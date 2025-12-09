// Student GraphQL inputs
// NOTE: The Student model now has embedded InputObject types
// These simplified inputs can be used for basic operations
use crate::models::student::{Guardian, Student, StudentStatus};
use crate::utils::common_types::{ContactInfo, DateOfBirth, Gender};
use async_graphql::*;

#[derive(InputObject)]
pub struct CreateStudentInput {
    /// School ID (required)
    pub school_id: String,
    /// School-specific student ID (e.g., "STU-2024-001")
    pub student_id: String,
    /// First name (English)
    pub first_name: String,
    /// Last name (English)
    pub last_name: String,
    /// First name (Khmer)
    pub first_name_km: Option<String>,
    /// Last name (Khmer)
    pub last_name_km: Option<String>,
    /// Date of birth
    pub date_of_birth: DateOfBirth,
    /// Gender
    pub gender: Gender,
    /// Grade level
    pub grade_level: String,
    /// Contact information
    pub contact: Option<ContactInfo>,
    /// Guardians
    pub guardians: Option<Vec<Guardian>>,
}

impl CreateStudentInput {
    pub fn into_student(self) -> Student {
        let mut student = Student::new(
            self.school_id,
            self.student_id,
            self.first_name,
            self.last_name,
            self.date_of_birth,
            self.grade_level,
        );
        student.first_name_km = self.first_name_km;
        student.last_name_km = self.last_name_km;
        student.gender = self.gender;
        if let Some(contact) = self.contact {
            student.contact = contact;
        }
        if let Some(guardians) = self.guardians {
            student.guardians = guardians;
        }
        student
    }
}

#[derive(InputObject)]
pub struct UpdateStudentInput {
    /// First name (English)
    pub first_name: Option<String>,
    /// Last name (English)
    pub last_name: Option<String>,
    /// First name (Khmer)
    pub first_name_km: Option<String>,
    /// Last name (Khmer)
    pub last_name_km: Option<String>,
    /// Grade level
    pub grade_level: Option<String>,
    /// Current class ID
    pub current_class_id: Option<String>,
    /// Student status
    pub status: Option<StudentStatus>,
}
