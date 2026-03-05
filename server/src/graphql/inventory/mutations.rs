use crate::graphql::inventory::types::InventoryItemGqlType;
use crate::models::inventory::{
    CreateInventoryItemInput, InventoryItem, UpdateInventoryItemInput,
};
use async_graphql::*;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Database,
};

#[derive(Default)]
pub struct InventoryMutation;

#[Object]
impl InventoryMutation {
    async fn create_inventory_item(
        &self,
        ctx: &Context<'_>,
        input: CreateInventoryItemInput,
    ) -> Result<InventoryItemGqlType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<InventoryItem>("inventory_items");

        let mut item = InventoryItem::new(
            input.school_id,
            input.name,
            input.category.unwrap_or_default(),
            input.quantity,
            input.unit_cost,
        );

        item.branch_id = input.branch_id;
        item.description = input.description;
        if let Some(currency) = input.currency {
            item.currency = currency;
        }
        item.location = input.location;
        item.supplier = input.supplier;
        item.purchase_date = input.purchase_date;
        item.warranty_expiry = input.warranty_expiry;
        if let Some(condition) = input.condition {
            item.condition = condition;
        }
        item.assigned_to = input.assigned_to;
        if let Some(status) = input.status {
            item.status = status;
        }

        let result = collection.insert_one(item.clone(), None).await?;
        item.id = Some(result.inserted_id.as_object_id().unwrap());

        Ok(InventoryItemGqlType::from(item))
    }

    async fn update_inventory_item(
        &self,
        ctx: &Context<'_>,
        id: String,
        input: UpdateInventoryItemInput,
    ) -> Result<InventoryItemGqlType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<InventoryItem>("inventory_items");

        let obj_id = ObjectId::parse_str(&id)?;

        let mut update_doc = doc! {};

        if let Some(name) = input.name {
            update_doc.insert("name", name);
        }
        if let Some(description) = input.description {
            update_doc.insert("description", description);
        }
        if let Some(category) = input.category {
            update_doc.insert("category", mongodb::bson::to_bson(&category)?);
        }
        if let Some(quantity) = input.quantity {
            update_doc.insert("quantity", quantity);
        }
        if let Some(unit_cost) = input.unit_cost {
            update_doc.insert("unit_cost", unit_cost);
        }
        if let Some(currency) = input.currency {
            update_doc.insert("currency", currency);
        }
        if let Some(location) = input.location {
            update_doc.insert("location", location);
        }
        if let Some(supplier) = input.supplier {
            update_doc.insert("supplier", supplier);
        }
        if let Some(purchase_date) = input.purchase_date {
            update_doc.insert("purchase_date", purchase_date);
        }
        if let Some(warranty_expiry) = input.warranty_expiry {
            update_doc.insert("warranty_expiry", warranty_expiry);
        }
        if let Some(condition) = input.condition {
            update_doc.insert("condition", mongodb::bson::to_bson(&condition)?);
        }
        if let Some(assigned_to) = input.assigned_to {
            update_doc.insert("assigned_to", assigned_to);
        }
        if let Some(status) = input.status {
            update_doc.insert("status", mongodb::bson::to_bson(&status)?);
        }

        update_doc.insert("audit.updated_at", mongodb::bson::DateTime::now());

        collection
            .find_one_and_update(doc! { "_id": obj_id }, doc! { "$set": update_doc }, None)
            .await?;

        let updated = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await?
            .ok_or_else(|| Error::new("Inventory item not found"))?;

        Ok(InventoryItemGqlType::from(updated))
    }

    async fn delete_inventory_item(&self, ctx: &Context<'_>, id: String) -> Result<bool> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<InventoryItem>("inventory_items");

        let obj_id = ObjectId::parse_str(&id)?;

        collection
            .update_one(
                doc! { "_id": obj_id },
                doc! {
                    "$set": {
                        "soft_delete.is_deleted": true,
                        "soft_delete.deleted_at": mongodb::bson::DateTime::now()
                    }
                },
                None,
            )
            .await?;

        Ok(true)
    }
}
