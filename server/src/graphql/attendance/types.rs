// Attendance GraphQL types
use async_graphql::*;
use crate::models::attendance::Attendance;

#[derive(SimpleObject)]
pub struct AttendanceType {
    pub id: String,
    pub student_id: String,
    pub class_id: String,
    pub date: String,
    pub status: String,
    pub remarks: Option<String>,
    pub marked_by: String,
    pub created_at: String,
    pub updated_at: String,
}

impl From<Attendance> for AttendanceType {
    fn from(a: Attendance) -> Self {
        AttendanceType {
            id: a.id.map(|id| id.to_hex()).unwrap_or_default(),
            student_id: a.student_id.to_hex(),
            class_id: a.class_id.to_hex(),
            date: a.date.try_to_rfc3339_string().unwrap_or_default(),
            status: a.status,
            remarks: a.remarks,
            marked_by: a.marked_by.to_hex(),
            created_at: a.created_at.try_to_rfc3339_string().unwrap_or_default(),
            updated_at: a.updated_at.try_to_rfc3339_string().unwrap_or_default(),
        }
    }
}
