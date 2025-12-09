use crate::{models::user::SystemRole, utils::jwt_token::verify_token};
use actix_web::HttpRequest;
use async_graphql::Context;

/// Authenticated user information extracted from JWT
#[derive(Debug, Clone)]
pub struct AuthUser {
    pub id: String,
    pub role: SystemRole,
}

/// Custom GraphQL context that includes authenticated user
pub struct GraphQLContext {
    pub auth_user: Option<AuthUser>,
}

impl GraphQLContext {
    /// Create context from HTTP request by extracting JWT token
    pub fn from_request(req: &HttpRequest) -> Self {
        let auth_user = extract_auth_user(req);
        Self { auth_user }
    }

    /// Get authenticated user or return error
    pub fn require_auth(&self) -> async_graphql::Result<&AuthUser> {
        self.auth_user
            .as_ref()
            .ok_or_else(|| async_graphql::Error::new("Authentication required"))
    }

    /// Check if user has specific role
    pub fn require_role(&self, required_role: SystemRole) -> async_graphql::Result<&AuthUser> {
        let user = self.require_auth()?;

        // Check if user has the required role
        match (&user.role, &required_role) {
            (SystemRole::SuperAdmin, _) => Ok(user), // SuperAdmin has access to everything
            (user_role, req_role)
                if std::mem::discriminant(user_role) == std::mem::discriminant(req_role) =>
            {
                Ok(user)
            }
            _ => Err(async_graphql::Error::new(format!(
                "Insufficient permissions. Required role: {:?}",
                required_role
            ))),
        }
    }
}

/// Extract authenticated user from HTTP request headers
fn extract_auth_user(req: &HttpRequest) -> Option<AuthUser> {
    let auth_header = req.headers().get("Authorization")?.to_str().ok()?;

    let token = if auth_header.starts_with("Bearer ") {
        &auth_header[7..]
    } else {
        return None;
    };

    let claims = verify_token(token).ok()?;

    Some(AuthUser {
        id: claims.sub,
        role: claims.role,
    })
}

/// Helper function to get GraphQL context from async_graphql Context
pub fn get_graphql_context<'a>(ctx: &'a Context<'_>) -> async_graphql::Result<&'a GraphQLContext> {
    ctx.data::<GraphQLContext>()
        .map_err(|_| async_graphql::Error::new("GraphQL context not found"))
}
