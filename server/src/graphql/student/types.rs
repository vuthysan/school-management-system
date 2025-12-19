// Student GraphQL types
// NOTE: The Student model now derives SimpleObject directly with ComplexObject
// These legacy types are kept for backward compatibility but most queries
// should use the Student model directly now.

use crate::models::student::{Guardian, Student, StudentStatus};
use crate::utils::common_types::{ContactInfo, DateOfBirth, Gender};
use async_graphql::*;

// Re-export the student model types since they already have GraphQL derives
pub use crate::models::student::Guardian as GuardianType;

// Legacy StudentType for backward compatibility
// New code should use Student directly from the model
#[derive(SimpleObject)]
#[graphql(complex)]
pub struct StudentType {
    pub id: String,
    pub school_id: String,
    pub student_id: String,
    pub national_id: Option<String>,
    pub first_name_km: String,
    pub last_name_km: String,
    pub first_name_en: Option<String>,
    pub last_name_en: Option<String>,
    pub contact: ContactInfo,
    pub date_of_birth: DateOfBirth,
    pub gender: Gender,
    pub nationality: Option<String>,
    pub religion: Option<String>,
    pub grade_level: String,
    pub status: StudentStatus,
    pub guardians: Vec<Guardian>,
}

#[ComplexObject]
impl StudentType {
    async fn full_name(&self) -> String {
        format!("{} {}", self.first_name_km, self.last_name_km)
    }

    async fn full_name_en(&self) -> Option<String> {
        match (&self.first_name_en, &self.last_name_en) {
            (Some(f), Some(l)) => Some(format!("{} {}", f, l)),
            _ => None,
        }
    }
}

impl From<Student> for StudentType {
    fn from(s: Student) -> Self {
        StudentType {
            id: s.id.map(|id| id.to_hex()).unwrap_or_default(),
            school_id: s.school_id,
            student_id: s.student_id,
            national_id: s.national_id,
            first_name_km: s.first_name_km,
            last_name_km: s.last_name_km,
            first_name_en: s.first_name_en,
            last_name_en: s.last_name_en,
            contact: s.contact,
            date_of_birth: s.date_of_birth,
            gender: s.gender,
            nationality: s.nationality,
            religion: s.religion,
            grade_level: s.grade_level,
            status: s.status,
            guardians: s.guardians,
        }
    }
}
