// Calendar Event GraphQL mutations
use crate::models::calendar_event::{
    CalendarEvent, CalendarEventType, CreateCalendarEventInput, RecurrencePattern,
    UpdateCalendarEventInput,
};
use async_graphql::*;
use mongodb::{
    bson::{doc, oid::ObjectId, DateTime},
    Database,
};

#[derive(Default)]
pub struct CalendarMutation;

#[Object]
impl CalendarMutation {
    /// Create a new calendar event
    async fn create_calendar_event(
        &self,
        ctx: &Context<'_>,
        input: CreateCalendarEventInput,
    ) -> Result<CalendarEvent> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<CalendarEvent>("calendar_events");

        let school_id = ObjectId::parse_str(&input.school_id)
            .map_err(|_| Error::new("Invalid school ID format"))?;

        let start_date = DateTime::parse_rfc3339_str(&input.start_date)
            .map_err(|_| Error::new("Invalid start_date format. Use ISO 8601."))?;
        let end_date = DateTime::parse_rfc3339_str(&input.end_date)
            .map_err(|_| Error::new("Invalid end_date format. Use ISO 8601."))?;

        let event_type = input.event_type.unwrap_or_default();

        let mut event =
            CalendarEvent::new(school_id, input.title, event_type, start_date, end_date);
        event.description = input.description;
        event.is_all_day = input.is_all_day.unwrap_or(false);
        event.is_recurring = input.is_recurring.unwrap_or(false);
        event.recurrence_pattern = input.recurrence_pattern.unwrap_or_default();
        event.color = input.color;
        event.location = input.location;
        event.is_school_closed = input.is_school_closed.unwrap_or(false);

        let result = collection
            .insert_one(&event, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        event.id = result.inserted_id.as_object_id();

        Ok(event)
    }

    /// Update a calendar event
    async fn update_calendar_event(
        &self,
        ctx: &Context<'_>,
        id: String,
        input: UpdateCalendarEventInput,
    ) -> Result<CalendarEvent> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<CalendarEvent>("calendar_events");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let mut update_doc = doc! {};

        if let Some(title) = input.title {
            update_doc.insert("title", title);
        }
        if let Some(description) = input.description {
            update_doc.insert("description", description);
        }
        if let Some(event_type) = input.event_type {
            let type_str = match event_type {
                CalendarEventType::Holiday => "Holiday",
                CalendarEventType::Break => "Break",
                CalendarEventType::Exam => "Exam",
                CalendarEventType::Event => "Event",
                CalendarEventType::Meeting => "Meeting",
                CalendarEventType::Deadline => "Deadline",
                CalendarEventType::Other => "Other",
            };
            update_doc.insert("event_type", type_str);
        }
        if let Some(start_date) = input.start_date {
            let dt = DateTime::parse_rfc3339_str(&start_date)
                .map_err(|_| Error::new("Invalid start_date format"))?;
            update_doc.insert("start_date", dt);
        }
        if let Some(end_date) = input.end_date {
            let dt = DateTime::parse_rfc3339_str(&end_date)
                .map_err(|_| Error::new("Invalid end_date format"))?;
            update_doc.insert("end_date", dt);
        }
        if let Some(is_all_day) = input.is_all_day {
            update_doc.insert("is_all_day", is_all_day);
        }
        if let Some(is_recurring) = input.is_recurring {
            update_doc.insert("is_recurring", is_recurring);
        }
        if let Some(pattern) = input.recurrence_pattern {
            let pattern_str = match pattern {
                RecurrencePattern::None => "None",
                RecurrencePattern::Daily => "Daily",
                RecurrencePattern::Weekly => "Weekly",
                RecurrencePattern::Monthly => "Monthly",
                RecurrencePattern::Yearly => "Yearly",
            };
            update_doc.insert("recurrence_pattern", pattern_str);
        }
        if let Some(color) = input.color {
            update_doc.insert("color", color);
        }
        if let Some(location) = input.location {
            update_doc.insert("location", location);
        }
        if let Some(is_school_closed) = input.is_school_closed {
            update_doc.insert("is_school_closed", is_school_closed);
        }

        update_doc.insert("audit.updated_at", DateTime::now());

        collection
            .update_one(doc! { "_id": obj_id }, doc! { "$set": update_doc }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let updated = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?
            .ok_or_else(|| Error::new("Calendar event not found after update"))?;

        Ok(updated)
    }

    /// Delete a calendar event (soft delete)
    async fn delete_calendar_event(&self, ctx: &Context<'_>, id: String) -> Result<bool> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<CalendarEvent>("calendar_events");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let update = doc! {
            "$set": {
                "soft_delete.is_deleted": true,
                "soft_delete.deleted_at": DateTime::now()
            }
        };

        let result = collection
            .update_one(doc! { "_id": obj_id }, update, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        Ok(result.modified_count > 0)
    }
}
