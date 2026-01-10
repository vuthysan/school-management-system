use async_graphql::{Enum, InputObject, SimpleObject};
use mongodb::bson::{oid::ObjectId, DateTime};
use serde::{Deserialize, Serialize};

use crate::utils::common_types::{AuditInfo, SoftDelete};

// ============================================================================
// CALENDAR EVENT TYPE
// ============================================================================

/// Type of calendar event
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
#[graphql(rename_items = "PascalCase")]
pub enum CalendarEventType {
    /// Public holiday
    Holiday,
    /// School break/vacation
    Break,
    /// Examination period
    Exam,
    /// School event (sports day, concert, etc.)
    Event,
    /// Parent-teacher meeting
    Meeting,
    /// Deadline (registration, payment, etc.)
    Deadline,
    /// Other
    Other,
}

impl Default for CalendarEventType {
    fn default() -> Self {
        CalendarEventType::Event
    }
}

// ============================================================================
// RECURRENCE PATTERN
// ============================================================================

/// Recurrence pattern for repeating events
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
#[graphql(rename_items = "PascalCase")]
pub enum RecurrencePattern {
    /// No recurrence
    None,
    /// Daily
    Daily,
    /// Weekly
    Weekly,
    /// Monthly
    Monthly,
    /// Yearly
    Yearly,
}

impl Default for RecurrencePattern {
    fn default() -> Self {
        RecurrencePattern::None
    }
}

// ============================================================================
// CALENDAR EVENT MODEL
// ============================================================================

/// CalendarEvent - represents a school calendar event (holiday, exam, event, etc.)
#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject)]
#[graphql(complex)]
pub struct CalendarEvent {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    #[graphql(skip)]
    pub id: Option<ObjectId>,

    /// Reference to the school
    #[graphql(skip)]
    pub school_id: ObjectId,

    /// Event title
    pub title: String,

    /// Event description
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,

    /// Type of event
    #[serde(default)]
    pub event_type: CalendarEventType,

    /// Start date/time
    #[graphql(skip)]
    pub start_date: DateTime,

    /// End date/time
    #[graphql(skip)]
    pub end_date: DateTime,

    /// Is this an all-day event?
    #[serde(default)]
    pub is_all_day: bool,

    /// Is this a recurring event?
    #[serde(default)]
    pub is_recurring: bool,

    /// Recurrence pattern
    #[serde(default)]
    pub recurrence_pattern: RecurrencePattern,

    /// Color for display (hex)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub color: Option<String>,

    /// Location (if applicable)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub location: Option<String>,

    /// Is school closed on this day?
    #[serde(default)]
    pub is_school_closed: bool,

    // ========================
    // Audit & Soft Delete
    // ========================
    #[serde(default)]
    pub audit: AuditInfo,
    #[serde(default)]
    pub soft_delete: SoftDelete,
}

#[async_graphql::ComplexObject]
impl CalendarEvent {
    /// Returns the event's MongoDB ObjectId as a hex string
    async fn id_str(&self) -> Option<String> {
        self.id.as_ref().map(|id| id.to_hex())
    }

    /// Returns school_id as hex string
    async fn school_id_str(&self) -> String {
        self.school_id.to_hex()
    }

    /// Start date as ISO string
    async fn start_date_str(&self) -> String {
        self.start_date.try_to_rfc3339_string().unwrap_or_default()
    }

    /// End date as ISO string
    async fn end_date_str(&self) -> String {
        self.end_date.try_to_rfc3339_string().unwrap_or_default()
    }
}

impl CalendarEvent {
    pub fn new(
        school_id: ObjectId,
        title: String,
        event_type: CalendarEventType,
        start_date: DateTime,
        end_date: DateTime,
    ) -> Self {
        Self {
            id: None,
            school_id,
            title,
            description: None,
            event_type,
            start_date,
            end_date,
            is_all_day: false,
            is_recurring: false,
            recurrence_pattern: RecurrencePattern::None,
            color: None,
            location: None,
            is_school_closed: false,
            audit: AuditInfo::default(),
            soft_delete: SoftDelete::default(),
        }
    }
}

// ============================================================================
// CREATE/UPDATE INPUTS
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize, InputObject)]
pub struct CreateCalendarEventInput {
    pub school_id: String,
    pub title: String,
    pub description: Option<String>,
    pub event_type: Option<CalendarEventType>,
    pub start_date: String,
    pub end_date: String,
    pub is_all_day: Option<bool>,
    pub is_recurring: Option<bool>,
    pub recurrence_pattern: Option<RecurrencePattern>,
    pub color: Option<String>,
    pub location: Option<String>,
    pub is_school_closed: Option<bool>,
}

#[derive(Debug, Clone, Serialize, Deserialize, InputObject)]
pub struct UpdateCalendarEventInput {
    pub title: Option<String>,
    pub description: Option<String>,
    pub event_type: Option<CalendarEventType>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub is_all_day: Option<bool>,
    pub is_recurring: Option<bool>,
    pub recurrence_pattern: Option<RecurrencePattern>,
    pub color: Option<String>,
    pub location: Option<String>,
    pub is_school_closed: Option<bool>,
}
