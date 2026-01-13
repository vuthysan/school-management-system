use async_graphql::*;
use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
pub enum AnnouncementTargetType {
    School,
    Grade,
    Class,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
pub enum AnnouncementPriority {
    Low,
    Normal,
    High,
    Urgent,
}

#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject)]
#[graphql(complex)]
pub struct Announcement {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    #[graphql(skip)]
    pub id: Option<ObjectId>,
    pub school_id: String,
    pub author_id: String,
    pub author_name: String,
    pub title: String,
    pub content: String,
    pub target_type: AnnouncementTargetType,
    pub target_ids: Vec<String>,
    pub priority: AnnouncementPriority,
    pub expires_at: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[ComplexObject]
impl Announcement {
    async fn id(&self) -> String {
        self.id.map(|id| id.to_hex()).unwrap_or_default()
    }
}

impl Announcement {
    pub fn new(
        school_id: String,
        author_id: String,
        author_name: String,
        title: String,
        content: String,
        target_type: AnnouncementTargetType,
        target_ids: Vec<String>,
        priority: AnnouncementPriority,
    ) -> Self {
        let now = chrono::Utc::now().to_rfc3339();
        Self {
            id: None,
            school_id,
            author_id,
            author_name,
            title,
            content,
            target_type,
            target_ids,
            priority,
            expires_at: None,
            created_at: now.clone(),
            updated_at: now,
        }
    }
}
