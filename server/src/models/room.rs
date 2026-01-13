// Room model - represents classrooms and facilities
use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Room {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub school_id: ObjectId,
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub building: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub floor: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub capacity: Option<i32>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub room_type: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub status: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub facilities: Option<Vec<String>>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

impl Room {
    pub fn new(school_id: ObjectId, name: String) -> Self {
        let now = chrono::Utc::now().to_rfc3339();
        Self {
            id: None,
            school_id,
            name,
            building: None,
            floor: None,
            capacity: None,
            room_type: Some("Classroom".to_string()),
            status: Some("Available".to_string()),
            facilities: None,
            description: None,
            created_at: now.clone(),
            updated_at: now,
        }
    }
}
