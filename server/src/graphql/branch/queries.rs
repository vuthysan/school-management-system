// Branch GraphQL queries
use super::types::BranchType;
use crate::models;
use async_graphql::*;
use futures::stream::TryStreamExt;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Database,
};

#[derive(Default)]
pub struct BranchQuery;

#[Object]
impl BranchQuery {
    async fn branches(&self, ctx: &Context<'_>) -> Result<Vec<BranchType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::branch::Branch>("branches");

        let mut cursor = collection
            .find(None, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut branches = Vec::new();
        while let Some(branch) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            branches.push(branch);
        }

        Ok(branches.into_iter().map(|b| b.into()).collect())
    }

    async fn branch(&self, ctx: &Context<'_>, id: String) -> Result<Option<BranchType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::branch::Branch>("branches");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let branch = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        Ok(branch.map(|b| b.into()))
    }

    async fn branches_by_school(
        &self,
        ctx: &Context<'_>,
        school_id: String,
    ) -> Result<Vec<BranchType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::branch::Branch>("branches");

        let obj_id =
            ObjectId::parse_str(&school_id).map_err(|_| Error::new("Invalid school ID"))?;

        let filter = doc! { "school_id": obj_id };
        let mut cursor = collection
            .find(filter, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut branches = Vec::new();
        while let Some(branch) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            branches.push(branch);
        }

        Ok(branches.into_iter().map(|b| b.into()).collect())
    }
}
