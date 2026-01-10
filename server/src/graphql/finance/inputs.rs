// Finance GraphQL inputs
use async_graphql::*;

/// Input for creating a new fee structure
#[derive(InputObject)]
pub struct CreateFeeInput {
    /// School ID (required)
    pub school_id: String,
    /// Fee name (e.g., "Tuition Fee", "Registration Fee")
    pub fee_name: String,
    /// Description of the fee
    pub description: Option<String>,
    /// Fee amount
    pub amount: f64,
    /// Currency: "USD" or "KHR"
    pub currency: String,
    /// Grade level (optional - if None, applies to all grades)
    pub grade_level: Option<String>,
    /// Academic year (e.g., "2024-2025")
    pub academic_year: String,
    /// Due date (ISO 8601 format)
    pub due_date: String,
    /// Whether this fee is mandatory
    pub is_mandatory: Option<bool>,
}

/// Input for updating a fee
#[derive(InputObject)]
pub struct UpdateFeeInput {
    /// Fee name
    pub fee_name: Option<String>,
    /// Description
    pub description: Option<String>,
    /// Fee amount
    pub amount: Option<f64>,
    /// Currency
    pub currency: Option<String>,
    /// Grade level
    pub grade_level: Option<String>,
    /// Academic year
    pub academic_year: Option<String>,
    /// Due date
    pub due_date: Option<String>,
    /// Whether mandatory
    pub is_mandatory: Option<bool>,
}

/// Input for recording a payment
#[derive(InputObject)]
pub struct CreatePaymentInput {
    /// School ID
    pub school_id: String,
    /// Student ID
    pub student_id: String,
    /// Fee ID being paid
    pub fee_id: String,
    /// Amount being paid
    pub amount_paid: f64,
    /// Currency
    pub currency: String,
    /// Payment method: "cash" | "bank_transfer" | "mobile_payment" | "card"
    pub payment_method: String,
    /// Optional remarks/notes
    pub remarks: Option<String>,
}

/// Input for generating an invoice
#[derive(InputObject)]
pub struct CreateInvoiceInput {
    /// School ID
    pub school_id: String,
    /// Student ID
    pub student_id: String,
    /// List of fee IDs to include
    pub fee_ids: Vec<String>,
    /// Total amount
    pub total_amount: f64,
    /// Currency
    pub currency: String,
    /// Due date (ISO 8601)
    pub due_date: String,
}

/// Filters for querying payments
#[derive(InputObject, Default)]
pub struct PaymentFilters {
    /// Filter by student ID
    pub student_id: Option<String>,
    /// Filter by payment status
    pub status: Option<String>,
    /// Filter by payment method
    pub payment_method: Option<String>,
    /// Filter by date range (start)
    pub date_from: Option<String>,
    /// Filter by date range (end)
    pub date_to: Option<String>,
}

/// Filters for querying invoices
#[derive(InputObject, Default)]
pub struct InvoiceFilters {
    /// Filter by student ID
    pub student_id: Option<String>,
    /// Filter by status
    pub status: Option<String>,
}
