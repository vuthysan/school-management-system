use crate::utils::common_types::Status;
use async_graphql::*;

#[derive(InputObject)]
pub struct ExamFilterInput {
    pub search: Option<String>,
    pub class_id: Option<String>,
    pub subject_id: Option<String>,
    pub status: Option<Status>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
}

#[derive(InputObject)]
pub struct ExamSortInput {
    pub sort_by: Option<String>,    // "exam_date", "name"
    pub sort_order: Option<String>, // "asc", "desc"
}
