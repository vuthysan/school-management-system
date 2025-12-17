// GradeLevel GraphQL queries
use super::inputs::{GradeLevelFilterInput, GradeLevelSortInput};
use super::types::{GradeLevelType, PaginatedGradeLevelsResult};
use crate::models;
use async_graphql::*;
use futures::stream::TryStreamExt;
use mongodb::{
    bson::{doc, oid::ObjectId, Document},
    options::FindOptions,
    Database,
};

#[derive(Default)]
pub struct GradeLevelQuery;

#[Object]
impl GradeLevelQuery {
    /// Get all grade levels (no pagination - for dropdowns)
    async fn grade_levels(&self, ctx: &Context<'_>) -> Result<Vec<GradeLevelType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::grade_level::GradeLevel>("grade_levels");

        // Exclude soft-deleted, sort by order
        let filter = doc! { "soft_delete.is_deleted": { "$ne": true } };
        let options = FindOptions::builder().sort(doc! { "order": 1 }).build();

        let mut cursor = collection
            .find(filter, options)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut grade_levels = Vec::new();
        while let Some(level) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            grade_levels.push(level);
        }

        Ok(grade_levels)
    }

    /// Get a single grade level by ID
    async fn grade_level(&self, ctx: &Context<'_>, id: String) -> Result<Option<GradeLevelType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::grade_level::GradeLevel>("grade_levels");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let grade_level = collection
            .find_one(
                doc! { "_id": obj_id, "soft_delete.is_deleted": { "$ne": true } },
                None,
            )
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        Ok(grade_level)
    }

    /// Get grade levels by school with pagination, filtering, and sorting
    async fn grade_levels_by_school(
        &self,
        ctx: &Context<'_>,
        school_id: String,
        page: Option<i32>,
        page_size: Option<i32>,
        filter: Option<GradeLevelFilterInput>,
        sort: Option<GradeLevelSortInput>,
    ) -> Result<PaginatedGradeLevelsResult> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::grade_level::GradeLevel>("grade_levels");

        // Default pagination values
        let page = page.unwrap_or(1).max(1);
        let page_size = page_size.unwrap_or(10).min(100).max(1);
        let skip = ((page - 1) * page_size) as u64;

        // Build filter document
        let mut filter_doc = doc! {
            "school_id": &school_id,
            "soft_delete.is_deleted": { "$ne": true }
        };

        // Apply optional filters
        if let Some(ref f) = filter {
            // Search by name or code
            if let Some(ref search) = f.search {
                if !search.is_empty() {
                    filter_doc.insert(
                        "$or",
                        vec![
                            doc! { "name": { "$regex": search, "$options": "i" } },
                            doc! { "code": { "$regex": search, "$options": "i" } },
                        ],
                    );
                }
            }

            // Filter by status
            if let Some(ref status) = f.status {
                filter_doc.insert("status", mongodb::bson::to_bson(status).unwrap());
            }

            // Filter by branch ID
            if let Some(ref branch_id) = f.branch_id {
                filter_doc.insert("branch_id", branch_id);
            }
        }

        // Count total matching documents
        let total = collection
            .count_documents(filter_doc.clone(), None)
            .await
            .map_err(|e| Error::new(e.to_string()))? as i64;

        // Build sort document
        let sort_doc = build_sort_document(&sort);

        // Configure find options
        let find_options = FindOptions::builder()
            .skip(skip)
            .limit(page_size as i64)
            .sort(sort_doc)
            .build();

        // Execute query
        let mut cursor = collection
            .find(filter_doc, find_options)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut grade_levels = Vec::new();
        while let Some(level) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            grade_levels.push(level);
        }

        // Calculate total pages
        let total_pages = ((total as f64) / (page_size as f64)).ceil() as i32;

        Ok(PaginatedGradeLevelsResult {
            items: grade_levels,
            total,
            page,
            page_size,
            total_pages,
        })
    }
}

/// Helper function to build sort document
fn build_sort_document(sort: &Option<GradeLevelSortInput>) -> Document {
    let mut sort_doc = Document::new();

    if let Some(ref s) = sort {
        let sort_field = match s.sort_by.as_deref() {
            Some("name") => "name",
            Some("code") => "code",
            Some("order") => "order",
            Some("createdAt") => "audit.created_at",
            _ => "order", // Default sort by order
        };

        let sort_order = match s.sort_order.as_deref() {
            Some("desc") => -1,
            _ => 1, // Default ascending
        };

        sort_doc.insert(sort_field, sort_order);
    } else {
        // Default: sort by order ascending
        sort_doc.insert("order", 1);
    }

    sort_doc
}
