use serde::{Deserialize, Serialize};
use mongodb::bson::{oid::ObjectId, DateTime};

#[derive(Debug, Serialize, Deserialize)]
pub struct Subject {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub subject_name: String,
    pub subject_code: String,
    pub description: String,
    pub grade_levels: Vec<String>,
    pub credits: i32,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}
