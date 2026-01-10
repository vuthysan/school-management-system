use mongodb::bson::{oid::ObjectId, DateTime};
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Fee {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub school_id: String,
    pub fee_name: String,
    pub description: Option<String>,
    pub amount: f64,
    pub currency: String,            // "USD" | "KHR"
    pub grade_level: Option<String>, // None = all grades
    pub academic_year: String,
    pub due_date: DateTime,
    pub is_mandatory: bool,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}

impl Fee {
    pub fn new(
        school_id: String,
        fee_name: String,
        amount: f64,
        currency: String,
        academic_year: String,
        due_date: DateTime,
    ) -> Self {
        let now = DateTime::now();
        Self {
            id: None,
            school_id,
            fee_name,
            description: None,
            amount,
            currency,
            grade_level: None,
            academic_year,
            due_date,
            is_mandatory: true,
            created_at: now,
            updated_at: now,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Payment {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub school_id: String,
    pub student_id: ObjectId,
    pub fee_id: ObjectId,
    pub amount_paid: f64,
    pub currency: String,
    pub payment_method: String, // "cash" | "bank_transfer" | "mobile_payment" | "card"
    pub payment_date: DateTime,
    pub receipt_number: String,
    pub status: String, // "pending" | "completed" | "failed"
    pub remarks: Option<String>,
    pub processed_by: ObjectId,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}

impl Payment {
    pub fn new(
        school_id: String,
        student_id: ObjectId,
        fee_id: ObjectId,
        amount_paid: f64,
        currency: String,
        payment_method: String,
        receipt_number: String,
        processed_by: ObjectId,
    ) -> Self {
        let now = DateTime::now();
        Self {
            id: None,
            school_id,
            student_id,
            fee_id,
            amount_paid,
            currency,
            payment_method,
            payment_date: now,
            receipt_number,
            status: "completed".to_string(),
            remarks: None,
            processed_by,
            created_at: now,
            updated_at: now,
        }
    }
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Invoice {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub school_id: String,
    pub invoice_number: String,
    pub student_id: ObjectId,
    pub fee_ids: Vec<ObjectId>,
    pub total_amount: f64,
    pub amount_paid: f64,
    pub balance: f64,
    pub currency: String,
    pub issue_date: DateTime,
    pub due_date: DateTime,
    pub status: String, // "unpaid" | "partial" | "paid" | "overdue"
    pub created_at: DateTime,
    pub updated_at: DateTime,
}

impl Invoice {
    pub fn new(
        school_id: String,
        invoice_number: String,
        student_id: ObjectId,
        fee_ids: Vec<ObjectId>,
        total_amount: f64,
        currency: String,
        due_date: DateTime,
    ) -> Self {
        let now = DateTime::now();
        Self {
            id: None,
            school_id,
            invoice_number,
            student_id,
            fee_ids,
            total_amount,
            amount_paid: 0.0,
            balance: total_amount,
            currency,
            issue_date: now,
            due_date,
            status: "unpaid".to_string(),
            created_at: now,
            updated_at: now,
        }
    }
}
