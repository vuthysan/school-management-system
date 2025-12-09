use actix_cors::Cors;
use actix_web::{get, web, App, HttpResponse, HttpServer, Responder};
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};
use dotenv::dotenv;
use mongodb::{options::ClientOptions, Client};
use std::env;

mod config;
mod graphql;
mod models;
mod routes;
mod utils;

use graphql::schema::{create_schema, AppSchema};

#[get("/health")]
async fn health_check() -> impl Responder {
    println!("health check 1");

    HttpResponse::Ok().json(serde_json::json!({
        "status": "ok",
        "timestamp": chrono::Utc::now().to_rfc3339()
    }))
}

async fn graphql_handler(
    schema: web::Data<AppSchema>,
    req: actix_web::HttpRequest,
    gql_req: GraphQLRequest,
) -> GraphQLResponse {
    use graphql::graphql_context::GraphQLContext;

    // Create GraphQL context from HTTP request
    let context = GraphQLContext::from_request(&req);

    schema
        .execute(gql_req.into_inner().data(context))
        .await
        .into()
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    let port = env::var("PORT").unwrap_or_else(|_| "8081".to_string());
    let mongo_uri =
        env::var("MONGODB_URI").unwrap_or_else(|_| "mongodb://localhost:27017".to_string());

    println!("🚀 Starting SMS Server on port {}", port);
    println!("📦 Connecting to MongoDB...");

    let client_options = ClientOptions::parse(&mongo_uri).await.unwrap();
    let client = Client::with_options(client_options).unwrap();

    let db_name = env::var("MONGODB_NAME").unwrap_or_else(|_| "sms_db".to_string());
    let db = client.database(&db_name);

    println!("✅ MongoDB connected successfully");
    println!("🌐 GraphQL endpoint: http://0.0.0.0:{}/graphql", port);
    println!("🌐 GraphQL Playground: http://0.0.0.0:{}/graphql", port);

    let schema = create_schema(db.clone());

    let port_clone = port.clone();

    HttpServer::new(move || {
        let cors = Cors::default()
            .allowed_origin("http://localhost:3000")
            // Allow requests from the server itself (e.g. GraphQL Playground)
            .allowed_origin(&format!("http://localhost:{}", port_clone))
            .allowed_methods(vec!["GET", "POST", "OPTIONS"])
            .allow_any_header()
            .supports_credentials();

        App::new()
            .wrap(cors)
            .app_data(web::Data::new(db.clone()))
            .app_data(web::Data::new(schema.clone()))
            .service(health_check)
            .service(routes::auth::auth_callback)
            .service(routes::auth::get_me)
            .service(web::resource("/graphql").route(web::post().to(graphql_handler)))
    })
    .bind(("0.0.0.0", port.parse::<u16>().unwrap()))?
    .run()
    .await
}
