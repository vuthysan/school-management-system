"use client";

import { useState, useEffect, useCallback } from "react";
import { graphqlRequest } from "@/lib/graphql-client";
import { EXAM_QUERIES, EXAM_MUTATIONS } from "@/app/graphql/exam";
import { useAuth } from "@/contexts/auth-context";
import {
	ExamSchedule,
	ExamFilterInput,
	ExamSortInput,
	ExamScheduleFormData,
	PaginatedExamsResult,
} from "@/types/academic";

export interface UseExamsOptions {
	schoolId: string | null;
	page?: number;
	pageSize?: number;
	filter?: ExamFilterInput;
	sort?: ExamSortInput;
}

export function useExams(options: UseExamsOptions) {
	const { schoolId, page = 1, pageSize = 10, filter, sort } = options;
	const { getAccessToken, isAuthenticated } = useAuth();
	const [exams, setExams] = useState<ExamSchedule[]>([]);
	const [total, setTotal] = useState(0);
	const [totalPages, setTotalPages] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchExams = useCallback(async () => {
		if (!schoolId || !isAuthenticated) {
			setExams([]);
			setTotal(0);
			setTotalPages(0);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{
				exams: PaginatedExamsResult;
			}>(
				EXAM_QUERIES.GET_EXAMS,
				{
					schoolId,
					page,
					pageSize,
					filter: filter || undefined,
					sort: sort || undefined,
				},
				token
			);

			setExams(data.exams.items || []);
			setTotal(data.exams.total);
			setTotalPages(data.exams.totalPages);
		} catch (err) {
			console.error("Failed to fetch exams:", err);
			setError(err instanceof Error ? err.message : "Failed to load exams");
		} finally {
			setIsLoading(false);
		}
	}, [schoolId, page, pageSize, filter, sort, isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchExams();
	}, [fetchExams]);

	const createExam = useCallback(
		async (input: ExamScheduleFormData) => {
			const token = getAccessToken();
			const data = await graphqlRequest<{ createExam: ExamSchedule }>(
				EXAM_MUTATIONS.CREATE,
				{ input },
				token
			);

			await fetchExams();
			return data.createExam;
		},
		[getAccessToken, fetchExams]
	);

	const updateExam = useCallback(
		async (id: string, input: Partial<ExamScheduleFormData>) => {
			const token = getAccessToken();
			const data = await graphqlRequest<{ updateExam: ExamSchedule }>(
				EXAM_MUTATIONS.UPDATE,
				{ id, input },
				token
			);

			await fetchExams();
			return data.updateExam;
		},
		[getAccessToken, fetchExams]
	);

	const deleteExam = useCallback(
		async (id: string) => {
			const token = getAccessToken();
			await graphqlRequest<{ deleteExam: boolean }>(
				EXAM_MUTATIONS.DELETE,
				{ id },
				token
			);
			await fetchExams();
		},
		[getAccessToken, fetchExams]
	);

	return {
		exams,
		total,
		totalPages,
		isLoading,
		error,
		refresh: fetchExams,
		createExam,
		updateExam,
		deleteExam,
	};
}

export function useExam(id: string | null) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [exam, setExam] = useState<ExamSchedule | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!id || !isAuthenticated) {
			setExam(null);
			return;
		}

		const fetchExam = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const token = getAccessToken();
				const data = await graphqlRequest<{ exam: ExamSchedule }>(
					EXAM_QUERIES.GET_EXAM,
					{ id },
					token
				);

				setExam(data.exam || null);
			} catch (err) {
				console.error("Failed to fetch exam:", err);
				setError(err instanceof Error ? err.message : "Failed to load exam");
			} finally {
				setIsLoading(false);
			}
		};

		fetchExam();
	}, [id, isAuthenticated, getAccessToken]);

	return { exam, isLoading, error };
}
