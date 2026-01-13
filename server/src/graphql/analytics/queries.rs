use super::types::*;
use crate::models::{attendance::Attendance, class::Class, grade::Grade, subject::Subject};
use async_graphql::*;
use futures::StreamExt;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Database,
};

#[derive(Default)]
pub struct AnalyticsQuery;

#[Object]
impl AnalyticsQuery {
    /// Get performance analytics for a school
    async fn get_performance_analytics(
        &self,
        ctx: &Context<'_>,
        _school_id: String,
        academic_year: String,
        semester: String,
    ) -> Result<PerformanceAnalytics> {
        let db = ctx.data::<Database>()?;

        // 1. Average Score by Class
        let grade_collection = db.collection::<Grade>("grades");
        let class_collection = db.collection::<Class>("classes");

        let pipeline = vec![
            doc! {
                "$match": {
                    "academic_year": &academic_year,
                    "semester": &semester,
                }
            },
            doc! {
                "$group": {
                    "_id": "$class_id",
                    "average_score": { "$avg": "$percentage" },
                    "student_count": { "$addToSet": "$student_id" }
                }
            },
        ];

        let mut cursor = grade_collection.aggregate(pipeline, None).await?;
        let mut class_performances = Vec::new();

        while let Some(result) = cursor.next().await {
            let doc = result?;
            let class_id_oid = doc.get_object_id("_id")?;
            let class_id = class_id_oid.to_hex();

            let class = class_collection
                .find_one(doc! { "_id": class_id_oid }, None)
                .await?;
            let class_name = class
                .map(|c| c.name)
                .unwrap_or_else(|| "Unknown Class".to_string());

            class_performances.push(ClassPerformance {
                class_id,
                class_name,
                average_score: doc.get_f64("average_score").unwrap_or(0.0),
                student_count: doc
                    .get_array("student_count")
                    .map(|a| a.len() as i32)
                    .unwrap_or(0),
            });
        }

        // 2. Average Score by Subject
        let subject_collection = db.collection::<Subject>("subjects");
        let subject_pipeline = vec![
            doc! {
                "$match": {
                    "academic_year": &academic_year,
                    "semester": &semester,
                }
            },
            doc! {
                "$group": {
                    "_id": "$subject_id",
                    "average_score": { "$avg": "$percentage" }
                }
            },
        ];

        let mut subject_cursor = grade_collection.aggregate(subject_pipeline, None).await?;
        let mut subject_performances = Vec::new();

        while let Some(result) = subject_cursor.next().await {
            let doc = result?;
            let subject_id_oid = doc.get_object_id("_id")?;
            let subject_id = subject_id_oid.to_hex();

            let subject = subject_collection
                .find_one(doc! { "_id": subject_id_oid }, None)
                .await?;
            let subject_name = subject
                .map(|s| s.subject_name)
                .unwrap_or_else(|| "Unknown Subject".to_string());

            subject_performances.push(SubjectPerformance {
                subject_id,
                subject_name,
                average_score: doc.get_f64("average_score").unwrap_or(0.0),
            });
        }

        // 3. Grade Distribution
        let distribution_pipeline = vec![
            doc! {
                "$match": {
                    "academic_year": &academic_year,
                    "semester": &semester,
                }
            },
            doc! {
                "$group": {
                    "_id": "$grade",
                    "count": { "$sum": 1 }
                }
            },
            doc! { "$sort": { "_id": 1 } },
        ];

        let mut dist_cursor = grade_collection
            .aggregate(distribution_pipeline, None)
            .await?;
        let mut grade_distribution = Vec::new();

        while let Some(result) = dist_cursor.next().await {
            let doc = result?;
            grade_distribution.push(GradeDistribution {
                grade: doc.get_str("_id").unwrap_or("Unknown").to_string(),
                count: doc.get_i32("count").unwrap_or(0),
            });
        }

        Ok(PerformanceAnalytics {
            class_performances,
            subject_performances,
            grade_distribution,
        })
    }

    /// Get attendance analytics for a school
    async fn get_attendance_analytics(
        &self,
        ctx: &Context<'_>,
        _school_id: String,
    ) -> Result<AttendanceAnalytics> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Attendance>("attendances");

        // 1. Overall Average Rate
        let avg_pipeline = vec![doc! {
            "$group": {
                "_id": null,
                "average_rate": {
                    "$avg": {
                        "$cond": [
                            { "$eq": ["$status", "present"] },
                            100,
                            0
                        ]
                    }
                }
            }
        }];

        let mut avg_cursor = collection.aggregate(avg_pipeline, None).await?;
        let mut average_rate = 0.0;
        if let Some(result) = avg_cursor.next().await {
            average_rate = result?.get_f64("average_rate").unwrap_or(0.0);
        }

        // 2. Weekly Trends (Aggregated by day for the last 7 entries)
        let trend_pipeline = vec![
            doc! {
                "$group": {
                    "_id": {
                        "$dateToString": { "format": "%Y-%m-%d", "date": "$date" }
                    },
                    "rate": {
                        "$avg": {
                            "$cond": [
                                { "$eq": ["$status", "present"] },
                                100,
                                0
                            ]
                        }
                    }
                }
            },
            doc! { "$sort": { "_id": 1 } },
            doc! { "$limit": 30 },
        ];

        let mut trend_cursor = collection.aggregate(trend_pipeline, None).await?;
        let mut weekly_trends = Vec::new();

        while let Some(result) = trend_cursor.next().await {
            let doc = result?;
            weekly_trends.push(AttendanceTrend {
                date: doc.get_str("_id").unwrap_or("").to_string(),
                attendance_rate: doc.get_f64("rate").unwrap_or(0.0),
            });
        }

        Ok(AttendanceAnalytics {
            weekly_trends,
            monthly_trends: Vec::new(),
            average_rate,
        })
    }

    /// Get detailed progress for a specific student
    async fn get_student_progress(
        &self,
        ctx: &Context<'_>,
        student_id: String,
        academic_year: String,
        semester: String,
    ) -> Result<StudentProgress> {
        let db = ctx.data::<Database>()?;
        let student_oid =
            ObjectId::parse_str(&student_id).map_err(|_| Error::new("Invalid student ID"))?;

        let grade_collection = db.collection::<Grade>("grades");
        let attendance_collection = db.collection::<Attendance>("attendances");
        let student_collection = db.collection::<crate::models::student::Student>("students");
        let subject_collection = db.collection::<Subject>("subjects");

        // 1. Fetch Student Info
        let student = student_collection
            .find_one(doc! { "_id": student_oid }, None)
            .await?
            .ok_or_else(|| Error::new("Student not found"))?;

        let student_name =
            if let (Some(fn_en), Some(ln_en)) = (&student.first_name_en, &student.last_name_en) {
                format!("{} {}", fn_en, ln_en)
            } else {
                format!("{} {}", student.first_name_km, student.last_name_km)
            };

        // 2. Average Grade
        let grade_pipeline = vec![
            doc! {
                "$match": {
                    "student_id": student_oid,
                    "academic_year": &academic_year,
                    "semester": &semester,
                }
            },
            doc! {
                "$group": {
                    "_id": null,
                    "average": { "$avg": "$percentage" }
                }
            },
        ];

        let mut grade_cursor = grade_collection.aggregate(grade_pipeline, None).await?;
        let grade_average = if let Some(result) = grade_cursor.next().await {
            result?.get_f64("average").unwrap_or(0.0)
        } else {
            0.0
        };

        // 3. Attendance Rate
        let att_pipeline = vec![
            doc! {
                "$match": { "student_id": student_oid }
            },
            doc! {
                "$group": {
                    "_id": null,
                    "rate": {
                        "$avg": {
                            "$cond": [
                                { "$eq": ["$status", "present"] },
                                100,
                                0
                            ]
                        }
                    }
                }
            },
        ];

        let mut att_cursor = attendance_collection.aggregate(att_pipeline, None).await?;
        let attendance_rate = if let Some(result) = att_cursor.next().await {
            result?.get_f64("rate").unwrap_or(0.0)
        } else {
            0.0
        };

        // 4. Subject Grades
        let sub_pipeline = vec![
            doc! {
                "$match": {
                    "student_id": student_oid,
                    "academic_year": &academic_year,
                    "semester": &semester,
                }
            },
            doc! {
                "$group": {
                    "_id": "$subject_id",
                    "average_score": { "$avg": "$percentage" }
                }
            },
        ];

        let mut sub_cursor = grade_collection.aggregate(sub_pipeline, None).await?;
        let mut subject_grades = Vec::new();

        while let Some(result) = sub_cursor.next().await {
            let doc = result?;
            let subject_id_oid = doc.get_object_id("_id")?;
            let subject = subject_collection
                .find_one(doc! { "_id": subject_id_oid }, None)
                .await?;
            let subject_name = subject
                .map(|s| s.subject_name)
                .unwrap_or_else(|| "Unknown".to_string());

            subject_grades.push(SubjectPerformance {
                subject_id: subject_id_oid.to_hex(),
                subject_name,
                average_score: doc.get_f64("average_score").unwrap_or(0.0),
            });
        }

        Ok(StudentProgress {
            student_id,
            student_name,
            grade_average,
            attendance_rate,
            subject_grades,
            grade_history: Vec::new(), // Placeholder for now
        })
    }
}
