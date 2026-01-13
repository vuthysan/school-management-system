// Room GraphQL mutations
use super::inputs::{CreateRoomInput, UpdateRoomInput};
use super::types::RoomType;
use crate::models;
use async_graphql::*;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Database,
};

#[derive(Default)]
pub struct RoomMutation;

#[Object]
impl RoomMutation {
    /// Create a new room
    async fn create_room(&self, ctx: &Context<'_>, input: CreateRoomInput) -> Result<RoomType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::room::Room>("rooms");

        let school_id =
            ObjectId::parse_str(&input.school_id).map_err(|_| Error::new("Invalid school ID"))?;

        let now = chrono::Utc::now().to_rfc3339();
        let room = models::room::Room {
            id: None,
            school_id,
            name: input.name,
            building: input.building,
            floor: input.floor,
            capacity: input.capacity,
            room_type: input.room_type,
            status: input.status.or(Some("Available".to_string())),
            facilities: input.facilities,
            description: input.description,
            created_at: now.clone(),
            updated_at: now,
        };

        let result = collection
            .insert_one(room, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let id = result.inserted_id.as_object_id().unwrap();
        let created_room = collection
            .find_one(doc! { "_id": id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Failed to retrieve created room"))?;

        Ok(created_room.into())
    }

    /// Update a room
    async fn update_room(
        &self,
        ctx: &Context<'_>,
        id: String,
        input: UpdateRoomInput,
    ) -> Result<RoomType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::room::Room>("rooms");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let mut update_doc = doc! {};

        if let Some(name) = input.name {
            update_doc.insert("name", name);
        }
        if let Some(building) = input.building {
            update_doc.insert("building", building);
        }
        if let Some(floor) = input.floor {
            update_doc.insert("floor", floor);
        }
        if let Some(capacity) = input.capacity {
            update_doc.insert("capacity", capacity);
        }
        if let Some(room_type) = input.room_type {
            update_doc.insert("room_type", room_type);
        }
        if let Some(status) = input.status {
            update_doc.insert("status", status);
        }
        if let Some(facilities) = input.facilities {
            update_doc.insert("facilities", facilities);
        }
        if let Some(description) = input.description {
            update_doc.insert("description", description);
        }

        update_doc.insert("updated_at", chrono::Utc::now().to_rfc3339());

        collection
            .update_one(doc! { "_id": obj_id }, doc! { "$set": update_doc }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let room = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Room not found"))?;

        Ok(room.into())
    }

    /// Delete a room
    async fn delete_room(&self, ctx: &Context<'_>, id: String) -> Result<bool> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::room::Room>("rooms");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let result = collection
            .delete_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        Ok(result.deleted_count > 0)
    }
}
