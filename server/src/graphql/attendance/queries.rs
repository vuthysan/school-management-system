// Attendance GraphQL queries
use super::types::AttendanceType;
use crate::models;
use async_graphql::*;
use futures::stream::TryStreamExt;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Database,
};

#[derive(Default)]
pub struct AttendanceQuery;

#[Object]
impl AttendanceQuery {
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
}
