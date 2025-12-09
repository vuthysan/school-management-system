// Class GraphQL types
// NOTE: The Class model now derives SimpleObject directly with ComplexObject
// These legacy types are kept for backward compatibility

use crate::models::class::Class;
use crate::utils::common_types::Status;
use async_graphql::*;

// Re-export schedule types from the model since they already have GraphQL derives
pub use crate::models::class::{ClassSchedule, SchedulePeriod};

// Legacy ClassType for backward compatibility
// New code should use Class directly from the model
#[derive(SimpleObject)]
pub struct ClassType {
    pub id: String,
    pub school_id: String,
    pub academic_year_id: String,
    pub name: String,
    pub code: String,
    pub grade_level: String,
    pub section: Option<String>,
    pub homeroom_teacher_id: Option<String>,
    pub room_number: Option<String>,
    pub capacity: i32,
    pub current_enrollment: i32,
    pub status: Status,
}

impl From<Class> for ClassType {
    fn from(c: Class) -> Self {
        ClassType {
            id: c.id.map(|id| id.to_hex()).unwrap_or_default(),
            school_id: c.school_id,
            academic_year_id: c.academic_year_id,
            name: c.name,
            code: c.code,
            grade_level: c.grade_level,
            section: c.section,
            homeroom_teacher_id: c.homeroom_teacher_id,
            room_number: c.room_number,
            capacity: c.capacity,
            current_enrollment: c.current_enrollment,
            status: c.status,
        }
    }
}
