use crate::graphql::exam::types::ExamScheduleType;
use crate::models::exam::{ExamSchedule, ExamScheduleInput, UpdateExamScheduleInput};
use async_graphql::*;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Database,
};

#[derive(Default)]
pub struct ExamMutations;

#[Object]
impl ExamMutations {
    async fn create_exam(
        &self,
        ctx: &Context<'_>,
        input: ExamScheduleInput,
    ) -> Result<ExamScheduleType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<ExamSchedule>("exams");

        let mut exam = ExamSchedule::new(
            input.school_id,
            input.academic_year_id,
            input.name,
            input.subject_id,
            input.class_id,
            input.exam_date,
            input.start_time,
            input.end_time,
            input.max_score,
        );

        exam.term_id = input.term_id;
        exam.room = input.room;
        exam.examiner_id = input.examiner_id;

        let result = collection.insert_one(exam.clone(), None).await?;
        let mut exam = exam;
        exam.id = Some(result.inserted_id.as_object_id().unwrap());

        Ok(ExamScheduleType::from(exam))
    }

    async fn update_exam(
        &self,
        ctx: &Context<'_>,
        id: String,
        input: UpdateExamScheduleInput,
    ) -> Result<ExamScheduleType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<ExamSchedule>("exams");

        let obj_id = ObjectId::parse_str(&id)?;

        let mut update_doc = doc! {};

        if let Some(name) = input.name {
            update_doc.insert("name", name);
        }
        if let Some(date) = input.exam_date {
            update_doc.insert("exam_date", date);
        }
        if let Some(start) = input.start_time {
            update_doc.insert("start_time", start);
        }
        if let Some(end) = input.end_time {
            update_doc.insert("end_time", end);
        }
        if let Some(room) = input.room {
            update_doc.insert("room", room);
        }
        if let Some(examiner) = input.examiner_id {
            update_doc.insert("examiner_id", examiner);
        }
        if let Some(max_score) = input.max_score {
            update_doc.insert("max_score", max_score);
        }
        if let Some(status) = input.status {
            update_doc.insert("status", mongodb::bson::to_bson(&status)?);
        }

        update_doc.insert("audit.updated_at", mongodb::bson::DateTime::now());

        let result = collection
            .find_one_and_update(doc! { "_id": obj_id }, doc! { "$set": update_doc }, None)
            .await?;

        match result {
            Some(_) => {
                let updated = collection
                    .find_one(doc! { "_id": obj_id }, None)
                    .await?
                    .unwrap();
                Ok(ExamScheduleType::from(updated))
            }
            None => Err(Error::new("Exam not found")),
        }
    }

    async fn delete_exam(&self, ctx: &Context<'_>, id: String) -> Result<bool> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<ExamSchedule>("exams");

        let obj_id = ObjectId::parse_str(&id)?;

        collection
            .update_one(
                doc! { "_id": obj_id },
                doc! {
                    "$set": {
                        "soft_delete.is_deleted": true,
                        "soft_delete.deleted_at": mongodb::bson::DateTime::now()
                    }
                },
                None,
            )
            .await?;

        Ok(true)
    }
}
