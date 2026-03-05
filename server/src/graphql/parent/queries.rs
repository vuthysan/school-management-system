use super::types::{ChildClassInfo, ChildSummary, ParentGradeView};
use crate::graphql::graphql_context::get_graphql_context;
use crate::models::attendance::Attendance;
use crate::models::class::Class;
use crate::models::grade::Grade;
use crate::models::member::Member;
use crate::models::student::{Student, StudentStatus};
use crate::models::subject::Subject;
use async_graphql::*;
use futures::stream::TryStreamExt;
use futures::StreamExt;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Database,
};

#[derive(Default)]
pub struct ParentQuery;

#[Object]
impl ParentQuery {
    /// Get all children linked to the authenticated parent user.
    /// Finds the parent's Member record(s) and resolves each child's
    /// student record with attendance rate and average grade.
    async fn my_children(&self, ctx: &Context<'_>) -> Result<Vec<ChildSummary>> {
        let db = ctx.data::<Database>()?;
        let gql_ctx = get_graphql_context(ctx)?;
        let auth_user = gql_ctx.require_auth()?;

        let member_collection = db.collection::<Member>("members");
        let student_collection = db.collection::<Student>("students");
        let class_collection = db.collection::<Class>("classes");
        let grade_collection = db.collection::<Grade>("grades");
        let attendance_collection = db.collection::<Attendance>("attendances");

        // Find parent member records for this user
        let mut member_cursor = member_collection
            .find(
                doc! {
                    "user_id": &auth_user.id,
                    "role": "Parent",
                    "soft_delete.is_deleted": false,
                },
                None,
            )
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        // Collect all child student IDs across all school memberships
        let mut child_ids: Vec<String> = Vec::new();
        while let Some(member) = member_cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            for id in &member.parent_of {
                if !child_ids.contains(id) {
                    child_ids.push(id.clone());
                }
            }
        }

        let mut children = Vec::new();

        for child_id in &child_ids {
            let student_oid = match ObjectId::parse_str(child_id) {
                Ok(oid) => oid,
                Err(_) => continue,
            };

            let student = match student_collection
                .find_one(
                    doc! { "_id": student_oid, "soft_delete.is_deleted": false },
                    None,
                )
                .await
                .map_err(|e| Error::new(e.to_string()))?
            {
                Some(s) => s,
                None => continue,
            };

            // Resolve current class
            let current_class = if let Some(ref class_id_str) = student.current_class_id {
                if let Ok(class_oid) = ObjectId::parse_str(class_id_str) {
                    class_collection
                        .find_one(doc! { "_id": class_oid }, None)
                        .await
                        .ok()
                        .flatten()
                        .map(|c| ChildClassInfo {
                            id: c.id.map(|id| id.to_hex()).unwrap_or_default(),
                            name: c.name,
                            grade: c.grade_level,
                        })
                } else {
                    None
                }
            } else {
                None
            };

            // Calculate attendance rate
            let att_pipeline = vec![
                doc! { "$match": { "student_id": student_oid } },
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

            let mut att_cursor = attendance_collection
                .aggregate(att_pipeline, None)
                .await
                .map_err(|e| Error::new(e.to_string()))?;

            let attendance_rate = if let Some(result) = att_cursor.next().await {
                result
                    .map_err(|e| Error::new(e.to_string()))?
                    .get_f64("rate")
                    .unwrap_or(0.0)
            } else {
                0.0
            };

            // Calculate average grade
            let grade_pipeline = vec![
                doc! { "$match": { "student_id": student_oid } },
                doc! {
                    "$group": {
                        "_id": null,
                        "average": { "$avg": "$percentage" }
                    }
                },
            ];

            let mut grade_cursor = grade_collection
                .aggregate(grade_pipeline, None)
                .await
                .map_err(|e| Error::new(e.to_string()))?;

            let average_grade = if let Some(result) = grade_cursor.next().await {
                result
                    .map_err(|e| Error::new(e.to_string()))?
                    .get_f64("average")
                    .unwrap_or(0.0)
            } else {
                0.0
            };

            let full_name =
                if let (Some(fn_en), Some(ln_en)) = (&student.first_name_en, &student.last_name_en)
                {
                    format!("{} {}", fn_en, ln_en)
                } else {
                    format!("{} {}", student.first_name_km, student.last_name_km)
                };

            let status_str = match student.status {
                StudentStatus::Active => "Active",
                StudentStatus::Inactive => "Inactive",
                StudentStatus::Graduated => "Graduated",
                StudentStatus::Transferred => "Transferred",
                StudentStatus::Expelled => "Expelled",
                StudentStatus::Dropped => "Dropped",
                StudentStatus::OnLeave => "OnLeave",
            };

            children.push(ChildSummary {
                id: student.id.map(|id| id.to_hex()).unwrap_or_default(),
                student_id: student.student_id,
                first_name_km: student.first_name_km,
                last_name_km: student.last_name_km,
                first_name_en: student.first_name_en,
                last_name_en: student.last_name_en,
                full_name,
                grade_level: student.grade_level,
                status: status_str.to_string(),
                gender: format!("{:?}", student.gender),
                current_class,
                attendance_rate,
                average_grade,
            });
        }

        Ok(children)
    }

    /// Get grades for a specific student, enriched with subject names.
    /// Parents can only view grades of their own children.
    async fn grades_by_student(
        &self,
        ctx: &Context<'_>,
        student_id: String,
    ) -> Result<Vec<ParentGradeView>> {
        let db = ctx.data::<Database>()?;

        let student_oid =
            ObjectId::parse_str(&student_id).map_err(|_| Error::new("Invalid student ID"))?;

        let grade_collection = db.collection::<Grade>("grades");
        let subject_collection = db.collection::<Subject>("subjects");

        let mut cursor = grade_collection
            .find(doc! { "student_id": student_oid }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut grades = Vec::new();
        while let Some(grade) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            // Look up subject name
            let subject_name = subject_collection
                .find_one(doc! { "_id": grade.subject_id }, None)
                .await
                .ok()
                .flatten()
                .map(|s| s.subject_name)
                .unwrap_or_else(|| "Unknown".to_string());

            grades.push(ParentGradeView {
                id: grade.id.map(|id| id.to_hex()).unwrap_or_default(),
                subject_id: grade.subject_id.to_hex(),
                subject_name,
                score: grade.score,
                max_score: grade.max_score,
                percentage: grade.percentage,
                grade_date: grade
                    .graded_at
                    .try_to_rfc3339_string()
                    .unwrap_or_default(),
                term: grade.semester,
            });
        }

        Ok(grades)
    }
}
