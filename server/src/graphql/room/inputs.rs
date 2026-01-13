// Room GraphQL inputs
use async_graphql::*;

#[derive(InputObject)]
pub struct CreateRoomInput {
    pub school_id: String,
    pub name: String,
    pub building: Option<String>,
    pub floor: Option<String>,
    pub capacity: Option<i32>,
    pub room_type: Option<String>,
    pub status: Option<String>,
    pub facilities: Option<Vec<String>>,
    pub description: Option<String>,
}

#[derive(InputObject)]
pub struct UpdateRoomInput {
    pub name: Option<String>,
    pub building: Option<String>,
    pub floor: Option<String>,
    pub capacity: Option<i32>,
    pub room_type: Option<String>,
    pub status: Option<String>,
    pub facilities: Option<Vec<String>>,
    pub description: Option<String>,
}
