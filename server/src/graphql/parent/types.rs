use async_graphql::*;

/// A child's class info for parent view
#[derive(SimpleObject)]
pub struct ChildClassInfo {
    pub id: String,
    pub name: String,
    pub grade: String,
}

/// A child's summary for the parent portal
#[derive(SimpleObject)]
pub struct ChildSummary {
    pub id: String,
    pub student_id: String,
    pub first_name_km: String,
    pub last_name_km: String,
    pub first_name_en: Option<String>,
    pub last_name_en: Option<String>,
    pub full_name: String,
    pub grade_level: String,
    pub status: String,
    pub gender: String,
    pub current_class: Option<ChildClassInfo>,
    pub attendance_rate: f64,
    pub average_grade: f64,
}

/// Grade entry as seen by parents (enriched with subject name)
#[derive(SimpleObject)]
pub struct ParentGradeView {
    pub id: String,
    pub subject_id: String,
    pub subject_name: String,
    pub score: f64,
    pub max_score: f64,
    pub percentage: f64,
    pub grade_date: String,
    pub term: String,
}
