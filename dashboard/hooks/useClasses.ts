"use client";

import { useState, useEffect, useCallback } from "react";
import {
	graphqlRequest,
	CLASS_QUERIES,
	CLASS_MUTATIONS,
} from "@/lib/graphql-client";
import { useAuth } from "@/contexts/auth-context";

export interface ClassPeriod {
	periodNumber: number;
	subjectId: string;
	teacherId: string;
	startTime: string;
	endTime: string;
}

export interface ClassSchedule {
	day: string;
	periods: ClassPeriod[];
}

export interface Class {
	id: string;
	schoolId: string;
	academicYearId: string;
	name: string;
	code: string;
	gradeLevel: string;
	section?: string;
	homeroomTeacherId?: string;
	roomNumber?: string;
	capacity: number;
	currentEnrollment: number;
	status: string;
	schedule?: ClassSchedule[];
	hasCapacity: boolean;
	availableSpots: number;
}

export interface CreateClassInput {
	schoolId: string;
	academicYearId: string;
	name: string;
	code: string;
	gradeLevel: string;
	section?: string;
	homeroomTeacherId?: string;
	roomNumber?: string;
	capacity: number;
}

export interface UpdateClassInput {
	name?: string;
	section?: string;
	homeroomTeacherId?: string;
	roomNumber?: string;
	capacity?: number;
	status?: string;
}

export function useClasses(schoolId: string | null) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [classes, setClasses] = useState<Class[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchClasses = useCallback(async () => {
		if (!schoolId || !isAuthenticated) {
			setClasses([]);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ classesBySchool: Class[] }>(
				CLASS_QUERIES.BY_SCHOOL,
				{ schoolId },
				token
			);
			setClasses(data.classesBySchool || []);
		} catch (err) {
			console.error("Failed to fetch classes:", err);
			setError(err instanceof Error ? err.message : "Failed to load classes");
		} finally {
			setIsLoading(false);
		}
	}, [schoolId, isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchClasses();
	}, [fetchClasses]);

	const createClass = useCallback(
		async (input: CreateClassInput) => {
			const token = getAccessToken();
			const data = await graphqlRequest<{ createClass: Class }>(
				CLASS_MUTATIONS.CREATE,
				{ input },
				token
			);
			await fetchClasses();
			return data.createClass;
		},
		[getAccessToken, fetchClasses]
	);

	const updateClass = useCallback(
		async (id: string, input: UpdateClassInput) => {
			const token = getAccessToken();
			const data = await graphqlRequest<{ updateClass: Class }>(
				CLASS_MUTATIONS.UPDATE,
				{ id, input },
				token
			);
			await fetchClasses();
			return data.updateClass;
		},
		[getAccessToken, fetchClasses]
	);

	const deleteClass = useCallback(
		async (id: string) => {
			const token = getAccessToken();
			await graphqlRequest<{ deleteClass: boolean }>(
				CLASS_MUTATIONS.DELETE,
				{ id },
				token
			);
			await fetchClasses();
		},
		[getAccessToken, fetchClasses]
	);

	return {
		classes,
		isLoading,
		error,
		refresh: fetchClasses,
		createClass,
		updateClass,
		deleteClass,
	};
}

export function useClass(id: string | null) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [classData, setClassData] = useState<Class | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id || !isAuthenticated) {
			setClassData(null);
			return;
		}

		const fetchClass = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const token = getAccessToken();
				const data = await graphqlRequest<{ class: Class }>(
					CLASS_QUERIES.GET_BY_ID,
					{ id },
					token
				);
				setClassData(data.class || null);
			} catch (err) {
				console.error("Failed to fetch class:", err);
				setError(err instanceof Error ? err.message : "Failed to load class");
			} finally {
				setIsLoading(false);
			}
		};

		fetchClass();
	}, [id, isAuthenticated, getAccessToken]);

	return { classData, isLoading, error };
}
