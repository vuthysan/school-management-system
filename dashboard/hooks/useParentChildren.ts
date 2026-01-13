"use client";

import { useState, useEffect, useCallback } from "react";
import { graphqlRequest } from "@/lib/graphql-client";
import { PARENT_QUERIES } from "@/app/graphql/parent";
import { useAuth } from "@/contexts/auth-context";

// Types for parent portal
export interface ChildInfo {
	id: string;
	studentId: string;
	firstNameKm?: string;
	lastNameKm?: string;
	firstNameEn?: string;
	lastNameEn?: string;
	fullName: string;
	gradeLevel: string;
	status: string;
	dateOfBirth?: {
		day: number;
		month: number;
		year: number;
	};
	gender?: string;
	contact?: {
		email?: string;
		phone?: string;
	};
	currentClass?: {
		id: string;
		name: string;
		grade: string;
	};
	attendanceRate?: number;
	averageGrade?: string;
}

export interface ChildGrade {
	id: string;
	subjectId: string;
	subjectName: string;
	score: number;
	maxScore: number;
	percentage: number;
	gradeDate: string;
	term: string;
}

export interface ChildAttendance {
	id: string;
	date: string;
	status: "present" | "absent" | "late" | "excused";
	note?: string;
}

export function useParentChildren() {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [children, setChildren] = useState<ChildInfo[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchChildren = useCallback(async () => {
		if (!isAuthenticated) {
			setChildren([]);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{
				myChildren: ChildInfo[];
			}>(PARENT_QUERIES.GET_MY_CHILDREN, {}, token);

			setChildren(data.myChildren || []);
		} catch (err) {
			console.error("Failed to fetch children:", err);
			setError(err instanceof Error ? err.message : "Failed to load children");
		} finally {
			setIsLoading(false);
		}
	}, [isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchChildren();
	}, [fetchChildren]);

	return {
		children,
		isLoading,
		error,
		refresh: fetchChildren,
	};
}

export function useChildGrades(studentId: string | null) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [grades, setGrades] = useState<ChildGrade[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!studentId || !isAuthenticated) {
			setGrades([]);
			return;
		}

		const fetchGrades = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const token = getAccessToken();
				const data = await graphqlRequest<{
					gradesByStudent: ChildGrade[];
				}>(PARENT_QUERIES.GET_CHILD_GRADES, { studentId }, token);

				setGrades(data.gradesByStudent || []);
			} catch (err) {
				console.error("Failed to fetch grades:", err);
				setError(err instanceof Error ? err.message : "Failed to load grades");
			} finally {
				setIsLoading(false);
			}
		};

		fetchGrades();
	}, [studentId, isAuthenticated, getAccessToken]);

	return { grades, isLoading, error };
}

export function useChildAttendance(
	studentId: string | null,
	startDate?: string,
	endDate?: string
) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [attendance, setAttendance] = useState<ChildAttendance[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!studentId || !isAuthenticated) {
			setAttendance([]);
			return;
		}

		const fetchAttendance = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const token = getAccessToken();
				const data = await graphqlRequest<{
					attendanceByStudent: ChildAttendance[];
				}>(
					PARENT_QUERIES.GET_CHILD_ATTENDANCE,
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
		};

		fetchAttendance();
	}, [studentId, startDate, endDate, isAuthenticated, getAccessToken]);

	return { attendance, isLoading, error };
}
