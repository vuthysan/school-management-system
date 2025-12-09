// Attendance GraphQL mutations
use super::inputs::AttendanceInput;
use super::types::AttendanceType;
use crate::models;
use async_graphql::*;
use mongodb::{
    bson::{doc, DateTime},
    Database,
};

#[derive(Default)]
pub struct AttendanceMutation;

#[Object]
impl AttendanceMutation {
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
}
