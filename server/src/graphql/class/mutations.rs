// Class GraphQL mutations
use super::inputs::ClassInput;
use super::types::ClassType;
use crate::models;
use async_graphql::*;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Database,
};

#[derive(Default)]
pub struct ClassMutation;

#[Object]
impl ClassMutation {
    async fn create_class(&self, ctx: &Context<'_>, input: ClassInput) -> Result<ClassType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::class::Class>("classes");
        let class: models::class::Class = input.into();

        // AuditInfo is set by default in the model
        // class.audit is already initialized with created_at

        // Insert class into database
        let result = collection
            .insert_one(class, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        // Retrieve the created class
        let id = result.inserted_id.as_object_id().unwrap();
        let class = collection
            .find_one(doc! { "_id": id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Failed to retrieve created class"))?;

        Ok(class.into())
    }

    async fn update_class(
        &self,
        ctx: &Context<'_>,
        id: String,
        input: super::inputs::UpdateClassInput,
    ) -> Result<ClassType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::class::Class>("classes");

        // Parse ObjectId
        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        // Build update document with only provided fields
        let mut update_fields = doc! {};
        if let Some(name) = &input.name {
            update_fields.insert("name", name);
        }
        if let Some(section) = &input.section {
            update_fields.insert("section", section);
        }
        if let Some(homeroom_teacher_id) = &input.homeroom_teacher_id {
            update_fields.insert("homeroom_teacher_id", homeroom_teacher_id);
        }
        if let Some(room_number) = &input.room_number {
            update_fields.insert("room_number", room_number);
        }
        if let Some(capacity) = input.capacity {
            update_fields.insert("capacity", capacity);
        }
        if let Some(status) = &input.status {
            update_fields.insert("status", mongodb::bson::to_bson(status).unwrap());
        }
        if let Some(academic_year_id) = &input.academic_year_id {
            update_fields.insert("academic_year_id", academic_year_id);
        }
        update_fields.insert("audit.updated_at", mongodb::bson::DateTime::now());

        let update_doc = doc! { "$set": update_fields };

        collection
            .update_one(doc! { "_id": obj_id }, update_doc, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        // Retrieve updated class
        let class = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Class not found"))?;

        Ok(class.into())
    }

    async fn delete_class(&self, ctx: &Context<'_>, id: String) -> Result<bool> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::class::Class>("classes");

        // Parse ObjectId
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
