use crate::models::hr::{Payroll, Staff};
use async_graphql::*;

#[derive(SimpleObject)]
pub struct StaffType {
    pub id: String,
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
    pub hire_date: String,
    pub salary: f64,
    pub currency: String,
    pub status: String,
    pub profile_photo: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

impl From<Staff> for StaffType {
    fn from(s: Staff) -> Self {
        StaffType {
            id: s.id.map(|id| id.to_hex()).unwrap_or_default(),
            staff_id: s.staff_id,
            first_name: s.first_name,
            last_name: s.last_name,
            email: s.email,
            phone: s.phone,
            date_of_birth: s.date_of_birth,
            gender: s.gender,
            address: s.address,
            role: s.role,
            department: s.department,
            subjects: s.subjects,
            hire_date: s.hire_date.try_to_rfc3339_string().unwrap_or_default(),
            salary: s.salary,
            currency: s.currency,
            status: s.status,
            profile_photo: s.profile_photo,
            created_at: s.created_at.try_to_rfc3339_string().unwrap_or_default(),
            updated_at: s.updated_at.try_to_rfc3339_string().unwrap_or_default(),
        }
    }
}

#[derive(SimpleObject)]
pub struct PayrollType {
    pub id: String,
    pub staff_id: String,
    pub month: String,
    pub base_salary: f64,
    pub bonuses: f64,
    pub deductions: f64,
    pub net_salary: f64,
    pub currency: String,
    pub payment_date: String,
    pub status: String,
    pub created_at: String,
    pub updated_at: String,
}

impl From<Payroll> for PayrollType {
    fn from(p: Payroll) -> Self {
        PayrollType {
            id: p.id.map(|id| id.to_hex()).unwrap_or_default(),
            staff_id: p.staff_id.to_hex(),
            month: p.month,
            base_salary: p.base_salary,
            bonuses: p.bonuses,
            deductions: p.deductions,
            net_salary: p.net_salary,
            currency: p.currency,
            payment_date: p.payment_date.try_to_rfc3339_string().unwrap_or_default(),
            status: p.status,
            created_at: p.created_at.try_to_rfc3339_string().unwrap_or_default(),
            updated_at: p.updated_at.try_to_rfc3339_string().unwrap_or_default(),
        }
    }
}
