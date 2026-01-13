use crate::models::announcement::{Announcement, AnnouncementTargetType};
use async_graphql::*;
use futures::StreamExt;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Collection, Database,
};

#[derive(Default)]
pub struct AnnouncementQuery;

#[Object]
impl AnnouncementQuery {
    async fn get_announcements(
        &self,
        ctx: &Context<'_>,
        school_id: String,
        target_type: Option<AnnouncementTargetType>,
        target_id: Option<String>,
    ) -> Result<Vec<Announcement>> {
        let db = ctx.data::<Database>()?;
        let collection: Collection<Announcement> = db.collection("announcements");

        let mut filter = doc! { "school_id": school_id };

        if let Some(t_type) = target_type {
            filter.insert("target_type", mongodb::bson::to_bson(&t_type)?);
        }

        if let Some(t_id) = target_id {
            filter.insert("target_ids", doc! { "$in": [t_id] });
        }

        let mut cursor = collection.find(filter, None).await?;
        let mut announcements = Vec::new();

        while let Some(result) = cursor.next().await {
            announcements.push(result?);
        }

        // Sort by created_at descending
        announcements.sort_by(|a, b| b.created_at.cmp(&a.created_at));

        Ok(announcements)
    }

    async fn get_announcement(
        &self,
        ctx: &Context<'_>,
        id: String,
    ) -> Result<Option<Announcement>> {
        let db = ctx.data::<Database>()?;
        let collection: Collection<Announcement> = db.collection("announcements");
        let object_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let announcement = collection.find_one(doc! { "_id": object_id }, None).await?;
        Ok(announcement)
    }
}
