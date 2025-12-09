// Branch GraphQL inputs
use async_graphql::*;
use mongodb::bson::oid::ObjectId;
use crate::models::branch::Branch;
use crate::graphql::common::AddressInput;

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
