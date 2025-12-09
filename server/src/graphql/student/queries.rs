// Student GraphQL queries
use super::types::StudentType;
use crate::models;
use async_graphql::*;
use futures::stream::TryStreamExt;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Database,
};

#[derive(Default)]
pub struct StudentQuery;

#[Object]
impl StudentQuery {
    async fn students(&self, ctx: &Context<'_>) -> Result<Vec<StudentType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::student::Student>("students");

        // Fetch all students from database
        let mut cursor = collection
            .find(None, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut students = Vec::new();
        while let Some(student) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            students.push(student);
        }

        Ok(students.into_iter().map(|s| s.into()).collect())
    }

    async fn student(&self, ctx: &Context<'_>, id: String) -> Result<Option<StudentType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::student::Student>("students");

        // Parse and validate ObjectId
        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        // Find student by ID
        let student = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        Ok(student.map(|s| s.into()))
    }
}
