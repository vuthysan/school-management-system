// Calendar Event GraphQL queries
use crate::models::calendar_event::{CalendarEvent, CalendarEventType};
use async_graphql::*;
use futures::stream::TryStreamExt;
use mongodb::{
    bson::{doc, oid::ObjectId, DateTime},
    Database,
};

#[derive(Default)]
pub struct CalendarQuery;

#[Object]
impl CalendarQuery {
    /// Get all calendar events for a school
    async fn calendar_events(
        &self,
        ctx: &Context<'_>,
        school_id: String,
    ) -> Result<Vec<CalendarEvent>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<CalendarEvent>("calendar_events");

        let school_oid =
            ObjectId::parse_str(&school_id).map_err(|_| Error::new("Invalid school ID format"))?;

        let filter = doc! {
            "school_id": school_oid,
            "soft_delete.is_deleted": { "$ne": true }
        };

        let mut cursor = collection
            .find(filter, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut items = Vec::new();
        while let Some(item) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            items.push(item);
        }

        Ok(items)
    }

    /// Get calendar events in a date range
    async fn calendar_events_in_range(
        &self,
        ctx: &Context<'_>,
        school_id: String,
        start_date: String,
        end_date: String,
    ) -> Result<Vec<CalendarEvent>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<CalendarEvent>("calendar_events");

        let school_oid =
            ObjectId::parse_str(&school_id).map_err(|_| Error::new("Invalid school ID format"))?;
        let start_dt = DateTime::parse_rfc3339_str(&start_date)
            .map_err(|_| Error::new("Invalid start_date format"))?;
        let end_dt = DateTime::parse_rfc3339_str(&end_date)
            .map_err(|_| Error::new("Invalid end_date format"))?;

        let filter = doc! {
            "school_id": school_oid,
            "soft_delete.is_deleted": { "$ne": true },
            "$or": [
                { "start_date": { "$gte": start_dt, "$lte": end_dt } },
                { "end_date": { "$gte": start_dt, "$lte": end_dt } }
            ]
        };

        let mut cursor = collection
            .find(filter, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut items = Vec::new();
        while let Some(item) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            items.push(item);
        }

        Ok(items)
    }

    /// Get calendar events by type
    async fn calendar_events_by_type(
        &self,
        ctx: &Context<'_>,
        school_id: String,
        event_type: CalendarEventType,
    ) -> Result<Vec<CalendarEvent>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<CalendarEvent>("calendar_events");

        let school_oid =
            ObjectId::parse_str(&school_id).map_err(|_| Error::new("Invalid school ID format"))?;

        let type_str = match event_type {
            CalendarEventType::Holiday => "Holiday",
            CalendarEventType::Break => "Break",
            CalendarEventType::Exam => "Exam",
            CalendarEventType::Event => "Event",
            CalendarEventType::Meeting => "Meeting",
            CalendarEventType::Deadline => "Deadline",
            CalendarEventType::Other => "Other",
        };

        let filter = doc! {
            "school_id": school_oid,
            "event_type": type_str,
            "soft_delete.is_deleted": { "$ne": true }
        };

        let mut cursor = collection
            .find(filter, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut items = Vec::new();
        while let Some(item) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            items.push(item);
        }

        Ok(items)
    }

    /// Get calendar event by ID
    async fn calendar_event(&self, ctx: &Context<'_>, id: String) -> Result<Option<CalendarEvent>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<CalendarEvent>("calendar_events");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let item = collection
            .find_one(
                doc! { "_id": obj_id, "soft_delete.is_deleted": { "$ne": true } },
                None,
            )
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        Ok(item)
    }
}
