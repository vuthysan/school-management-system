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
        input: ClassInput,
    ) -> Result<ClassType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::class::Class>("classes");

        // Parse ObjectId
        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let mut class: models::class::Class = input.into();
        class.id = Some(obj_id);
        // Update the audit timestamp
        class.audit.touch(None);

        // Update class in database
        let update_doc = doc! {
            "$set": mongodb::bson::to_document(&class)
                .map_err(|e| Error::new(e.to_string()))?
        };

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
