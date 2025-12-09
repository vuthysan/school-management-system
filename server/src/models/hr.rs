use serde::{Deserialize, Serialize};
use mongodb::bson::{oid::ObjectId, DateTime};

#[derive(Debug, Serialize, Deserialize)]
pub struct Staff {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub staff_id: String,
    pub first_name: String,
    pub last_name: String,
    pub email: String,
    pub phone: String,
    pub date_of_birth: String,
    pub gender: String,
    pub address: String,
    pub role: String, // "teacher" | "admin" | "principal" | "librarian"
    pub department: Option<String>,
    pub subjects: Vec<String>,
    pub hire_date: DateTime,
    pub salary: f64,
    pub currency: String,
    pub status: String, // "active" | "inactive" | "on_leave"
    pub profile_photo: Option<String>,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Payroll {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub staff_id: ObjectId,
    pub month: String, // "2024-01"
    pub base_salary: f64,
    pub bonuses: f64,
    pub deductions: f64,
    pub net_salary: f64,
    pub currency: String,
    pub payment_date: DateTime,
    pub status: String, // "pending" | "paid"
    pub created_at: DateTime,
    pub updated_at: DateTime,
}
