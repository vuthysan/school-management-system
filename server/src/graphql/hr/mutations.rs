use super::inputs::{CreatePayrollInput, CreateStaffInput, UpdateStaffInput};
use super::types::{PayrollType, StaffType};
use crate::models::hr::{Payroll, Staff};
use async_graphql::*;
use mongodb::{
    bson::{doc, oid::ObjectId, DateTime},
    Database,
};

#[derive(Default)]
pub struct HRMutation;

#[Object]
impl HRMutation {
    /// Create a new staff member
    async fn create_staff(&self, ctx: &Context<'_>, input: CreateStaffInput) -> Result<StaffType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Staff>("staff");

        let now = DateTime::now();
        let staff = Staff {
            id: None,
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

    /// Create a payroll record for a staff member
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
            staff_id: staff_obj_id,
            month: input.month,
            base_salary: staff.salary,
            bonuses: input.bonuses,
            deductions: input.deductions,
            net_salary,
            currency: staff.currency,
            payment_date: now,
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
}
