use crate::models::inventory::{InventoryCategory, ItemCondition};
use crate::utils::common_types::Status;
use async_graphql::*;

#[derive(InputObject)]
pub struct InventoryFilterInput {
    pub search: Option<String>,
    pub category: Option<InventoryCategory>,
    pub condition: Option<ItemCondition>,
    pub status: Option<Status>,
}
