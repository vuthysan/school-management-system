use crate::models::member::{Member, SchoolRole};
use async_graphql::*;
use futures::stream::TryStreamExt;
use mongodb::{bson::doc, Database};

#[derive(Default)]
pub struct MemberQuery;

#[Object]
impl MemberQuery {
    /// Get all memberships for the current user
    async fn my_memberships(&self, ctx: &Context<'_>) -> Result<Vec<Member>> {
        use crate::graphql::graphql_context::get_graphql_context;

        let graphql_ctx = get_graphql_context(ctx)?;
        let auth_user = graphql_ctx.require_auth()?;

        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Member>("members");

        let filter = doc! { "user_id": &auth_user.id, "is_active": true };
        let mut cursor = collection
            .find(filter, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut members = Vec::new();
        while let Some(member) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            members.push(member);
        }

        Ok(members)
    }

    /// Get all members of a specific school
    async fn school_members(&self, ctx: &Context<'_>, school_id: String) -> Result<Vec<Member>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Member>("members");

        let filter = doc! { "school_id": school_id, "is_active": true };
        let mut cursor = collection
            .find(filter, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut members = Vec::new();
        while let Some(member) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            members.push(member);
        }

        Ok(members)
    }

    /// Get members by role in a specific school
    async fn members_by_role(
        &self,
        ctx: &Context<'_>,
        school_id: String,
        role: String,
    ) -> Result<Vec<Member>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Member>("members");

        // Parse role string to SchoolRole
        let school_role: SchoolRole = serde_json::from_str(&format!("\"{}\"", role))
            .map_err(|_| Error::new("Invalid role"))?;

        let filter = doc! {
            "school_id": school_id,
            "role": mongodb::bson::to_bson(&school_role).unwrap(),
            "is_active": true
        };

        let mut cursor = collection
            .find(filter, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut members = Vec::new();
        while let Some(member) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            members.push(member);
        }

        Ok(members)
    }
}
