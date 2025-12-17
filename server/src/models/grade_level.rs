use async_graphql::SimpleObject;
use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

use crate::utils::common_types::{AuditInfo, SoftDelete, Status};

/// GradeLevel - represents a grade level in a school (e.g., "Grade 1", "Grade 10")
/// Each school can define their own grade levels dynamically
#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject)]
#[graphql(complex)]
pub struct GradeLevel {
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
    // Basic Information
    // ========================
    /// Grade level name (e.g., "Grade 1", "ថ្នាក់ទី១", "Kindergarten")
    pub name: String,
    /// Grade level code (e.g., "G1", "K1", "PRE")
    pub code: String,
    /// Sort order for display (e.g., 1, 2, 3)
    #[serde(default)]
    pub order: i32,
    /// Optional description
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    // ========================
    // Status
    // ========================
    /// Grade level status
    #[serde(default)]
    pub status: Status,

    // ========================
    // Audit & Soft Delete
    // ========================
    #[serde(default)]
    pub audit: AuditInfo,
    #[serde(default)]
    pub soft_delete: SoftDelete,
}

/// Complex field resolvers for GradeLevel
#[async_graphql::ComplexObject]
impl GradeLevel {
    /// Get the MongoDB ObjectId as a string
    async fn id(&self) -> Option<String> {
        self.id.map(|oid| oid.to_hex())
    }
}

impl GradeLevel {
    /// Create a new grade level
    pub fn new(
        school_id: impl Into<String>,
        name: impl Into<String>,
        code: impl Into<String>,
        order: i32,
    ) -> Self {
        Self {
            id: None,
            school_id: school_id.into(),
            branch_id: None,
            name: name.into(),
            code: code.into(),
            order,
            description: None,
            status: Status::Active,
            audit: AuditInfo::default(),
            soft_delete: SoftDelete::default(),
        }
    }
}
