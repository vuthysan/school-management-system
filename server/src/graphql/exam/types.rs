use crate::models::exam::ExamSchedule;
use crate::utils::common_types::Status;
use async_graphql::*;

#[derive(SimpleObject)]
pub struct ExamScheduleType {
    pub id: String,
    pub school_id: String,
    pub academic_year_id: String,
    pub term_id: Option<String>,
    pub name: String,
    pub subject_id: String,
    pub class_id: String,
    pub exam_date: String,
    pub start_time: String,
    pub end_time: String,
    pub room: Option<String>,
    pub examiner_id: Option<String>,
    pub max_score: f64,
    pub status: Status,
    pub created_at: String,
    pub updated_at: String,
}

impl From<ExamSchedule> for ExamScheduleType {
    fn from(exam: ExamSchedule) -> Self {
        Self {
            id: exam.id.map(|id| id.to_hex()).unwrap_or_default(),
            school_id: exam.school_id,
            academic_year_id: exam.academic_year_id,
            term_id: exam.term_id,
            name: exam.name,
            subject_id: exam.subject_id,
            class_id: exam.class_id,
            exam_date: exam.exam_date,
            start_time: exam.start_time,
            end_time: exam.end_time,
            room: exam.room,
            examiner_id: exam.examiner_id,
            max_score: exam.max_score,
            status: exam.status,
            created_at: exam.audit.created_at_str().unwrap_or_default(),
            updated_at: exam.audit.updated_at_str().unwrap_or_default(),
        }
    }
}

#[derive(SimpleObject)]
pub struct PaginatedExamsResult {
    pub items: Vec<ExamScheduleType>,
    pub total: u64,
    pub page: u64,
    pub total_pages: u64,
}
