// Subject GraphQL inputs
use async_graphql::*;
use mongodb::bson::DateTime;
use crate::models::subject::Subject;

#[derive(InputObject)]
pub struct SubjectInput {
    pub subject_name: String,
    pub subject_code: String,
    pub description: String,
    pub grade_levels: Vec<String>,
    pub credits: i32,
}

impl From<SubjectInput> for Subject {
    fn from(input: SubjectInput) -> Self {
        let now = DateTime::now();
        Subject {
            id: None,
            subject_name: input.subject_name,
            subject_code: input.subject_code,
            description: input.description,
            grade_levels: input.grade_levels,
            credits: input.credits,
            created_at: now,
            updated_at: now,
        }
    }
}
