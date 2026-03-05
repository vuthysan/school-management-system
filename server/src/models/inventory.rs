use crate::utils::common_types::{AuditInfo, SoftDelete, Status};
use async_graphql::*;
use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

// ============================================================================
// ENUMS
// ============================================================================

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
pub enum InventoryCategory {
    #[graphql(name = "Furniture")]
    Furniture,
    #[graphql(name = "Electronics")]
    Electronics,
    #[graphql(name = "Stationery")]
    Stationery,
    #[graphql(name = "Sports")]
    Sports,
    #[graphql(name = "LabEquipment")]
    LabEquipment,
    #[graphql(name = "Books")]
    Books,
    #[graphql(name = "Other")]
    Other,
}

impl Default for InventoryCategory {
    fn default() -> Self {
        InventoryCategory::Other
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
pub enum ItemCondition {
    #[graphql(name = "New")]
    New,
    #[graphql(name = "Good")]
    Good,
    #[graphql(name = "Fair")]
    Fair,
    #[graphql(name = "Poor")]
    Poor,
    #[graphql(name = "Damaged")]
    Damaged,
}

impl Default for ItemCondition {
    fn default() -> Self {
        ItemCondition::Good
    }
}

// ============================================================================
// INVENTORY ITEM
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject)]
#[graphql(complex)]
pub struct InventoryItem {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    #[graphql(skip)]
    pub id: Option<ObjectId>,
    pub school_id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub branch_id: Option<String>,
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    pub category: InventoryCategory,
    pub quantity: i32,
    pub unit_cost: f64,
    pub currency: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub location: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub supplier: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub purchase_date: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub warranty_expiry: Option<String>,
    pub condition: ItemCondition,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub assigned_to: Option<String>,
    pub status: Status,
    pub audit: AuditInfo,
    pub soft_delete: SoftDelete,
}

#[async_graphql::ComplexObject]
impl InventoryItem {
    async fn id(&self) -> Option<String> {
        self.id.map(|oid| oid.to_hex())
    }

    async fn total_value(&self) -> f64 {
        self.quantity as f64 * self.unit_cost
    }
}

impl InventoryItem {
    pub fn new(school_id: String, name: String, category: InventoryCategory, quantity: i32, unit_cost: f64) -> Self {
        Self {
            id: None,
            school_id,
            branch_id: None,
            name,
            description: None,
            category,
            quantity,
            unit_cost,
            currency: "USD".to_string(),
            location: None,
            supplier: None,
            purchase_date: None,
            warranty_expiry: None,
            condition: ItemCondition::default(),
            assigned_to: None,
            status: Status::Active,
            audit: AuditInfo::new(None),
            soft_delete: SoftDelete::default(),
        }
    }
}

// ============================================================================
// INPUT TYPES
// ============================================================================

#[derive(InputObject)]
pub struct CreateInventoryItemInput {
    pub school_id: String,
    pub branch_id: Option<String>,
    pub name: String,
    pub description: Option<String>,
    pub category: Option<InventoryCategory>,
    pub quantity: i32,
    pub unit_cost: f64,
    pub currency: Option<String>,
    pub location: Option<String>,
    pub supplier: Option<String>,
    pub purchase_date: Option<String>,
    pub warranty_expiry: Option<String>,
    pub condition: Option<ItemCondition>,
    pub assigned_to: Option<String>,
    pub status: Option<Status>,
}

#[derive(InputObject)]
pub struct UpdateInventoryItemInput {
    pub name: Option<String>,
    pub description: Option<String>,
    pub category: Option<InventoryCategory>,
    pub quantity: Option<i32>,
    pub unit_cost: Option<f64>,
    pub currency: Option<String>,
    pub location: Option<String>,
    pub supplier: Option<String>,
    pub purchase_date: Option<String>,
    pub warranty_expiry: Option<String>,
    pub condition: Option<ItemCondition>,
    pub assigned_to: Option<String>,
    pub status: Option<Status>,
}
