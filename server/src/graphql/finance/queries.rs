// Finance GraphQL queries
use super::inputs::{InvoiceFilters, PaymentFilters};
use super::types::{FeeType, FinanceSummary, InvoiceType, PaymentType};
use crate::models::finance::{Fee, Invoice, Payment};
use async_graphql::*;
use futures::stream::TryStreamExt;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Database,
};

#[derive(Default)]
pub struct FinanceQuery;

#[Object]
impl FinanceQuery {
    /// Get all fees for a school
    async fn fees(&self, ctx: &Context<'_>, school_id: String) -> Result<Vec<FeeType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Fee>("fees");

        let mut cursor = collection
            .find(doc! { "school_id": &school_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut fees = Vec::new();
        while let Some(fee) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            fees.push(fee.into());
        }

        Ok(fees)
    }

    /// Get a single fee by ID
    async fn fee(&self, ctx: &Context<'_>, id: String) -> Result<Option<FeeType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Fee>("fees");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let fee = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        Ok(fee.map(|f| f.into()))
    }

    /// Get payments for a school with optional filters
    async fn payments(
        &self,
        ctx: &Context<'_>,
        school_id: String,
        filters: Option<PaymentFilters>,
    ) -> Result<Vec<PaymentType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Payment>("payments");

        let mut filter = doc! { "school_id": &school_id };

        if let Some(f) = filters {
            if let Some(student_id) = f.student_id {
                if let Ok(oid) = ObjectId::parse_str(&student_id) {
                    filter.insert("student_id", oid);
                }
            }
            if let Some(status) = f.status {
                filter.insert("status", status);
            }
            if let Some(method) = f.payment_method {
                filter.insert("payment_method", method);
            }
        }

        let mut cursor = collection
            .find(filter, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut payments = Vec::new();
        while let Some(payment) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            payments.push(payment.into());
        }

        Ok(payments)
    }

    /// Get payment history for a specific student
    async fn payments_by_student(
        &self,
        ctx: &Context<'_>,
        student_id: String,
    ) -> Result<Vec<PaymentType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Payment>("payments");

        let obj_id =
            ObjectId::parse_str(&student_id).map_err(|_| Error::new("Invalid student ID"))?;

        let mut cursor = collection
            .find(doc! { "student_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut payments = Vec::new();
        while let Some(payment) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            payments.push(payment.into());
        }

        Ok(payments)
    }

    /// Get invoices for a school with optional filters
    async fn invoices(
        &self,
        ctx: &Context<'_>,
        school_id: String,
        filters: Option<InvoiceFilters>,
    ) -> Result<Vec<InvoiceType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Invoice>("invoices");

        let mut filter = doc! { "school_id": &school_id };

        if let Some(f) = filters {
            if let Some(student_id) = f.student_id {
                if let Ok(oid) = ObjectId::parse_str(&student_id) {
                    filter.insert("student_id", oid);
                }
            }
            if let Some(status) = f.status {
                filter.insert("status", status);
            }
        }

        let mut cursor = collection
            .find(filter, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut invoices = Vec::new();
        while let Some(invoice) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            invoices.push(invoice.into());
        }

        Ok(invoices)
    }

    /// Get finance summary/statistics for dashboard
    async fn finance_summary(
        &self,
        ctx: &Context<'_>,
        school_id: String,
    ) -> Result<FinanceSummary> {
        let db = ctx.data::<Database>()?;
        let payments_collection = db.collection::<Payment>("payments");
        let invoices_collection = db.collection::<Invoice>("invoices");

        // Calculate total collected (completed payments)
        let pipeline = vec![
            doc! { "$match": { "school_id": &school_id, "status": "completed" } },
            doc! { "$group": { "_id": null, "total": { "$sum": "$amount_paid" } } },
        ];

        let mut cursor = payments_collection
            .aggregate(pipeline, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let total_collected = if let Some(result) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            result.get_f64("total").unwrap_or(0.0)
        } else {
            0.0
        };

        // Calculate pending and overdue from invoices
        let mut total_pending = 0.0;
        let mut total_overdue = 0.0;

        let mut invoice_cursor = invoices_collection
            .find(doc! { "school_id": &school_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut student_ids_with_balance = std::collections::HashSet::new();

        while let Some(invoice) = invoice_cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            if invoice.balance > 0.0 {
                student_ids_with_balance.insert(invoice.student_id);
                if invoice.status == "overdue" {
                    total_overdue += invoice.balance;
                } else {
                    total_pending += invoice.balance;
                }
            }
        }

        let students_with_balance = student_ids_with_balance.len() as i32;

        // Get total students count
        let students_collection = db.collection::<mongodb::bson::Document>("students");
        let total_students = students_collection
            .count_documents(doc! { "school_id": &school_id }, None)
            .await
            .unwrap_or(0) as i32;

        let total_expected = total_collected + total_pending + total_overdue;
        let collection_rate = if total_expected > 0.0 {
            (total_collected / total_expected) * 100.0
        } else {
            100.0
        };

        Ok(FinanceSummary {
            total_collected,
            total_pending,
            total_overdue,
            currency: "USD".to_string(),
            students_with_balance,
            total_students,
            collection_rate,
        })
    }
}
