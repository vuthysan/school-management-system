use crate::models::notification::Notification;
use async_graphql::*;

#[derive(SimpleObject)]
pub struct NotificationGqlType {
    pub id: String,
    pub school_id: String,
    pub student_id: String,
    pub parent_user_id: Option<String>,
    pub notification_type: String,
    pub title: String,
    pub message: String,
    pub status: String,
    pub is_read: bool,
    pub sent_at: Option<String>,
    pub read_at: Option<String>,
    pub created_at: String,
}

impl From<Notification> for NotificationGqlType {
    fn from(n: Notification) -> Self {
        let status_str = format!("{:?}", n.status);
        NotificationGqlType {
            id: n.id.map(|id| id.to_hex()).unwrap_or_default(),
            school_id: n.school_id,
            student_id: n.student_id,
            parent_user_id: n.parent_user_id,
            notification_type: format!("{:?}", n.notification_type),
            title: n.title,
            message: n.message,
            is_read: status_str == "Read",
            status: status_str,
            sent_at: n.sent_at,
            read_at: n.read_at,
            created_at: n.created_at,
        }
    }
}

#[derive(SimpleObject)]
pub struct PaginatedNotificationsResult {
    pub items: Vec<NotificationGqlType>,
    pub total: i64,
    pub page: i32,
    pub total_pages: i32,
    pub unread_count: i64,
}
