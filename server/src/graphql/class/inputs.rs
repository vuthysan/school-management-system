// Class GraphQL inputs
use crate::models::class::{Class, ClassSchedule};
use crate::utils::common_types::Status;
use async_graphql::*;

#[derive(InputObject)]
pub struct ClassInput {
    /// School ID (required)
    pub school_id: String,
    /// Academic year ID
    pub academic_year_id: String,
    /// Class name (e.g., "Grade 10A")
    pub name: String,
    /// Class code (e.g., "G10A-2024")
    pub code: String,
    /// Grade level
    pub grade_level: String,
    /// Section
    pub section: Option<String>,
    /// Homeroom teacher ID
    pub homeroom_teacher_id: Option<String>,
    /// Room number
    pub room_number: Option<String>,
    /// Capacity
    pub capacity: Option<i32>,
    /// Schedule
    pub schedule: Option<Vec<ClassSchedule>>,
}

impl From<ClassInput> for Class {
    fn from(input: ClassInput) -> Self {
        let mut class = Class::new(
            input.school_id,
            input.academic_year_id,
            input.name,
            input.code,
            input.grade_level,
        );
        class.section = input.section;
        class.homeroom_teacher_id = input.homeroom_teacher_id;
        class.room_number = input.room_number;
        if let Some(capacity) = input.capacity {
            class.capacity = capacity;
        }
        if let Some(schedule) = input.schedule {
            class.schedule = schedule;
        }
        class
    }
}

#[derive(InputObject)]
pub struct UpdateClassInput {
    /// Class name
    pub name: Option<String>,
    /// Section
    pub section: Option<String>,
    /// Homeroom teacher ID
    pub homeroom_teacher_id: Option<String>,
    /// Room number
    pub room_number: Option<String>,
    /// Capacity
    pub capacity: Option<i32>,
    /// Status
    pub status: Option<Status>,
}
