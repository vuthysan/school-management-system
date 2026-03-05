use crate::models::hr::{Leave, LeaveBalance, Payroll, Staff};
use async_graphql::*;

// ============================================================================
// STAFF TYPE
// ============================================================================

#[derive(SimpleObject)]
pub struct StaffType {
    pub id: String,
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
            school_id: s.school_id,
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

// ============================================================================
// PAYROLL TYPE
// ============================================================================

#[derive(SimpleObject)]
pub struct PayrollType {
    pub id: String,
    pub school_id: String,
    pub staff_id: String,
    pub staff_name: Option<String>,
    pub month: String,
    pub base_salary: f64,
    pub bonuses: f64,
    pub deductions: f64,
    pub net_salary: f64,
    pub currency: String,
    pub payment_date: Option<String>,
    pub status: String,
    pub created_at: String,
    pub updated_at: String,
}

impl From<Payroll> for PayrollType {
    fn from(p: Payroll) -> Self {
        PayrollType {
            id: p.id.map(|id| id.to_hex()).unwrap_or_default(),
            school_id: p.school_id,
            staff_id: p.staff_id.to_hex(),
            staff_name: p.staff_name,
            month: p.month,
            base_salary: p.base_salary,
            bonuses: p.bonuses,
            deductions: p.deductions,
            net_salary: p.net_salary,
            currency: p.currency,
            payment_date: p
                .payment_date
                .map(|dt| dt.try_to_rfc3339_string().unwrap_or_default()),
            status: p.status,
            created_at: p.created_at.try_to_rfc3339_string().unwrap_or_default(),
            updated_at: p.updated_at.try_to_rfc3339_string().unwrap_or_default(),
        }
    }
}

#[derive(SimpleObject)]
pub struct PaginatedPayrollResult {
    pub items: Vec<PayrollType>,
    pub total: i64,
    pub page: i32,
    pub total_pages: i32,
}

// ============================================================================
// LEAVE TYPE
// ============================================================================

#[derive(SimpleObject)]
pub struct LeaveGqlType {
    pub id: String,
    pub school_id: String,
    pub staff_id: String,
    pub leave_type: String,
    pub start_date: String,
    pub end_date: String,
    pub days: i32,
    pub reason: String,
    pub status: String,
    pub approved_by: Option<String>,
    pub rejection_reason: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

impl From<Leave> for LeaveGqlType {
    fn from(l: Leave) -> Self {
        LeaveGqlType {
            id: l.id.map(|id| id.to_hex()).unwrap_or_default(),
            school_id: l.school_id,
            staff_id: l.staff_id.to_hex(),
            leave_type: format!("{:?}", l.leave_type),
            start_date: l.start_date,
            end_date: l.end_date,
            days: l.days,
            reason: l.reason,
            status: format!("{:?}", l.status),
            approved_by: l.approved_by,
            rejection_reason: l.rejection_reason,
            created_at: l.created_at.try_to_rfc3339_string().unwrap_or_default(),
            updated_at: l.updated_at.try_to_rfc3339_string().unwrap_or_default(),
        }
    }
}

// ============================================================================
// LEAVE BALANCE TYPE
// ============================================================================

#[derive(SimpleObject)]
pub struct LeaveBalanceType {
    pub id: String,
    pub school_id: String,
    pub staff_id: String,
    pub academic_year: String,
    pub annual_total: i32,
    pub annual_used: i32,
    pub annual_remaining: i32,
    pub sick_total: i32,
    pub sick_used: i32,
    pub sick_remaining: i32,
    pub maternity_total: i32,
    pub maternity_used: i32,
    pub maternity_remaining: i32,
    pub personal_total: i32,
    pub personal_used: i32,
    pub personal_remaining: i32,
}

impl From<LeaveBalance> for LeaveBalanceType {
    fn from(lb: LeaveBalance) -> Self {
        LeaveBalanceType {
            id: lb.id.map(|id| id.to_hex()).unwrap_or_default(),
            school_id: lb.school_id,
            staff_id: lb.staff_id.to_hex(),
            academic_year: lb.academic_year,
            annual_total: lb.annual_total,
            annual_used: lb.annual_used,
            annual_remaining: lb.annual_total - lb.annual_used,
            sick_total: lb.sick_total,
            sick_used: lb.sick_used,
            sick_remaining: lb.sick_total - lb.sick_used,
            maternity_total: lb.maternity_total,
            maternity_used: lb.maternity_used,
            maternity_remaining: lb.maternity_total - lb.maternity_used,
            personal_total: lb.personal_total,
            personal_used: lb.personal_used,
            personal_remaining: lb.personal_total - lb.personal_used,
        }
    }
}

// ============================================================================
// BATCH PAYROLL RESULT
// ============================================================================

#[derive(SimpleObject)]
pub struct BatchPayrollResult {
    pub generated_count: i32,
    pub total_amount: f64,
    pub month: String,
    pub payrolls: Vec<PayrollType>,
}
