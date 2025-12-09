// Branch GraphQL mutations
use super::inputs::BranchInput;
use super::types::BranchType;
use crate::models;
use async_graphql::*;
use mongodb::{bson::doc, Database};

#[derive(Default)]
pub struct BranchMutation;

#[Object]
impl BranchMutation {
    async fn create_branch(&self, ctx: &Context<'_>, input: BranchInput) -> Result<BranchType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::branch::Branch>("branches");
        let mut branch: models::branch::Branch = input.into();

        let now = chrono::Utc::now().to_rfc3339();
        branch.created_at = now.clone();
        branch.updated_at = now;

        let result = collection
            .insert_one(branch, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let id = result.inserted_id.as_object_id().unwrap();
        let branch = collection
            .find_one(doc! { "_id": id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Failed to retrieve created branch"))?;

        Ok(branch.into())
    }
}
