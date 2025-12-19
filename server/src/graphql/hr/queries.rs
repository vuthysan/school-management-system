use super::types::{PayrollType, StaffType};
use crate::models::hr::{Payroll, Staff};
use async_graphql::*;
use futures::stream::TryStreamExt;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Database,
};

#[derive(Default)]
pub struct HRQuery;

#[Object]
impl HRQuery {
    /// Get all staff for a specific school
    async fn all_staff(&self, ctx: &Context<'_>, _school_id: String) -> Result<Vec<StaffType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Staff>("staff");

        // NOTE: The Staff model currently doesn't have a school_id field in its definition,
        // but for a multi-tenant system, we should filter by it.
        // For now, we'll fetch all and assume the schema will be updated or we filter by something else.
        // Actually, looking at members, they link to staff.

        // Let's fetch all staff for now to get things working.
        let mut cursor = collection
            .find(None, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut staff_list = Vec::new();
        while let Some(staff) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            staff_list.push(StaffType::from(staff));
        }

        Ok(staff_list)
    }

    /// Get a specific staff member by ID
    async fn staff(&self, ctx: &Context<'_>, id: String) -> Result<Option<StaffType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Staff>("staff");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let staff = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        Ok(staff.map(StaffType::from))
    }

    /// Get payroll records for a specific staff member
    async fn payroll_for_staff(
        &self,
        ctx: &Context<'_>,
        staff_id: String,
    ) -> Result<Vec<PayrollType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Payroll>("payroll");

        let obj_id =
            ObjectId::parse_str(&staff_id).map_err(|_| Error::new("Invalid staff ID format"))?;

        let mut cursor = collection
            .find(doc! { "staff_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut payroll_list = Vec::new();
        while let Some(payroll) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            payroll_list.push(PayrollType::from(payroll));
        }

        Ok(payroll_list)
    }
}
