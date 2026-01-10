// Term GraphQL mutations
use crate::models::term::{CreateTermInput, Term, TermType, UpdateTermInput};
use async_graphql::*;
use mongodb::{
    bson::{doc, oid::ObjectId, DateTime},
    Database,
};

#[derive(Default)]
pub struct TermMutation;

#[Object]
impl TermMutation {
    /// Create a new term
    async fn create_term(&self, ctx: &Context<'_>, input: CreateTermInput) -> Result<Term> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Term>("terms");

        let school_id = ObjectId::parse_str(&input.school_id)
            .map_err(|_| Error::new("Invalid school ID format"))?;
        let academic_year_id = ObjectId::parse_str(&input.academic_year_id)
            .map_err(|_| Error::new("Invalid academic year ID format"))?;

        let start_date = DateTime::parse_rfc3339_str(&input.start_date)
            .map_err(|_| Error::new("Invalid start_date format. Use ISO 8601."))?;
        let end_date = DateTime::parse_rfc3339_str(&input.end_date)
            .map_err(|_| Error::new("Invalid end_date format. Use ISO 8601."))?;

        // If this is set as current, unset all others first
        if input.is_current.unwrap_or(false) {
            collection
                .update_many(
                    doc! { "school_id": school_id, "is_current": true },
                    doc! { "$set": { "is_current": false } },
                    None,
                )
                .await
                .map_err(|e| Error::new(e.to_string()))?;
        }

        let mut term = Term::new(
            school_id,
            academic_year_id,
            input.name,
            input.term_number,
            start_date,
            end_date,
        );
        term.term_type = input.term_type.unwrap_or_default();
        term.is_current = input.is_current.unwrap_or(false);
        term.description = input.description;

        let result = collection
            .insert_one(&term, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        term.id = result.inserted_id.as_object_id();

        Ok(term)
    }

    /// Update a term
    async fn update_term(
        &self,
        ctx: &Context<'_>,
        id: String,
        input: UpdateTermInput,
    ) -> Result<Term> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Term>("terms");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let mut update_doc = doc! {};

        if let Some(name) = input.name {
            update_doc.insert("name", name);
        }
        if let Some(term_number) = input.term_number {
            update_doc.insert("term_number", term_number);
        }
        if let Some(term_type) = input.term_type {
            let type_str = match term_type {
                TermType::Semester => "Semester",
                TermType::Trimester => "Trimester",
                TermType::Quarter => "Quarter",
                TermType::Custom => "Custom",
            };
            update_doc.insert("term_type", type_str);
        }
        if let Some(start_date) = input.start_date {
            let dt = DateTime::parse_rfc3339_str(&start_date)
                .map_err(|_| Error::new("Invalid start_date format"))?;
            update_doc.insert("start_date", dt);
        }
        if let Some(end_date) = input.end_date {
            let dt = DateTime::parse_rfc3339_str(&end_date)
                .map_err(|_| Error::new("Invalid end_date format"))?;
            update_doc.insert("end_date", dt);
        }
        if let Some(is_current) = input.is_current {
            if is_current {
                let existing = collection
                    .find_one(doc! { "_id": obj_id }, None)
                    .await
                    .map_err(|e| Error::new(e.to_string()))?
                    .ok_or_else(|| Error::new("Term not found"))?;

                collection
                    .update_many(
                        doc! { "school_id": existing.school_id, "is_current": true },
                        doc! { "$set": { "is_current": false } },
                        None,
                    )
                    .await
                    .map_err(|e| Error::new(e.to_string()))?;
            }
            update_doc.insert("is_current", is_current);
        }
        if let Some(description) = input.description {
            update_doc.insert("description", description);
        }

        update_doc.insert("audit.updated_at", DateTime::now());

        collection
            .update_one(doc! { "_id": obj_id }, doc! { "$set": update_doc }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let updated = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Term not found after update"))?;

        Ok(updated)
    }

    /// Delete a term (soft delete)
    async fn delete_term(&self, ctx: &Context<'_>, id: String) -> Result<bool> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Term>("terms");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let update = doc! {
            "$set": {
                "soft_delete.is_deleted": true,
                "soft_delete.deleted_at": DateTime::now()
            }
        };

        let result = collection
            .update_one(doc! { "_id": obj_id }, update, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        Ok(result.modified_count > 0)
    }
}
