// Branch GraphQL types
use async_graphql::*;
use crate::models::branch::Branch;
use crate::graphql::common::AddressType;

#[derive(SimpleObject)]
pub struct BranchType {
    pub id: String,
    pub school_id: String,
    pub name: String,
    pub address: AddressType,
    pub contact_email: String,
    pub contact_phone: String,
    pub created_at: String,
    pub updated_at: String,
}

impl From<Branch> for BranchType {
    fn from(b: Branch) -> Self {
        BranchType {
            id: b.id.map(|id| id.to_hex()).unwrap_or_default(),
            school_id: b.school_id.to_hex(),
            name: b.name,
            address: b.address.into(),
            contact_email: b.contact_email,
            contact_phone: b.contact_phone,
            created_at: b.created_at,
            updated_at: b.updated_at,
        }
    }
}
