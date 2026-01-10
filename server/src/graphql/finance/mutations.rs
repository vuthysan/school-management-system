// Finance GraphQL mutations
use super::inputs::{CreateFeeInput, CreateInvoiceInput, CreatePaymentInput, UpdateFeeInput};
use super::types::{FeeType, InvoiceType, PaymentType};
use crate::models::finance::{Fee, Invoice, Payment};
use async_graphql::*;
use mongodb::{
    bson::{doc, oid::ObjectId, DateTime},
    Database,
};

#[derive(Default)]
pub struct FinanceMutation;

#[Object]
impl FinanceMutation {
    /// Create a new fee structure
    async fn create_fee(&self, ctx: &Context<'_>, input: CreateFeeInput) -> Result<FeeType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Fee>("fees");

        // Parse due date
        let due_date = DateTime::parse_rfc3339_str(&input.due_date)
            .map_err(|_| Error::new("Invalid due_date format. Use ISO 8601."))?;

        let now = DateTime::now();
        let fee = Fee {
            id: None,
            school_id: input.school_id,
            fee_name: input.fee_name,
            description: input.description,
            amount: input.amount,
            currency: input.currency,
            grade_level: input.grade_level,
            academic_year: input.academic_year,
            due_date,
            is_mandatory: input.is_mandatory.unwrap_or(true),
            created_at: now,
            updated_at: now,
        };

        let result = collection
            .insert_one(&fee, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let id = result.inserted_id.as_object_id().unwrap();
        let created_fee = collection
            .find_one(doc! { "_id": id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Failed to retrieve created fee"))?;

        Ok(created_fee.into())
    }

    /// Update an existing fee
    async fn update_fee(
        &self,
        ctx: &Context<'_>,
        id: String,
        input: UpdateFeeInput,
    ) -> Result<FeeType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Fee>("fees");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let mut update_doc = doc! {};

        if let Some(name) = input.fee_name {
            update_doc.insert("fee_name", name);
        }
        if let Some(desc) = input.description {
            update_doc.insert("description", desc);
        }
        if let Some(amount) = input.amount {
            update_doc.insert("amount", amount);
        }
        if let Some(currency) = input.currency {
            update_doc.insert("currency", currency);
        }
        if let Some(grade) = input.grade_level {
            update_doc.insert("grade_level", grade);
        }
        if let Some(year) = input.academic_year {
            update_doc.insert("academic_year", year);
        }
        if let Some(due_date_str) = input.due_date {
            let due_date = DateTime::parse_rfc3339_str(&due_date_str)
                .map_err(|_| Error::new("Invalid due_date format"))?;
            update_doc.insert("due_date", due_date);
        }
        if let Some(mandatory) = input.is_mandatory {
            update_doc.insert("is_mandatory", mandatory);
        }

        update_doc.insert("updated_at", DateTime::now());

        collection
            .update_one(doc! { "_id": obj_id }, doc! { "$set": update_doc }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let fee = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Fee not found"))?;

        Ok(fee.into())
    }

    /// Delete a fee
    async fn delete_fee(&self, ctx: &Context<'_>, id: String) -> Result<bool> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Fee>("fees");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let result = collection
            .delete_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        Ok(result.deleted_count > 0)
    }

    /// Record a payment
    async fn record_payment(
        &self,
        ctx: &Context<'_>,
        input: CreatePaymentInput,
    ) -> Result<PaymentType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Payment>("payments");

        let student_id =
            ObjectId::parse_str(&input.student_id).map_err(|_| Error::new("Invalid student ID"))?;
        let fee_id =
            ObjectId::parse_str(&input.fee_id).map_err(|_| Error::new("Invalid fee ID"))?;

        // Generate receipt number
        let receipt_number = self.generate_receipt_number(db, &input.school_id).await?;

        // For now, use a placeholder for processed_by (in real app, get from auth context)
        let processed_by = ObjectId::new();

        let now = DateTime::now();
        let payment = Payment {
            id: None,
            school_id: input.school_id,
            student_id,
            fee_id,
            amount_paid: input.amount_paid,
            currency: input.currency,
            payment_method: input.payment_method,
            payment_date: now,
            receipt_number,
            status: "completed".to_string(),
            remarks: input.remarks,
            processed_by,
            created_at: now,
            updated_at: now,
        };

        let result = collection
            .insert_one(&payment, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let id = result.inserted_id.as_object_id().unwrap();
        let created_payment = collection
            .find_one(doc! { "_id": id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Failed to retrieve created payment"))?;

        // Update related invoice if exists
        self.update_invoice_for_payment(db, &created_payment)
            .await?;

        Ok(created_payment.into())
    }

    /// Generate an invoice for a student
    async fn generate_invoice(
        &self,
        ctx: &Context<'_>,
        input: CreateInvoiceInput,
    ) -> Result<InvoiceType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Invoice>("invoices");

        let student_id =
            ObjectId::parse_str(&input.student_id).map_err(|_| Error::new("Invalid student ID"))?;

        let fee_ids: Result<Vec<ObjectId>, _> = input
            .fee_ids
            .iter()
            .map(|id| ObjectId::parse_str(id))
            .collect();
        let fee_ids = fee_ids.map_err(|_| Error::new("Invalid fee ID in list"))?;

        let due_date = DateTime::parse_rfc3339_str(&input.due_date)
            .map_err(|_| Error::new("Invalid due_date format"))?;

        let invoice_number = self.generate_invoice_number(db, &input.school_id).await?;

        let now = DateTime::now();
        let invoice = Invoice {
            id: None,
            school_id: input.school_id,
            invoice_number,
            student_id,
            fee_ids,
            total_amount: input.total_amount,
            amount_paid: 0.0,
            balance: input.total_amount,
            currency: input.currency,
            issue_date: now,
            due_date,
            status: "unpaid".to_string(),
            created_at: now,
            updated_at: now,
        };

        let result = collection
            .insert_one(&invoice, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let id = result.inserted_id.as_object_id().unwrap();
        let created_invoice = collection
            .find_one(doc! { "_id": id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Failed to retrieve created invoice"))?;

        Ok(created_invoice.into())
    }

    /// Update invoice status
    async fn update_invoice_status(
        &self,
        ctx: &Context<'_>,
        id: String,
        status: String,
    ) -> Result<InvoiceType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Invoice>("invoices");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        collection
            .update_one(
                doc! { "_id": obj_id },
                doc! { "$set": { "status": &status, "updated_at": DateTime::now() } },
                None,
            )
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let invoice = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Invoice not found"))?;

        Ok(invoice.into())
    }
}

impl FinanceMutation {
    /// Generate a unique receipt number
    async fn generate_receipt_number(&self, db: &Database, school_id: &str) -> Result<String> {
        let collection = db.collection::<Payment>("payments");

        let current_year = chrono::Utc::now().format("%y").to_string();
        let prefix = format!("RCP{}", current_year);

        let filter = doc! {
            "school_id": school_id,
            "receipt_number": doc! { "$regex": format!("^{}\\d{{6}}$", prefix) }
        };
        let sort = doc! { "receipt_number": -1 };

        let mut options = mongodb::options::FindOneOptions::default();
        options.sort = Some(sort);

        let latest = collection
            .find_one(filter, options)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let next_number = match latest {
            Some(p) => {
                let current_num = &p.receipt_number[5..];
                current_num.parse::<u64>().unwrap_or(0) + 1
            }
            None => 1,
        };

        Ok(format!("{}{:06}", prefix, next_number))
    }

    /// Generate a unique invoice number
    async fn generate_invoice_number(&self, db: &Database, school_id: &str) -> Result<String> {
        let collection = db.collection::<Invoice>("invoices");

        let current_year = chrono::Utc::now().format("%y").to_string();
        let prefix = format!("INV{}", current_year);

        let filter = doc! {
            "school_id": school_id,
            "invoice_number": doc! { "$regex": format!("^{}\\d{{6}}$", prefix) }
        };
        let sort = doc! { "invoice_number": -1 };

        let mut options = mongodb::options::FindOneOptions::default();
        options.sort = Some(sort);

        let latest = collection
            .find_one(filter, options)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let next_number = match latest {
            Some(i) => {
                let current_num = &i.invoice_number[5..];
                current_num.parse::<u64>().unwrap_or(0) + 1
            }
            None => 1,
        };

        Ok(format!("{}{:06}", prefix, next_number))
    }

    /// Update invoice when a payment is made
    async fn update_invoice_for_payment(&self, db: &Database, payment: &Payment) -> Result<()> {
        let collection = db.collection::<Invoice>("invoices");

        // Find invoice that contains this fee for this student
        let filter = doc! {
            "student_id": payment.student_id,
            "fee_ids": payment.fee_id,
        };

        if let Some(mut invoice) = collection
            .find_one(filter.clone(), None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            invoice.amount_paid += payment.amount_paid;
            invoice.balance = invoice.total_amount - invoice.amount_paid;

            let new_status = if invoice.balance <= 0.0 {
                "paid"
            } else if invoice.amount_paid > 0.0 {
                "partial"
            } else {
                "unpaid"
            };

            collection
                .update_one(
                    filter,
                    doc! {
                        "$set": {
                            "amount_paid": invoice.amount_paid,
                            "balance": invoice.balance,
                            "status": new_status,
                            "updated_at": DateTime::now()
                        }
                    },
                    None,
                )
                .await
                .map_err(|e| Error::new(e.to_string()))?;
        }

        Ok(())
    }
}
