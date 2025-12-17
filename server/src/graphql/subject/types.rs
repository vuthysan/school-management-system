// Subject GraphQL types
use crate::models::subject::Subject;
use crate::utils::common_types::Status;
use async_graphql::*;

#[derive(SimpleObject)]
pub struct SubjectType {
    pub id: String,
    pub school_id: String,
    pub branch_id: Option<String>,
    pub subject_name: String,
    pub subject_code: String,
    pub description: String,
    pub grade_levels: Vec<String>,
    pub credits: i32,
    pub department: Option<String>,
    pub status: Status,
    pub created_at: String,
    pub updated_at: String,
}

impl From<Subject> for SubjectType {
    fn from(s: Subject) -> Self {
        SubjectType {
            id: s.id.map(|id| id.to_hex()).unwrap_or_default(),
            school_id: s.school_id,
            branch_id: s.branch_id,
            subject_name: s.subject_name,
            subject_code: s.subject_code,
            description: s.description,
            grade_levels: s.grade_levels,
            credits: s.credits,
            department: s.department,
            status: s.status,
            created_at: s
                .audit
                .created_at
                .map(|dt| dt.try_to_rfc3339_string().unwrap_or_default())
                .unwrap_or_default(),
            updated_at: s
                .audit
                .updated_at
                .map(|dt| dt.try_to_rfc3339_string().unwrap_or_default())
                .unwrap_or_default(),
        }
    }
}

// ============================================================================
// PAGINATED RESULT TYPE
// ============================================================================

/// Paginated result for subjects list
#[derive(SimpleObject)]
pub struct PaginatedSubjectsResult {
    /// List of subjects for current page
    pub items: Vec<SubjectType>,
    /// Total number of subjects matching the filter
    pub total: i64,
    /// Current page number (1-indexed)
    pub page: i32,
    /// Number of items per page
    pub page_size: i32,
    /// Total number of pages
    pub total_pages: i32,
}
