// Subject GraphQL types
use async_graphql::*;
use crate::models::subject::Subject;

#[derive(SimpleObject)]
pub struct SubjectType {
    pub id: String,
    pub subject_name: String,
    pub subject_code: String,
    pub description: String,
    pub grade_levels: Vec<String>,
    pub credits: i32,
    pub created_at: String,
    pub updated_at: String,
}

impl From<Subject> for SubjectType {
    fn from(s: Subject) -> Self {
        SubjectType {
            id: s.id.map(|id| id.to_hex()).unwrap_or_default(),
            subject_name: s.subject_name,
            subject_code: s.subject_code,
            description: s.description,
            grade_levels: s.grade_levels,
            credits: s.credits,
            created_at: s.created_at.try_to_rfc3339_string().unwrap_or_default(),
            updated_at: s.updated_at.try_to_rfc3339_string().unwrap_or_default(),
        }
    }
}
