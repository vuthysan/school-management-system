use async_graphql::{Enum, InputObject, SimpleObject};
use mongodb::bson::{oid::ObjectId, DateTime};
use serde::{Deserialize, Serialize};

use crate::utils::common_types::{AuditInfo, SoftDelete};

// ============================================================================
// TERM TYPE
// ============================================================================

/// Type of term/semester
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
#[graphql(rename_items = "PascalCase")]
pub enum TermType {
    /// Semester (2 per year)
    Semester,
    /// Trimester (3 per year)
    Trimester,
    /// Quarter (4 per year)
    Quarter,
    /// Custom term
    Custom,
}

impl Default for TermType {
    fn default() -> Self {
        TermType::Semester
    }
}

// ============================================================================
// TERM MODEL
// ============================================================================

/// Term - represents a term/semester within an academic year
#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject)]
#[graphql(complex)]
pub struct Term {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    #[graphql(skip)]
    pub id: Option<ObjectId>,

    /// Reference to the school
    #[graphql(skip)]
    pub school_id: ObjectId,

    /// Reference to the academic year
    #[graphql(skip)]
    pub academic_year_id: ObjectId,

    /// Term name (e.g., "Term 1", "Semester 1", "Q1")
    pub name: String,

    /// Term number (1, 2, 3, etc.)
    pub term_number: i32,

    /// Type of term
    #[serde(default)]
    pub term_type: TermType,

    /// Start date of the term
    #[graphql(skip)]
    pub start_date: DateTime,

    /// End date of the term
    #[graphql(skip)]
    pub end_date: DateTime,

    /// Whether this is the current term
    #[serde(default)]
    pub is_current: bool,

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
impl Term {
    /// Returns the term's MongoDB ObjectId as a hex string
    async fn id_str(&self) -> Option<String> {
        self.id.as_ref().map(|id| id.to_hex())
    }

    /// Returns school_id as hex string
    async fn school_id_str(&self) -> String {
        self.school_id.to_hex()
    }

    /// Returns academic_year_id as hex string
    async fn academic_year_id_str(&self) -> String {
        self.academic_year_id.to_hex()
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

impl Term {
    pub fn new(
        school_id: ObjectId,
        academic_year_id: ObjectId,
        name: String,
        term_number: i32,
        start_date: DateTime,
        end_date: DateTime,
    ) -> Self {
        Self {
            id: None,
            school_id,
            academic_year_id,
            name,
            term_number,
            term_type: TermType::default(),
            start_date,
            end_date,
            is_current: false,
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
pub struct CreateTermInput {
    pub school_id: String,
    pub academic_year_id: String,
    pub name: String,
    pub term_number: i32,
    pub term_type: Option<TermType>,
    pub start_date: String,
    pub end_date: String,
    pub is_current: Option<bool>,
    pub description: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize, InputObject)]
pub struct UpdateTermInput {
    pub name: Option<String>,
    pub term_number: Option<i32>,
    pub term_type: Option<TermType>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub is_current: Option<bool>,
    pub description: Option<String>,
}
