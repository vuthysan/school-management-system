use crate::graphql::graphql_context::get_graphql_context;
use crate::models::member::Member;
use crate::models::notification::{Notification, NotificationStatus, NotificationType};
use async_graphql::*;
use futures::stream::TryStreamExt;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Database,
};

#[derive(Default)]
pub struct NotificationMutation;

#[Object]
impl NotificationMutation {
    /// Mark a single notification as read
    async fn mark_notification_as_read(&self, ctx: &Context<'_>, id: String) -> Result<bool> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Notification>("notifications");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let now = chrono::Utc::now().to_rfc3339();

        let result = collection
            .update_one(
                doc! { "_id": obj_id },
                doc! { "$set": { "status": "Read", "read_at": &now } },
                None,
            )
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        if result.modified_count == 0 {
            return Err(Error::new("Notification not found"));
        }

        Ok(true)
    }

    /// Mark all notifications as read for the authenticated parent
    async fn mark_all_notifications_as_read(&self, ctx: &Context<'_>) -> Result<i64> {
        let db = ctx.data::<Database>()?;
        let gql_ctx = get_graphql_context(ctx)?;
        let auth_user = gql_ctx.require_auth()?;

        let member_collection = db.collection::<Member>("members");
        let notification_collection = db.collection::<Notification>("notifications");

        // Find child IDs for this parent
        let mut member_cursor = member_collection
            .find(
                doc! {
                    "user_id": &auth_user.id,
                    "role": "Parent",
                    "soft_delete.is_deleted": false,
                },
                None,
            )
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut child_ids: Vec<String> = Vec::new();
        while let Some(member) = member_cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            for id in &member.parent_of {
                if !child_ids.contains(id) {
                    child_ids.push(id.clone());
                }
            }
        }

        if child_ids.is_empty() {
            return Ok(0);
        }

        let now = chrono::Utc::now().to_rfc3339();

        let result = notification_collection
            .update_many(
                doc! {
                    "student_id": { "$in": &child_ids },
                    "status": { "$ne": "Read" },
                },
                doc! { "$set": { "status": "Read", "read_at": &now } },
                None,
            )
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        Ok(result.modified_count as i64)
    }

    /// Create a notification (used internally or by admin)
    async fn create_notification(
        &self,
        ctx: &Context<'_>,
        school_id: String,
        student_id: String,
        title: String,
        message: String,
        notification_type: Option<String>,
    ) -> Result<bool> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Notification>("notifications");

        let ntype = match notification_type.as_deref() {
            Some("Absence") => NotificationType::Absence,
            Some("LateArrival") => NotificationType::LateArrival,
            Some("GradeUpdate") => NotificationType::GradeUpdate,
            Some("Announcement") => NotificationType::Announcement,
            _ => NotificationType::Other,
        };

        let notification = Notification {
            id: None,
            school_id,
            student_id,
            parent_user_id: None,
            parent_phone: None,
            parent_email: None,
            notification_type: ntype,
            title,
            message,
            status: NotificationStatus::Pending,
            sent_at: None,
            read_at: None,
            created_at: chrono::Utc::now().to_rfc3339(),
        };

        collection
            .insert_one(notification, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        Ok(true)
    }

    /// Delete a notification
    async fn delete_notification(&self, ctx: &Context<'_>, id: String) -> Result<bool> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Notification>("notifications");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let result = collection
            .delete_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        if result.deleted_count == 0 {
            return Err(Error::new("Notification not found"));
        }

        Ok(true)
    }
}
