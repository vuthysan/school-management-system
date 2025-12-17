// Subject GraphQL inputs
use crate::models::subject::Subject;
use crate::utils::common_types::Status;
use async_graphql::*;

#[derive(InputObject)]
pub struct SubjectInput {
    /// School ID (required)
    pub school_id: String,
    /// Branch ID (optional)
    pub branch_id: Option<String>,
    /// Subject name
    pub subject_name: String,
    /// Subject code
    pub subject_code: String,
    /// Description
    pub description: Option<String>,
    /// Applicable grade levels
    pub grade_levels: Option<Vec<String>>,
    /// Number of credits
    pub credits: Option<i32>,
    /// Department
    pub department: Option<String>,
}

impl From<SubjectInput> for Subject {
    fn from(input: SubjectInput) -> Self {
        let mut subject = Subject::new(input.school_id, input.subject_name, input.subject_code);
        subject.branch_id = input.branch_id;
        subject.description = input.description.unwrap_or_default();
        subject.grade_levels = input.grade_levels.unwrap_or_default();
        subject.credits = input.credits.unwrap_or(0);
        subject.department = input.department;
        subject
    }
}

#[derive(InputObject)]
pub struct UpdateSubjectInput {
    /// Subject name
    pub subject_name: Option<String>,
    /// Subject code
    pub subject_code: Option<String>,
    /// Description
    pub description: Option<String>,
    /// Applicable grade levels
    pub grade_levels: Option<Vec<String>>,
    /// Number of credits
    pub credits: Option<i32>,
    /// Department
    pub department: Option<String>,
    /// Status
    pub status: Option<Status>,
}

// ============================================================================
// FILTER AND SORT INPUTS
// ============================================================================

/// Input for filtering subjects
#[derive(InputObject, Default)]
pub struct SubjectFilterInput {
    /// Search by name or code (case-insensitive)
    pub search: Option<String>,
    /// Filter by status
    pub status: Option<Status>,
    /// Filter by department
    pub department: Option<String>,
    /// Filter by grade level
    pub grade_level: Option<String>,
    /// Filter by branch ID
    pub branch_id: Option<String>,
}

/// Input for sorting subjects
#[derive(InputObject, Default)]
pub struct SubjectSortInput {
    /// Field to sort by: "subjectName", "subjectCode", "credits", "createdAt"
    pub sort_by: Option<String>,
    /// Sort order: "asc" or "desc" (default: "asc")
    pub sort_order: Option<String>,
}
