use crate::models::library::{BookCategory, BorrowStatus};
use crate::utils::common_types::Status;
use async_graphql::*;

#[derive(InputObject)]
pub struct BookFilterInput {
    pub search: Option<String>,
    pub category: Option<BookCategory>,
    pub status: Option<Status>,
}

#[derive(InputObject)]
pub struct BorrowFilterInput {
    pub book_id: Option<String>,
    pub borrower_id: Option<String>,
    pub borrow_status: Option<BorrowStatus>,
}
