use async_graphql::*;
use serde::{Deserialize, Serialize};

#[derive(InputObject, Serialize, Deserialize)]
pub struct CreateStaffInput {
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

#[derive(InputObject, Serialize, Deserialize)]
pub struct CreatePayrollInput {
    pub staff_id: String,
    pub month: String,
    pub bonuses: f64,
    pub deductions: f64,
}
