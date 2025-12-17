// GradeLevel GraphQL input types
use crate::models::grade_level::GradeLevel;
use crate::utils::common_types::{AuditInfo, SoftDelete, Status};
use async_graphql::InputObject;

/// Input for creating a new grade level
#[derive(InputObject)]
pub struct GradeLevelInput {
    /// School ID (required)
    pub school_id: String,
    /// Branch ID (optional)
    pub branch_id: Option<String>,
    /// Grade level name (e.g., "Grade 1", "ថ្នាក់ទី១")
    pub name: String,
    /// Grade level code (e.g., "G1", "K1")
    pub code: String,
    /// Sort order (e.g., 1, 2, 3)
    #[graphql(default)]
    pub order: i32,
    /// Optional description
    pub description: Option<String>,
    /// Status (defaults to Active)
    pub status: Option<Status>,
}

impl From<GradeLevelInput> for GradeLevel {
    fn from(input: GradeLevelInput) -> Self {
        GradeLevel {
            id: None,
            school_id: input.school_id,
            branch_id: input.branch_id,
            name: input.name,
            code: input.code,
            order: input.order,
            description: input.description,
            status: input.status.unwrap_or(Status::Active),
            audit: AuditInfo::default(),
            soft_delete: SoftDelete::default(),
        }
    }
}

/// Input for updating an existing grade level
#[derive(InputObject)]
pub struct UpdateGradeLevelInput {
    /// Update name
    pub name: Option<String>,
    /// Update code
    pub code: Option<String>,
    /// Update sort order
    pub order: Option<i32>,
    /// Update description
    pub description: Option<String>,
    /// Update status
    pub status: Option<Status>,
    /// Update branch ID
    pub branch_id: Option<String>,
}

/// Filter input for querying grade levels
#[derive(InputObject)]
pub struct GradeLevelFilterInput {
    /// Search by name or code
    pub search: Option<String>,
    /// Filter by status
    pub status: Option<Status>,
    /// Filter by branch ID
    pub branch_id: Option<String>,
}

/// Sort input for querying grade levels
#[derive(InputObject)]
pub struct GradeLevelSortInput {
    /// Field to sort by: "name", "code", "order", "createdAt"
    pub sort_by: Option<String>,
    /// Sort order: "asc" or "desc"
    pub sort_order: Option<String>,
}
