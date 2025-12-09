// Grade GraphQL types
use async_graphql::*;
use crate::models::grade::Grade;

#[derive(SimpleObject)]
pub struct GradeType {
    pub id: String,
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
    pub graded_at: String,
    pub created_at: String,
    pub updated_at: String,
}

impl From<Grade> for GradeType {
    fn from(g: Grade) -> Self {
        GradeType {
            id: g.id.map(|id| id.to_hex()).unwrap_or_default(),
            student_id: g.student_id.to_hex(),
            class_id: g.class_id.to_hex(),
            subject_id: g.subject_id.to_hex(),
            academic_year: g.academic_year,
            semester: g.semester,
            assessment_type: g.assessment_type,
            score: g.score,
            max_score: g.max_score,
            percentage: g.percentage,
            grade: g.grade,
            remarks: g.remarks,
            graded_by: g.graded_by.to_hex(),
            graded_at: g.graded_at.try_to_rfc3339_string().unwrap_or_default(),
            created_at: g.created_at.try_to_rfc3339_string().unwrap_or_default(),
            updated_at: g.updated_at.try_to_rfc3339_string().unwrap_or_default(),
        }
    }
}
