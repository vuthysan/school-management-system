use async_graphql::{InputObject, SimpleObject};
use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

use crate::utils::common_types::{AuditInfo, DayOfWeek, SoftDelete, Status};

// ============================================================================
// SCHEDULE STRUCTURES
// ============================================================================

/// A single period in the class schedule
#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject, InputObject)]
#[graphql(input_name = "SchedulePeriodInput")]
pub struct SchedulePeriod {
    /// Period number (1, 2, 3...)
    pub period_number: i32,
    /// Subject ID
    pub subject_id: String,
    /// Teacher ID
    pub teacher_id: String,
    /// Start time (e.g., "08:00")
    pub start_time: String,
    /// End time (e.g., "09:00")
    pub end_time: String,
    /// Room number (override)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub room: Option<String>,
}

/// Daily class schedule
#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject, InputObject)]
#[graphql(input_name = "ClassScheduleInput")]
pub struct ClassSchedule {
    /// Day of week
    pub day: DayOfWeek,
    /// Periods for this day
    #[serde(default)]
    pub periods: Vec<SchedulePeriod>,
}

// ============================================================================
// CLASS MODEL
// ============================================================================

/// Class - represents a class/section in a school for an academic year
#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject)]
#[graphql(complex)]
pub struct Class {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    #[graphql(skip)]
    pub id: Option<ObjectId>,

    // ========================
    // Multi-tenancy (REQUIRED)
    // ========================
    /// School ID - required for data isolation
    pub school_id: String,
    /// Branch ID (optional, for multi-branch schools)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub branch_id: Option<String>,
    /// Academic year ID
    pub academic_year_id: String,

    // ========================
    // Basic Information
    // ========================
    /// Class name (e.g., "Grade 10A", "Class 5 Blue")
    pub name: String,
    /// Class code (e.g., "G10A-2024")
    pub code: String,
    /// Grade level (e.g., "10", "Grade 5")
    pub grade_level: String,
    /// Section (e.g., "A", "Blue")
    #[serde(skip_serializing_if = "Option::is_none")]
    pub section: Option<String>,

    // ========================
    // Assignment
    // ========================
    /// Homeroom teacher ID
    #[serde(skip_serializing_if = "Option::is_none")]
    pub homeroom_teacher_id: Option<String>,
    /// Assigned room number
    #[serde(skip_serializing_if = "Option::is_none")]
    pub room_number: Option<String>,

    // ========================
    // Capacity
    // ========================
    /// Maximum number of students
    #[serde(default = "default_capacity")]
    pub capacity: i32,
    /// Current student count (denormalized)
    #[serde(default)]
    pub current_enrollment: i32,

    // ========================
    // Students
    // ========================
    /// List of enrolled student IDs
    #[serde(default)]
    pub student_ids: Vec<String>,

    // ========================
    // Schedule
    // ========================
    /// Weekly schedule
    #[serde(default)]
    pub schedule: Vec<ClassSchedule>,

    // ========================
    // Status
    // ========================
    /// Class status
    #[serde(default)]
    pub status: Status,

    // ========================
    // Audit & Soft Delete
    // ========================
    #[serde(default)]
    pub audit: AuditInfo,
    #[serde(default)]
    pub soft_delete: SoftDelete,
}

fn default_capacity() -> i32 {
    40
}

/// Complex field resolvers for Class
#[async_graphql::ComplexObject]
impl Class {
    /// Get the MongoDB ObjectId as a string
    async fn id(&self) -> Option<String> {
        self.id.map(|oid| oid.to_hex())
    }

    /// Check if class has available capacity
    async fn has_capacity(&self) -> bool {
        self.current_enrollment < self.capacity
    }

    /// Get remaining spots
    async fn available_spots(&self) -> i32 {
        self.capacity - self.current_enrollment
    }
}

impl Class {
    /// Create a new class
    pub fn new(
        school_id: impl Into<String>,
        academic_year_id: impl Into<String>,
        name: impl Into<String>,
        code: impl Into<String>,
        grade_level: impl Into<String>,
    ) -> Self {
        Self {
            id: None,
            school_id: school_id.into(),
            branch_id: None,
            academic_year_id: academic_year_id.into(),
            name: name.into(),
            code: code.into(),
            grade_level: grade_level.into(),
            section: None,
            homeroom_teacher_id: None,
            room_number: None,
            capacity: default_capacity(),
            current_enrollment: 0,
            student_ids: vec![],
            schedule: vec![],
            status: Status::Active,
            audit: AuditInfo::default(),
            soft_delete: SoftDelete::default(),
        }
    }

    /// Add a student to the class
    pub fn add_student(&mut self, student_id: impl Into<String>) -> bool {
        if self.current_enrollment >= self.capacity {
            return false;
        }
        self.student_ids.push(student_id.into());
        self.current_enrollment += 1;
        true
    }

    /// Remove a student from the class
    pub fn remove_student(&mut self, student_id: &str) -> bool {
        if let Some(pos) = self.student_ids.iter().position(|id| id == student_id) {
            self.student_ids.remove(pos);
            self.current_enrollment -= 1;
            true
        } else {
            false
        }
    }
}
