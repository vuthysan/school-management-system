use async_graphql::*;
use serde::{Deserialize, Serialize};

#[derive(SimpleObject, Debug, Serialize, Deserialize)]
pub struct ClassPerformance {
    pub class_id: String,
    pub class_name: String,
    pub average_score: f64,
    pub student_count: i32,
}

#[derive(SimpleObject, Debug, Serialize, Deserialize)]
pub struct SubjectPerformance {
    pub subject_id: String,
    pub subject_name: String,
    pub average_score: f64,
}

#[derive(SimpleObject, Debug, Serialize, Deserialize)]
pub struct GradeDistribution {
    pub grade: String,
    pub count: i32,
}

#[derive(SimpleObject, Debug, Serialize, Deserialize)]
pub struct PerformanceAnalytics {
    pub class_performances: Vec<ClassPerformance>,
    pub subject_performances: Vec<SubjectPerformance>,
    pub grade_distribution: Vec<GradeDistribution>,
}

#[derive(SimpleObject, Debug, Serialize, Deserialize)]
pub struct AttendanceTrend {
    pub date: String,
    pub attendance_rate: f64,
}

#[derive(SimpleObject, Debug, Serialize, Deserialize)]
pub struct AttendanceAnalytics {
    pub weekly_trends: Vec<AttendanceTrend>,
    pub monthly_trends: Vec<AttendanceTrend>,
    pub average_rate: f64,
}

#[derive(SimpleObject, Debug, Serialize, Deserialize)]
pub struct StudentProgress {
    pub student_id: String,
    pub student_name: String,
    pub grade_average: f64,
    pub attendance_rate: f64,
    pub subject_grades: Vec<SubjectPerformance>,
    pub grade_history: Vec<AttendanceTrend>, // Reusing trend for grade history too
}
