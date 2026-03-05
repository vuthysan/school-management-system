use async_graphql::*;

/// A complete student report card following MoEYS Cambodia format.
/// Includes student info, subject-wise grades by assessment type,
/// semester averages, and overall ranking.
#[derive(SimpleObject)]
pub struct ReportCard {
    // === Student Information ===
    pub student_id: String,
    pub student_code: String,
    pub first_name_km: String,
    pub last_name_km: String,
    pub first_name_en: Option<String>,
    pub last_name_en: Option<String>,
    pub date_of_birth: Option<String>,
    pub gender: String,
    pub grade_level: String,
    pub class_name: Option<String>,

    // === Academic Period ===
    pub academic_year: String,
    /// Buddhist Era display: e.g. "ព.ស. 2568"
    pub academic_year_be: String,
    pub semester: String,
    pub school_name: Option<String>,

    // === Subject Results ===
    pub subjects: Vec<SubjectResult>,

    // === Summary ===
    pub overall_average: f64,
    pub overall_grade: String,
    pub total_subjects: i32,
    pub rank_in_class: Option<i32>,
    pub total_students_in_class: Option<i32>,

    // === Remarks ===
    pub remarks: Option<String>,
    pub generated_at: String,
}

/// Per-subject breakdown with scores by assessment type.
#[derive(SimpleObject, Clone)]
pub struct SubjectResult {
    pub subject_id: String,
    pub subject_name: String,
    /// Quiz/homework average
    pub quiz_average: Option<f64>,
    /// Midterm exam score
    pub midterm_score: Option<f64>,
    /// Final exam score
    pub final_score: Option<f64>,
    /// Weighted average for the subject
    pub subject_average: f64,
    /// Letter grade (A, B, C, D, F)
    pub grade: String,
    pub total_assessments: i32,
}

/// Assign a letter grade based on MoEYS Cambodia grading scale.
/// A: 80-100, B: 60-79, C: 50-59, D: 25-49, F: 0-24
pub fn moeys_letter_grade(percentage: f64) -> String {
    match percentage as i32 {
        80..=100 => "A".to_string(),
        60..=79 => "B".to_string(),
        50..=59 => "C".to_string(),
        25..=49 => "D".to_string(),
        _ => "F".to_string(),
    }
}
