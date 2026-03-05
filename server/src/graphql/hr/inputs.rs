use crate::models::hr::{LeaveStatus, LeaveTypeEnum};
use async_graphql::*;
use serde::{Deserialize, Serialize};

// ============================================================================
// STAFF INPUTS
// ============================================================================

#[derive(InputObject, Serialize, Deserialize)]
pub struct CreateStaffInput {
    pub school_id: String,
    pub staff_id: String,
    pub first_name: String,
    pub last_name: String,
    pub email: String,
    pub phone: String,
    pub date_of_birth: String,
    pub gender: String,
    pub address: String,
    pub role: String,
    pub department: Option<String>,
    pub subjects: Vec<String>,
    pub salary: f64,
    pub currency: String,
}

#[derive(InputObject, Serialize, Deserialize)]
pub struct UpdateStaffInput {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub address: Option<String>,
    pub role: Option<String>,
    pub department: Option<String>,
    pub subjects: Option<Vec<String>>,
    pub salary: Option<f64>,
    pub status: Option<String>,
}

// ============================================================================
// PAYROLL INPUTS
// ============================================================================

#[derive(InputObject, Serialize, Deserialize)]
pub struct CreatePayrollInput {
    pub staff_id: String,
    pub month: String,
    pub bonuses: f64,
    pub deductions: f64,
}

#[derive(InputObject, Serialize, Deserialize)]
pub struct GeneratePayrollInput {
    pub school_id: String,
    pub month: String, // "2025-01"
    pub default_bonuses: Option<f64>,
    pub default_deductions: Option<f64>,
}

#[derive(InputObject, Serialize, Deserialize)]
pub struct UpdatePayrollStatusInput {
    pub status: String, // "pending" | "paid"
}

// ============================================================================
// LEAVE INPUTS
// ============================================================================

#[derive(InputObject, Serialize, Deserialize)]
pub struct CreateLeaveInput {
    pub school_id: String,
    pub staff_id: String,
    pub leave_type: LeaveTypeEnum,
    pub start_date: String,
    pub end_date: String,
    pub days: i32,
    pub reason: String,
}

#[derive(InputObject, Serialize, Deserialize)]
pub struct UpdateLeaveStatusInput {
    pub status: LeaveStatus,
    pub approved_by: Option<String>,
    pub rejection_reason: Option<String>,
}

// ============================================================================
// LEAVE BALANCE INPUTS
// ============================================================================

#[derive(InputObject, Serialize, Deserialize)]
pub struct InitLeaveBalanceInput {
    pub school_id: String,
    pub staff_id: String,
    pub academic_year: String,
    pub annual_total: Option<i32>,
    pub sick_total: Option<i32>,
    pub maternity_total: Option<i32>,
    pub personal_total: Option<i32>,
}
