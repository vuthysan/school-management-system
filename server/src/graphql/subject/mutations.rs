// Subject GraphQL mutations
use super::inputs::SubjectInput;
use super::types::SubjectType;
use crate::models;
use async_graphql::*;
use mongodb::{
    bson::{doc, oid::ObjectId, DateTime},
    Database,
};

#[derive(Default)]
pub struct SubjectMutation;

#[Object]
impl SubjectMutation {
    async fn create_subject(&self, ctx: &Context<'_>, input: SubjectInput) -> Result<SubjectType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::subject::Subject>("subjects");
        let mut subject: models::subject::Subject = input.into();

        let now = DateTime::now();
        subject.created_at = now;
        subject.updated_at = now;

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
        input: SubjectInput,
    ) -> Result<SubjectType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::subject::Subject>("subjects");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let mut subject: models::subject::Subject = input.into();
        subject.id = Some(obj_id);
        subject.updated_at = DateTime::now();

        let update_doc = doc! {
            "$set": mongodb::bson::to_document(&subject)
                .map_err(|e| Error::new(e.to_string()))?
        };

        collection
            .update_one(doc! { "_id": obj_id }, update_doc, None)
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

        collection
            .delete_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        Ok(true)
    }
}
