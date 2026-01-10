// Academic Year GraphQL mutations
use crate::models::academic_year::{
    AcademicYear, AcademicYearStatus, CreateAcademicYearInput, UpdateAcademicYearInput,
};
use async_graphql::*;
use mongodb::{
    bson::{doc, oid::ObjectId, DateTime},
    Database,
};

#[derive(Default)]
pub struct AcademicYearMutation;

#[Object]
impl AcademicYearMutation {
    /// Create a new academic year
    async fn create_academic_year(
        &self,
        ctx: &Context<'_>,
        input: CreateAcademicYearInput,
    ) -> Result<AcademicYear> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<AcademicYear>("academic_years");

        let school_id = ObjectId::parse_str(&input.school_id)
            .map_err(|_| Error::new("Invalid school ID format"))?;

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

        let mut academic_year = AcademicYear::new(school_id, input.name, start_date, end_date);
        academic_year.label = input.label;
        academic_year.is_current = input.is_current.unwrap_or(false);
        if let Some(status) = input.status {
            academic_year.status = status;
        }
        academic_year.description = input.description;

        let result = collection
            .insert_one(&academic_year, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        academic_year.id = result.inserted_id.as_object_id();

        Ok(academic_year)
    }

    /// Update an academic year
    async fn update_academic_year(
        &self,
        ctx: &Context<'_>,
        id: String,
        input: UpdateAcademicYearInput,
    ) -> Result<AcademicYear> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<AcademicYear>("academic_years");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        // Build update document
        let mut update_doc = doc! {};

        if let Some(name) = input.name {
            update_doc.insert("name", name);
        }
        if let Some(label) = input.label {
            update_doc.insert("label", label);
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
            // If setting as current, unset others first
            if is_current {
                // Get the school_id first
                let existing = collection
                    .find_one(doc! { "_id": obj_id }, None)
                    .await
                    .map_err(|e| Error::new(e.to_string()))?
                    .ok_or_else(|| Error::new("Academic year not found"))?;

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
        if let Some(status) = input.status {
            let status_str = match status {
                AcademicYearStatus::Planning => "Planning",
                AcademicYearStatus::Active => "Active",
                AcademicYearStatus::Completed => "Completed",
                AcademicYearStatus::Archived => "Archived",
            };
            update_doc.insert("status", status_str);
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
            .ok_or_else(|| Error::new("Academic year not found after update"))?;

        Ok(updated)
    }

    /// Delete an academic year (soft delete)
    async fn delete_academic_year(&self, ctx: &Context<'_>, id: String) -> Result<bool> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<AcademicYear>("academic_years");

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

    /// Set an academic year as current
    async fn set_current_academic_year(
        &self,
        ctx: &Context<'_>,
        id: String,
    ) -> Result<AcademicYear> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<AcademicYear>("academic_years");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        // Get the academic year to find school_id
        let academic_year = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Academic year not found"))?;

        // Unset current from all academic years of this school
        collection
            .update_many(
                doc! { "school_id": academic_year.school_id, "is_current": true },
                doc! { "$set": { "is_current": false } },
                None,
            )
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        // Set this one as current
        collection
            .update_one(
                doc! { "_id": obj_id },
                doc! { "$set": { "is_current": true, "status": "Active" } },
                None,
            )
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let updated = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Academic year not found after update"))?;

        Ok(updated)
    }
}
