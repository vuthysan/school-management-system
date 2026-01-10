"use client";

import { useState, useEffect, useCallback } from "react";
import {
	graphqlRequest,
	TERM_QUERIES,
	TERM_MUTATIONS,
} from "@/lib/graphql-client";
import { useAuth } from "@/contexts/auth-context";

export interface Term {
	idStr: string;
	name: string;
	termNumber: number;
	termType: string;
	startDateStr: string;
	endDateStr: string;
	isCurrent: boolean;
	description?: string;
	academicYearIdStr: string;
}

export interface CreateTermInput {
	schoolId: string;
	academicYearId: string;
	name: string;
	termNumber: number;
	termType?: string;
	startDate: string;
	endDate: string;
	isCurrent?: boolean;
	description?: string;
}

export interface UpdateTermInput {
	name?: string;
	termNumber?: number;
	termType?: string;
	startDate?: string;
	endDate?: string;
	isCurrent?: boolean;
	description?: string;
}

export function useTerms(schoolId: string) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [terms, setTerms] = useState<Term[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchTerms = useCallback(async () => {
		if (!isAuthenticated || !schoolId) {
			setLoading(false);
			return;
		}

		setLoading(true);
		setError(null);
		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ terms: Term[] }>(
				TERM_QUERIES.GET_ALL,
				{ schoolId },
				token
			);
			setTerms(data.terms || []);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to fetch terms");
		} finally {
			setLoading(false);
		}
	}, [schoolId, isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchTerms();
	}, [fetchTerms]);

	return { terms, loading, error, refetch: fetchTerms };
}

export function useCreateTerm() {
	const { getAccessToken } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createTerm = async (input: CreateTermInput): Promise<Term> => {
		setLoading(true);
		setError(null);
		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ createTerm: Term }>(
				TERM_MUTATIONS.CREATE,
				{ input },
				token
			);
			return data.createTerm;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to create term";
			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return { createTerm, loading, error };
}

export function useUpdateTerm() {
	const { getAccessToken } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const updateTerm = async (
		id: string,
		input: UpdateTermInput
	): Promise<Term> => {
		setLoading(true);
		setError(null);
		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ updateTerm: Term }>(
				TERM_MUTATIONS.UPDATE,
				{ id, input },
				token
			);
			return data.updateTerm;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to update term";
			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return { updateTerm, loading, error };
}

export function useDeleteTerm() {
	const { getAccessToken } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const deleteTerm = async (id: string): Promise<boolean> => {
		setLoading(true);
		setError(null);
		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ deleteTerm: boolean }>(
				TERM_MUTATIONS.DELETE,
				{ id },
				token
			);
			return data.deleteTerm;
		} catch (err) {
			const errorMessage =
				err instanceof Error ? err.message : "Failed to delete term";
			setError(errorMessage);
			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	return { deleteTerm, loading, error };
}
