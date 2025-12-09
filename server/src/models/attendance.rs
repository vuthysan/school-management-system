use serde::{Deserialize, Serialize};
use mongodb::bson::{oid::ObjectId, DateTime};

#[derive(Debug, Serialize, Deserialize)]
pub struct Attendance {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub student_id: ObjectId,
    pub class_id: ObjectId,
    pub date: DateTime,
    pub status: String, // "present" | "absent" | "late" | "excused"
    pub remarks: Option<String>,
    pub marked_by: ObjectId,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}
