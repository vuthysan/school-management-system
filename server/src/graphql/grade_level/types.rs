// GradeLevel GraphQL types
use crate::models::grade_level::GradeLevel;
use async_graphql::SimpleObject;

/// Type alias for GradeLevel to use in GraphQL
pub type GradeLevelType = GradeLevel;

/// Paginated result for grade levels
#[derive(SimpleObject)]
pub struct PaginatedGradeLevelsResult {
    /// List of grade levels
    pub items: Vec<GradeLevelType>,
    /// Total number of matching records
    pub total: i64,
    /// Current page number
    pub page: i32,
    /// Page size
    pub page_size: i32,
    /// Total number of pages
    pub total_pages: i32,
}
