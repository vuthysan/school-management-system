"use client";

import { useState, useEffect, useCallback } from "react";

import {
	graphqlRequest,
	ATTENDANCE_QUERIES,
	ATTENDANCE_MUTATIONS,
} from "@/lib/graphql-client";
import { useAuth } from "@/contexts/auth-context";

export interface Attendance {
	id: string;
	studentId: string;
	classId: string;
	date: string;
	status: "Present" | "Absent" | "Late" | "Excused";
	remarks?: string;
}

export interface AttendanceSummary {
	totalDays: number;
	presentCount: number;
	absentCount: number;
	lateCount: number;
	attendanceRate: number;
}

export interface AttendanceRecordInput {
	studentId: string;
	status: string;
	remarks?: string;
}

export interface MarkAttendanceInput {
	studentId: string;
	classId: string;
	date: string;
	status: string;
	remarks?: string;
}

export function useAttendanceByClass(
	classId: string | null,
	date: string | null
) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [attendance, setAttendance] = useState<Attendance[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchAttendance = useCallback(async () => {
		if (!classId || !date || !isAuthenticated) {
			setAttendance([]);

			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ attendanceByClass: Attendance[] }>(
				ATTENDANCE_QUERIES.GET_BY_CLASS,
				{ classId, date },
				token
			);

			setAttendance(data.attendanceByClass || []);
		} catch (err) {
			console.error("Failed to fetch attendance:", err);
			setError(
				err instanceof Error ? err.message : "Failed to load attendance"
			);
		} finally {
			setIsLoading(false);
		}
	}, [classId, date, isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchAttendance();
	}, [fetchAttendance]);

	return { attendance, isLoading, error, refresh: fetchAttendance };
}

export function useAttendanceByStudent(
	studentId: string | null,
	startDate?: string,
	endDate?: string
) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [attendance, setAttendance] = useState<Attendance[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchAttendance = useCallback(async () => {
		if (!studentId || !isAuthenticated) {
			setAttendance([]);

			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ attendanceByStudent: Attendance[] }>(
				ATTENDANCE_QUERIES.GET_BY_STUDENT,
				{ studentId, startDate, endDate },
				token
			);

			setAttendance(data.attendanceByStudent || []);
		} catch (err) {
			console.error("Failed to fetch attendance:", err);
			setError(
				err instanceof Error ? err.message : "Failed to load attendance"
			);
		} finally {
			setIsLoading(false);
		}
	}, [studentId, startDate, endDate, isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchAttendance();
	}, [fetchAttendance]);

	return { attendance, isLoading, error, refresh: fetchAttendance };
}

export function useAttendanceSummary(
	classId: string | null,
	month: number,
	year: number
) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [summary, setSummary] = useState<AttendanceSummary | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!classId || !isAuthenticated) {
			setSummary(null);

			return;
		}

		const fetchSummary = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const token = getAccessToken();
				const data = await graphqlRequest<{
					attendanceSummaryByClass: AttendanceSummary;
				}>(
					ATTENDANCE_QUERIES.SUMMARY_BY_CLASS,
					{ classId, month, year },
					token
				);

				setSummary(data.attendanceSummaryByClass || null);
			} catch (err) {
				console.error("Failed to fetch attendance summary:", err);
				setError(err instanceof Error ? err.message : "Failed to load summary");
			} finally {
				setIsLoading(false);
			}
		};

		fetchSummary();
	}, [classId, month, year, isAuthenticated, getAccessToken]);

	return { summary, isLoading, error };
}

export function useAttendanceMutations() {
	const { getAccessToken } = useAuth();

	const markAttendance = useCallback(
		async (input: MarkAttendanceInput) => {
			const token = getAccessToken();
			const data = await graphqlRequest<{ markAttendance: Attendance }>(
				ATTENDANCE_MUTATIONS.MARK_ATTENDANCE,
				{ input },
				token
			);

			return data.markAttendance;
		},
		[getAccessToken]
	);

	const markBulkAttendance = useCallback(
		async (
			classId: string,
			date: string,
			markedBy: string,
			records: AttendanceRecordInput[]
		) => {
			const token = getAccessToken();
			const data = await graphqlRequest<{
				markBulkAttendance: { success: boolean; count: number };
			}>(
				ATTENDANCE_MUTATIONS.MARK_BULK_ATTENDANCE,
				{ classId, date, markedBy, records },
				token
			);

			return data.markBulkAttendance;
		},
		[getAccessToken]
	);

	const updateAttendance = useCallback(
		async (id: string, status: string, remarks?: string) => {
			const token = getAccessToken();
			const data = await graphqlRequest<{ updateAttendance: Attendance }>(
				ATTENDANCE_MUTATIONS.UPDATE_ATTENDANCE,
				{ id, status, remarks },
				token
			);

			return data.updateAttendance;
		},
		[getAccessToken]
	);

	return { markAttendance, markBulkAttendance, updateAttendance };
}
