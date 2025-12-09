// Student GraphQL mutations
use super::inputs::CreateStudentInput;
use super::types::StudentType;
use crate::models;
use async_graphql::*;
use mongodb::{bson::doc, Database};

#[derive(Default)]
pub struct StudentMutation;

#[Object]
impl StudentMutation {
    async fn create_student(
        &self,
        ctx: &Context<'_>,
        input: CreateStudentInput,
    ) -> Result<StudentType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::student::Student>("students");
        let student = input.into_student();

        // Insert student into database
        let result = collection
            .insert_one(student, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        // Retrieve the created student
        let id = result.inserted_id.as_object_id().unwrap();
        let student = collection
            .find_one(doc! { "_id": id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Failed to retrieve created student"))?;

        Ok(student.into())
    }
}
