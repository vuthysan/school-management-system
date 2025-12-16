use actix_web::{get, post, web, HttpRequest, HttpResponse, Responder};
use serde::{Deserialize, Serialize};
use std::env;

#[derive(Deserialize, Debug, Serialize)]
pub struct CallbackInput {
    pub code: String,
    pub state: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
struct TokenResponse {
    access_token: String,
    refresh_token: Option<String>,
    token_type: String,
    expires_in: Option<i64>,
    scope: Option<String>,
}

#[derive(Serialize)]
struct UserProfile {
    id: String,
    email: Option<String>,
    name: String,
    picture: Option<String>,
    role: String,
}

// AuthResponse is now handled inline with serde_json::json!

use crate::{
    models::member::Member,
    models::user::{SystemRole, User},
    utils::jwt_token::sign_token,
};
use mongodb::{bson::doc, Collection, Database};

#[derive(Serialize, Deserialize, Debug)]
struct KoompiUser {
    #[serde(rename = "_id")]
    id: String,
    fullname: String,
    first_name: Option<String>,
    last_name: Option<String>,
    username: String,
    #[serde(rename = "profile")]
    picture: Option<String>,
    email: Option<String>,
    wallet_address: Option<String>,
    telegram_id: Option<i64>,
}

#[derive(Serialize, Deserialize, Debug)]
struct UserInfoResponse {
    user: KoompiUser,
    status: String,
    scopes: Option<Vec<String>>,
}

#[post("/auth/callback")]
pub async fn auth_callback(
    input: web::Json<CallbackInput>,
    db: web::Data<Database>,
) -> impl Responder {
    let client_id = env::var("KOOMPI_CLIENT_ID").unwrap_or_default();
    let client_secret = env::var("KOOMPI_CLIENT_SECRET").unwrap_or_default();
    let redirect_uri = env::var("KOOMPI_REDIRECT_URI").unwrap_or_default();

    if client_id.is_empty() || client_secret.is_empty() {
        return HttpResponse::InternalServerError().json(serde_json::json!({
            "error": "Server misconfiguration: Client ID or Secret missing"
        }));
    }

    let client = reqwest::Client::new();

    // 1. Exchange code for token
    let token_params = serde_json::json!({
        "grant_type": "authorization_code",
        "code": input.code,
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": redirect_uri,
        "state": input.state,
    });

    let token_res = match client
        .post("https://oauth.koompi.org/v1/oauth/token")
        .json(&token_params)
        .send()
        .await
    {
        Ok(res) => res,
        Err(err) => {
            return HttpResponse::InternalServerError().json(serde_json::json!({
                "error": format!("Failed to connect to auth server: {}", err)
            }));
        }
    };

    // Check response status and get raw body for debugging
    let status = token_res.status();
    let raw_body = match token_res.text().await {
        Ok(body) => body,
        Err(err) => {
            return HttpResponse::InternalServerError().json(serde_json::json!({
                "error": format!("Failed to read token response body: {}", err)
            }));
        }
    };

    // If not successful, return the error from OAuth server
    if !status.is_success() {
        return HttpResponse::BadRequest().json(serde_json::json!({
            "error": format!("OAuth token exchange failed: {}", raw_body)
        }));
    }

    let token_data: TokenResponse = match serde_json::from_str(&raw_body) {
        Ok(data) => data,
        Err(err) => {
            return HttpResponse::InternalServerError().json(serde_json::json!({
                "error": format!("Failed to parse token response: {}. Raw: {}", err, raw_body)
            }));
        }
    };

    // Reuse existing client
    let mut headers = reqwest::header::HeaderMap::new();
    let auth_header_val = match format!("Bearer {}", token_data.access_token).parse() {
        Ok(v) => v,
        Err(_) => {
            return HttpResponse::InternalServerError().json(serde_json::json!({
                "error": "Invalid token format"
            }))
        }
    };
    headers.insert("Authorization", auth_header_val);

    let response = match client
        .get("https://oauth.koompi.org/v1/oauth/userinfo")
        .headers(headers)
        .send()
        .await
    {
        Ok(res) => res,
        Err(err) => {
            return HttpResponse::InternalServerError().json(serde_json::json!({
                "error": format!("Failed to fetch user info: {}", err)
            }))
        }
    };

    let user_info_res: UserInfoResponse = match response.json().await {
        Ok(data) => data,
        Err(err) => {
            return HttpResponse::InternalServerError().json(serde_json::json!({
                "error": format!("Failed to parse user info: {}", err)
            }))
        }
    };

    let koompi_user = user_info_res.user;

    // Fallback email since Koompi might not provide it with basic scope
    let user_email = koompi_user
        .email
        .clone()
        .unwrap_or_else(|| format!("{}@koompi.org", koompi_user.username));

    // 3. Find or Create User in MongoDB
    let users_collection: Collection<User> = db.collection("users");

    // Check if this is the first user in the system
    let user_count = users_collection
        .count_documents(None, None)
        .await
        .unwrap_or(0);

    let is_first_user = user_count == 0;
    println!(
        "User count: {}, is_first_user: {}",
        user_count, is_first_user
    );

    // Check if user exists by Koompi ID
    println!("Looking for user with kid: {}", &koompi_user.id);
    let existing_user = users_collection
        .find_one(doc! { "kid": &koompi_user.id }, None)
        .await;

    let user_record =
        match existing_user {
            Ok(Some(user)) => {
                println!("Found existing user: {:?}", user.id);
                user
            }
            Ok(None) => {
                println!("User not found, creating new user...");
                // Create new user - first user gets SuperAdmin, others get User role
                let mut new_user = User::new(
                    koompi_user.id.clone(),
                    koompi_user.username.clone(),
                    Some(user_email.clone()),
                );

                // Assign SuperAdmin to first user
                if is_first_user {
                    new_user.system_role = SystemRole::SuperAdmin;
                    println!("Assigning SuperAdmin role to first user");
                }

                // Set profile info from Koompi
                new_user.first_name = koompi_user.first_name.clone();
                new_user.last_name = koompi_user.last_name.clone();
                new_user.avatar_url = koompi_user.picture.clone();

                println!("Inserting new user: {:?}", new_user.username);
                match users_collection.insert_one(&new_user, None).await {
                    Ok(insert_result) => {
                        println!("User inserted with id: {:?}", insert_result.inserted_id);
                        // Fetch the created user to get the ID
                        match users_collection
                            .find_one(doc! { "_id": insert_result.inserted_id }, None)
                            .await
                        {
                            Ok(Some(u)) => {
                                println!("Successfully retrieved created user");
                                u
                            }
                            _ => return HttpResponse::InternalServerError().json(
                                serde_json::json!({ "error": "Failed to retrieve created user" }),
                            ),
                        }
                    }
                    Err(err) => {
                        println!("Failed to insert user: {}", err);
                        return HttpResponse::InternalServerError().json(serde_json::json!({
                            "error": format!("Failed to create user: {}", err)
                        }));
                    }
                }
            }
            Err(err) => {
                println!("Database error when finding user: {}", err);
                return HttpResponse::InternalServerError().json(serde_json::json!({
                    "error": format!("Database error: {}", err)
                }));
            }
        };

    let user_id_str = user_record.id.map(|oid| oid.to_hex()).unwrap_or_default();

    // 4. Check if user has any memberships (for frontend routing)
    let members_collection: Collection<Member> = db.collection("members");
    let user_memberships = members_collection
        .count_documents(
            doc! {
                "user_id": &user_id_str,
                "status": "Active",
                "soft_delete.is_deleted": false
            },
            None,
        )
        .await
        .unwrap_or(0);

    println!("User {} has {} memberships", user_id_str, user_memberships);

    // Note: We no longer auto-create schools
    // Users without memberships will be redirected to:
    // - "Get Started" page where they can register a school
    // - Or wait for a school owner to add them as a member

    let user_profile = UserProfile {
        id: user_id_str.clone(),
        email: user_record.email.clone(),
        name: user_record.username.clone(),
        picture: koompi_user.picture,
        role: format!("{:?}", user_record.system_role),
    };

    // Use the actual user role from the database
    let token = sign_token(user_id_str, user_record.system_role).unwrap();

    HttpResponse::Ok().json(serde_json::json!({
        "access_token": token,
        "token_type": "Bearer",
        "user": user_profile,
        "has_membership": user_memberships > 0
    }))
}

#[get("/auth/me")]
pub async fn get_me(req: HttpRequest, db: web::Data<Database>) -> impl Responder {
    let auth_header = match req.headers().get("Authorization") {
        Some(h) => h.to_str().unwrap_or(""),
        None => {
            return HttpResponse::Unauthorized()
                .json(serde_json::json!({ "error": "Missing token" }))
        }
    };

    let token = if auth_header.starts_with("Bearer ") {
        &auth_header[7..]
    } else {
        return HttpResponse::Unauthorized()
            .json(serde_json::json!({ "error": "Invalid token type" }));
    };

    use crate::utils::jwt_token::verify_token;

    let claims = match verify_token(token) {
        Ok(c) => c,
        Err(_) => {
            return HttpResponse::Unauthorized()
                .json(serde_json::json!({ "error": "Invalid or expired token" }))
        }
    };

    let users_collection: Collection<User> = db.collection("users");

    // Find user by ID (claims.sub should hold the user ID formatted as hex string or similar, checking implementation)
    // In auth_callback we did: user_record.id.map(|oid| oid.to_hex()).unwrap_or_default() -> used as sub
    // So here we need to parse it back to ObjectId if possible, or querying by string if we stored it as string?
    // User struct says: pub id: Option<ObjectId>

    let object_id = match mongodb::bson::oid::ObjectId::parse_str(&claims.sub) {
        Ok(oid) => oid,
        Err(_) => {
            return HttpResponse::Unauthorized()
                .json(serde_json::json!({ "error": "Invalid user ID in token" }))
        }
    };

    let user_record = match users_collection
        .find_one(doc! { "_id": object_id }, None)
        .await
    {
        Ok(Some(u)) => u,
        Ok(None) => {
            return HttpResponse::Unauthorized()
                .json(serde_json::json!({ "error": "User not found" }))
        }
        Err(_) => {
            return HttpResponse::InternalServerError()
                .json(serde_json::json!({ "error": "Database error" }))
        }
    };

    let user_profile = UserProfile {
        id: user_record.id.map(|oid| oid.to_hex()).unwrap_or_default(),
        email: user_record.email,
        name: user_record.username,
        picture: None,
        role: format!("{:?}", user_record.system_role),
    };

    HttpResponse::Ok().json(user_profile)
}
