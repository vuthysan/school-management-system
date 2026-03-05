"use client";

import { useState, useEffect, useCallback } from "react";
import {
	graphqlRequest,
	CALENDAR_QUERIES,
	CALENDAR_MUTATIONS,
} from "@/lib/graphql-client";
import { useAuth } from "@/contexts/auth-context";

export type CalendarEventType =
	| "Holiday"
	| "Break"
	| "Exam"
	| "Event"
	| "Meeting"
	| "Deadline"
	| "Other";

export type RecurrencePattern =
	| "None"
	| "Daily"
	| "Weekly"
	| "Monthly"
	| "Yearly";

export interface CalendarEvent {
	idStr: string;
	title: string;
	description?: string;
	eventType: CalendarEventType;
	startDateStr: string;
	endDateStr: string;
	isAllDay: boolean;
	isRecurring: boolean;
	recurrencePattern: RecurrencePattern;
	color?: string;
	location?: string;
	isSchoolClosed: boolean;
}

export interface CreateCalendarEventInput {
	schoolId: string;
	title: string;
	description?: string;
	eventType?: CalendarEventType;
	startDate: string;
	endDate: string;
	isAllDay?: boolean;
	isRecurring?: boolean;
	recurrencePattern?: RecurrencePattern;
	color?: string;
	location?: string;
	isSchoolClosed?: boolean;
}

export interface UpdateCalendarEventInput {
	title?: string;
	description?: string;
	eventType?: CalendarEventType;
	startDate?: string;
	endDate?: string;
	isAllDay?: boolean;
	isRecurring?: boolean;
	recurrencePattern?: RecurrencePattern;
	color?: string;
	location?: string;
	isSchoolClosed?: boolean;
}

export function useCalendarEvents(schoolId: string) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchCalendarEvents = useCallback(async () => {
		if (!isAuthenticated || !schoolId) {
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);
		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ calendarEvents: CalendarEvent[] }>(
				CALENDAR_QUERIES.GET_ALL,
				{ schoolId },
				token
			);
			setCalendarEvents(data.calendarEvents || []);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to fetch calendar events"
			);
		} finally {
			setLoading(false);
		}
	}, [schoolId, isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchCalendarEvents();
	}, [fetchCalendarEvents]);

	return { calendarEvents, loading, error, refetch: fetchCalendarEvents };
}

export function useCreateCalendarEvent() {
	const { getAccessToken } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createCalendarEvent = async (
		input: CreateCalendarEventInput
	): Promise<CalendarEvent> => {
		setLoading(true);
		setError(null);
		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ createCalendarEvent: CalendarEvent }>(
				CALENDAR_MUTATIONS.CREATE,
				{ input },
				token
			);
			return data.createCalendarEvent;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to create calendar event";
			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return { createCalendarEvent, loading, error };
}

export function useUpdateCalendarEvent() {
	const { getAccessToken } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const updateCalendarEvent = async (
		id: string,
		input: UpdateCalendarEventInput
	): Promise<CalendarEvent> => {
		setLoading(true);
		setError(null);
		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ updateCalendarEvent: CalendarEvent }>(
				CALENDAR_MUTATIONS.UPDATE,
				{ id, input },
				token
			);
			return data.updateCalendarEvent;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to update calendar event";
			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return { updateCalendarEvent, loading, error };
}

export function useDeleteCalendarEvent() {
	const { getAccessToken } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const deleteCalendarEvent = async (id: string): Promise<boolean> => {
		setLoading(true);
		setError(null);
		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ deleteCalendarEvent: boolean }>(
				CALENDAR_MUTATIONS.DELETE,
				{ id },
				token
			);
			return data.deleteCalendarEvent;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to delete calendar event";
			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return { deleteCalendarEvent, loading, error };
}

export function useCalendarEventsInRange(
	schoolId: string | null,
	startDate: string | null,
	endDate: string | null
) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchCalendarEvents = useCallback(async () => {
		if (!isAuthenticated || !schoolId || !startDate || !endDate) {
			setCalendarEvents([]);
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);
		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{
				calendarEventsInRange: CalendarEvent[];
			}>(CALENDAR_QUERIES.GET_IN_RANGE, { schoolId, startDate, endDate }, token);
			setCalendarEvents(data.calendarEventsInRange || []);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to fetch calendar events"
			);
		} finally {
			setLoading(false);
		}
	}, [schoolId, startDate, endDate, isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchCalendarEvents();
	}, [fetchCalendarEvents]);

	return { calendarEvents, loading, error, refetch: fetchCalendarEvents };
}

export function useSeedCambodianHolidays() {
	const { getAccessToken } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const seedHolidays = async (
		schoolId: string,
		year: number
	): Promise<CalendarEvent[]> => {
		setLoading(true);
		setError(null);
		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{
				seedCambodianHolidays: CalendarEvent[];
			}>(CALENDAR_MUTATIONS.SEED_CAMBODIAN_HOLIDAYS, { schoolId, year }, token);
			return data.seedCambodianHolidays;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to seed holidays";
			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return { seedHolidays, loading, error };
}
