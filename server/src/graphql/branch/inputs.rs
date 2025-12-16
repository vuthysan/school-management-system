// Branch GraphQL inputs
use crate::graphql::common::AddressInput;
use crate::models::branch::Branch;
use async_graphql::*;
use mongodb::bson::oid::ObjectId;

#[derive(InputObject)]
pub struct BranchInput {
    pub school_id: String,
    pub name: String,
    pub address: AddressInput,
    pub contact_email: String,
    pub contact_phone: String,
}

impl From<BranchInput> for Branch {
    fn from(input: BranchInput) -> Self {
        Branch::new(
            ObjectId::parse_str(&input.school_id).unwrap(),
            input.name,
            input.address.into(),
            input.contact_email,
            input.contact_phone,
        )
    }
}

#[derive(InputObject)]
pub struct UpdateBranchInput {
    pub name: Option<String>,
    pub address: Option<AddressInput>,
    pub contact_email: Option<String>,
    pub contact_phone: Option<String>,
}
