// Attendance GraphQL queries
use super::types::{AttendanceSummaryType, AttendanceType};
use crate::models;
use async_graphql::*;
use chrono::{NaiveDate, TimeZone, Utc};
use futures::stream::TryStreamExt;
use mongodb::{
    bson::{doc, oid::ObjectId, DateTime},
    Database,
};

#[derive(Default)]
pub struct AttendanceQuery;

#[Object]
impl AttendanceQuery {
    /// Get all attendance records
    async fn attendances(&self, ctx: &Context<'_>) -> Result<Vec<AttendanceType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::attendance::Attendance>("attendances");

        let mut cursor = collection
            .find(None, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut attendances = Vec::new();
        while let Some(attendance) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            attendances.push(attendance);
        }

        Ok(attendances.into_iter().map(|a| a.into()).collect())
    }

    /// Get single attendance by ID
    async fn attendance(&self, ctx: &Context<'_>, id: String) -> Result<Option<AttendanceType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::attendance::Attendance>("attendances");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let attendance = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        Ok(attendance.map(|a| a.into()))
    }

    /// Get attendance records for a specific class on a specific date
    async fn attendance_by_class(
        &self,
        ctx: &Context<'_>,
        class_id: String,
        date: String,
    ) -> Result<Vec<AttendanceType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::attendance::Attendance>("attendances");

        let class_oid =
            ObjectId::parse_str(&class_id).map_err(|_| Error::new("Invalid class ID format"))?;

        // Parse date string to get start and end of day
        let parsed_date = NaiveDate::parse_from_str(&date, "%Y-%m-%d")
            .map_err(|_| Error::new("Invalid date format. Use YYYY-MM-DD"))?;

        let start_of_day = Utc.from_utc_datetime(&parsed_date.and_hms_opt(0, 0, 0).unwrap());
        let end_of_day = Utc.from_utc_datetime(&parsed_date.and_hms_opt(23, 59, 59).unwrap());

        let filter = doc! {
            "class_id": class_oid,
            "date": {
                "$gte": DateTime::from_millis(start_of_day.timestamp_millis()),
                "$lte": DateTime::from_millis(end_of_day.timestamp_millis())
            }
        };

        let mut cursor = collection
            .find(filter, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut attendances = Vec::new();
        while let Some(attendance) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            attendances.push(attendance);
        }

        Ok(attendances.into_iter().map(|a| a.into()).collect())
    }

    /// Get attendance history for a specific student
    async fn attendance_by_student(
        &self,
        ctx: &Context<'_>,
        student_id: String,
        start_date: Option<String>,
        end_date: Option<String>,
    ) -> Result<Vec<AttendanceType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::attendance::Attendance>("attendances");

        let student_oid = ObjectId::parse_str(&student_id)
            .map_err(|_| Error::new("Invalid student ID format"))?;

        let mut filter = doc! { "student_id": student_oid };

        // Add date range filter if provided
        if let Some(start) = start_date {
            if let Ok(parsed) = NaiveDate::parse_from_str(&start, "%Y-%m-%d") {
                let start_dt = Utc.from_utc_datetime(&parsed.and_hms_opt(0, 0, 0).unwrap());
                filter.insert(
                    "date",
                    doc! { "$gte": DateTime::from_millis(start_dt.timestamp_millis()) },
                );
            }
        }

        if let Some(end) = end_date {
            if let Ok(parsed) = NaiveDate::parse_from_str(&end, "%Y-%m-%d") {
                let end_dt = Utc.from_utc_datetime(&parsed.and_hms_opt(23, 59, 59).unwrap());
                if let Some(date_filter) = filter.get_mut("date") {
                    if let Some(doc) = date_filter.as_document_mut() {
                        doc.insert("$lte", DateTime::from_millis(end_dt.timestamp_millis()));
                    }
                } else {
                    filter.insert(
                        "date",
                        doc! { "$lte": DateTime::from_millis(end_dt.timestamp_millis()) },
                    );
                }
            }
        }

        let mut cursor = collection
            .find(filter, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut attendances = Vec::new();
        while let Some(attendance) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            attendances.push(attendance);
        }

        Ok(attendances.into_iter().map(|a| a.into()).collect())
    }

    /// Get attendance summary for a class in a specific month
    async fn attendance_summary_by_class(
        &self,
        ctx: &Context<'_>,
        class_id: String,
        month: i32,
        year: i32,
    ) -> Result<AttendanceSummaryType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<models::attendance::Attendance>("attendances");

        let class_oid =
            ObjectId::parse_str(&class_id).map_err(|_| Error::new("Invalid class ID format"))?;

        // Calculate start and end of month
        let start_date = NaiveDate::from_ymd_opt(year, month as u32, 1)
            .ok_or_else(|| Error::new("Invalid month/year"))?;
        let end_date = if month == 12 {
            NaiveDate::from_ymd_opt(year + 1, 1, 1).unwrap()
        } else {
            NaiveDate::from_ymd_opt(year, (month + 1) as u32, 1).unwrap()
        };

        let start_dt = Utc.from_utc_datetime(&start_date.and_hms_opt(0, 0, 0).unwrap());
        let end_dt = Utc.from_utc_datetime(&end_date.and_hms_opt(0, 0, 0).unwrap());

        let filter = doc! {
            "class_id": class_oid,
            "date": {
                "$gte": DateTime::from_millis(start_dt.timestamp_millis()),
                "$lt": DateTime::from_millis(end_dt.timestamp_millis())
            }
        };

        let mut cursor = collection
            .find(filter, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut present_count = 0;
        let mut absent_count = 0;
        let mut late_count = 0;
        let mut excused_count = 0;

        while let Some(attendance) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            match attendance.status.to_lowercase().as_str() {
                "present" => present_count += 1,
                "absent" => absent_count += 1,
                "late" => late_count += 1,
                "excused" => excused_count += 1,
                _ => {}
            }
        }

        let total = present_count + absent_count + late_count + excused_count;
        let attendance_rate = if total > 0 {
            ((present_count + late_count) as f64 / total as f64) * 100.0
        } else {
            0.0
        };

        // Count unique days with attendance records
        let total_days = (end_date - start_date).num_days() as i32;

        Ok(AttendanceSummaryType {
            total_days,
            present_count,
            absent_count,
            late_count,
            excused_count,
            attendance_rate,
        })
    }
}
