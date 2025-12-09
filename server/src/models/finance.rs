use serde::{Deserialize, Serialize};
use mongodb::bson::{oid::ObjectId, DateTime};

#[derive(Debug, Serialize, Deserialize)]
pub struct Fee {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub fee_name: String,
    pub amount: f64,
    pub currency: String, // "USD" | "KHR"
    pub grade_level: Option<String>,
    pub academic_year: String,
    pub due_date: DateTime,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Payment {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub student_id: ObjectId,
    pub fee_id: ObjectId,
    pub amount_paid: f64,
    pub currency: String,
    pub payment_method: String, // "cash" | "bank_transfer" | "card"
    pub payment_date: DateTime,
    pub receipt_number: String,
    pub status: String, // "pending" | "completed" | "failed"
    pub remarks: Option<String>,
    pub processed_by: ObjectId,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Invoice {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
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
