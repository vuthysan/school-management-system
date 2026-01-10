// Finance GraphQL types
use crate::models::finance::{Fee, Invoice, Payment};
use async_graphql::*;

/// Fee structure type for GraphQL
#[derive(SimpleObject)]
#[graphql(complex)]
pub struct FeeType {
    pub id: String,
    pub school_id: String,
    pub fee_name: String,
    pub amount: f64,
    pub currency: String,
    pub grade_level: Option<String>,
    pub academic_year: String,
    pub due_date: String,
    pub description: Option<String>,
    pub is_mandatory: bool,
    pub created_at: String,
    pub updated_at: String,
}

#[ComplexObject]
impl FeeType {
    /// Formatted amount with currency
    async fn formatted_amount(&self) -> String {
        if self.currency == "KHR" {
            format!("{:.0}៛", self.amount)
        } else {
            format!("${:.2}", self.amount)
        }
    }

    /// Check if fee is applicable to all grades
    async fn is_all_grades(&self) -> bool {
        self.grade_level.is_none()
    }
}

impl From<Fee> for FeeType {
    fn from(f: Fee) -> Self {
        FeeType {
            id: f.id.map(|id| id.to_hex()).unwrap_or_default(),
            school_id: f.school_id,
            fee_name: f.fee_name,
            amount: f.amount,
            currency: f.currency,
            grade_level: f.grade_level,
            academic_year: f.academic_year,
            due_date: f.due_date.try_to_rfc3339_string().unwrap_or_default(),
            description: f.description,
            is_mandatory: f.is_mandatory,
            created_at: f.created_at.try_to_rfc3339_string().unwrap_or_default(),
            updated_at: f.updated_at.try_to_rfc3339_string().unwrap_or_default(),
        }
    }
}

/// Payment record type for GraphQL
#[derive(SimpleObject)]
#[graphql(complex)]
pub struct PaymentType {
    pub id: String,
    pub school_id: String,
    pub student_id: String,
    pub fee_id: String,
    pub amount_paid: f64,
    pub currency: String,
    pub payment_method: String,
    pub payment_date: String,
    pub receipt_number: String,
    pub status: String,
    pub remarks: Option<String>,
    pub processed_by: String,
    pub created_at: String,
    pub updated_at: String,
}

#[ComplexObject]
impl PaymentType {
    /// Formatted amount with currency
    async fn formatted_amount(&self) -> String {
        if self.currency == "KHR" {
            format!("{:.0}៛", self.amount_paid)
        } else {
            format!("${:.2}", self.amount_paid)
        }
    }

    /// Human-readable payment method
    async fn payment_method_label(&self) -> String {
        match self.payment_method.as_str() {
            "cash" => "Cash".to_string(),
            "bank_transfer" => "Bank Transfer".to_string(),
            "mobile_payment" => "Mobile Payment".to_string(),
            "card" => "Card".to_string(),
            _ => self.payment_method.clone(),
        }
    }
}

impl From<Payment> for PaymentType {
    fn from(p: Payment) -> Self {
        PaymentType {
            id: p.id.map(|id| id.to_hex()).unwrap_or_default(),
            school_id: p.school_id,
            student_id: p.student_id.to_hex(),
            fee_id: p.fee_id.to_hex(),
            amount_paid: p.amount_paid,
            currency: p.currency,
            payment_method: p.payment_method,
            payment_date: p.payment_date.try_to_rfc3339_string().unwrap_or_default(),
            receipt_number: p.receipt_number,
            status: p.status,
            remarks: p.remarks,
            processed_by: p.processed_by.to_hex(),
            created_at: p.created_at.try_to_rfc3339_string().unwrap_or_default(),
            updated_at: p.updated_at.try_to_rfc3339_string().unwrap_or_default(),
        }
    }
}

/// Invoice type for GraphQL
#[derive(SimpleObject)]
#[graphql(complex)]
pub struct InvoiceType {
    pub id: String,
    pub school_id: String,
    pub invoice_number: String,
    pub student_id: String,
    pub fee_ids: Vec<String>,
    pub total_amount: f64,
    pub amount_paid: f64,
    pub balance: f64,
    pub currency: String,
    pub issue_date: String,
    pub due_date: String,
    pub status: String,
    pub created_at: String,
    pub updated_at: String,
}

#[ComplexObject]
impl InvoiceType {
    /// Formatted total amount
    async fn formatted_total(&self) -> String {
        if self.currency == "KHR" {
            format!("{:.0}៛", self.total_amount)
        } else {
            format!("${:.2}", self.total_amount)
        }
    }

    /// Formatted remaining balance
    async fn formatted_balance(&self) -> String {
        if self.currency == "KHR" {
            format!("{:.0}៛", self.balance)
        } else {
            format!("${:.2}", self.balance)
        }
    }

    /// Payment completion percentage
    async fn payment_percentage(&self) -> f64 {
        if self.total_amount == 0.0 {
            100.0
        } else {
            (self.amount_paid / self.total_amount) * 100.0
        }
    }

    /// Check if overdue
    async fn is_overdue(&self) -> bool {
        self.status == "overdue"
    }
}

impl From<Invoice> for InvoiceType {
    fn from(i: Invoice) -> Self {
        InvoiceType {
            id: i.id.map(|id| id.to_hex()).unwrap_or_default(),
            school_id: i.school_id,
            invoice_number: i.invoice_number,
            student_id: i.student_id.to_hex(),
            fee_ids: i.fee_ids.into_iter().map(|id| id.to_hex()).collect(),
            total_amount: i.total_amount,
            amount_paid: i.amount_paid,
            balance: i.balance,
            currency: i.currency,
            issue_date: i.issue_date.try_to_rfc3339_string().unwrap_or_default(),
            due_date: i.due_date.try_to_rfc3339_string().unwrap_or_default(),
            status: i.status,
            created_at: i.created_at.try_to_rfc3339_string().unwrap_or_default(),
            updated_at: i.updated_at.try_to_rfc3339_string().unwrap_or_default(),
        }
    }
}

/// Finance summary for dashboard statistics
#[derive(SimpleObject)]
pub struct FinanceSummary {
    pub total_collected: f64,
    pub total_pending: f64,
    pub total_overdue: f64,
    pub currency: String,
    pub students_with_balance: i32,
    pub total_students: i32,
    pub collection_rate: f64,
}
