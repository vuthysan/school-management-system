// Subject GraphQL queries
use super::inputs::{SubjectFilterInput, SubjectSortInput};
use super::types::{PaginatedSubjectsResult, SubjectType};
use crate::models;
use async_graphql::*;
use futures::stream::TryStreamExt;
use mongodb::{
    bson::{doc, oid::ObjectId, Document},
    options::FindOptions,
    Database,
};

#[derive(Default)]
pub struct SubjectQuery;

#[Object]
impl SubjectQuery {
    /// Get all subjects (no pagination - for backward compatibility)
    async fn subjects(&self, ctx: &Context<'_>) -> Result<Vec<SubjectType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::subject::Subject>("subjects");

        // Exclude soft-deleted
        let filter = doc! { "soft_delete.is_deleted": { "$ne": true } };

        let mut cursor = collection
            .find(filter, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut subjects = Vec::new();
        while let Some(subject) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            subjects.push(subject);
        }

        Ok(subjects.into_iter().map(|s| s.into()).collect())
    }

    /// Get a single subject by ID
    async fn subject(&self, ctx: &Context<'_>, id: String) -> Result<Option<SubjectType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::subject::Subject>("subjects");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let subject = collection
            .find_one(
                doc! { "_id": obj_id, "soft_delete.is_deleted": { "$ne": true } },
                None,
            )
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        Ok(subject.map(|s| s.into()))
    }

    /// Get subjects by school with pagination, filtering, and sorting
    async fn subjects_by_school(
        &self,
        ctx: &Context<'_>,
        school_id: String,
        page: Option<i32>,
        page_size: Option<i32>,
        filter: Option<SubjectFilterInput>,
        sort: Option<SubjectSortInput>,
    ) -> Result<PaginatedSubjectsResult> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::subject::Subject>("subjects");

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
                            doc! { "subject_name": { "$regex": search, "$options": "i" } },
                            doc! { "subject_code": { "$regex": search, "$options": "i" } },
                        ],
                    );
                }
            }

            // Filter by status
            if let Some(ref status) = f.status {
                filter_doc.insert("status", mongodb::bson::to_bson(status).unwrap());
            }

            // Filter by subject category
            if let Some(ref category) = f.subject_category {
                filter_doc.insert("subject_category", category);
            }

            // Filter by grade level (any matching)
            if let Some(ref grade_level) = f.grade_level {
                filter_doc.insert("grade_levels", grade_level);
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

        let mut subjects = Vec::new();
        while let Some(subject) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            subjects.push(subject);
        }

        // Calculate total pages
        let total_pages = ((total as f64) / (page_size as f64)).ceil() as i32;

        Ok(PaginatedSubjectsResult {
            items: subjects.into_iter().map(|s| s.into()).collect(),
            total,
            page,
            page_size,
            total_pages,
        })
    }
}

/// Helper function to build sort document
fn build_sort_document(sort: &Option<SubjectSortInput>) -> Document {
    let mut sort_doc = Document::new();

    if let Some(ref s) = sort {
        let sort_field = match s.sort_by.as_deref() {
            Some("subjectName") => "subject_name",
            Some("subjectCode") => "subject_code",
            Some("hoursPerWeek") => "hours_per_week",
            Some("createdAt") => "audit.created_at",
            Some("subjectCategory") => "subject_category",
            _ => "subject_name", // Default sort by name
        };

        let sort_order = match s.sort_order.as_deref() {
            Some("desc") => -1,
            _ => 1, // Default ascending
        };

        sort_doc.insert(sort_field, sort_order);
    } else {
        // Default: sort by name ascending
        sort_doc.insert("subject_name", 1);
    }

    sort_doc
}
