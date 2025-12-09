"use client";

import { useState, useEffect, useCallback } from "react";
import {
	graphqlRequest,
	SUBJECT_QUERIES,
	SUBJECT_MUTATIONS,
} from "@/lib/graphql-client";
import { useAuth } from "@/contexts/auth-context";

export interface AssessmentWeight {
	type: string;
	weight: number;
}

export interface Subject {
	id: string;
	schoolId: string;
	name: string;
	code: string;
	description?: string;
	category: string;
	credits: number;
	isElective: boolean;
	status: string;
	prerequisites?: string[];
	assessmentWeights?: AssessmentWeight[];
}

export interface CreateSubjectInput {
	schoolId: string;
	name: string;
	code: string;
	description?: string;
	category: string;
	credits: number;
	isElective?: boolean;
}

export interface UpdateSubjectInput {
	name?: string;
	code?: string;
	description?: string;
	category?: string;
	credits?: number;
	isElective?: boolean;
	status?: string;
}

export function useSubjects(schoolId: string | null) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [subjects, setSubjects] = useState<Subject[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchSubjects = useCallback(async () => {
		if (!schoolId || !isAuthenticated) {
			setSubjects([]);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ subjectsBySchool: Subject[] }>(
				SUBJECT_QUERIES.BY_SCHOOL,
				{ schoolId },
				token
			);
			setSubjects(data.subjectsBySchool || []);
		} catch (err) {
			console.error("Failed to fetch subjects:", err);
			setError(err instanceof Error ? err.message : "Failed to load subjects");
		} finally {
			setIsLoading(false);
		}
	}, [schoolId, isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchSubjects();
	}, [fetchSubjects]);

	const createSubject = useCallback(
		async (input: CreateSubjectInput) => {
			const token = getAccessToken();
			const data = await graphqlRequest<{ createSubject: Subject }>(
				SUBJECT_MUTATIONS.CREATE,
				{ input },
				token
			);
			await fetchSubjects();
			return data.createSubject;
		},
		[getAccessToken, fetchSubjects]
	);

	const updateSubject = useCallback(
		async (id: string, input: UpdateSubjectInput) => {
			const token = getAccessToken();
			const data = await graphqlRequest<{ updateSubject: Subject }>(
				SUBJECT_MUTATIONS.UPDATE,
				{ id, input },
				token
			);
			await fetchSubjects();
			return data.updateSubject;
		},
		[getAccessToken, fetchSubjects]
	);

	const deleteSubject = useCallback(
		async (id: string) => {
			const token = getAccessToken();
			await graphqlRequest<{ deleteSubject: boolean }>(
				SUBJECT_MUTATIONS.DELETE,
				{ id },
				token
			);
			await fetchSubjects();
		},
		[getAccessToken, fetchSubjects]
	);

	return {
		subjects,
		isLoading,
		error,
		refresh: fetchSubjects,
		createSubject,
		updateSubject,
		deleteSubject,
	};
}

export function useSubject(id: string | null) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [subject, setSubject] = useState<Subject | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id || !isAuthenticated) {
			setSubject(null);
			return;
		}

		const fetchSubject = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const token = getAccessToken();
				const data = await graphqlRequest<{ subject: Subject }>(
					SUBJECT_QUERIES.GET_BY_ID,
					{ id },
					token
				);
				setSubject(data.subject || null);
			} catch (err) {
				console.error("Failed to fetch subject:", err);
				setError(err instanceof Error ? err.message : "Failed to load subject");
			} finally {
				setIsLoading(false);
			}
		};

		fetchSubject();
	}, [id, isAuthenticated, getAccessToken]);

	return { subject, isLoading, error };
}
