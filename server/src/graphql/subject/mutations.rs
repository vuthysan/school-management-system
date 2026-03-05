// Subject GraphQL mutations
use super::inputs::{SubjectInput, UpdateSubjectInput};
use super::types::SubjectType;
use crate::models;
use async_graphql::*;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Database,
};

#[derive(Default)]
pub struct SubjectMutation;

#[Object]
impl SubjectMutation {
    async fn create_subject(&self, ctx: &Context<'_>, input: SubjectInput) -> Result<SubjectType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::subject::Subject>("subjects");
        let subject: models::subject::Subject = input.into();

        let result = collection
            .insert_one(subject, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let id = result.inserted_id.as_object_id().unwrap();
        let subject = collection
            .find_one(doc! { "_id": id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Failed to retrieve created subject"))?;

        Ok(subject.into())
    }

    async fn update_subject(
        &self,
        ctx: &Context<'_>,
        id: String,
        input: UpdateSubjectInput,
    ) -> Result<SubjectType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::subject::Subject>("subjects");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        // Build update document with only provided fields
        let mut update_doc = doc! {};

        if let Some(name) = &input.subject_name {
            update_doc.insert("subject_name", name);
        }
        if let Some(code) = &input.subject_code {
            update_doc.insert("subject_code", code);
        }
        if let Some(desc) = &input.description {
            update_doc.insert("description", desc);
        }
        if let Some(levels) = &input.grade_levels {
            update_doc.insert("grade_levels", levels);
        }
        if let Some(hours) = input.hours_per_week {
            update_doc.insert("hours_per_week", hours);
        }
        if let Some(coeff) = input.coefficient {
            update_doc.insert("coefficient", coeff);
        }
        if let Some(cat) = &input.subject_category {
            update_doc.insert("subject_category", cat);
        }
        if let Some(status) = &input.status {
            update_doc.insert("status", mongodb::bson::to_bson(status).unwrap());
        }

        // Update audit timestamp
        update_doc.insert("audit.updated_at", mongodb::bson::DateTime::now());

        collection
            .update_one(doc! { "_id": obj_id }, doc! { "$set": update_doc }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let subject = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Subject not found"))?;

        Ok(subject.into())
    }

    async fn delete_subject(&self, ctx: &Context<'_>, id: String) -> Result<bool> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::subject::Subject>("subjects");

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
