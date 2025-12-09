// Subject GraphQL queries
use super::types::SubjectType;
use crate::models;
use async_graphql::*;
use futures::stream::TryStreamExt;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Database,
};

#[derive(Default)]
pub struct SubjectQuery;

#[Object]
impl SubjectQuery {
    async fn subjects(&self, ctx: &Context<'_>) -> Result<Vec<SubjectType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::subject::Subject>("subjects");

        let mut cursor = collection
            .find(None, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut subjects = Vec::new();
        while let Some(subject) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            subjects.push(subject);
        }

        Ok(subjects.into_iter().map(|s| s.into()).collect())
    }

    async fn subject(&self, ctx: &Context<'_>, id: String) -> Result<Option<SubjectType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::subject::Subject>("subjects");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let subject = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        Ok(subject.map(|s| s.into()))
    }
}
