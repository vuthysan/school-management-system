// Grade GraphQL inputs
use async_graphql::*;
use mongodb::bson::{oid::ObjectId, DateTime};
use crate::models::grade::Grade;

#[derive(InputObject)]
pub struct GradeInput {
    pub student_id: String,
    pub class_id: String,
    pub subject_id: String,
    pub academic_year: String,
    pub semester: String,
    pub assessment_type: String,
    pub score: f64,
    pub max_score: f64,
    pub percentage: f64,
    pub grade: String,
    pub remarks: Option<String>,
    pub graded_by: String,
}

impl From<GradeInput> for Grade {
    fn from(input: GradeInput) -> Self {
        let now = DateTime::now();
        Grade {
            id: None,
            student_id: ObjectId::parse_str(&input.student_id).unwrap(),
            class_id: ObjectId::parse_str(&input.class_id).unwrap(),
            subject_id: ObjectId::parse_str(&input.subject_id).unwrap(),
            academic_year: input.academic_year,
            semester: input.semester,
            assessment_type: input.assessment_type,
            score: input.score,
            max_score: input.max_score,
            percentage: input.percentage,
            grade: input.grade,
            remarks: input.remarks,
            graded_by: ObjectId::parse_str(&input.graded_by).unwrap(),
            graded_at: now,
            created_at: now,
            updated_at: now,
        }
    }
}
