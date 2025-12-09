// Student GraphQL types
// NOTE: The Student model now derives SimpleObject directly with ComplexObject
// These legacy types are kept for backward compatibility but most queries
// should use the Student model directly now.

use crate::models::student::{Student, StudentStatus};
use crate::utils::common_types::{DateOfBirth, Gender};
use async_graphql::*;

// Re-export the student model types since they already have GraphQL derives
pub use crate::models::student::Guardian as GuardianType;

// Legacy StudentType for backward compatibility
// New code should use Student directly from the model
#[derive(SimpleObject)]
pub struct StudentType {
    pub id: String,
    pub school_id: String,
    pub student_id: String,
    pub first_name: String,
    pub last_name: String,
    pub date_of_birth: DateOfBirth,
    pub gender: Gender,
    pub grade_level: String,
    pub status: StudentStatus,
}

impl From<Student> for StudentType {
    fn from(s: Student) -> Self {
        StudentType {
            id: s.id.map(|id| id.to_hex()).unwrap_or_default(),
            school_id: s.school_id,
            student_id: s.student_id,
            first_name: s.first_name,
            last_name: s.last_name,
            date_of_birth: s.date_of_birth,
            gender: s.gender,
            grade_level: s.grade_level,
            status: s.status,
        }
    }
}
