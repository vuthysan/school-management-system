use async_graphql::SimpleObject;
use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

use crate::utils::common_types::{AuditInfo, SoftDelete, Status};

/// Subject - represents a subject in a school curriculum
#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject)]
#[graphql(complex)]
pub struct Subject {
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
    /// Subject name (e.g., "Mathematics", "Physics")
    pub subject_name: String,
    /// Subject code (e.g., "MATH101", "PHY201")
    pub subject_code: String,
    /// Subject description
    #[serde(default)]
    pub description: String,
    /// Applicable grade levels
    #[serde(default)]
    pub grade_levels: Vec<String>,
    /// Number of credits
    #[serde(default)]
    pub credits: i32,
    /// Department (e.g., "Science", "Arts")
    #[serde(skip_serializing_if = "Option::is_none")]
    pub department: Option<String>,

    // ========================
    // Status
    // ========================
    /// Subject status
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

/// Complex field resolvers for Subject
#[async_graphql::ComplexObject]
impl Subject {
    /// Get the MongoDB ObjectId as a string
    async fn id(&self) -> Option<String> {
        self.id.map(|oid| oid.to_hex())
    }
}

impl Subject {
    /// Create a new subject
    pub fn new(
        school_id: impl Into<String>,
        subject_name: impl Into<String>,
        subject_code: impl Into<String>,
    ) -> Self {
        Self {
            id: None,
            school_id: school_id.into(),
            branch_id: None,
            subject_name: subject_name.into(),
            subject_code: subject_code.into(),
            description: String::new(),
            grade_levels: vec![],
            credits: 0,
            department: None,
            status: Status::Active,
            audit: AuditInfo::default(),
            soft_delete: SoftDelete::default(),
        }
    }
}
