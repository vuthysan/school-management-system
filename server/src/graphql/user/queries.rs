use crate::models::user::User;
use async_graphql::*;
use mongodb::{bson::doc, Database};

#[derive(Default)]
pub struct UserQuery;

#[Object]
impl UserQuery {
    /// Search for a user by email or username (minimum 5 characters required)
    async fn search_user(&self, ctx: &Context<'_>, query: String) -> Result<Option<User>> {
        // Require minimum 5 characters to prevent fetching too many users
        let trimmed_query = query.trim();
        if trimmed_query.len() < 5 {
            return Err(Error::new("Search query must be at least 5 characters"));
        }

        let db = ctx.data::<Database>()?;
        let users_collection = db.collection::<User>("users");

        // Search by email or username (case-insensitive)
        let filter = doc! {
            "$or": [
                { "email": { "$regex": trimmed_query, "$options": "i" } },
                { "username": { "$regex": trimmed_query, "$options": "i" } }
            ]
        };

        let user = users_collection
            .find_one(filter, None)
            .await
            .map_err(|e| Error::new(format!("Failed to search user: {}", e)))?;

        Ok(user)
    }

    /// Get a user by their ID
    async fn user_by_id(&self, ctx: &Context<'_>, id: String) -> Result<Option<User>> {
        let db = ctx.data::<Database>()?;
        let users_collection = db.collection::<User>("users");

        // Try to parse as ObjectId first
        let user = if let Ok(oid) = mongodb::bson::oid::ObjectId::parse_str(&id) {
            users_collection
                .find_one(doc! { "_id": oid }, None)
                .await
                .map_err(|e| Error::new(format!("Failed to fetch user: {}", e)))?
        } else {
            // If not a valid ObjectId, search by kid
            users_collection
                .find_one(doc! { "kid": &id }, None)
                .await
                .map_err(|e| Error::new(format!("Failed to fetch user: {}", e)))?
        };

        Ok(user)
    }
}
