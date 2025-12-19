use async_graphql::{Enum, InputObject, SimpleObject};
use mongodb::bson::{oid::ObjectId, DateTime};
use serde::{Deserialize, Serialize};

use crate::utils::common_types::{
    Address, Attachment, AuditInfo, ContactInfo, DateOfBirth, Gender, SoftDelete,
};

// ============================================================================
// STUDENT ENUMS
// ============================================================================

/// Student enrollment type
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
pub enum EnrollmentType {
    New,       // First-time enrollment
    Transfer,  // Transferred from another school
    Returning, // Re-enrolling after leave
}

impl Default for EnrollmentType {
    fn default() -> Self {
        Self::New
    }
}

/// Student status
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
pub enum StudentStatus {
    Active,      // Currently enrolled
    Inactive,    // Temporarily inactive
    Graduated,   // Completed education
    Transferred, // Transferred to another school
    Expelled,    // Expelled from school
    Dropped,     // Dropped out
    OnLeave,     // On leave of absence
}

impl Default for StudentStatus {
    fn default() -> Self {
        Self::Active
    }
}

/// Relationship to student
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
pub enum Relationship {
    Father,
    Mother,
    Grandfather,
    Grandmother,
    Uncle,
    Aunt,
    Sibling,
    Guardian,
    Other,
}

impl Default for Relationship {
    fn default() -> Self {
        Self::Guardian
    }
}

/// Document type for student documents
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
pub enum DocumentType {
    BirthCertificate,
    NationalId,
    Passport,
    PreviousTranscript,
    MedicalRecord,
    Photo,
    Other,
}

// ============================================================================
// EMBEDDED STRUCTURES
// ============================================================================

/// Guardian/parent information
#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject, InputObject)]
#[graphql(input_name = "GuardianInput")]
pub struct Guardian {
    /// User ID if registered in the system
    #[serde(skip_serializing_if = "Option::is_none")]
    pub user_id: Option<String>,
    /// Guardian's full name
    pub name: String,
    /// Relationship to student
    #[serde(default)]
    pub relationship: Relationship,
    /// Primary phone number
    pub phone: String,
    /// Email address
    #[serde(skip_serializing_if = "Option::is_none")]
    pub email: Option<String>,
    /// Occupation
    #[serde(skip_serializing_if = "Option::is_none")]
    pub occupation: Option<String>,
    /// Home address
    #[serde(skip_serializing_if = "Option::is_none")]
    pub address: Option<Address>,
    /// Is emergency contact?
    #[serde(default)]
    pub is_emergency_contact: bool,
    /// Can pick up student?
    #[serde(default)]
    pub can_pickup: bool,
}

/// Student enrollment information
#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject, InputObject)]
#[graphql(input_name = "EnrollmentInfoInput")]
pub struct EnrollmentInfo {
    /// Date of enrollment
    #[graphql(skip)]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub enrollment_date: Option<DateTime>,
    /// Type of enrollment
    #[serde(default)]
    pub enrollment_type: EnrollmentType,
    /// Grade level at entry
    pub entry_grade: String,
    /// Previous school name (if transfer)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub previous_school: Option<String>,
    /// Admission/registration number
    #[serde(skip_serializing_if = "Option::is_none")]
    pub admission_number: Option<String>,
}

impl Default for EnrollmentInfo {
    fn default() -> Self {
        Self {
            enrollment_date: Some(DateTime::now()),
            enrollment_type: EnrollmentType::New,
            entry_grade: String::new(),
            previous_school: None,
            admission_number: None,
        }
    }
}

/// Student health information
#[derive(Debug, Clone, Default, Serialize, Deserialize, SimpleObject, InputObject)]
#[graphql(input_name = "HealthInfoInput")]
pub struct HealthInfo {
    /// Blood type
    #[serde(skip_serializing_if = "Option::is_none")]
    pub blood_type: Option<String>,
    /// Known allergies
    #[serde(default)]
    pub allergies: Vec<String>,
    /// Medical conditions
    #[serde(default)]
    pub medical_conditions: Vec<String>,
    /// Current medications
    #[serde(default)]
    pub medications: Vec<String>,
    /// Emergency medical notes
    #[serde(skip_serializing_if = "Option::is_none")]
    pub emergency_notes: Option<String>,
}

/// Student document with verification
#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject)]
pub struct StudentDocument {
    /// Document type
    pub doc_type: DocumentType,
    /// File attachment
    pub attachment: Attachment,
    /// Is verified?
    #[serde(default)]
    pub verified: bool,
    /// Verified by (user ID)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub verified_by: Option<String>,
    /// Verification date
    #[graphql(skip)]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub verified_at: Option<DateTime>,
}

// ============================================================================
// STUDENT MODEL
// ============================================================================

/// Student - represents an enrolled student at a school
#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject)]
#[graphql(complex)]
pub struct Student {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    #[graphql(skip)]
    pub id: Option<ObjectId>,

    // ========================
    // Multi-tenancy (REQUIRED)
    // ========================
    /// School ID - required for data isolation
    pub school_id: String,
    /// Branch ID (optional, for multi-branch schools)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub branch_id: Option<String>,

    // ========================
    // Unique Identifiers
    // ========================
    /// School-specific student ID (e.g., "STU-2024-001")
    pub student_id: String,
    /// National ID card number
    #[serde(skip_serializing_if = "Option::is_none")]
    pub national_id: Option<String>,

    // ========================
    // Personal Information
    // ========================
    /// First name (Khmer) - primary/required
    pub first_name_km: String,
    /// Last name (Khmer) - primary/required
    pub last_name_km: String,
    /// First name (English) - optional
    #[serde(skip_serializing_if = "Option::is_none")]
    pub first_name_en: Option<String>,
    /// Last name (English) - optional
    #[serde(skip_serializing_if = "Option::is_none")]
    pub last_name_en: Option<String>,
    /// Date of birth
    pub date_of_birth: DateOfBirth,
    /// Gender
    #[serde(default)]
    pub gender: Gender,
    /// Nationality
    #[serde(skip_serializing_if = "Option::is_none")]
    pub nationality: Option<String>,
    /// Religion
    #[serde(skip_serializing_if = "Option::is_none")]
    pub religion: Option<String>,

    // ========================
    // Contact Information
    // ========================
    /// Contact details
    #[serde(default)]
    pub contact: ContactInfo,

    // ========================
    // Photos & Documents
    // ========================
    /// Profile photo
    #[serde(skip_serializing_if = "Option::is_none")]
    pub profile_photo: Option<Attachment>,
    /// Uploaded documents
    #[serde(default)]
    pub documents: Vec<StudentDocument>,

    // ========================
    // Academic Information
    // ========================
    /// Enrollment details
    #[serde(default)]
    pub enrollment: EnrollmentInfo,
    /// Current class ID
    #[serde(skip_serializing_if = "Option::is_none")]
    pub current_class_id: Option<String>,
    /// Current grade level
    pub grade_level: String,

    // ========================
    // Guardians
    // ========================
    /// List of guardians/parents
    #[serde(default)]
    pub guardians: Vec<Guardian>,
    /// Index of primary guardian in guardians array
    #[serde(default)]
    pub primary_guardian_index: i32,

    // ========================
    // Health Information
    // ========================
    /// Health and medical info
    #[serde(skip_serializing_if = "Option::is_none")]
    pub health_info: Option<HealthInfo>,

    // ========================
    // Status
    // ========================
    /// Student status
    #[serde(default)]
    pub status: StudentStatus,

    // ========================
    // Audit & Soft Delete
    // ========================
    #[serde(default)]
    pub audit: AuditInfo,
    #[serde(default)]
    pub soft_delete: SoftDelete,
}

/// Complex field resolvers for Student
#[async_graphql::ComplexObject]
impl Student {
    /// Get the MongoDB ObjectId as a string
    async fn id(&self) -> Option<String> {
        self.id.map(|oid| oid.to_hex())
    }

    /// Get full name in Khmer (primary)
    async fn full_name(&self) -> String {
        format!("{} {}", self.first_name_km, self.last_name_km)
    }

    /// Get full name in English (if available)
    async fn full_name_en(&self) -> Option<String> {
        match (&self.first_name_en, &self.last_name_en) {
            (Some(first), Some(last)) => Some(format!("{} {}", first, last)),
            _ => None,
        }
    }

    /// Get primary guardian
    async fn primary_guardian(&self) -> Option<&Guardian> {
        let index = self.primary_guardian_index as usize;
        self.guardians.get(index)
    }

    /// Get age in years
    async fn age(&self) -> Option<i32> {
        Some(self.date_of_birth.age())
    }
}

impl Student {
    /// Create a new student with minimal required fields
    pub fn new(
        school_id: impl Into<String>,
        student_id: impl Into<String>,
        first_name_km: impl Into<String>,
        last_name_km: impl Into<String>,
        date_of_birth: DateOfBirth,
        grade_level: impl Into<String>,
    ) -> Self {
        Self {
            id: None,
            school_id: school_id.into(),
            branch_id: None,
            student_id: student_id.into(),
            national_id: None,
            first_name_km: first_name_km.into(),
            last_name_km: last_name_km.into(),
            first_name_en: None,
            last_name_en: None,
            date_of_birth,
            gender: Gender::default(),
            nationality: Some("Cambodian".to_string()),
            religion: None,
            contact: ContactInfo::default(),
            profile_photo: None,
            documents: vec![],
            enrollment: EnrollmentInfo::default(),
            current_class_id: None,
            grade_level: grade_level.into(),
            guardians: vec![],
            primary_guardian_index: 0,
            health_info: None,
            status: StudentStatus::Active,
            audit: AuditInfo::default(),
            soft_delete: SoftDelete::default(),
        }
    }

    /// Check if student is currently active
    pub fn is_active(&self) -> bool {
        self.status == StudentStatus::Active && !self.soft_delete.is_deleted
    }
}
