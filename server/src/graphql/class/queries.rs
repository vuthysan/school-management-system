// Class GraphQL queries
use super::types::ClassType;
use crate::models;
use async_graphql::*;
use futures::stream::TryStreamExt;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Database,
};

#[derive(Default)]
pub struct ClassQuery;

#[Object]
impl ClassQuery {
    async fn classes(&self, ctx: &Context<'_>) -> Result<Vec<ClassType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::class::Class>("classes");

        // Fetch all classes from database
        let mut cursor = collection
            .find(None, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut classes = Vec::new();
        while let Some(class) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            classes.push(class);
        }

        Ok(classes.into_iter().map(|c| c.into()).collect())
    }

    async fn class(&self, ctx: &Context<'_>, id: String) -> Result<Option<ClassType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::class::Class>("classes");

        // Parse and validate ObjectId
        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        // Find class by ID
        let class = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        Ok(class.map(|c| c.into()))
    }
}
