"use client";

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { graphqlRequest } from "@/lib/graphql-client";
import { HR_QUERIES, HR_MUTATIONS } from "@/app/graphql/hr";

export interface Staff {
	id: string;
	staffId: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	dateOfBirth: string;
	gender: string;
	address: string;
	role: string;
	department?: string;
	subjects: string[];
	hireDate: string;
	salary: number;
	currency: string;
	status: string;
	profilePhoto?: string;
	createdAt: string;
	updatedAt: string;
}

export interface Payroll {
	id: string;
	staffId: string;
	month: string;
	baseSalary: number;
	bonuses: number;
	deductions: number;
	netSalary: number;
	currency: string;
	paymentDate: string;
	status: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateStaffInput {
	staffId: string;
	firstName: string;
	lastName: string;
	email: string;
	phone: string;
	dateOfBirth: string;
	gender: string;
	address: string;
	role: string;
	department?: string;
	subjects: string[];
	salary: number;
	currency: string;
}

export interface UpdateStaffInput {
	firstName?: string;
	lastName?: string;
	email?: string;
	phone?: string;
	address?: string;
	role?: string;
	department?: string;
	subjects?: string[];
	salary?: number;
	status?: string;
}

export function useStaff(schoolId: string | undefined) {
	const { isAuthenticated, getAccessToken } = useAuth();
	const [staffList, setStaffList] = useState<Staff[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchStaff = useCallback(async () => {
		if (!schoolId || !isAuthenticated) {
			setStaffList([]);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ allStaff: Staff[] }>(
				HR_QUERIES.ALL_STAFF,
				{ schoolId },
				token
			);
			setStaffList(data.allStaff || []);
		} catch (err) {
			console.error("Failed to fetch staff:", err);
			setError(err instanceof Error ? err.message : "Failed to load staff");
		} finally {
			setLoading(false);
		}
	}, [schoolId, isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchStaff();
	}, [fetchStaff]);

	return { staffList, loading, error, refetch: fetchStaff };
}

export function useHRMutations() {
	const { getAccessToken } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createStaff = async (input: CreateStaffInput): Promise<Staff> => {
		setLoading(true);
		setError(null);
		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ createStaff: Staff }>(
				HR_MUTATIONS.CREATE_STAFF,
				{ input },
				token
			);
			return data.createStaff;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create staff");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const updateStaff = async (
		id: string,
		input: UpdateStaffInput
	): Promise<Staff> => {
		setLoading(true);
		setError(null);
		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ updateStaff: Staff }>(
				HR_MUTATIONS.UPDATE_STAFF,
				{ id, input },
				token
			);
			return data.updateStaff;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to update staff");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const deleteStaff = async (id: string): Promise<boolean> => {
		setLoading(true);
		setError(null);
		try {
			const token = getAccessToken();
			await graphqlRequest<{ deleteStaff: boolean }>(
				HR_MUTATIONS.DELETE_STAFF,
				{ id },
				token
			);
			return true;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to delete staff");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { createStaff, updateStaff, deleteStaff, loading, error };
}
