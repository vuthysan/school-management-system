use crate::models::user::User;
use async_graphql::*;
use mongodb::{bson::doc, Database};

#[derive(Default)]
pub struct UserQuery;

#[Object]
impl UserQuery {
    /// Search for a user by their unique user_id (e.g., "00000001")
    async fn search_user(&self, ctx: &Context<'_>, query: String) -> Result<Option<User>> {
        let trimmed_query = query.trim();
        if trimmed_query.is_empty() {
            return Err(Error::new("User ID is required"));
        }

        let db = ctx.data::<Database>()?;
        let users_collection = db.collection::<User>("users");

        // Search by the sequential user_id field
        let filter = doc! {
            "user_id": trimmed_query,
            "soft_delete.is_deleted": false
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
