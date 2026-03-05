use async_graphql::Enum;
use mongodb::bson::{oid::ObjectId, DateTime};
use serde::{Deserialize, Serialize};

// ============================================================================
// ENUMS
// ============================================================================

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
pub enum LeaveTypeEnum {
    #[graphql(name = "Annual")]
    Annual,
    #[graphql(name = "Sick")]
    Sick,
    #[graphql(name = "Maternity")]
    Maternity,
    #[graphql(name = "Personal")]
    Personal,
    #[graphql(name = "Unpaid")]
    Unpaid,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
pub enum LeaveStatus {
    #[graphql(name = "Pending")]
    Pending,
    #[graphql(name = "Approved")]
    Approved,
    #[graphql(name = "Rejected")]
    Rejected,
}

// ============================================================================
// STAFF
// ============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct Staff {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub school_id: String,
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

// ============================================================================
// PAYROLL
// ============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct Payroll {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub school_id: String,
    pub staff_id: ObjectId,
    pub staff_name: Option<String>,
    pub month: String, // "2024-01"
    pub base_salary: f64,
    pub bonuses: f64,
    pub deductions: f64,
    pub net_salary: f64,
    pub currency: String,
    pub payment_date: Option<DateTime>,
    pub status: String, // "pending" | "paid"
    pub created_at: DateTime,
    pub updated_at: DateTime,
}

// ============================================================================
// LEAVE REQUEST
// ============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct Leave {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub school_id: String,
    pub staff_id: ObjectId,
    pub leave_type: LeaveTypeEnum,
    pub start_date: String,
    pub end_date: String,
    pub days: i32,
    pub reason: String,
    pub status: LeaveStatus,
    pub approved_by: Option<String>,
    pub rejection_reason: Option<String>,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}

// ============================================================================
// LEAVE BALANCE
// ============================================================================

#[derive(Debug, Serialize, Deserialize)]
pub struct LeaveBalance {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    pub id: Option<ObjectId>,
    pub school_id: String,
    pub staff_id: ObjectId,
    pub academic_year: String, // "2025-2026"
    pub annual_total: i32,
    pub annual_used: i32,
    pub sick_total: i32,
    pub sick_used: i32,
    pub maternity_total: i32,
    pub maternity_used: i32,
    pub personal_total: i32,
    pub personal_used: i32,
    pub created_at: DateTime,
    pub updated_at: DateTime,
}
