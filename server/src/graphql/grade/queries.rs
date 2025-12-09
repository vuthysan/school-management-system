// Grade GraphQL queries
use super::types::GradeType;
use crate::models;
use async_graphql::*;
use futures::stream::TryStreamExt;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Database,
};

#[derive(Default)]
pub struct GradeQuery;

#[Object]
impl GradeQuery {
    async fn grades(&self, ctx: &Context<'_>) -> Result<Vec<GradeType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::grade::Grade>("grades");

        let mut cursor = collection
            .find(None, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut grades = Vec::new();
        while let Some(grade) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            grades.push(grade);
        }

        Ok(grades.into_iter().map(|g| g.into()).collect())
    }

    async fn grade(&self, ctx: &Context<'_>, id: String) -> Result<Option<GradeType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::grade::Grade>("grades");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let grade = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        Ok(grade.map(|g| g.into()))
    }
}
