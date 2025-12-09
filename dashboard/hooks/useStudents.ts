"use client";

import { useState, useEffect, useCallback } from "react";
import {
	graphqlRequest,
	STUDENT_QUERIES,
	STUDENT_MUTATIONS,
} from "@/lib/graphql-client";
import { useAuth } from "@/contexts/auth-context";

export interface DateOfBirth {
	day: number;
	month: number;
	year: number;
}

export interface Guardian {
	firstName: string;
	lastName: string;
	relationship: string;
	phone: string;
	email?: string;
	isPrimary: boolean;
}

export interface Enrollment {
	enrollmentDate: string;
	enrollmentType: string;
	entryGrade: string;
}

export interface HealthInfo {
	bloodType?: string;
	allergies?: string[];
	medicalConditions?: string[];
}

export interface Student {
	id: string;
	schoolId: string;
	studentId: string;
	firstName: string;
	lastName: string;
	firstNameKm?: string;
	lastNameKm?: string;
	dateOfBirth?: DateOfBirth;
	gender?: string;
	gradeLevel: string;
	status: string;
	fullName: string;
	fullNameKm?: string;
	age?: number;
	guardians?: Guardian[];
	enrollment?: Enrollment;
	healthInfo?: HealthInfo;
}

export interface CreateStudentInput {
	schoolId: string;
	firstName: string;
	lastName: string;
	firstNameKm?: string;
	lastNameKm?: string;
	dateOfBirth?: DateOfBirth;
	gender?: string;
	gradeLevel: string;
}

export interface UpdateStudentInput {
	firstName?: string;
	lastName?: string;
	firstNameKm?: string;
	lastNameKm?: string;
	dateOfBirth?: DateOfBirth;
	gender?: string;
	gradeLevel?: string;
	status?: string;
}

export function useStudents(schoolId: string | null) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [students, setStudents] = useState<Student[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchStudents = useCallback(async () => {
		if (!schoolId || !isAuthenticated) {
			setStudents([]);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ studentsBySchool: Student[] }>(
				STUDENT_QUERIES.BY_SCHOOL,
				{ schoolId },
				token
			);
			setStudents(data.studentsBySchool || []);
		} catch (err) {
			console.error("Failed to fetch students:", err);
			setError(err instanceof Error ? err.message : "Failed to load students");
		} finally {
			setIsLoading(false);
		}
	}, [schoolId, isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchStudents();
	}, [fetchStudents]);

	const createStudent = useCallback(
		async (input: CreateStudentInput) => {
			const token = getAccessToken();
			const data = await graphqlRequest<{ createStudent: Student }>(
				STUDENT_MUTATIONS.CREATE,
				{ input },
				token
			);
			await fetchStudents();
			return data.createStudent;
		},
		[getAccessToken, fetchStudents]
	);

	const updateStudent = useCallback(
		async (id: string, input: UpdateStudentInput) => {
			const token = getAccessToken();
			const data = await graphqlRequest<{ updateStudent: Student }>(
				STUDENT_MUTATIONS.UPDATE,
				{ id, input },
				token
			);
			await fetchStudents();
			return data.updateStudent;
		},
		[getAccessToken, fetchStudents]
	);

	const deleteStudent = useCallback(
		async (id: string) => {
			const token = getAccessToken();
			await graphqlRequest<{ deleteStudent: boolean }>(
				STUDENT_MUTATIONS.DELETE,
				{ id },
				token
			);
			await fetchStudents();
		},
		[getAccessToken, fetchStudents]
	);

	return {
		students,
		isLoading,
		error,
		refresh: fetchStudents,
		createStudent,
		updateStudent,
		deleteStudent,
	};
}

export function useStudentsByClass(classId: string | null) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [students, setStudents] = useState<Student[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchStudents = useCallback(async () => {
		if (!classId || !isAuthenticated) {
			setStudents([]);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ studentsByClass: Student[] }>(
				STUDENT_QUERIES.BY_CLASS,
				{ classId },
				token
			);
			setStudents(data.studentsByClass || []);
		} catch (err) {
			console.error("Failed to fetch students:", err);
			setError(err instanceof Error ? err.message : "Failed to load students");
		} finally {
			setIsLoading(false);
		}
	}, [classId, isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchStudents();
	}, [fetchStudents]);

	return { students, isLoading, error, refresh: fetchStudents };
}

export function useStudent(id: string | null) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [student, setStudent] = useState<Student | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id || !isAuthenticated) {
			setStudent(null);
			return;
		}

		const fetchStudent = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const token = getAccessToken();
				const data = await graphqlRequest<{ student: Student }>(
					STUDENT_QUERIES.GET_BY_ID,
					{ id },
					token
				);
				setStudent(data.student || null);
			} catch (err) {
				console.error("Failed to fetch student:", err);
				setError(err instanceof Error ? err.message : "Failed to load student");
			} finally {
				setIsLoading(false);
			}
		};

		fetchStudent();
	}, [id, isAuthenticated, getAccessToken]);

	return { student, isLoading, error };
}
