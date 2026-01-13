// Room GraphQL types
use crate::models::room::Room;
use async_graphql::*;

#[derive(SimpleObject)]
pub struct RoomType {
    pub id: String,
    pub school_id: String,
    pub name: String,
    pub building: Option<String>,
    pub floor: Option<String>,
    pub capacity: Option<i32>,
    pub room_type: Option<String>,
    pub status: Option<String>,
    pub facilities: Option<Vec<String>>,
    pub description: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

impl From<Room> for RoomType {
    fn from(r: Room) -> Self {
        RoomType {
            id: r.id.map(|id| id.to_hex()).unwrap_or_default(),
            school_id: r.school_id.to_hex(),
            name: r.name,
            building: r.building,
            floor: r.floor,
            capacity: r.capacity,
            room_type: r.room_type,
            status: r.status,
            facilities: r.facilities,
            description: r.description,
            created_at: r.created_at,
            updated_at: r.updated_at,
        }
    }
}
