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
    /// Branch ID (optional)
    pub branch_id: Option<String>,
    /// School-specific student ID (e.g., "STU-2024-001")
    pub student_id: Option<String>,
    /// National ID card number
    pub national_id: Option<String>,
    /// First name (English) - optional
    pub first_name_en: Option<String>,
    /// Last name (English) - optional
    pub last_name_en: Option<String>,
    /// First name (Khmer) - required
    pub first_name_km: String,
    /// Last name (Khmer) - required
    pub last_name_km: String,
    /// Date of birth
    pub date_of_birth: DateOfBirth,
    /// Gender
    pub gender: Gender,
    /// Nationality
    pub nationality: Option<String>,
    /// Religion
    pub religion: Option<String>,
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
            self.student_id.unwrap_or_default(),
            self.first_name_km.clone(),
            self.last_name_km.clone(),
            self.date_of_birth,
            self.grade_level,
        );
        student.branch_id = self.branch_id;
        student.national_id = self.national_id;
        student.first_name_en = self.first_name_en;
        student.last_name_en = self.last_name_en;
        student.first_name_km = self.first_name_km;
        student.last_name_km = self.last_name_km;
        student.gender = self.gender;
        student.nationality = self.nationality;
        student.religion = self.religion;
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
    pub first_name_en: Option<String>,
    /// Last name (English)
    pub last_name_en: Option<String>,
    /// First name (Khmer)
    pub first_name_km: Option<String>,
    /// Last name (Khmer)
    pub last_name_km: Option<String>,
    /// National ID
    pub national_id: Option<String>,
    /// Date of birth
    pub date_of_birth: Option<DateOfBirth>,
    /// Gender
    pub gender: Option<Gender>,
    /// Nationality
    pub nationality: Option<String>,
    /// Religion
    pub religion: Option<String>,
    /// Grade level
    pub grade_level: Option<String>,
    /// Current class ID
    pub current_class_id: Option<String>,
    /// Contact information
    pub contact: Option<ContactInfo>,
    /// Guardians
    pub guardians: Option<Vec<Guardian>>,
    /// Student status
    pub status: Option<StudentStatus>,
}
