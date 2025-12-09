use serde::{Deserialize, Serialize};
use mongodb::bson::{oid::ObjectId, DateTime};

#[derive(Debug, Serialize, Deserialize)]
pub struct Grade {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub student_id: ObjectId,
    pub class_id: ObjectId,
    pub subject_id: ObjectId,
    pub academic_year: String,
    pub semester: String, // "1" | "2"
    pub assessment_type: String, // "quiz" | "midterm" | "final" | "assignment"
    pub score: f64,
    pub max_score: f64,
    pub percentage: f64,
    pub grade: String, // "A" | "B" | "C" | "D" | "F"
    pub remarks: Option<String>,
    pub graded_by: ObjectId,
    pub graded_at: DateTime,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}
