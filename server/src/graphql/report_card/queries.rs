use super::types::{moeys_letter_grade, ReportCard, SubjectResult};
use crate::models::class::Class;
use crate::models::grade::Grade;
use crate::models::school::School;
use crate::models::student::Student;
use crate::models::subject::Subject;
use crate::utils::common_types::to_buddhist_era;
use async_graphql::*;
use futures::stream::TryStreamExt;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Database,
};

// MoEYS assessment weight constants
const MOEYS_QUIZ_WEIGHT: f64 = 0.30;
const MOEYS_MIDTERM_WEIGHT: f64 = 0.30;
const MOEYS_FINAL_WEIGHT: f64 = 0.40;
const MOEYS_PASSING_SCORE: f64 = 50.0;

#[derive(Default)]
pub struct ReportCardQuery;

#[Object]
impl ReportCardQuery {
    /// Generate a report card for a student for a specific academic year and semester.
    /// Aggregates all grades by subject and assessment type following MoEYS format.
    async fn report_card(
        &self,
        ctx: &Context<'_>,
        student_id: String,
        academic_year: String,
        semester: String,
    ) -> Result<ReportCard> {
        let db = ctx.data::<Database>()?;

        let student_oid = ObjectId::parse_str(&student_id)
            .map_err(|_| Error::new("Invalid student ID"))?;

        // Fetch student
        let student_collection = db.collection::<Student>("students");
        let student = student_collection
            .find_one(doc! { "_id": student_oid }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Student not found"))?;

        // Fetch class info
        let class_collection = db.collection::<Class>("classes");
        let class_name = if let Some(ref class_id_str) = student.current_class_id {
            if let Ok(class_oid) = ObjectId::parse_str(class_id_str) {
                class_collection
                    .find_one(doc! { "_id": class_oid }, None)
                    .await
                    .ok()
                    .flatten()
                    .map(|c| c.name)
            } else {
                None
            }
        } else {
            None
        };

        // Fetch school name
        let school_collection = db.collection::<School>("schools");
        let school_name = if let Ok(school_oid) = ObjectId::parse_str(&student.school_id) {
            school_collection
                .find_one(doc! { "_id": school_oid }, None)
                .await
                .ok()
                .flatten()
                .map(|s| s.name.en)
        } else {
            None
        };

        // Fetch all grades for this student, year, and semester
        let grade_collection = db.collection::<Grade>("grades");
        let mut grade_cursor = grade_collection
            .find(
                doc! {
                    "student_id": student_oid,
                    "academic_year": &academic_year,
                    "semester": &semester,
                },
                None,
            )
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        // Group grades by subject
        let mut subject_grades: std::collections::HashMap<ObjectId, Vec<Grade>> =
            std::collections::HashMap::new();
        while let Some(grade) = grade_cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            subject_grades
                .entry(grade.subject_id)
                .or_default()
                .push(grade);
        }

        // Batch fetch all subject names to avoid N+1 queries
        let subject_collection = db.collection::<Subject>("subjects");
        let subject_ids: Vec<ObjectId> = subject_grades.keys().copied().collect();

        let mut subject_cursor = subject_collection
            .find(doc! { "_id": { "$in": subject_ids } }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut subject_map: std::collections::HashMap<ObjectId, String> =
            std::collections::HashMap::new();
        while let Some(subject) = subject_cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            if let Some(id) = subject.id {
                subject_map.insert(id, subject.subject_name);
            }
        }

        let mut subjects: Vec<SubjectResult> = Vec::new();

        for (subject_oid, grades) in &subject_grades {
            let subject_name = subject_map
                .get(subject_oid)
                .cloned()
                .unwrap_or_else(|| "Unknown".to_string());

            // Separate grades by assessment type
            let mut quiz_scores: Vec<f64> = Vec::new();
            let mut midterm_score: Option<f64> = None;
            let mut final_score: Option<f64> = None;
            let mut all_percentages: Vec<f64> = Vec::new();

            for grade in grades {
                all_percentages.push(grade.percentage);
                match grade.assessment_type.to_lowercase().as_str() {
                    "quiz" | "assignment" | "homework" => {
                        quiz_scores.push(grade.percentage);
                    }
                    "midterm" => {
                        midterm_score = Some(grade.percentage);
                    }
                    "final" => {
                        final_score = Some(grade.percentage);
                    }
                    _ => {
                        quiz_scores.push(grade.percentage);
                    }
                }
            }

            let quiz_average = if quiz_scores.is_empty() {
                None
            } else {
                Some(quiz_scores.iter().sum::<f64>() / quiz_scores.len() as f64)
            };

            // Calculate subject average with MoEYS weighting:
            // Quiz/Assignment: 30%, Midterm: 30%, Final: 40%
            let subject_average = calculate_moeys_average(quiz_average, midterm_score, final_score);

            subjects.push(SubjectResult {
                subject_id: subject_oid.to_hex(),
                subject_name,
                quiz_average,
                midterm_score,
                final_score,
                subject_average,
                grade: moeys_letter_grade(subject_average),
                total_assessments: grades.len() as i32,
            });
        }

        // Sort subjects by name
        subjects.sort_by(|a, b| a.subject_name.cmp(&b.subject_name));

        // Calculate overall average
        let overall_average = if subjects.is_empty() {
            0.0
        } else {
            subjects.iter().map(|s| s.subject_average).sum::<f64>() / subjects.len() as f64
        };

        // Calculate class rank
        let (rank_in_class, total_students_in_class) = if let Some(ref class_id_str) =
            student.current_class_id
        {
            calculate_class_rank(
                db,
                class_id_str,
                &academic_year,
                &semester,
                &student_id,
                overall_average,
            )
            .await
        } else {
            (None, None)
        };

        // Parse year for Buddhist Era
        let ce_year = academic_year.parse::<i32>().unwrap_or(2025);
        let be_year = to_buddhist_era(ce_year);

        let dob_str = Some(student.date_of_birth.to_iso_string());

        let full_name_km = format!("{} {}", student.last_name_km, student.first_name_km);
        let remarks = if overall_average >= MOEYS_PASSING_SCORE {
            Some(format!("ឆ្លងថ្នាក់ (Pass) - {}", full_name_km))
        } else {
            Some(format!("ធ្លាក់ (Fail) - {}", full_name_km))
        };

        Ok(ReportCard {
            student_id: student.id.map(|id| id.to_hex()).unwrap_or_default(),
            student_code: student.student_id,
            first_name_km: student.first_name_km,
            last_name_km: student.last_name_km,
            first_name_en: student.first_name_en,
            last_name_en: student.last_name_en,
            date_of_birth: dob_str,
            gender: format!("{:?}", student.gender),
            grade_level: student.grade_level,
            class_name,
            academic_year,
            academic_year_be: format!("ព.ស. {}", be_year),
            semester,
            school_name,
            subjects,
            overall_average,
            overall_grade: moeys_letter_grade(overall_average),
            total_subjects: subject_grades.len() as i32,
            rank_in_class,
            total_students_in_class,
            remarks,
            generated_at: mongodb::bson::DateTime::now()
                .try_to_rfc3339_string()
                .unwrap_or_default(),
        })
    }

    /// Generate report cards for all students in a class.
    async fn class_report_cards(
        &self,
        ctx: &Context<'_>,
        class_id: String,
        academic_year: String,
        semester: String,
    ) -> Result<Vec<ReportCard>> {
        let db = ctx.data::<Database>()?;
        let student_collection = db.collection::<Student>("students");

        // Find all active students in this class
        let mut cursor = student_collection
            .find(
                doc! {
                    "current_class_id": &class_id,
                    "status": "Active",
                    "soft_delete.is_deleted": false,
                },
                None,
            )
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut student_ids: Vec<String> = Vec::new();
        while let Some(student) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            if let Some(id) = student.id {
                student_ids.push(id.to_hex());
            }
        }

        let mut report_cards = Vec::new();
        for sid in &student_ids {
            let rc = self
                .report_card(ctx, sid.clone(), academic_year.clone(), semester.clone())
                .await?;
            report_cards.push(rc);
        }

        // Sort by overall average descending (highest first)
        report_cards.sort_by(|a, b| {
            b.overall_average
                .partial_cmp(&a.overall_average)
                .unwrap_or(std::cmp::Ordering::Equal)
        });

        Ok(report_cards)
    }
}

/// Calculate weighted average following MoEYS assessment weighting.
/// Uses constants defined above for maintainability.
fn calculate_moeys_average(
    quiz_avg: Option<f64>,
    midterm: Option<f64>,
    final_exam: Option<f64>,
) -> f64 {
    let mut total_weight = 0.0;
    let mut weighted_sum = 0.0;

    if let Some(q) = quiz_avg {
        weighted_sum += q * MOEYS_QUIZ_WEIGHT;
        total_weight += MOEYS_QUIZ_WEIGHT;
    }
    if let Some(m) = midterm {
        weighted_sum += m * MOEYS_MIDTERM_WEIGHT;
        total_weight += MOEYS_MIDTERM_WEIGHT;
    }
    if let Some(f) = final_exam {
        weighted_sum += f * MOEYS_FINAL_WEIGHT;
        total_weight += MOEYS_FINAL_WEIGHT;
    }

    if total_weight > 0.0 {
        weighted_sum / total_weight
    } else {
        0.0
    }
}

/// Calculate a student's rank within their class for a given academic period.
async fn calculate_class_rank(
    db: &Database,
    class_id: &str,
    academic_year: &str,
    semester: &str,
    current_student_id: &str,
    current_average: f64,
) -> (Option<i32>, Option<i32>) {
    let student_collection = db.collection::<Student>("students");
    let grade_collection = db.collection::<Grade>("grades");

    // Find all students in this class
    let students_result = student_collection
        .find(
            doc! {
                "current_class_id": class_id,
                "status": "Active",
                "soft_delete.is_deleted": false,
            },
            None,
        )
        .await;

    let mut student_cursor = match students_result {
        Ok(c) => c,
        Err(_) => return (None, None),
    };

    let mut student_averages: Vec<(String, f64)> = Vec::new();

    while let Ok(Some(student)) = student_cursor.try_next().await {
        let sid = match student.id {
            Some(id) => id,
            None => continue,
        };
        let sid_str = sid.to_hex();

        if sid_str == current_student_id {
            student_averages.push((sid_str, current_average));
            continue;
        }

        // Calculate average for this student
        let grade_cursor_result = grade_collection
            .find(
                doc! {
                    "student_id": sid,
                    "academic_year": academic_year,
                    "semester": semester,
                },
                None,
            )
            .await;

        if let Ok(mut gc) = grade_cursor_result {
            let mut total = 0.0;
            let mut count = 0;
            while let Ok(Some(grade)) = gc.try_next().await {
                total += grade.percentage;
                count += 1;
            }
            let avg = if count > 0 { total / count as f64 } else { 0.0 };
            student_averages.push((sid_str, avg));
        }
    }

    let total_students = student_averages.len() as i32;

    // Sort descending by average
    student_averages.sort_by(|a, b| {
        b.1.partial_cmp(&a.1)
            .unwrap_or(std::cmp::Ordering::Equal)
    });

    // Find current student's rank
    let rank = student_averages
        .iter()
        .position(|(id, _)| id == current_student_id)
        .map(|pos| (pos + 1) as i32);

    (rank, Some(total_students))
}
