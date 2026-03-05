use crate::graphql::inventory::inputs::InventoryFilterInput;
use crate::graphql::inventory::types::{
    CategorySummary, InventoryItemGqlType, InventoryStatsType, PaginatedInventoryResult,
};
use crate::models::inventory::InventoryItem;
use async_graphql::*;
use mongodb::{
    bson::{doc, oid::ObjectId},
    options::FindOptions,
    Database,
};

#[derive(Default)]
pub struct InventoryQuery;

#[Object]
impl InventoryQuery {
    async fn inventory_items(
        &self,
        ctx: &Context<'_>,
        school_id: String,
        page: Option<u64>,
        page_size: Option<u64>,
        filter: Option<InventoryFilterInput>,
    ) -> Result<PaginatedInventoryResult> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<InventoryItem>("inventory_items");

        let mut query = doc! {
            "school_id": &school_id,
            "soft_delete.is_deleted": false
        };

        if let Some(f) = filter {
            if let Some(search) = f.search {
                query.insert(
                    "$or",
                    vec![
                        doc! { "name": { "$regex": &search, "$options": "i" } },
                        doc! { "description": { "$regex": &search, "$options": "i" } },
                        doc! { "supplier": { "$regex": &search, "$options": "i" } },
                    ],
                );
            }
            if let Some(category) = f.category {
                query.insert("category", mongodb::bson::to_bson(&category)?);
            }
            if let Some(condition) = f.condition {
                query.insert("condition", mongodb::bson::to_bson(&condition)?);
            }
            if let Some(status) = f.status {
                query.insert("status", mongodb::bson::to_bson(&status)?);
            }
        }

        let page = page.unwrap_or(1);
        let page_size = page_size.unwrap_or(10);
        let skip = (page - 1) * page_size;

        let total = collection.count_documents(query.clone(), None).await?;
        let total_pages = (total as f64 / page_size as f64).ceil() as u64;

        let find_options = FindOptions::builder()
            .skip(skip)
            .limit(page_size as i64)
            .sort(doc! { "name": 1 })
            .build();

        let mut cursor = collection.find(query, find_options).await?;
        let mut items = Vec::new();

        while cursor.advance().await? {
            items.push(InventoryItemGqlType::from(cursor.deserialize_current()?));
        }

        Ok(PaginatedInventoryResult {
            items,
            total,
            page,
            total_pages,
        })
    }

    async fn inventory_item(
        &self,
        ctx: &Context<'_>,
        id: String,
    ) -> Result<Option<InventoryItemGqlType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<InventoryItem>("inventory_items");

        let obj_id = ObjectId::parse_str(&id)?;
        let item = collection
            .find_one(
                doc! { "_id": obj_id, "soft_delete.is_deleted": false },
                None,
            )
            .await?;

        Ok(item.map(InventoryItemGqlType::from))
    }

    async fn inventory_stats(
        &self,
        ctx: &Context<'_>,
        school_id: String,
    ) -> Result<InventoryStatsType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<InventoryItem>("inventory_items");

        let base_query = doc! {
            "school_id": &school_id,
            "soft_delete.is_deleted": false
        };

        // Get all active items
        let find_options = FindOptions::builder().build();
        let mut cursor = collection.find(base_query.clone(), find_options).await?;

        let mut total_items: i32 = 0;
        let mut total_value: f64 = 0.0;
        let mut low_stock_count: i32 = 0;
        let mut category_map: std::collections::HashMap<String, (i32, f64)> =
            std::collections::HashMap::new();

        while cursor.advance().await? {
            let item: InventoryItem = cursor.deserialize_current()?;
            total_items += 1;
            let item_value = item.quantity as f64 * item.unit_cost;
            total_value += item_value;

            if item.quantity <= 5 {
                low_stock_count += 1;
            }

            let cat = format!("{:?}", item.category);
            let entry = category_map.entry(cat).or_insert((0, 0.0));
            entry.0 += 1;
            entry.1 += item_value;
        }

        let categories = category_map
            .into_iter()
            .map(|(category, (count, value))| CategorySummary {
                category,
                count,
                total_value: value,
            })
            .collect();

        Ok(InventoryStatsType {
            total_items,
            total_value,
            low_stock_count,
            categories,
        })
    }

    async fn low_stock_items(
        &self,
        ctx: &Context<'_>,
        school_id: String,
        threshold: Option<i32>,
    ) -> Result<Vec<InventoryItemGqlType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<InventoryItem>("inventory_items");

        let threshold = threshold.unwrap_or(5);

        let query = doc! {
            "school_id": &school_id,
            "soft_delete.is_deleted": false,
            "quantity": { "$lte": threshold }
        };

        let find_options = FindOptions::builder()
            .sort(doc! { "quantity": 1 })
            .build();

        let mut cursor = collection.find(query, find_options).await?;
        let mut items = Vec::new();

        while cursor.advance().await? {
            items.push(InventoryItemGqlType::from(cursor.deserialize_current()?));
        }

        Ok(items)
    }
}
