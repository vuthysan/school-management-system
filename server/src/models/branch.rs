use serde::{Deserialize, Serialize};
use mongodb::bson::oid::ObjectId;
use crate::utils::common_types::Address;

#[derive(Debug, Serialize, Deserialize)]
pub struct Branch {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub school_id: ObjectId,
    pub name: String,
    pub address: Address,
    pub contact_email: String,
    pub contact_phone: String,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct NewBranch {
    pub school_id: ObjectId,
    pub name: String,
    pub address: Address,
    pub contact_email: String,
    pub contact_phone: String,
}

impl Branch {
    pub fn new(school_id: ObjectId, name: String, address: Address, contact_email: String, contact_phone: String) -> Self {
        Self {
            id: None,
            school_id,
            name,
            address,
            contact_email,
            contact_phone,
            created_at: chrono::Utc::now().to_rfc3339(),
            updated_at: chrono::Utc::now().to_rfc3339(),
        }
    }
}