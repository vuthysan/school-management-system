use crate::utils::common_types::{AuditInfo, SoftDelete, Status};
use async_graphql::*;
use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

/// ExamSchedule - represents a scheduled exam for a class and subject
#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject)]
#[graphql(complex)]
pub struct ExamSchedule {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    #[graphql(skip)]
    pub id: Option<ObjectId>,
    pub school_id: String,
    pub academic_year_id: String,
    pub term_id: Option<String>,
    pub name: String, // e.g. "Midterm Exam", "Final Assessment"
    pub subject_id: String,
    pub class_id: String,
    pub exam_date: String,  // ISO date string
    pub start_time: String, // "08:00"
    pub end_time: String,   // "10:30"
    pub room: Option<String>,
    pub examiner_id: Option<String>,
    pub max_score: f64,
    pub status: Status,
    pub audit: AuditInfo,
    pub soft_delete: SoftDelete,
}

#[async_graphql::ComplexObject]
impl ExamSchedule {
    /// Get the MongoDB ObjectId as a string
    async fn id(&self) -> Option<String> {
        self.id.map(|oid| oid.to_hex())
    }
}

#[derive(InputObject)]
pub struct ExamScheduleInput {
    pub school_id: String,
    pub academic_year_id: String,
    pub term_id: Option<String>,
    pub name: String,
    pub subject_id: String,
    pub class_id: String,
    pub exam_date: String,
    pub start_time: String,
    pub end_time: String,
    pub room: Option<String>,
    pub examiner_id: Option<String>,
    pub max_score: f64,
}

#[derive(InputObject)]
pub struct UpdateExamScheduleInput {
    pub name: Option<String>,
    pub exam_date: Option<String>,
    pub start_time: Option<String>,
    pub end_time: Option<String>,
    pub room: Option<String>,
    pub examiner_id: Option<String>,
    pub max_score: Option<f64>,
    pub status: Option<Status>,
}

impl ExamSchedule {
    pub fn new(
        school_id: String,
        academic_year_id: String,
        name: String,
        subject_id: String,
        class_id: String,
        exam_date: String,
        start_time: String,
        end_time: String,
        max_score: f64,
    ) -> Self {
        Self {
            id: None,
            school_id,
            academic_year_id,
            term_id: None,
            name,
            subject_id,
            class_id,
            exam_date,
            start_time,
            end_time,
            room: None,
            examiner_id: None,
            max_score,
            status: Status::Active,
            audit: AuditInfo::new(None),
            soft_delete: SoftDelete::default(),
        }
    }
}
