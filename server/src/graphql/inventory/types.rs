use crate::models::inventory::{InventoryCategory, InventoryItem, ItemCondition};
use crate::utils::common_types::Status;
use async_graphql::*;

#[derive(SimpleObject)]
pub struct InventoryItemGqlType {
    pub id: String,
    pub school_id: String,
    pub branch_id: Option<String>,
    pub name: String,
    pub description: Option<String>,
    pub category: InventoryCategory,
    pub quantity: i32,
    pub unit_cost: f64,
    pub currency: String,
    pub total_value: f64,
    pub location: Option<String>,
    pub supplier: Option<String>,
    pub purchase_date: Option<String>,
    pub warranty_expiry: Option<String>,
    pub condition: ItemCondition,
    pub assigned_to: Option<String>,
    pub status: Status,
    pub created_at: String,
    pub updated_at: String,
}

impl From<InventoryItem> for InventoryItemGqlType {
    fn from(i: InventoryItem) -> Self {
        let total_value = i.quantity as f64 * i.unit_cost;
        Self {
            id: i.id.map(|id| id.to_hex()).unwrap_or_default(),
            school_id: i.school_id,
            branch_id: i.branch_id,
            name: i.name,
            description: i.description,
            category: i.category,
            quantity: i.quantity,
            unit_cost: i.unit_cost,
            currency: i.currency,
            total_value,
            location: i.location,
            supplier: i.supplier,
            purchase_date: i.purchase_date,
            warranty_expiry: i.warranty_expiry,
            condition: i.condition,
            assigned_to: i.assigned_to,
            status: i.status,
            created_at: i.audit.created_at_str().unwrap_or_default(),
            updated_at: i.audit.updated_at_str().unwrap_or_default(),
        }
    }
}

#[derive(SimpleObject)]
pub struct PaginatedInventoryResult {
    pub items: Vec<InventoryItemGqlType>,
    pub total: u64,
    pub page: u64,
    pub total_pages: u64,
}

#[derive(SimpleObject)]
pub struct CategorySummary {
    pub category: String,
    pub count: i32,
    pub total_value: f64,
}

#[derive(SimpleObject)]
pub struct InventoryStatsType {
    pub total_items: i32,
    pub total_value: f64,
    pub low_stock_count: i32,
    pub categories: Vec<CategorySummary>,
}
