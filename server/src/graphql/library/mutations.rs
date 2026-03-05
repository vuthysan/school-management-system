use crate::graphql::library::types::{BookGqlType, BorrowRecordGqlType};
use crate::models::library::{
    Book, BorrowRecord, BorrowStatus, CreateBookInput, CreateBorrowRecordInput, UpdateBookInput,
    UpdateBorrowRecordInput,
};
use async_graphql::*;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Database,
};

#[derive(Default)]
pub struct LibraryMutation;

#[Object]
impl LibraryMutation {
    // ========================================================================
    // BOOKS
    // ========================================================================

    async fn create_book(
        &self,
        ctx: &Context<'_>,
        input: CreateBookInput,
    ) -> Result<BookGqlType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Book>("books");

        let mut book = Book::new(
            input.school_id,
            input.title,
            input.author,
            input.total_copies,
        );

        book.isbn = input.isbn;
        if let Some(category) = input.category {
            book.category = category;
        }
        book.publisher = input.publisher;
        book.published_year = input.published_year;
        book.location = input.location;
        book.description = input.description;
        if let Some(status) = input.status {
            book.status = status;
        }

        let result = collection.insert_one(book.clone(), None).await?;
        book.id = Some(result.inserted_id.as_object_id().unwrap());

        Ok(BookGqlType::from(book))
    }

    async fn update_book(
        &self,
        ctx: &Context<'_>,
        id: String,
        input: UpdateBookInput,
    ) -> Result<BookGqlType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Book>("books");

        let obj_id = ObjectId::parse_str(&id)?;

        let mut update_doc = doc! {};

        if let Some(title) = input.title {
            update_doc.insert("title", title);
        }
        if let Some(author) = input.author {
            update_doc.insert("author", author);
        }
        if let Some(isbn) = input.isbn {
            update_doc.insert("isbn", isbn);
        }
        if let Some(category) = input.category {
            update_doc.insert("category", mongodb::bson::to_bson(&category)?);
        }
        if let Some(publisher) = input.publisher {
            update_doc.insert("publisher", publisher);
        }
        if let Some(year) = input.published_year {
            update_doc.insert("published_year", year);
        }
        if let Some(total) = input.total_copies {
            update_doc.insert("total_copies", total);
        }
        if let Some(available) = input.available_copies {
            update_doc.insert("available_copies", available);
        }
        if let Some(location) = input.location {
            update_doc.insert("location", location);
        }
        if let Some(description) = input.description {
            update_doc.insert("description", description);
        }
        if let Some(status) = input.status {
            update_doc.insert("status", mongodb::bson::to_bson(&status)?);
        }

        update_doc.insert("audit.updated_at", mongodb::bson::DateTime::now());

        collection
            .find_one_and_update(doc! { "_id": obj_id }, doc! { "$set": update_doc }, None)
            .await?;

        let updated = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await?
            .ok_or_else(|| Error::new("Book not found"))?;

        Ok(BookGqlType::from(updated))
    }

    async fn delete_book(&self, ctx: &Context<'_>, id: String) -> Result<bool> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Book>("books");

        let obj_id = ObjectId::parse_str(&id)?;

        collection
            .update_one(
                doc! { "_id": obj_id },
                doc! {
                    "$set": {
                        "soft_delete.is_deleted": true,
                        "soft_delete.deleted_at": mongodb::bson::DateTime::now()
                    }
                },
                None,
            )
            .await?;

        Ok(true)
    }

    // ========================================================================
    // BORROW RECORDS
    // ========================================================================

    async fn create_borrow_record(
        &self,
        ctx: &Context<'_>,
        input: CreateBorrowRecordInput,
    ) -> Result<BorrowRecordGqlType> {
        let db = ctx.data::<Database>()?;
        let borrow_collection = db.collection::<BorrowRecord>("borrow_records");
        let book_collection = db.collection::<Book>("books");

        // Decrement available_copies on the book
        let book_obj_id = ObjectId::parse_str(&input.book_id)?;
        book_collection
            .update_one(
                doc! { "_id": book_obj_id },
                doc! { "$inc": { "available_copies": -1 }, "$set": { "audit.updated_at": mongodb::bson::DateTime::now() } },
                None,
            )
            .await?;

        let mut record = BorrowRecord::new(
            input.school_id,
            input.book_id,
            input.borrower_id,
            input.borrower_name,
            input.borrow_date,
            input.due_date,
        );

        if let Some(bt) = input.borrower_type {
            record.borrower_type = bt;
        }
        record.notes = input.notes;

        let result = borrow_collection.insert_one(record.clone(), None).await?;
        record.id = Some(result.inserted_id.as_object_id().unwrap());

        Ok(BorrowRecordGqlType::from(record))
    }

    async fn update_borrow_record(
        &self,
        ctx: &Context<'_>,
        id: String,
        input: UpdateBorrowRecordInput,
    ) -> Result<BorrowRecordGqlType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<BorrowRecord>("borrow_records");

        let obj_id = ObjectId::parse_str(&id)?;

        let mut update_doc = doc! {};

        if let Some(due_date) = input.due_date {
            update_doc.insert("due_date", due_date);
        }
        if let Some(borrow_status) = input.borrow_status {
            update_doc.insert("borrow_status", mongodb::bson::to_bson(&borrow_status)?);
        }
        if let Some(notes) = input.notes {
            update_doc.insert("notes", notes);
        }

        update_doc.insert("audit.updated_at", mongodb::bson::DateTime::now());

        collection
            .find_one_and_update(doc! { "_id": obj_id }, doc! { "$set": update_doc }, None)
            .await?;

        let updated = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await?
            .ok_or_else(|| Error::new("Borrow record not found"))?;

        Ok(BorrowRecordGqlType::from(updated))
    }

    async fn delete_borrow_record(&self, ctx: &Context<'_>, id: String) -> Result<bool> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<BorrowRecord>("borrow_records");

        let obj_id = ObjectId::parse_str(&id)?;

        collection
            .update_one(
                doc! { "_id": obj_id },
                doc! {
                    "$set": {
                        "soft_delete.is_deleted": true,
                        "soft_delete.deleted_at": mongodb::bson::DateTime::now()
                    }
                },
                None,
            )
            .await?;

        Ok(true)
    }

    /// Return a book — sets return_date, status=Returned, increments available_copies
    async fn return_book(&self, ctx: &Context<'_>, id: String) -> Result<BorrowRecordGqlType> {
        let db = ctx.data::<Database>()?;
        let borrow_collection = db.collection::<BorrowRecord>("borrow_records");
        let book_collection = db.collection::<Book>("books");

        let obj_id = ObjectId::parse_str(&id)?;

        // Get the borrow record to find book_id
        let record = borrow_collection
            .find_one(doc! { "_id": obj_id }, None)
            .await?
            .ok_or_else(|| Error::new("Borrow record not found"))?;

        // Update borrow record
        let now = chrono::Utc::now().format("%Y-%m-%d").to_string();
        borrow_collection
            .find_one_and_update(
                doc! { "_id": obj_id },
                doc! {
                    "$set": {
                        "return_date": &now,
                        "borrow_status": mongodb::bson::to_bson(&BorrowStatus::Returned)?,
                        "audit.updated_at": mongodb::bson::DateTime::now()
                    }
                },
                None,
            )
            .await?;

        // Increment available_copies on the book
        let book_obj_id = ObjectId::parse_str(&record.book_id)?;
        book_collection
            .update_one(
                doc! { "_id": book_obj_id },
                doc! { "$inc": { "available_copies": 1 }, "$set": { "audit.updated_at": mongodb::bson::DateTime::now() } },
                None,
            )
            .await?;

        let updated = borrow_collection
            .find_one(doc! { "_id": obj_id }, None)
            .await?
            .ok_or_else(|| Error::new("Borrow record not found"))?;

        Ok(BorrowRecordGqlType::from(updated))
    }
}
