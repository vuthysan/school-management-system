// Attendance GraphQL inputs
use crate::models::attendance::Attendance;
use async_graphql::*;
use mongodb::bson::{oid::ObjectId, DateTime};

#[derive(InputObject)]
pub struct AttendanceInput {
    pub student_id: String,
    pub class_id: String,
    pub date: String,
    pub status: String,
    pub remarks: Option<String>,
    pub marked_by: String,
}

impl From<AttendanceInput> for Attendance {
    fn from(input: AttendanceInput) -> Self {
        let now = DateTime::now();
        let date = DateTime::parse_rfc3339_str(&input.date).unwrap_or(now);
        Attendance {
            id: None,
            student_id: ObjectId::parse_str(&input.student_id).unwrap(),
            class_id: ObjectId::parse_str(&input.class_id).unwrap(),
            date,
            status: input.status,
            remarks: input.remarks,
            marked_by: ObjectId::parse_str(&input.marked_by).unwrap(),
            created_at: now,
            updated_at: now,
        }
    }
}

/// Input for a single attendance record in bulk operations
#[derive(InputObject)]
pub struct AttendanceRecordInput {
    pub student_id: String,
    pub status: String,
    pub remarks: Option<String>,
}

/// Input for updating an existing attendance record
#[derive(InputObject)]
pub struct UpdateAttendanceInput {
    pub id: String,
    pub status: String,
    pub remarks: Option<String>,
}
