export const CALENDAR_QUERIES = {
	GET_ALL: `
    query GetCalendarEvents($schoolId: String!) {
      calendarEvents(schoolId: $schoolId) {
        idStr
        title
        description
        eventType
        startDateStr
        endDateStr
        isAllDay
        isRecurring
        recurrencePattern
        color
        location
        isSchoolClosed
      }
    }
  `,
	GET_IN_RANGE: `
    query CalendarEventsInRange($schoolId: String!, $startDate: String!, $endDate: String!) {
      calendarEventsInRange(schoolId: $schoolId, startDate: $startDate, endDate: $endDate) {
        idStr
        title
        description
        eventType
        startDateStr
        endDateStr
        isAllDay
        isRecurring
        recurrencePattern
        color
        location
        isSchoolClosed
      }
    }
  `,
};

export const CALENDAR_MUTATIONS = {
	CREATE: `
    mutation CreateCalendarEvent($input: CreateCalendarEventInput!) {
      createCalendarEvent(input: $input) {
        idStr
        title
        eventType
        startDateStr
        endDateStr
      }
    }
  `,
	UPDATE: `
    mutation UpdateCalendarEvent($id: String!, $input: UpdateCalendarEventInput!) {
      updateCalendarEvent(id: $id, input: $input) {
        idStr
        title
        eventType
        startDateStr
        endDateStr
      }
    }
  `,
	DELETE: `
    mutation DeleteCalendarEvent($id: String!) {
      deleteCalendarEvent(id: $id)
    }
  `,
	SEED_CAMBODIAN_HOLIDAYS: `
    mutation SeedCambodianHolidays($schoolId: String!, $year: Int!) {
      seedCambodianHolidays(schoolId: $schoolId, year: $year) {
        idStr
        title
        description
        eventType
        startDateStr
        endDateStr
        isAllDay
        isSchoolClosed
        color
      }
    }
  `,
};
