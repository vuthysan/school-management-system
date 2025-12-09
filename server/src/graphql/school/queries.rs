// School GraphQL queries
use crate::models::school::School;
use async_graphql::*;
use futures::stream::TryStreamExt;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Database,
};

#[derive(Default)]
pub struct SchoolQuery;

#[Object]
impl SchoolQuery {
    /// Get all schools
    async fn schools(&self, ctx: &Context<'_>) -> Result<Vec<School>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<School>("schools");

        let mut cursor = collection
            .find(None, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut schools = Vec::new();
        while let Some(school) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            schools.push(school);
        }

        Ok(schools)
    }

    /// Get school by ID
    async fn school(&self, ctx: &Context<'_>, id: String) -> Result<Option<School>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<School>("schools");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let school = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        Ok(school)
    }

    /// Admin only - get all pending schools
    async fn pending_schools(&self, ctx: &Context<'_>) -> Result<Vec<School>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<School>("schools");

        let filter = doc! { "status": "pending" };
        let mut cursor = collection
            .find(filter, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut schools = Vec::new();
        while let Some(school) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            schools.push(school);
        }

        Ok(schools)
    }

    /// Get schools by status
    async fn schools_by_status(&self, ctx: &Context<'_>, status: String) -> Result<Vec<School>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<School>("schools");

        let filter = doc! { "status": status };
        let mut cursor = collection
            .find(filter, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut schools = Vec::new();
        while let Some(school) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            schools.push(school);
        }

        Ok(schools)
    }

    /// Owner - get my schools (by owner_email or owner_id)
    async fn my_schools(&self, ctx: &Context<'_>, owner_email: String) -> Result<Vec<School>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<School>("schools");

        let filter = doc! { "owner_email": owner_email };
        let mut cursor = collection
            .find(filter, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut schools = Vec::new();
        while let Some(school) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            schools.push(school);
        }

        Ok(schools)
    }
}
