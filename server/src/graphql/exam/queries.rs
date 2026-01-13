use crate::graphql::exam::inputs::{ExamFilterInput, ExamSortInput};
use crate::graphql::exam::types::{ExamScheduleType, PaginatedExamsResult};
use crate::models::exam::ExamSchedule;
use async_graphql::*;
use mongodb::{
    bson::{doc, oid::ObjectId},
    options::FindOptions,
    Database,
};

#[derive(Default)]
pub struct ExamQueries;

#[Object]
impl ExamQueries {
    async fn exams(
        &self,
        ctx: &Context<'_>,
        school_id: String,
        page: Option<u64>,
        page_size: Option<u64>,
        filter: Option<ExamFilterInput>,
        sort: Option<ExamSortInput>,
    ) -> Result<PaginatedExamsResult> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<ExamSchedule>("exams");

        let mut query = doc! {
            "school_id": &school_id,
            "soft_delete.is_deleted": false
        };

        if let Some(f) = filter {
            if let Some(search) = f.search {
                query.insert("name", doc! { "$regex": search, "$options": "i" });
            }
            if let Some(class_id) = f.class_id {
                query.insert("class_id", class_id);
            }
            if let Some(subject_id) = f.subject_id {
                query.insert("subject_id", subject_id);
            }
            if let Some(status) = f.status {
                query.insert("status", mongodb::bson::to_bson(&status)?);
            }
        }

        let page = page.unwrap_or(1);
        let page_size = page_size.unwrap_or(10);
        let skip = (page - 1) * page_size;

        let total = collection.count_documents(query.clone(), None).await?;
        let total_pages = (total as f64 / page_size as f64).ceil() as u64;

        let mut find_options = FindOptions::builder()
            .skip(skip)
            .limit(page_size as i64)
            .build();

        if let Some(s) = sort {
            let sort_by = s.sort_by.unwrap_or_else(|| "exam_date".to_string());
            let sort_order = if s.sort_order.unwrap_or_else(|| "asc".to_string()) == "desc" {
                -1
            } else {
                1
            };
            find_options.sort = Some(doc! { sort_by: sort_order });
        } else {
            find_options.sort = Some(doc! { "exam_date": 1 });
        }

        let mut cursor = collection.find(query, find_options).await?;
        let mut items = Vec::new();

        while cursor.advance().await? {
            items.push(ExamScheduleType::from(cursor.deserialize_current()?));
        }

        Ok(PaginatedExamsResult {
            items,
            total,
            page,
            total_pages,
        })
    }

    async fn exam(&self, ctx: &Context<'_>, id: String) -> Result<Option<ExamScheduleType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<ExamSchedule>("exams");

        let obj_id = ObjectId::parse_str(&id)?;
        let exam = collection
            .find_one(
                doc! { "_id": obj_id, "soft_delete.is_deleted": false },
                None,
            )
            .await?;

        Ok(exam.map(ExamScheduleType::from))
    }
}
