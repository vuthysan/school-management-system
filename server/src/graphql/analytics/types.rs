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
pub struct GradeHistoryEntry {
    pub date: String,
    pub average_score: f64,
    pub assessment_count: i32,
}

#[derive(SimpleObject, Debug, Serialize, Deserialize)]
pub struct StudentProgress {
    pub student_id: String,
    pub student_name: String,
    pub grade_average: f64,
    pub attendance_rate: f64,
    pub subject_grades: Vec<SubjectPerformance>,
    pub grade_history: Vec<GradeHistoryEntry>,
}

#[derive(SimpleObject, Debug, Serialize, Deserialize)]
pub struct EnrollmentTrend {
    pub month: String,
    pub total_students: i64,
    pub new_enrollments: i64,
}

#[derive(SimpleObject, Debug, Serialize, Deserialize)]
pub struct FeeCollectionSummary {
    pub total_expected: f64,
    pub total_collected: f64,
    pub collection_rate: f64,
    pub outstanding: f64,
    pub monthly_collection: Vec<MonthlyCollection>,
}

#[derive(SimpleObject, Debug, Serialize, Deserialize)]
pub struct MonthlyCollection {
    pub month: String,
    pub amount: f64,
}

#[derive(SimpleObject, Debug, Serialize, Deserialize)]
pub struct StaffStudentRatio {
    pub total_teachers: i64,
    pub total_students: i64,
    pub ratio: f64,
}

#[derive(SimpleObject, Debug, Serialize, Deserialize)]
pub struct SchoolOverviewAnalytics {
    pub total_students: i64,
    pub total_staff: i64,
    pub total_classes: i64,
    pub attendance_rate: f64,
    pub fee_collection_rate: f64,
    pub staff_student_ratio: f64,
}
