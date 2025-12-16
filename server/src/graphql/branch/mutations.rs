// Branch GraphQL mutations
use super::inputs::{BranchInput, UpdateBranchInput};
use super::types::BranchType;
use crate::models;
use async_graphql::*;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Database,
};

#[derive(Default)]
pub struct BranchMutation;

#[Object]
impl BranchMutation {
    async fn create_branch(&self, ctx: &Context<'_>, input: BranchInput) -> Result<BranchType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::branch::Branch>("branches");
        let mut branch: models::branch::Branch = input.into();

        let now = chrono::Utc::now().to_rfc3339();
        branch.created_at = now.clone();
        branch.updated_at = now;

        let result = collection
            .insert_one(branch, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let id = result.inserted_id.as_object_id().unwrap();
        let branch = collection
            .find_one(doc! { "_id": id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Failed to retrieve created branch"))?;

        Ok(branch.into())
    }

    async fn update_branch(
        &self,
        ctx: &Context<'_>,
        id: String,
        input: UpdateBranchInput,
    ) -> Result<BranchType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::branch::Branch>("branches");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        // Build update document dynamically based on provided fields
        let mut update_doc = doc! {};

        if let Some(name) = input.name {
            update_doc.insert("name", name);
        }
        if let Some(contact_email) = input.contact_email {
            update_doc.insert("contact_email", contact_email);
        }
        if let Some(contact_phone) = input.contact_phone {
            update_doc.insert("contact_phone", contact_phone);
        }
        if let Some(address) = input.address {
            update_doc.insert(
                "address",
                mongodb::bson::to_document(&crate::utils::common_types::Address::from(address))
                    .unwrap(),
            );
        }

        update_doc.insert("updated_at", chrono::Utc::now().to_rfc3339());

        collection
            .update_one(doc! { "_id": obj_id }, doc! { "$set": update_doc }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let branch = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Branch not found"))?;

        Ok(branch.into())
    }

    async fn delete_branch(&self, ctx: &Context<'_>, id: String) -> Result<bool> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::branch::Branch>("branches");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let result = collection
            .delete_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        Ok(result.deleted_count > 0)
    }
}
