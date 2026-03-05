use crate::utils::common_types::{AuditInfo, SoftDelete, Status};
use async_graphql::*;
use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

// ============================================================================
// ENUMS
// ============================================================================

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
pub enum BookCategory {
    #[graphql(name = "Textbook")]
    Textbook,
    #[graphql(name = "Reference")]
    Reference,
    #[graphql(name = "Fiction")]
    Fiction,
    #[graphql(name = "NonFiction")]
    NonFiction,
    #[graphql(name = "Magazine")]
    Magazine,
    #[graphql(name = "Other")]
    Other,
}

impl Default for BookCategory {
    fn default() -> Self {
        BookCategory::Other
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
pub enum BorrowStatus {
    #[graphql(name = "Borrowed")]
    Borrowed,
    #[graphql(name = "Returned")]
    Returned,
    #[graphql(name = "Overdue")]
    Overdue,
}

impl Default for BorrowStatus {
    fn default() -> Self {
        BorrowStatus::Borrowed
    }
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
pub enum BorrowerType {
    #[graphql(name = "Student")]
    Student,
    #[graphql(name = "Staff")]
    Staff,
}

impl Default for BorrowerType {
    fn default() -> Self {
        BorrowerType::Student
    }
}

// ============================================================================
// BOOK
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject)]
#[graphql(complex)]
pub struct Book {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    #[graphql(skip)]
    pub id: Option<ObjectId>,
    pub school_id: String,
    pub title: String,
    pub author: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub isbn: Option<String>,
    pub category: BookCategory,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub publisher: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub published_year: Option<i32>,
    pub total_copies: i32,
    pub available_copies: i32,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub location: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    pub status: Status,
    pub audit: AuditInfo,
    pub soft_delete: SoftDelete,
}

#[async_graphql::ComplexObject]
impl Book {
    async fn id(&self) -> Option<String> {
        self.id.map(|oid| oid.to_hex())
    }
}

impl Book {
    pub fn new(school_id: String, title: String, author: String, total_copies: i32) -> Self {
        Self {
            id: None,
            school_id,
            title,
            author,
            isbn: None,
            category: BookCategory::default(),
            publisher: None,
            published_year: None,
            total_copies,
            available_copies: total_copies,
            location: None,
            description: None,
            status: Status::Active,
            audit: AuditInfo::new(None),
            soft_delete: SoftDelete::default(),
        }
    }
}

// ============================================================================
// BORROW RECORD
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject)]
#[graphql(complex)]
pub struct BorrowRecord {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    #[graphql(skip)]
    pub id: Option<ObjectId>,
    pub school_id: String,
    pub book_id: String,
    pub borrower_id: String,
    pub borrower_name: String,
    pub borrower_type: BorrowerType,
    pub borrow_date: String,
    pub due_date: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub return_date: Option<String>,
    pub borrow_status: BorrowStatus,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub notes: Option<String>,
    pub audit: AuditInfo,
    pub soft_delete: SoftDelete,
}

#[async_graphql::ComplexObject]
impl BorrowRecord {
    async fn id(&self) -> Option<String> {
        self.id.map(|oid| oid.to_hex())
    }
}

impl BorrowRecord {
    pub fn new(
        school_id: String,
        book_id: String,
        borrower_id: String,
        borrower_name: String,
        borrow_date: String,
        due_date: String,
    ) -> Self {
        Self {
            id: None,
            school_id,
            book_id,
            borrower_id,
            borrower_name,
            borrower_type: BorrowerType::Student,
            borrow_date,
            due_date,
            return_date: None,
            borrow_status: BorrowStatus::Borrowed,
            notes: None,
            audit: AuditInfo::new(None),
            soft_delete: SoftDelete::default(),
        }
    }
}

// ============================================================================
// INPUT TYPES
// ============================================================================

#[derive(InputObject)]
pub struct CreateBookInput {
    pub school_id: String,
    pub title: String,
    pub author: String,
    pub isbn: Option<String>,
    pub category: Option<BookCategory>,
    pub publisher: Option<String>,
    pub published_year: Option<i32>,
    pub total_copies: i32,
    pub location: Option<String>,
    pub description: Option<String>,
    pub status: Option<Status>,
}

#[derive(InputObject)]
pub struct UpdateBookInput {
    pub title: Option<String>,
    pub author: Option<String>,
    pub isbn: Option<String>,
    pub category: Option<BookCategory>,
    pub publisher: Option<String>,
    pub published_year: Option<i32>,
    pub total_copies: Option<i32>,
    pub available_copies: Option<i32>,
    pub location: Option<String>,
    pub description: Option<String>,
    pub status: Option<Status>,
}

#[derive(InputObject)]
pub struct CreateBorrowRecordInput {
    pub school_id: String,
    pub book_id: String,
    pub borrower_id: String,
    pub borrower_name: String,
    pub borrower_type: Option<BorrowerType>,
    pub borrow_date: String,
    pub due_date: String,
    pub notes: Option<String>,
}

#[derive(InputObject)]
pub struct UpdateBorrowRecordInput {
    pub due_date: Option<String>,
    pub borrow_status: Option<BorrowStatus>,
    pub notes: Option<String>,
}
