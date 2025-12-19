// Student GraphQL mutations
use super::inputs::{CreateStudentInput, UpdateStudentInput};
use super::types::StudentType;
use crate::models;
use async_graphql::*;
use mongodb::{
    bson::{doc, oid::ObjectId, DateTime},
    Database,
};

#[derive(Default)]
pub struct StudentMutation;

#[Object]
impl StudentMutation {
    async fn create_student(
        &self,
        ctx: &Context<'_>,
        input: CreateStudentInput,
    ) -> Result<StudentType> {
        let db = ctx.data::<Database>()?;
        let student_collection = db.collection::<models::student::Student>("students");
        let class_collection = db.collection::<models::class::Class>("classes");

        let mut student = input.into_student();

        // Auto-generate student ID if not provided
        if student.student_id.trim().is_empty() {
            student.student_id = self
                .generate_next_student_id(db, &student.school_id)
                .await?;
        }

        // Store class ID before inserting (for syncing)
        let class_id = student.current_class_id.clone();

        // Insert student into database
        let result = student_collection
            .insert_one(student, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        // Retrieve the created student
        let id = result.inserted_id.as_object_id().unwrap();
        let student = student_collection
            .find_one(doc! { "_id": id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Failed to retrieve created student"))?;

        // Sync class student_ids if class is assigned
        if let Some(ref cid) = class_id {
            let _ = class_collection
                .update_one(
                    doc! { "_id": cid },
                    doc! { "$addToSet": { "student_ids": id.to_hex() } },
                    None,
                )
                .await;
        }

        Ok(student.into())
    }

    async fn update_student(
        &self,
        ctx: &Context<'_>,
        id: String,
        input: UpdateStudentInput,
    ) -> Result<StudentType> {
        let db = ctx.data::<Database>()?;
        let student_collection = db.collection::<models::student::Student>("students");
        let class_collection = db.collection::<models::class::Class>("classes");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        // Get the current student to check for class change
        let current_student = student_collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Student not found"))?;

        let old_class_id = current_student.current_class_id.clone();
        let new_class_id = input.current_class_id.clone();

        let mut update_doc = doc! {};

        if let Some(fe) = input.first_name_en {
            update_doc.insert("first_name_en", fe);
        }
        if let Some(le) = input.last_name_en {
            update_doc.insert("last_name_en", le);
        }
        if let Some(fk) = input.first_name_km {
            update_doc.insert("first_name_km", fk);
        }
        if let Some(lk) = input.last_name_km {
            update_doc.insert("last_name_km", lk);
        }
        if let Some(gl) = input.grade_level {
            update_doc.insert("grade_level", gl);
        }
        if let Some(ref cc) = new_class_id {
            update_doc.insert("current_class_id", cc);
        }
        if let Some(s) = input.status {
            update_doc.insert(
                "status",
                mongodb::bson::to_bson(&s).map_err(|e| Error::new(e.to_string()))?,
            );
        }

        update_doc.insert("audit.updated_at", DateTime::now());

        // Update the student document
        student_collection
            .update_one(doc! { "_id": obj_id }, doc! { "$set": update_doc }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        // Sync class student_ids if class is changing
        if new_class_id != old_class_id {
            let student_id_str = id.clone();

            // Remove from old class if exists
            if let Some(ref old_cid) = old_class_id {
                let _ = class_collection
                    .update_one(
                        doc! { "_id": old_cid },
                        doc! { "$pull": { "student_ids": &student_id_str } },
                        None,
                    )
                    .await;
            }

            // Add to new class if exists
            if let Some(ref new_cid) = new_class_id {
                let _ = class_collection
                    .update_one(
                        doc! { "_id": new_cid },
                        doc! { "$addToSet": { "student_ids": &student_id_str } },
                        None,
                    )
                    .await;
            }
        }

        let student = student_collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Student not found"))?;

        Ok(student.into())
    }

    async fn delete_student(&self, ctx: &Context<'_>, id: String) -> Result<bool> {
        let db = ctx.data::<Database>()?;
        let student_collection = db.collection::<models::student::Student>("students");
        let class_collection = db.collection::<models::class::Class>("classes");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        // Get the student first to check for class enrollment
        if let Some(student) = student_collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            // Remove from class if enrolled
            if let Some(ref class_id) = student.current_class_id {
                let _ = class_collection
                    .update_one(
                        doc! { "_id": class_id },
                        doc! { "$pull": { "student_ids": &id } },
                        None,
                    )
                    .await;
            }
        }

        let result = student_collection
            .delete_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        Ok(result.deleted_count > 0)
    }
}

impl StudentMutation {
    async fn generate_next_student_id(&self, db: &Database, school_id: &str) -> Result<String> {
        let collection = db.collection::<models::student::Student>("students");

        // Get current year (YY)
        let current_year = chrono::Utc::now().format("%y").to_string();
        let prefix = format!("STU{}", current_year);

        // Find the student with the highest student_id for this school and current year
        // IDs are in format STU250000001
        let filter = doc! {
            "school_id": school_id,
            "student_id": doc! { "$regex": format!("^{}\\d{{7}}$", prefix) }
        };
        let sort = doc! { "student_id": -1 };

        let mut options = mongodb::options::FindOneOptions::default();
        options.sort = Some(sort);

        let latest_student = collection
            .find_one(filter, options)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let next_number = match latest_student {
            Some(s) => {
                let current_id = s.student_id;
                // STUYYXXXXXXX -> numeric part is XXXXXXX (last 7 digits)
                let numeric_part = &current_id[5..];
                numeric_part.parse::<u64>().unwrap_or(0) + 1
            }
            None => 1,
        };

        Ok(format!("{}{:07}", prefix, next_number))
    }
}
