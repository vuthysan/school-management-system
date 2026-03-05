use super::types::{LeaveBalanceType, LeaveGqlType, PaginatedPayrollResult, PayrollType, StaffType};
use crate::models::hr::{Leave, LeaveBalance, Payroll, Staff};
use async_graphql::*;
use futures::stream::TryStreamExt;
use mongodb::{
    bson::{doc, oid::ObjectId},
    options::FindOptions,
    Database,
};

#[derive(Default)]
pub struct HRQuery;

#[Object]
impl HRQuery {
    // ========================================================================
    // STAFF QUERIES
    // ========================================================================

    /// Get all staff for a specific school
    async fn all_staff(&self, ctx: &Context<'_>, school_id: String) -> Result<Vec<StaffType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Staff>("staff");

        let mut cursor = collection
            .find(doc! { "school_id": &school_id }, None)
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

    // ========================================================================
    // PAYROLL QUERIES
    // ========================================================================

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

    /// Get paginated payroll history for a school/month
    async fn payroll_history(
        &self,
        ctx: &Context<'_>,
        school_id: String,
        month: Option<String>,
        page: Option<i32>,
        page_size: Option<i32>,
    ) -> Result<PaginatedPayrollResult> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Payroll>("payroll");

        let page = page.unwrap_or(1).max(1);
        let page_size = page_size.unwrap_or(20).min(100);
        let skip = ((page - 1) * page_size) as u64;

        let mut filter = doc! { "school_id": &school_id };
        if let Some(m) = &month {
            filter.insert("month", m);
        }

        let total = collection
            .count_documents(filter.clone(), None)
            .await
            .map_err(|e| Error::new(e.to_string()))? as i64;

        let options = FindOptions::builder()
            .skip(Some(skip))
            .limit(Some(page_size as i64))
            .sort(doc! { "month": -1, "created_at": -1 })
            .build();

        let mut cursor = collection
            .find(filter, Some(options))
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut items = Vec::new();
        while let Some(payroll) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            items.push(PayrollType::from(payroll));
        }

        let total_pages = ((total as f64) / (page_size as f64)).ceil() as i32;

        Ok(PaginatedPayrollResult {
            items,
            total,
            page,
            total_pages,
        })
    }

    // ========================================================================
    // LEAVE QUERIES
    // ========================================================================

    /// Get leave requests for a staff member
    async fn staff_leaves(
        &self,
        ctx: &Context<'_>,
        school_id: String,
        staff_id: Option<String>,
        status: Option<String>,
    ) -> Result<Vec<LeaveGqlType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Leave>("leaves");

        let mut filter = doc! { "school_id": &school_id };

        if let Some(sid) = &staff_id {
            let obj_id =
                ObjectId::parse_str(sid).map_err(|_| Error::new("Invalid staff ID format"))?;
            filter.insert("staff_id", obj_id);
        }

        if let Some(s) = &status {
            filter.insert("status", s);
        }

        let options = FindOptions::builder()
            .sort(doc! { "created_at": -1 })
            .build();

        let mut cursor = collection
            .find(filter, Some(options))
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut leaves = Vec::new();
        while let Some(leave) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            leaves.push(LeaveGqlType::from(leave));
        }

        Ok(leaves)
    }

    /// Get leave balance for a staff member in an academic year
    async fn leave_balance(
        &self,
        ctx: &Context<'_>,
        school_id: String,
        staff_id: String,
        academic_year: String,
    ) -> Result<Option<LeaveBalanceType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<LeaveBalance>("leave_balances");

        let obj_id =
            ObjectId::parse_str(&staff_id).map_err(|_| Error::new("Invalid staff ID format"))?;

        let balance = collection
            .find_one(
                doc! {
                    "school_id": &school_id,
                    "staff_id": obj_id,
                    "academic_year": &academic_year,
                },
                None,
            )
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        Ok(balance.map(LeaveBalanceType::from))
    }

    /// Get all leave balances for a school in an academic year
    async fn all_leave_balances(
        &self,
        ctx: &Context<'_>,
        school_id: String,
        academic_year: String,
    ) -> Result<Vec<LeaveBalanceType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<LeaveBalance>("leave_balances");

        let mut cursor = collection
            .find(
                doc! {
                    "school_id": &school_id,
                    "academic_year": &academic_year,
                },
                None,
            )
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut balances = Vec::new();
        while let Some(balance) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            balances.push(LeaveBalanceType::from(balance));
        }

        Ok(balances)
    }
}
