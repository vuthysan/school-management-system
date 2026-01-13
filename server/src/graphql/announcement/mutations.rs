use crate::graphql::graphql_context::get_graphql_context;
use crate::models::announcement::{Announcement, AnnouncementPriority, AnnouncementTargetType};
use crate::models::member::Member;
use crate::models::user::User;
use async_graphql::*;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Collection, Database,
};

#[derive(Default)]
pub struct AnnouncementMutation;

#[Object]
impl AnnouncementMutation {
    async fn create_announcement(
        &self,
        ctx: &Context<'_>,
        title: String,
        content: String,
        target_type: AnnouncementTargetType,
        target_ids: Vec<String>,
        priority: AnnouncementPriority,
    ) -> Result<Announcement> {
        let db = ctx.data::<Database>()?;
        let gql_ctx = get_graphql_context(ctx)?;
        let auth_user = gql_ctx.require_auth()?;

        let user_oid =
            ObjectId::parse_str(&auth_user.id).map_err(|_| Error::new("Invalid user ID"))?;

        // Fetch user to get their name
        let user_collection = db.collection::<User>("users");
        let user = user_collection
            .find_one(doc! { "_id": user_oid }, None)
            .await?
            .ok_or_else(|| Error::new("User not found"))?;

        let author_name = user
            .display_name
            .clone()
            .or(user.first_name.clone())
            .unwrap_or_else(|| user.username.clone());

        // Fetch user's membership to get school_id
        let member_collection = db.collection::<Member>("members");
        let member = member_collection
            .find_one(
                doc! { "user_id": auth_user.id.clone(), "soft_delete.is_deleted": false },
                None,
            )
            .await?
            .ok_or_else(|| Error::new("User is not a member of any school"))?;

        let school_id = member.school_id;

        let new_announcement = Announcement::new(
            school_id,
            auth_user.id.clone(),
            author_name,
            title,
            content,
            target_type,
            target_ids,
            priority,
        );

        let collection: Collection<Announcement> = db.collection("announcements");
        let result = collection
            .insert_one(new_announcement.clone(), None)
            .await?;

        let mut announcement = new_announcement;
        if let Some(oid) = result.inserted_id.as_object_id() {
            announcement.id = Some(oid);
        }

        Ok(announcement)
    }

    async fn delete_announcement(&self, ctx: &Context<'_>, id: String) -> Result<bool> {
        let db = ctx.data::<Database>()?;
        let object_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;
        let collection: Collection<Announcement> = db.collection("announcements");

        let result = collection
            .delete_one(doc! { "_id": object_id }, None)
            .await?;
        Ok(result.deleted_count > 0)
    }
}
