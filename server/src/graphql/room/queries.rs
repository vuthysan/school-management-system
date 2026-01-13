// Room GraphQL queries
use super::types::RoomType;
use crate::models;
use async_graphql::*;
use futures::stream::TryStreamExt;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Database,
};

#[derive(Default)]
pub struct RoomQuery;

#[Object]
impl RoomQuery {
    /// Get all rooms for a school
    async fn rooms(&self, ctx: &Context<'_>, school_id: String) -> Result<Vec<RoomType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::room::Room>("rooms");

        let obj_id =
            ObjectId::parse_str(&school_id).map_err(|_| Error::new("Invalid school ID"))?;

        let filter = doc! { "school_id": obj_id };
        let mut cursor = collection
            .find(filter, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut rooms = Vec::new();
        while let Some(room) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            rooms.push(room);
        }

        Ok(rooms.into_iter().map(|r| r.into()).collect())
    }

    /// Get a single room by ID
    async fn room(&self, ctx: &Context<'_>, id: String) -> Result<Option<RoomType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::room::Room>("rooms");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let room = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        Ok(room.map(|r| r.into()))
    }
}
