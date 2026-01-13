// Attendance GraphQL mutations
use super::inputs::{AttendanceInput, AttendanceRecordInput};
use super::types::{AttendanceType, BulkAttendanceResult};
use crate::models;
use async_graphql::*;
use chrono::{NaiveDate, TimeZone, Utc};
use futures::stream::TryStreamExt;
use mongodb::{
    bson::{doc, oid::ObjectId, DateTime},
    options::UpdateOptions,
    Database,
};

#[derive(Default)]
pub struct AttendanceMutation;

#[Object]
impl AttendanceMutation {
    /// Create a single attendance record
    async fn create_attendance(
        &self,
        ctx: &Context<'_>,
        input: AttendanceInput,
    ) -> Result<AttendanceType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::attendance::Attendance>("attendances");
        let mut attendance: models::attendance::Attendance = input.into();

        let now = DateTime::now();
        attendance.created_at = now;
        attendance.updated_at = now;

        let result = collection
            .insert_one(attendance, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let id = result.inserted_id.as_object_id().unwrap();
        let attendance = collection
            .find_one(doc! { "_id": id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Failed to retrieve created attendance"))?;

        Ok(attendance.into())
    }

    /// Mark attendance for multiple students at once (upsert)
    async fn mark_bulk_attendance(
        &self,
        ctx: &Context<'_>,
        class_id: String,
        date: String,
        marked_by: String,
        records: Vec<AttendanceRecordInput>,
    ) -> Result<BulkAttendanceResult> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::attendance::Attendance>("attendances");

        let class_oid =
            ObjectId::parse_str(&class_id).map_err(|_| Error::new("Invalid class ID format"))?;
        let marked_by_oid = ObjectId::parse_str(&marked_by)
            .map_err(|_| Error::new("Invalid marked_by ID format"))?;

        // Parse date
        let parsed_date = NaiveDate::parse_from_str(&date, "%Y-%m-%d")
            .map_err(|_| Error::new("Invalid date format. Use YYYY-MM-DD"))?;
        let date_dt = Utc.from_utc_datetime(&parsed_date.and_hms_opt(12, 0, 0).unwrap());
        let attendance_date = DateTime::from_millis(date_dt.timestamp_millis());

        let now = DateTime::now();
        let mut count = 0;

        for record in records {
            let student_oid = ObjectId::parse_str(&record.student_id)
                .map_err(|_| Error::new(format!("Invalid student ID: {}", record.student_id)))?;

            // Upsert: update if exists, insert if not
            let filter = doc! {
                "student_id": student_oid,
                "class_id": class_oid,
                "date": attendance_date
            };

            let update = doc! {
                "$set": {
                    "status": &record.status,
                    "remarks": record.remarks.as_deref(),
                    "marked_by": marked_by_oid,
                    "updated_at": now
                },
                "$setOnInsert": {
                    "student_id": student_oid,
                    "class_id": class_oid,
                    "date": attendance_date,
                    "created_at": now
                }
            };

            let options = UpdateOptions::builder().upsert(true).build();

            collection
                .update_one(filter, update, options)
                .await
                .map_err(|e| Error::new(e.to_string()))?;

            count += 1;
        }

        Ok(BulkAttendanceResult {
            success: true,
            count,
        })
    }

    /// Update an existing attendance record
    async fn update_attendance(
        &self,
        ctx: &Context<'_>,
        id: String,
        status: String,
        remarks: Option<String>,
    ) -> Result<AttendanceType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::attendance::Attendance>("attendances");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let now = DateTime::now();

        let update = doc! {
            "$set": {
                "status": &status,
                "remarks": remarks.as_deref(),
                "updated_at": now
            }
        };

        collection
            .update_one(doc! { "_id": obj_id }, update, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let attendance = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Attendance record not found"))?;

        Ok(attendance.into())
    }

    /// Delete an attendance record
    async fn delete_attendance(&self, ctx: &Context<'_>, id: String) -> Result<bool> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::attendance::Attendance>("attendances");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let result = collection
            .delete_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        Ok(result.deleted_count > 0)
    }

    /// Send absence notification to parents for students marked absent
    async fn send_absence_notifications(
        &self,
        ctx: &Context<'_>,
        class_id: String,
        date: String,
    ) -> Result<AbsenceNotificationResult> {
        let db = ctx.data::<Database>()?;
        let attendance_collection = db.collection::<models::attendance::Attendance>("attendances");
        let student_collection = db.collection::<models::student::Student>("students");
        let notification_collection =
            db.collection::<models::notification::Notification>("notifications");

        let class_oid =
            ObjectId::parse_str(&class_id).map_err(|_| Error::new("Invalid class ID format"))?;

        // Parse date
        let parsed_date = NaiveDate::parse_from_str(&date, "%Y-%m-%d")
            .map_err(|_| Error::new("Invalid date format. Use YYYY-MM-DD"))?;
        let date_dt = Utc.from_utc_datetime(&parsed_date.and_hms_opt(12, 0, 0).unwrap());
        let attendance_date = DateTime::from_millis(date_dt.timestamp_millis());

        // Find all absent students for this class and date
        let filter = doc! {
            "class_id": class_oid,
            "date": attendance_date,
            "status": "Absent"
        };

        let mut cursor = attendance_collection
            .find(filter, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut notifications_sent = 0;
        let mut notifications_failed = 0;

        while let Some(attendance) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            // Get the student's guardian info
            let student_oid = attendance.student_id;
            let student = match student_collection
                .find_one(doc! { "_id": student_oid }, None)
                .await
            {
                Ok(Some(s)) => s,
                _ => {
                    notifications_failed += 1;
                    continue;
                }
            };

            // Get primary guardian contact info
            let guardian = student
                .guardians
                .get(student.primary_guardian_index as usize);
            let (parent_phone, parent_email) = match guardian {
                Some(g) => (Some(g.phone.clone()), g.email.clone()),
                None => (None, None),
            };

            if parent_phone.is_none() && parent_email.is_none() {
                notifications_failed += 1;
                continue;
            }

            // Create notification
            let student_name = format!("{} {}", student.first_name_km, student.last_name_km);
            let notification = models::notification::Notification::new_absence_notification(
                student.school_id.clone(),
                student_oid.to_hex(),
                student_name,
                date.clone(),
                parent_phone,
                parent_email,
            );

            if notification_collection
                .insert_one(notification, None)
                .await
                .is_ok()
            {
                notifications_sent += 1;
            } else {
                notifications_failed += 1;
            }
        }

        Ok(AbsenceNotificationResult {
            success: notifications_failed == 0,
            notifications_sent,
            notifications_failed,
        })
    }
}

/// Result of sending absence notifications
#[derive(SimpleObject)]
pub struct AbsenceNotificationResult {
    pub success: bool,
    pub notifications_sent: i32,
    pub notifications_failed: i32,
}
