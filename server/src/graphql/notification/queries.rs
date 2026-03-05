use super::types::{NotificationGqlType, PaginatedNotificationsResult};
use crate::graphql::graphql_context::get_graphql_context;
use crate::models::member::Member;
use crate::models::notification::Notification;
use async_graphql::*;
use futures::stream::TryStreamExt;
use mongodb::{bson::doc, options::FindOptions, Database};

#[derive(Default)]
pub struct NotificationQuery;

#[Object]
impl NotificationQuery {
    /// Get paginated notifications for the authenticated parent user
    async fn my_notifications(
        &self,
        ctx: &Context<'_>,
        page: Option<i32>,
        page_size: Option<i32>,
        is_read: Option<bool>,
    ) -> Result<PaginatedNotificationsResult> {
        let db = ctx.data::<Database>()?;
        let gql_ctx = get_graphql_context(ctx)?;
        let auth_user = gql_ctx.require_auth()?;

        let member_collection = db.collection::<Member>("members");
        let notification_collection = db.collection::<Notification>("notifications");

        // Find parent member records to get child IDs
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
            return Ok(PaginatedNotificationsResult {
                items: Vec::new(),
                total: 0,
                page: 1,
                total_pages: 0,
                unread_count: 0,
            });
        }

        let page = page.unwrap_or(1).max(1);
        let page_size = page_size.unwrap_or(20).min(100);
        let skip = ((page - 1) * page_size) as u64;

        let mut filter = doc! { "student_id": { "$in": &child_ids } };
        if let Some(read) = is_read {
            if read {
                filter.insert("status", "Read");
            } else {
                filter.insert("status", doc! { "$ne": "Read" });
            }
        }

        let total = notification_collection
            .count_documents(filter.clone(), None)
            .await
            .map_err(|e| Error::new(e.to_string()))? as i64;

        // Count unread (always count unread regardless of filter)
        let unread_count = notification_collection
            .count_documents(
                doc! {
                    "student_id": { "$in": &child_ids },
                    "status": { "$ne": "Read" },
                },
                None,
            )
            .await
            .map_err(|e| Error::new(e.to_string()))? as i64;

        let options = FindOptions::builder()
            .skip(Some(skip))
            .limit(Some(page_size as i64))
            .sort(doc! { "created_at": -1 })
            .build();

        let mut cursor = notification_collection
            .find(filter, Some(options))
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut items = Vec::new();
        while let Some(notification) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            items.push(NotificationGqlType::from(notification));
        }

        let total_pages = ((total as f64) / (page_size as f64)).ceil() as i32;

        Ok(PaginatedNotificationsResult {
            items,
            total,
            page,
            total_pages,
            unread_count,
        })
    }

    /// Get unread notification count for the authenticated user
    async fn unread_notification_count(&self, ctx: &Context<'_>) -> Result<i64> {
        let db = ctx.data::<Database>()?;
        let gql_ctx = get_graphql_context(ctx)?;
        let auth_user = gql_ctx.require_auth()?;

        let member_collection = db.collection::<Member>("members");
        let notification_collection = db.collection::<Notification>("notifications");

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

        let count = notification_collection
            .count_documents(
                doc! {
                    "student_id": { "$in": &child_ids },
                    "status": { "$ne": "Read" },
                },
                None,
            )
            .await
            .map_err(|e| Error::new(e.to_string()))? as i64;

        Ok(count)
    }

    /// Get notifications for a specific child
    async fn notifications_by_student(
        &self,
        ctx: &Context<'_>,
        student_id: String,
    ) -> Result<Vec<NotificationGqlType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Notification>("notifications");

        let options = FindOptions::builder()
            .sort(doc! { "created_at": -1 })
            .build();

        let mut cursor = collection
            .find(doc! { "student_id": &student_id }, Some(options))
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut notifications = Vec::new();
        while let Some(notification) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            notifications.push(NotificationGqlType::from(notification));
        }

        Ok(notifications)
    }
}
