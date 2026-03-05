use crate::graphql::library::inputs::{BookFilterInput, BorrowFilterInput};
use crate::graphql::library::types::{
    BookGqlType, BorrowRecordGqlType, PaginatedBooksResult, PaginatedBorrowsResult,
};
use crate::models::library::{Book, BorrowRecord};
use async_graphql::*;
use mongodb::{
    bson::{doc, oid::ObjectId},
    options::FindOptions,
    Database,
};

#[derive(Default)]
pub struct LibraryQuery;

#[Object]
impl LibraryQuery {
    // ========================================================================
    // BOOKS
    // ========================================================================

    async fn books(
        &self,
        ctx: &Context<'_>,
        school_id: String,
        page: Option<u64>,
        page_size: Option<u64>,
        filter: Option<BookFilterInput>,
    ) -> Result<PaginatedBooksResult> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Book>("books");

        let mut query = doc! {
            "school_id": &school_id,
            "soft_delete.is_deleted": false
        };

        if let Some(f) = filter {
            if let Some(search) = f.search {
                query.insert(
                    "$or",
                    vec![
                        doc! { "title": { "$regex": &search, "$options": "i" } },
                        doc! { "author": { "$regex": &search, "$options": "i" } },
                        doc! { "isbn": { "$regex": &search, "$options": "i" } },
                    ],
                );
            }
            if let Some(category) = f.category {
                query.insert("category", mongodb::bson::to_bson(&category)?);
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
            .sort(doc! { "title": 1 })
            .build();

        let mut cursor = collection.find(query, find_options).await?;
        let mut items = Vec::new();

        while cursor.advance().await? {
            items.push(BookGqlType::from(cursor.deserialize_current()?));
        }

        Ok(PaginatedBooksResult {
            items,
            total,
            page,
            total_pages,
        })
    }

    async fn book(&self, ctx: &Context<'_>, id: String) -> Result<Option<BookGqlType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Book>("books");

        let obj_id = ObjectId::parse_str(&id)?;
        let book = collection
            .find_one(
                doc! { "_id": obj_id, "soft_delete.is_deleted": false },
                None,
            )
            .await?;

        Ok(book.map(BookGqlType::from))
    }

    // ========================================================================
    // BORROW RECORDS
    // ========================================================================

    async fn borrow_records(
        &self,
        ctx: &Context<'_>,
        school_id: String,
        page: Option<u64>,
        page_size: Option<u64>,
        filter: Option<BorrowFilterInput>,
    ) -> Result<PaginatedBorrowsResult> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<BorrowRecord>("borrow_records");

        let mut query = doc! {
            "school_id": &school_id,
            "soft_delete.is_deleted": false
        };

        if let Some(f) = filter {
            if let Some(book_id) = f.book_id {
                query.insert("book_id", book_id);
            }
            if let Some(borrower_id) = f.borrower_id {
                query.insert("borrower_id", borrower_id);
            }
            if let Some(borrow_status) = f.borrow_status {
                query.insert("borrow_status", mongodb::bson::to_bson(&borrow_status)?);
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
            .sort(doc! { "audit.created_at": -1 })
            .build();

        let mut cursor = collection.find(query, find_options).await?;
        let mut items = Vec::new();

        while cursor.advance().await? {
            items.push(BorrowRecordGqlType::from(cursor.deserialize_current()?));
        }

        Ok(PaginatedBorrowsResult {
            items,
            total,
            page,
            total_pages,
        })
    }

    async fn borrow_record(
        &self,
        ctx: &Context<'_>,
        id: String,
    ) -> Result<Option<BorrowRecordGqlType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<BorrowRecord>("borrow_records");

        let obj_id = ObjectId::parse_str(&id)?;
        let record = collection
            .find_one(
                doc! { "_id": obj_id, "soft_delete.is_deleted": false },
                None,
            )
            .await?;

        Ok(record.map(BorrowRecordGqlType::from))
    }
}
