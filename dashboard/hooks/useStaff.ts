"use client";

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { graphqlRequest } from "@/lib/graphql-client";
import { HR_QUERIES, HR_MUTATIONS } from "@/app/graphql/hr";

// ============================================================================
// TYPES
// ============================================================================

export interface Staff {
	id: string;
	schoolId?: string;
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

export interface PayrollRecord {
	id: string;
	schoolId: string;
	staffId: string;
	staffName?: string;
	month: string;
	baseSalary: number;
	bonuses: number;
	deductions: number;
	netSalary: number;
	currency: string;
	paymentDate?: string;
	status: string;
	createdAt: string;
	updatedAt: string;
}

export interface LeaveRecord {
	id: string;
	schoolId: string;
	staffId: string;
	leaveType: string;
	startDate: string;
	endDate: string;
	days: number;
	reason: string;
	status: string;
	approvedBy?: string;
	rejectionReason?: string;
	createdAt: string;
	updatedAt: string;
}

export interface LeaveBalance {
	id: string;
	schoolId: string;
	staffId: string;
	academicYear: string;
	annualTotal: number;
	annualUsed: number;
	annualRemaining: number;
	sickTotal: number;
	sickUsed: number;
	sickRemaining: number;
	maternityTotal: number;
	maternityUsed: number;
	maternityRemaining: number;
	personalTotal: number;
	personalUsed: number;
	personalRemaining: number;
}

export interface CreateStaffInput {
	schoolId: string;
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

export interface CreateLeaveInput {
	schoolId: string;
	staffId: string;
	leaveType: string;
	startDate: string;
	endDate: string;
	days: number;
	reason: string;
}

export interface UpdateLeaveStatusInput {
	status: string;
	approvedBy?: string;
	rejectionReason?: string;
}

export interface GeneratePayrollInput {
	schoolId: string;
	month: string;
	defaultBonuses?: number;
	defaultDeductions?: number;
}

export interface BatchPayrollResult {
	generatedCount: number;
	totalAmount: number;
	month: string;
	payrolls: PayrollRecord[];
}

// Keep backward compat
export type Payroll = PayrollRecord;

// ============================================================================
// STAFF HOOK
// ============================================================================

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

// ============================================================================
// HR MUTATIONS HOOK
// ============================================================================

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

// ============================================================================
// LEAVES HOOK
// ============================================================================

export function useLeaves(schoolId: string | undefined, staffId?: string) {
	const { isAuthenticated, getAccessToken } = useAuth();
	const [leaves, setLeaves] = useState<LeaveRecord[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchLeaves = useCallback(async () => {
		if (!schoolId || !isAuthenticated) {
			setLeaves([]);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const token = getAccessToken();
			const variables: Record<string, unknown> = { schoolId };
			if (staffId) variables.staffId = staffId;

			const data = await graphqlRequest<{ staffLeaves: LeaveRecord[] }>(
				HR_QUERIES.STAFF_LEAVES,
				variables,
				token
			);
			setLeaves(data.staffLeaves || []);
		} catch (err) {
			console.error("Failed to fetch leaves:", err);
			setError(err instanceof Error ? err.message : "Failed to load leaves");
		} finally {
			setLoading(false);
		}
	}, [schoolId, staffId, isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchLeaves();
	}, [fetchLeaves]);

	return { leaves, loading, error, refetch: fetchLeaves };
}

// ============================================================================
// LEAVE MUTATIONS HOOK
// ============================================================================

export function useLeaveMutations() {
	const { getAccessToken } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createLeave = async (input: CreateLeaveInput): Promise<LeaveRecord> => {
		setLoading(true);
		setError(null);
		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ createLeave: LeaveRecord }>(
				HR_MUTATIONS.CREATE_LEAVE,
				{ input },
				token
			);
			return data.createLeave;
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to create leave");
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const updateLeaveStatus = async (
		id: string,
		input: UpdateLeaveStatusInput
	): Promise<LeaveRecord> => {
		setLoading(true);
		setError(null);
		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ updateLeaveStatus: LeaveRecord }>(
				HR_MUTATIONS.UPDATE_LEAVE_STATUS,
				{ id, input },
				token
			);
			return data.updateLeaveStatus;
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to update leave status"
			);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { createLeave, updateLeaveStatus, loading, error };
}

// ============================================================================
// PAYROLL HOOK
// ============================================================================

export function usePayroll(schoolId: string | undefined, month?: string) {
	const { isAuthenticated, getAccessToken } = useAuth();
	const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);
	const [total, setTotal] = useState(0);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchPayroll = useCallback(async () => {
		if (!schoolId || !isAuthenticated) {
			setPayrolls([]);
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const token = getAccessToken();
			const variables: Record<string, unknown> = {
				schoolId,
				pageSize: 100,
			};
			if (month) variables.month = month;

			const data = await graphqlRequest<{
				payrollHistory: {
					items: PayrollRecord[];
					total: number;
					page: number;
					totalPages: number;
				};
			}>(HR_QUERIES.PAYROLL_HISTORY, variables, token);
			setPayrolls(data.payrollHistory?.items || []);
			setTotal(data.payrollHistory?.total || 0);
		} catch (err) {
			console.error("Failed to fetch payroll:", err);
			setError(
				err instanceof Error ? err.message : "Failed to load payroll"
			);
		} finally {
			setLoading(false);
		}
	}, [schoolId, month, isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchPayroll();
	}, [fetchPayroll]);

	return { payrolls, total, loading, error, refetch: fetchPayroll };
}

// ============================================================================
// PAYROLL MUTATIONS HOOK
// ============================================================================

export function usePayrollMutations() {
	const { getAccessToken } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const generateMonthlyPayroll = async (
		input: GeneratePayrollInput
	): Promise<BatchPayrollResult> => {
		setLoading(true);
		setError(null);
		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{
				generateMonthlyPayroll: BatchPayrollResult;
			}>(HR_MUTATIONS.GENERATE_MONTHLY_PAYROLL, { input }, token);
			return data.generateMonthlyPayroll;
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to generate payroll"
			);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	const updatePayrollStatus = async (
		id: string,
		status: string
	): Promise<PayrollRecord> => {
		setLoading(true);
		setError(null);
		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{
				updatePayrollStatus: PayrollRecord;
			}>(HR_MUTATIONS.UPDATE_PAYROLL_STATUS, { id, input: { status } }, token);
			return data.updatePayrollStatus;
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "Failed to update payroll status"
			);
			throw err;
		} finally {
			setLoading(false);
		}
	};

	return { generateMonthlyPayroll, updatePayrollStatus, loading, error };
}
