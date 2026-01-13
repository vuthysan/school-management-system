// Notification model - for parent notifications
use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum NotificationType {
    Absence,
    LateArrival,
    GradeUpdate,
    Announcement,
    Other,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
pub enum NotificationStatus {
    Pending,
    Sent,
    Failed,
    Read,
}

impl Default for NotificationStatus {
    fn default() -> Self {
        Self::Pending
    }
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Notification {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub school_id: String,
    pub student_id: String,
    pub parent_user_id: Option<String>,
    pub parent_phone: Option<String>,
    pub parent_email: Option<String>,
    pub notification_type: NotificationType,
    pub title: String,
    pub message: String,
    pub status: NotificationStatus,
    pub sent_at: Option<String>,
    pub read_at: Option<String>,
    pub created_at: String,
}

impl Notification {
    pub fn new_absence_notification(
        school_id: String,
        student_id: String,
        student_name: String,
        date: String,
        parent_phone: Option<String>,
        parent_email: Option<String>,
    ) -> Self {
        Self {
            id: None,
            school_id,
            student_id,
            parent_user_id: None,
            parent_phone,
            parent_email,
            notification_type: NotificationType::Absence,
            title: "Absence Notification".to_string(),
            message: format!(
                "Dear Parent, your child {} was marked absent on {}. Please contact the school if you have any questions.",
                student_name, date
            ),
            status: NotificationStatus::Pending,
            sent_at: None,
            read_at: None,
            created_at: chrono::Utc::now().to_rfc3339(),
        }
    }
}
