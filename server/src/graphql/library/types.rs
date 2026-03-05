use crate::models::library::{Book, BookCategory, BorrowRecord, BorrowStatus, BorrowerType};
use crate::utils::common_types::Status;
use async_graphql::*;

// ============================================================================
// BOOK
// ============================================================================

#[derive(SimpleObject)]
pub struct BookGqlType {
    pub id: String,
    pub school_id: String,
    pub title: String,
    pub author: String,
    pub isbn: Option<String>,
    pub category: BookCategory,
    pub publisher: Option<String>,
    pub published_year: Option<i32>,
    pub total_copies: i32,
    pub available_copies: i32,
    pub location: Option<String>,
    pub description: Option<String>,
    pub status: Status,
    pub created_at: String,
    pub updated_at: String,
}

impl From<Book> for BookGqlType {
    fn from(b: Book) -> Self {
        Self {
            id: b.id.map(|id| id.to_hex()).unwrap_or_default(),
            school_id: b.school_id,
            title: b.title,
            author: b.author,
            isbn: b.isbn,
            category: b.category,
            publisher: b.publisher,
            published_year: b.published_year,
            total_copies: b.total_copies,
            available_copies: b.available_copies,
            location: b.location,
            description: b.description,
            status: b.status,
            created_at: b.audit.created_at_str().unwrap_or_default(),
            updated_at: b.audit.updated_at_str().unwrap_or_default(),
        }
    }
}

#[derive(SimpleObject)]
pub struct PaginatedBooksResult {
    pub items: Vec<BookGqlType>,
    pub total: u64,
    pub page: u64,
    pub total_pages: u64,
}

// ============================================================================
// BORROW RECORD
// ============================================================================

#[derive(SimpleObject)]
pub struct BorrowRecordGqlType {
    pub id: String,
    pub school_id: String,
    pub book_id: String,
    pub borrower_id: String,
    pub borrower_name: String,
    pub borrower_type: BorrowerType,
    pub borrow_date: String,
    pub due_date: String,
    pub return_date: Option<String>,
    pub borrow_status: BorrowStatus,
    pub notes: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

impl From<BorrowRecord> for BorrowRecordGqlType {
    fn from(r: BorrowRecord) -> Self {
        Self {
            id: r.id.map(|id| id.to_hex()).unwrap_or_default(),
            school_id: r.school_id,
            book_id: r.book_id,
            borrower_id: r.borrower_id,
            borrower_name: r.borrower_name,
            borrower_type: r.borrower_type,
            borrow_date: r.borrow_date,
            due_date: r.due_date,
            return_date: r.return_date,
            borrow_status: r.borrow_status,
            notes: r.notes,
            created_at: r.audit.created_at_str().unwrap_or_default(),
            updated_at: r.audit.updated_at_str().unwrap_or_default(),
        }
    }
}

#[derive(SimpleObject)]
pub struct PaginatedBorrowsResult {
    pub items: Vec<BorrowRecordGqlType>,
    pub total: u64,
    pub page: u64,
    pub total_pages: u64,
}
