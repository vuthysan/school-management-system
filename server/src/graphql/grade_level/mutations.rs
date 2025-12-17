// GradeLevel GraphQL mutations
use super::inputs::{GradeLevelInput, UpdateGradeLevelInput};
use super::types::GradeLevelType;
use crate::models;
use async_graphql::*;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Database,
};

#[derive(Default)]
pub struct GradeLevelMutation;

#[Object]
impl GradeLevelMutation {
    /// Create a new grade level
    async fn create_grade_level(
        &self,
        ctx: &Context<'_>,
        input: GradeLevelInput,
    ) -> Result<GradeLevelType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::grade_level::GradeLevel>("grade_levels");
        let grade_level: models::grade_level::GradeLevel = input.into();

        let result = collection
            .insert_one(grade_level, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let id = result.inserted_id.as_object_id().unwrap();
        let grade_level = collection
            .find_one(doc! { "_id": id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Failed to retrieve created grade level"))?;

        Ok(grade_level)
    }

    /// Update an existing grade level
    async fn update_grade_level(
        &self,
        ctx: &Context<'_>,
        id: String,
        input: UpdateGradeLevelInput,
    ) -> Result<GradeLevelType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::grade_level::GradeLevel>("grade_levels");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        // Build update document with only provided fields
        let mut update_doc = doc! {};

        if let Some(name) = &input.name {
            update_doc.insert("name", name);
        }
        if let Some(code) = &input.code {
            update_doc.insert("code", code);
        }
        if let Some(order) = input.order {
            update_doc.insert("order", order);
        }
        if let Some(desc) = &input.description {
            update_doc.insert("description", desc);
        }
        if let Some(status) = &input.status {
            update_doc.insert("status", mongodb::bson::to_bson(status).unwrap());
        }
        if let Some(branch_id) = &input.branch_id {
            update_doc.insert("branch_id", branch_id);
        }

        // Update audit timestamp
        update_doc.insert("audit.updated_at", mongodb::bson::DateTime::now());

        collection
            .update_one(doc! { "_id": obj_id }, doc! { "$set": update_doc }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let grade_level = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Grade level not found"))?;

        Ok(grade_level)
    }

    /// Delete a grade level (soft delete)
    async fn delete_grade_level(&self, ctx: &Context<'_>, id: String) -> Result<bool> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::grade_level::GradeLevel>("grade_levels");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        // Soft delete: mark as deleted instead of actually deleting
        let update_doc = doc! {
            "$set": {
                "soft_delete.is_deleted": true,
                "soft_delete.deleted_at": mongodb::bson::DateTime::now()
            }
        };

        collection
            .update_one(doc! { "_id": obj_id }, update_doc, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        Ok(true)
    }
}
