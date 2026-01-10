use async_graphql::{Enum, InputObject, SimpleObject};
use mongodb::bson::{oid::ObjectId, DateTime};
use serde::{Deserialize, Serialize};

use crate::utils::common_types::{AuditInfo, SoftDelete};

// ============================================================================
// ACADEMIC YEAR STATUS
// ============================================================================

/// Status of an academic year
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
#[graphql(rename_items = "PascalCase")]
pub enum AcademicYearStatus {
    /// Currently in planning phase
    Planning,
    /// Active academic year
    Active,
    /// Completed academic year
    Completed,
    /// Archived
    Archived,
}

impl Default for AcademicYearStatus {
    fn default() -> Self {
        AcademicYearStatus::Planning
    }
}

// ============================================================================
// ACADEMIC YEAR MODEL
// ============================================================================

/// AcademicYear - represents a school academic year (e.g., "2024-2025")
#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject)]
#[graphql(complex)]
pub struct AcademicYear {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    #[graphql(skip)]
    pub id: Option<ObjectId>,

    /// Reference to the school
    #[graphql(skip)]
    pub school_id: ObjectId,

    /// Academic year name (e.g., "2024-2025")
    pub name: String,

    /// Display label (e.g., "Academic Year 2024-2025")
    #[serde(skip_serializing_if = "Option::is_none")]
    pub label: Option<String>,

    /// Start date of the academic year
    #[graphql(skip)]
    pub start_date: DateTime,

    /// End date of the academic year
    #[graphql(skip)]
    pub end_date: DateTime,

    /// Whether this is the current/active academic year
    #[serde(default)]
    pub is_current: bool,

    /// Status of the academic year
    #[serde(default)]
    pub status: AcademicYearStatus,

    /// Description or notes
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    // ========================
    // Audit & Soft Delete
    // ========================
    #[serde(default)]
    pub audit: AuditInfo,
    #[serde(default)]
    pub soft_delete: SoftDelete,
}

#[async_graphql::ComplexObject]
impl AcademicYear {
    /// Returns the academic year's MongoDB ObjectId as a hex string
    async fn id_str(&self) -> Option<String> {
        self.id.as_ref().map(|id| id.to_hex())
    }

    /// Returns school_id as hex string
    async fn school_id_str(&self) -> String {
        self.school_id.to_hex()
    }

    /// Start date as ISO string
    async fn start_date_str(&self) -> String {
        self.start_date.try_to_rfc3339_string().unwrap_or_default()
    }

    /// End date as ISO string
    async fn end_date_str(&self) -> String {
        self.end_date.try_to_rfc3339_string().unwrap_or_default()
    }
}

impl AcademicYear {
    pub fn new(
        school_id: ObjectId,
        name: String,
        start_date: DateTime,
        end_date: DateTime,
    ) -> Self {
        Self {
            id: None,
            school_id,
            name,
            label: None,
            start_date,
            end_date,
            is_current: false,
            status: AcademicYearStatus::Planning,
            description: None,
            audit: AuditInfo::default(),
            soft_delete: SoftDelete::default(),
        }
    }
}

// ============================================================================
// CREATE/UPDATE INPUTS
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize, InputObject)]
pub struct CreateAcademicYearInput {
    pub school_id: String,
    pub name: String,
    pub label: Option<String>,
    pub start_date: String,
    pub end_date: String,
    pub is_current: Option<bool>,
    pub status: Option<AcademicYearStatus>,
    pub description: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, InputObject)]
pub struct UpdateAcademicYearInput {
    pub name: Option<String>,
    pub label: Option<String>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub is_current: Option<bool>,
    pub status: Option<AcademicYearStatus>,
    pub description: Option<String>,
}
