// Grade GraphQL mutations
use super::inputs::GradeInput;
use super::types::GradeType;
use crate::models;
use async_graphql::*;
use mongodb::{
    bson::{doc, oid::ObjectId, DateTime},
    Database,
};

#[derive(Default)]
pub struct GradeMutation;

#[Object]
impl GradeMutation {
    async fn create_grade(&self, ctx: &Context<'_>, input: GradeInput) -> Result<GradeType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::grade::Grade>("grades");
        let mut grade: models::grade::Grade = input.into();

        let now = DateTime::now();
        grade.created_at = now;
        grade.updated_at = now;

        let result = collection
            .insert_one(grade, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let id = result.inserted_id.as_object_id().unwrap();
        let grade = collection
            .find_one(doc! { "_id": id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Failed to retrieve created grade"))?;

        Ok(grade.into())
    }

    async fn update_grade(
        &self,
        ctx: &Context<'_>,
        id: String,
        input: GradeInput,
    ) -> Result<GradeType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::grade::Grade>("grades");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let mut grade: models::grade::Grade = input.into();
        grade.id = Some(obj_id);
        grade.updated_at = DateTime::now();

        let update_doc = doc! {
            "$set": mongodb::bson::to_document(&grade)
                .map_err(|e| Error::new(e.to_string()))?
        };

        collection
            .update_one(doc! { "_id": obj_id }, update_doc, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let grade = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Grade not found"))?;

        Ok(grade.into())
    }

    async fn delete_grade(&self, ctx: &Context<'_>, id: String) -> Result<bool> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::grade::Grade>("grades");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        collection
            .delete_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        Ok(true)
    }
}
