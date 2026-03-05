use super::inputs::{
    CreateLeaveInput, CreatePayrollInput, CreateStaffInput, GeneratePayrollInput,
    InitLeaveBalanceInput, UpdateLeaveStatusInput, UpdatePayrollStatusInput, UpdateStaffInput,
};
use super::types::{BatchPayrollResult, LeaveBalanceType, LeaveGqlType, PayrollType, StaffType};
use crate::models::hr::{Leave, LeaveBalance, LeaveStatus, Payroll, Staff};
use async_graphql::*;
use futures::stream::TryStreamExt;
use mongodb::{
    bson::{doc, oid::ObjectId, DateTime},
    Database,
};

#[derive(Default)]
pub struct HRMutation;

#[Object]
impl HRMutation {
    // ========================================================================
    // STAFF MUTATIONS
    // ========================================================================

    /// Create a new staff member
    async fn create_staff(&self, ctx: &Context<'_>, input: CreateStaffInput) -> Result<StaffType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Staff>("staff");

        let now = DateTime::now();
        let staff = Staff {
            id: None,
            school_id: input.school_id,
            staff_id: input.staff_id,
            first_name: input.first_name,
            last_name: input.last_name,
            email: input.email,
            phone: input.phone,
            date_of_birth: input.date_of_birth,
            gender: input.gender,
            address: input.address,
            role: input.role,
            department: input.department,
            subjects: input.subjects,
            hire_date: now,
            salary: input.salary,
            currency: input.currency,
            status: "active".to_string(),
            profile_photo: None,
            created_at: now,
            updated_at: now,
        };

        let result = collection
            .insert_one(staff, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let id = result.inserted_id.as_object_id().unwrap();
        let staff = collection
            .find_one(doc! { "_id": id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Failed to retrieve created staff"))?;

        Ok(StaffType::from(staff))
    }

    /// Update an existing staff member
    async fn update_staff(
        &self,
        ctx: &Context<'_>,
        id: String,
        input: UpdateStaffInput,
    ) -> Result<StaffType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Staff>("staff");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let mut update_doc = doc! {};

        if let Some(f) = input.first_name {
            update_doc.insert("first_name", f);
        }
        if let Some(l) = input.last_name {
            update_doc.insert("last_name", l);
        }
        if let Some(e) = input.email {
            update_doc.insert("email", e);
        }
        if let Some(p) = input.phone {
            update_doc.insert("phone", p);
        }
        if let Some(a) = input.address {
            update_doc.insert("address", a);
        }
        if let Some(r) = input.role {
            update_doc.insert("role", r);
        }
        if let Some(d) = input.department {
            update_doc.insert("department", d);
        }
        if let Some(s) = input.subjects {
            update_doc.insert("subjects", s);
        }
        if let Some(s) = input.salary {
            update_doc.insert("salary", s);
        }
        if let Some(s) = input.status {
            update_doc.insert("status", s);
        }

        update_doc.insert("updated_at", DateTime::now());

        collection
            .update_one(doc! { "_id": obj_id }, doc! { "$set": update_doc }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let staff = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Staff member not found"))?;

        Ok(StaffType::from(staff))
    }

    /// Delete a staff member by ID
    async fn delete_staff(&self, ctx: &Context<'_>, id: String) -> Result<bool> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Staff>("staff");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let result = collection
            .delete_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        if result.deleted_count == 0 {
            return Err(Error::new("Staff member not found"));
        }

        Ok(true)
    }

    // ========================================================================
    // PAYROLL MUTATIONS
    // ========================================================================

    /// Create a payroll record for a single staff member
    async fn create_payroll(
        &self,
        ctx: &Context<'_>,
        input: CreatePayrollInput,
    ) -> Result<PayrollType> {
        let db = ctx.data::<Database>()?;
        let staff_collection = db.collection::<Staff>("staff");
        let payroll_collection = db.collection::<Payroll>("payroll");

        let staff_obj_id = ObjectId::parse_str(&input.staff_id)
            .map_err(|_| Error::new("Invalid staff ID format"))?;

        let staff = staff_collection
            .find_one(doc! { "_id": staff_obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Staff member not found"))?;

        let net_salary = staff.salary + input.bonuses - input.deductions;
        let now = DateTime::now();

        let payroll = Payroll {
            id: None,
            school_id: staff.school_id,
            staff_id: staff_obj_id,
            staff_name: Some(format!("{} {}", staff.first_name, staff.last_name)),
            month: input.month,
            base_salary: staff.salary,
            bonuses: input.bonuses,
            deductions: input.deductions,
            net_salary,
            currency: staff.currency,
            payment_date: None,
            status: "pending".to_string(),
            created_at: now,
            updated_at: now,
        };

        let result = payroll_collection
            .insert_one(payroll, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let id = result.inserted_id.as_object_id().unwrap();
        let payroll = payroll_collection
            .find_one(doc! { "_id": id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Failed to retrieve created payroll record"))?;

        Ok(PayrollType::from(payroll))
    }

    /// Generate monthly payroll for all active staff in a school
    async fn generate_monthly_payroll(
        &self,
        ctx: &Context<'_>,
        input: GeneratePayrollInput,
    ) -> Result<BatchPayrollResult> {
        let db = ctx.data::<Database>()?;
        let staff_collection = db.collection::<Staff>("staff");
        let payroll_collection = db.collection::<Payroll>("payroll");

        // Get all active staff for this school
        let mut cursor = staff_collection
            .find(
                doc! {
                    "school_id": &input.school_id,
                    "status": "active",
                },
                None,
            )
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut staff_list = Vec::new();
        while let Some(staff) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            staff_list.push(staff);
        }

        if staff_list.is_empty() {
            return Err(Error::new("No active staff found for this school"));
        }

        let default_bonuses = input.default_bonuses.unwrap_or(0.0);
        let default_deductions = input.default_deductions.unwrap_or(0.0);
        let now = DateTime::now();

        let mut payrolls = Vec::new();
        let mut total_amount = 0.0;

        for staff in &staff_list {
            // Check if payroll already exists for this staff+month
            let staff_id = staff.id.unwrap();
            let existing = payroll_collection
                .find_one(
                    doc! {
                        "staff_id": staff_id,
                        "month": &input.month,
                    },
                    None,
                )
                .await
                .map_err(|e| Error::new(e.to_string()))?;

            if existing.is_some() {
                continue; // Skip already generated
            }

            let net_salary = staff.salary + default_bonuses - default_deductions;
            total_amount += net_salary;

            let payroll = Payroll {
                id: None,
                school_id: input.school_id.clone(),
                staff_id,
                staff_name: Some(format!("{} {}", staff.first_name, staff.last_name)),
                month: input.month.clone(),
                base_salary: staff.salary,
                bonuses: default_bonuses,
                deductions: default_deductions,
                net_salary,
                currency: staff.currency.clone(),
                payment_date: None,
                status: "pending".to_string(),
                created_at: now,
                updated_at: now,
            };

            let result = payroll_collection
                .insert_one(payroll, None)
                .await
                .map_err(|e| Error::new(e.to_string()))?;

            let id = result.inserted_id.as_object_id().unwrap();
            let created_payroll = payroll_collection
                .find_one(doc! { "_id": id }, None)
                .await
                .map_err(|e| Error::new(e.to_string()))?
                .ok_or_else(|| Error::new("Failed to retrieve payroll record"))?;

            payrolls.push(PayrollType::from(created_payroll));
        }

        Ok(BatchPayrollResult {
            generated_count: payrolls.len() as i32,
            total_amount,
            month: input.month,
            payrolls,
        })
    }

    /// Update payroll status (mark as paid)
    async fn update_payroll_status(
        &self,
        ctx: &Context<'_>,
        id: String,
        input: UpdatePayrollStatusInput,
    ) -> Result<PayrollType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Payroll>("payroll");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let mut update_doc = doc! {
            "status": &input.status,
            "updated_at": DateTime::now(),
        };

        if input.status == "paid" {
            update_doc.insert("payment_date", DateTime::now());
        }

        collection
            .update_one(doc! { "_id": obj_id }, doc! { "$set": update_doc }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let payroll = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Payroll record not found"))?;

        Ok(PayrollType::from(payroll))
    }

    // ========================================================================
    // LEAVE MUTATIONS
    // ========================================================================

    /// Create a leave request
    async fn create_leave(
        &self,
        ctx: &Context<'_>,
        input: CreateLeaveInput,
    ) -> Result<LeaveGqlType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Leave>("leaves");

        let staff_obj_id = ObjectId::parse_str(&input.staff_id)
            .map_err(|_| Error::new("Invalid staff ID format"))?;

        let now = DateTime::now();
        let leave = Leave {
            id: None,
            school_id: input.school_id,
            staff_id: staff_obj_id,
            leave_type: input.leave_type,
            start_date: input.start_date,
            end_date: input.end_date,
            days: input.days,
            reason: input.reason,
            status: LeaveStatus::Pending,
            approved_by: None,
            rejection_reason: None,
            created_at: now,
            updated_at: now,
        };

        let result = collection
            .insert_one(leave, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let id = result.inserted_id.as_object_id().unwrap();
        let leave = collection
            .find_one(doc! { "_id": id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Failed to retrieve created leave request"))?;

        Ok(LeaveGqlType::from(leave))
    }

    /// Approve or reject a leave request
    async fn update_leave_status(
        &self,
        ctx: &Context<'_>,
        id: String,
        input: UpdateLeaveStatusInput,
    ) -> Result<LeaveGqlType> {
        let db = ctx.data::<Database>()?;
        let leave_collection = db.collection::<Leave>("leaves");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        // Get current leave to check it exists and is pending
        let current_leave = leave_collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Leave request not found"))?;

        if current_leave.status != LeaveStatus::Pending {
            return Err(Error::new("Leave request is not in pending status"));
        }

        let status_str = format!("{:?}", input.status);
        let mut update_doc = doc! {
            "status": &status_str,
            "updated_at": DateTime::now(),
        };

        if let Some(approver) = &input.approved_by {
            update_doc.insert("approved_by", approver);
        }
        if let Some(reason) = &input.rejection_reason {
            update_doc.insert("rejection_reason", reason);
        }

        leave_collection
            .update_one(doc! { "_id": obj_id }, doc! { "$set": update_doc }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        // If approved, update leave balance
        if input.status == LeaveStatus::Approved {
            let balance_collection = db.collection::<LeaveBalance>("leave_balances");

            // Determine which leave type field to update
            let used_field = match current_leave.leave_type {
                crate::models::hr::LeaveTypeEnum::Annual => "annual_used",
                crate::models::hr::LeaveTypeEnum::Sick => "sick_used",
                crate::models::hr::LeaveTypeEnum::Maternity => "maternity_used",
                crate::models::hr::LeaveTypeEnum::Personal => "personal_used",
                crate::models::hr::LeaveTypeEnum::Unpaid => {
                    // No balance tracking for unpaid leave
                    ""
                }
            };

            if !used_field.is_empty() {
                // Increment the used days in the balance
                let _ = balance_collection
                    .update_one(
                        doc! {
                            "staff_id": current_leave.staff_id,
                            "school_id": &current_leave.school_id,
                        },
                        doc! {
                            "$inc": { used_field: current_leave.days },
                            "$set": { "updated_at": DateTime::now() },
                        },
                        None,
                    )
                    .await;
            }
        }

        let leave = leave_collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Leave request not found"))?;

        Ok(LeaveGqlType::from(leave))
    }

    /// Initialize leave balance for a staff member
    async fn init_leave_balance(
        &self,
        ctx: &Context<'_>,
        input: InitLeaveBalanceInput,
    ) -> Result<LeaveBalanceType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<LeaveBalance>("leave_balances");

        let staff_obj_id = ObjectId::parse_str(&input.staff_id)
            .map_err(|_| Error::new("Invalid staff ID format"))?;

        // Check if balance already exists
        let existing = collection
            .find_one(
                doc! {
                    "school_id": &input.school_id,
                    "staff_id": staff_obj_id,
                    "academic_year": &input.academic_year,
                },
                None,
            )
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        if existing.is_some() {
            return Err(Error::new(
                "Leave balance already exists for this staff member and academic year",
            ));
        }

        let now = DateTime::now();
        let balance = LeaveBalance {
            id: None,
            school_id: input.school_id,
            staff_id: staff_obj_id,
            academic_year: input.academic_year,
            annual_total: input.annual_total.unwrap_or(18), // Cambodia standard: 18 days
            annual_used: 0,
            sick_total: input.sick_total.unwrap_or(10),
            sick_used: 0,
            maternity_total: input.maternity_total.unwrap_or(90), // Cambodia Labor Law: 90 days
            maternity_used: 0,
            personal_total: input.personal_total.unwrap_or(5),
            personal_used: 0,
            created_at: now,
            updated_at: now,
        };

        let result = collection
            .insert_one(balance, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let id = result.inserted_id.as_object_id().unwrap();
        let balance = collection
            .find_one(doc! { "_id": id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Failed to retrieve created leave balance"))?;

        Ok(LeaveBalanceType::from(balance))
    }
}
