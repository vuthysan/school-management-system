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

    /// Seed official Cambodian public holidays for a given year.
    /// Creates calendar events for all holidays recognized by the
    /// Royal Government of Cambodia. Includes fixed-date holidays
    /// and known lunar-based holidays for 2025-2026.
    async fn seed_cambodian_holidays(
        &self,
        ctx: &Context<'_>,
        school_id: String,
        year: i32,
    ) -> Result<Vec<CalendarEvent>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<CalendarEvent>("calendar_events");

        let school_oid = ObjectId::parse_str(&school_id)
            .map_err(|_| Error::new("Invalid school ID format"))?;

        // Check if holidays already exist for this year
        let year_start = DateTime::parse_rfc3339_str(&format!("{}-01-01T00:00:00Z", year))
            .map_err(|_| Error::new("Invalid year"))?;
        let year_end = DateTime::parse_rfc3339_str(&format!("{}-12-31T23:59:59Z", year))
            .map_err(|_| Error::new("Invalid year"))?;

        let existing = collection
            .count_documents(
                doc! {
                    "school_id": school_oid,
                    "event_type": "Holiday",
                    "start_date": { "$gte": year_start, "$lte": year_end },
                    "soft_delete.is_deleted": { "$ne": true }
                },
                None,
            )
            .await
            .unwrap_or(0);

        if existing > 0 {
            return Err(Error::new(format!(
                "Holidays already exist for {} in this school's calendar. Delete existing holidays first to re-seed.",
                year
            )));
        }

        let holidays = cambodian_holidays(year);
        let mut created_events = Vec::new();

        for h in &holidays {
            let start_date =
                DateTime::parse_rfc3339_str(&format!("{}T00:00:00Z", h.start_date))
                    .map_err(|_| Error::new(format!("Invalid date: {}", h.start_date)))?;
            let end_date =
                DateTime::parse_rfc3339_str(&format!("{}T23:59:59Z", h.end_date))
                    .map_err(|_| Error::new(format!("Invalid date: {}", h.end_date)))?;

            let mut event = CalendarEvent::new(
                school_oid,
                format!("{} | {}", h.title_en, h.title_km),
                h.event_type,
                start_date,
                end_date,
            );
            event.description = Some(h.title_km.to_string());
            event.is_all_day = true;
            event.is_school_closed = true;
            event.is_recurring = true;
            event.recurrence_pattern = RecurrencePattern::Yearly;
            event.color = Some(match h.event_type {
                CalendarEventType::Break => "#4CAF50".to_string(),
                _ => "#F44336".to_string(),
            });

            let result = collection
                .insert_one(&event, None)
                .await
                .map_err(|e| Error::new(e.to_string()))?;

            event.id = result.inserted_id.as_object_id();
            created_events.push(event);
        }

        Ok(created_events)
    }
}

struct CambodianHoliday {
    title_en: &'static str,
    title_km: &'static str,
    start_date: String,
    end_date: String,
    event_type: CalendarEventType,
}

/// Returns official Cambodian public holidays for a given year.
/// Fixed-date holidays work for any year. Lunar-based holidays
/// (Meak Bochea, Visak Bochea, Royal Ploughing, Pchum Ben, Water Festival)
/// are hardcoded for 2025 and 2026.
fn cambodian_holidays(year: i32) -> Vec<CambodianHoliday> {
    let y = year.to_string();
    let mut holidays = vec![
        // === Fixed-date holidays ===
        CambodianHoliday {
            title_en: "International New Year",
            title_km: "ទិវាចូលឆ្នាំសកល",
            start_date: format!("{}-01-01", y),
            end_date: format!("{}-01-01", y),
            event_type: CalendarEventType::Holiday,
        },
        CambodianHoliday {
            title_en: "Victory over Genocide Day",
            title_km: "ទិវាជ័យជំនះលើរបបប្រល័យពូជសាសន៍",
            start_date: format!("{}-01-07", y),
            end_date: format!("{}-01-07", y),
            event_type: CalendarEventType::Holiday,
        },
        CambodianHoliday {
            title_en: "International Women's Day",
            title_km: "ទិវានារីអន្តរជាតិ",
            start_date: format!("{}-03-08", y),
            end_date: format!("{}-03-08", y),
            event_type: CalendarEventType::Holiday,
        },
        CambodianHoliday {
            title_en: "Khmer New Year",
            title_km: "បុណ្យចូលឆ្នាំថ្មីប្រពៃណីខ្មែរ",
            start_date: format!("{}-04-14", y),
            end_date: format!("{}-04-16", y),
            event_type: CalendarEventType::Holiday,
        },
        CambodianHoliday {
            title_en: "International Labor Day",
            title_km: "ទិវាពលកម្មអន្តរជាតិ",
            start_date: format!("{}-05-01", y),
            end_date: format!("{}-05-01", y),
            event_type: CalendarEventType::Holiday,
        },
        CambodianHoliday {
            title_en: "King Sihamoni's Birthday",
            title_km: "ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្មព្រះមហាក្សត្រ",
            start_date: format!("{}-05-13", y),
            end_date: format!("{}-05-15", y),
            event_type: CalendarEventType::Holiday,
        },
        CambodianHoliday {
            title_en: "National Day of Remembrance",
            title_km: "ទិវាជាតិនៃការចងចាំ",
            start_date: format!("{}-05-20", y),
            end_date: format!("{}-05-20", y),
            event_type: CalendarEventType::Holiday,
        },
        CambodianHoliday {
            title_en: "Queen Mother Monineath's Birthday",
            title_km: "ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្មសម្តេចព្រះមហាក្សត្រី",
            start_date: format!("{}-06-18", y),
            end_date: format!("{}-06-18", y),
            event_type: CalendarEventType::Holiday,
        },
        CambodianHoliday {
            title_en: "Constitution Day",
            title_km: "ទិវារដ្ឋធម្មនុញ្ញ",
            start_date: format!("{}-09-24", y),
            end_date: format!("{}-09-24", y),
            event_type: CalendarEventType::Holiday,
        },
        CambodianHoliday {
            title_en: "Paris Peace Agreement Day",
            title_km: "ទិវាសន្ធិសញ្ញាសន្តិភាពក្រុងប៉ារីស",
            start_date: format!("{}-10-23", y),
            end_date: format!("{}-10-23", y),
            event_type: CalendarEventType::Holiday,
        },
        CambodianHoliday {
            title_en: "King's Coronation Day",
            title_km: "ព្រះរាជពិធីគ្រងព្រះបរមរាជសម្បត្តិ",
            start_date: format!("{}-10-29", y),
            end_date: format!("{}-10-29", y),
            event_type: CalendarEventType::Holiday,
        },
        CambodianHoliday {
            title_en: "Independence Day",
            title_km: "ទិវាឯករាជ្យជាតិ",
            start_date: format!("{}-11-09", y),
            end_date: format!("{}-11-09", y),
            event_type: CalendarEventType::Holiday,
        },
    ];

    // === Lunar-based holidays (dates vary by year) ===
    match year {
        2025 => {
            holidays.extend(vec![
                CambodianHoliday {
                    title_en: "Meak Bochea Day",
                    title_km: "ពិធីបុណ្យមាឃបូជា",
                    start_date: format!("{}-02-12", y),
                    end_date: format!("{}-02-12", y),
                    event_type: CalendarEventType::Holiday,
                },
                CambodianHoliday {
                    title_en: "Royal Ploughing Ceremony",
                    title_km: "ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល",
                    start_date: format!("{}-05-08", y),
                    end_date: format!("{}-05-08", y),
                    event_type: CalendarEventType::Holiday,
                },
                CambodianHoliday {
                    title_en: "Visak Bochea Day",
                    title_km: "ពិធីបុណ្យវិសាខបូជា",
                    start_date: format!("{}-05-12", y),
                    end_date: format!("{}-05-12", y),
                    event_type: CalendarEventType::Holiday,
                },
                CambodianHoliday {
                    title_en: "Pchum Ben (Ancestors' Day)",
                    title_km: "បុណ្យភ្ជុំបិណ្ឌ",
                    start_date: format!("{}-10-04", y),
                    end_date: format!("{}-10-06", y),
                    event_type: CalendarEventType::Holiday,
                },
                CambodianHoliday {
                    title_en: "Water Festival (Bon Om Touk)",
                    title_km: "បុណ្យអុំទូក បណ្ដែតប្រទីប សំពះព្រះខែ",
                    start_date: format!("{}-11-05", y),
                    end_date: format!("{}-11-07", y),
                    event_type: CalendarEventType::Holiday,
                },
            ]);
        }
        2026 => {
            holidays.extend(vec![
                CambodianHoliday {
                    title_en: "Meak Bochea Day",
                    title_km: "ពិធីបុណ្យមាឃបូជា",
                    start_date: format!("{}-03-03", y),
                    end_date: format!("{}-03-03", y),
                    event_type: CalendarEventType::Holiday,
                },
                CambodianHoliday {
                    title_en: "Royal Ploughing Ceremony",
                    title_km: "ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល",
                    start_date: format!("{}-05-18", y),
                    end_date: format!("{}-05-18", y),
                    event_type: CalendarEventType::Holiday,
                },
                CambodianHoliday {
                    title_en: "Visak Bochea Day",
                    title_km: "ពិធីបុណ្យវិសាខបូជា",
                    start_date: format!("{}-05-31", y),
                    end_date: format!("{}-05-31", y),
                    event_type: CalendarEventType::Holiday,
                },
                CambodianHoliday {
                    title_en: "Pchum Ben (Ancestors' Day)",
                    title_km: "បុណ្យភ្ជុំបិណ្ឌ",
                    start_date: format!("{}-09-22", y),
                    end_date: format!("{}-09-24", y),
                    event_type: CalendarEventType::Holiday,
                },
                CambodianHoliday {
                    title_en: "Water Festival (Bon Om Touk)",
                    title_km: "បុណ្យអុំទូក បណ្ដែតប្រទីប សំពះព្រះខែ",
                    start_date: format!("{}-10-25", y),
                    end_date: format!("{}-10-27", y),
                    event_type: CalendarEventType::Holiday,
                },
            ]);
        }
        _ => {
            // For other years, only fixed-date holidays are included.
            // Lunar-based holidays must be added manually.
        }
    }

    // === MoEYS School Breaks ===
    holidays.push(CambodianHoliday {
        title_en: "Khmer New Year School Break",
        title_km: "សម្រាកបុណ្យចូលឆ្នាំថ្មី",
        start_date: format!("{}-04-12", y),
        end_date: format!("{}-04-20", y),
        event_type: CalendarEventType::Break,
    });

    holidays
}
