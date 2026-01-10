"use client";

import { useState, useEffect, useCallback } from "react";
import {
	graphqlRequest,
	ACADEMIC_YEAR_QUERIES,
	ACADEMIC_YEAR_MUTATIONS,
} from "@/lib/graphql-client";
import { useAuth } from "@/contexts/auth-context";

export interface AcademicYear {
	idStr: string;
	name: string;
	label?: string;
	startDateStr: string;
	endDateStr: string;
	isCurrent: boolean;
	status: string;
	description?: string;
}

export interface CreateAcademicYearInput {
	schoolId: string;
	name: string;
	label?: string;
	startDate: string;
	endDate: string;
	isCurrent?: boolean;
	status?: string;
	description?: string;
}

export interface UpdateAcademicYearInput {
	name?: string;
	label?: string;
	startDate?: string;
	endDate?: string;
	isCurrent?: boolean;
	status?: string;
	description?: string;
}

export function useAcademicYears(schoolId: string) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchAcademicYears = useCallback(async () => {
		if (!isAuthenticated || !schoolId) {
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);
		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ academicYears: AcademicYear[] }>(
				ACADEMIC_YEAR_QUERIES.GET_ALL,
				{ schoolId },
				token
			);
			setAcademicYears(data.academicYears || []);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to fetch academic years"
			);
		} finally {
			setLoading(false);
		}
	}, [schoolId, isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchAcademicYears();
	}, [fetchAcademicYears]);

	return { academicYears, loading, error, refetch: fetchAcademicYears };
}

export function useCreateAcademicYear() {
	const { getAccessToken } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createAcademicYear = async (
		input: CreateAcademicYearInput
	): Promise<AcademicYear> => {
		setLoading(true);
		setError(null);
		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ createAcademicYear: AcademicYear }>(
				ACADEMIC_YEAR_MUTATIONS.CREATE,
				{ input },
				token
			);
			return data.createAcademicYear;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to create academic year";
			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return { createAcademicYear, loading, error };
}

export function useUpdateAcademicYear() {
	const { getAccessToken } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const updateAcademicYear = async (
		id: string,
		input: UpdateAcademicYearInput
	): Promise<AcademicYear> => {
		setLoading(true);
		setError(null);
		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ updateAcademicYear: AcademicYear }>(
				ACADEMIC_YEAR_MUTATIONS.UPDATE,
				{ id, input },
				token
			);
			return data.updateAcademicYear;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to update academic year";
			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return { updateAcademicYear, loading, error };
}

export function useDeleteAcademicYear() {
	const { getAccessToken } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const deleteAcademicYear = async (id: string): Promise<boolean> => {
		setLoading(true);
		setError(null);
		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ deleteAcademicYear: boolean }>(
				ACADEMIC_YEAR_MUTATIONS.DELETE,
				{ id },
				token
			);
			return data.deleteAcademicYear;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to delete academic year";
			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return { deleteAcademicYear, loading, error };
}

export function useSetCurrentAcademicYear() {
	const { getAccessToken } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const setCurrentAcademicYear = async (id: string): Promise<AcademicYear> => {
		setLoading(true);
		setError(null);
		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{
				setCurrentAcademicYear: AcademicYear;
			}>(ACADEMIC_YEAR_MUTATIONS.SET_CURRENT, { id }, token);
			return data.setCurrentAcademicYear;
		} catch (err) {
			const errorMessage =
				err instanceof Error
					? err.message
					: "Failed to set current academic year";
			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return { setCurrentAcademicYear, loading, error };
}
