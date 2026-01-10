"use client";

import { useState, useEffect, useCallback } from "react";

import {
	graphqlRequest,
	FEE_QUERIES,
	FEE_MUTATIONS,
	PAYMENT_QUERIES,
	PAYMENT_MUTATIONS,
	INVOICE_QUERIES,
	INVOICE_MUTATIONS,
	FINANCE_QUERIES,
} from "@/lib/graphql-client";
import { useAuth } from "@/contexts/auth-context";
import {
	Fee,
	Payment,
	Invoice,
	FinanceSummary,
	CreateFeeInput,
	UpdateFeeInput,
	CreatePaymentInput,
	PaymentFilters,
	InvoiceFilters,
} from "@/types/finance";

// Hook for managing fees
export function useFees(schoolId: string | null) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [fees, setFees] = useState<Fee[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchFees = useCallback(async () => {
		if (!schoolId || !isAuthenticated) {
			setFees([]);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ fees: Fee[] }>(
				FEE_QUERIES.BY_SCHOOL,
				{ schoolId },
				token
			);

			setFees(data.fees || []);
		} catch (err) {
			console.error("Failed to fetch fees:", err);
			setError(err instanceof Error ? err.message : "Failed to load fees");
		} finally {
			setIsLoading(false);
		}
	}, [schoolId, isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchFees();
	}, [fetchFees]);

	return {
		fees,
		isLoading,
		error,
		refresh: fetchFees,
	};
}

// Hook for fee mutations
export function useFeeMutations() {
	const { getAccessToken } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const createFee = useCallback(
		async (input: CreateFeeInput) => {
			setIsLoading(true);
			setError(null);
			try {
				const token = getAccessToken();
				const data = await graphqlRequest<{ createFee: Fee }>(
					FEE_MUTATIONS.CREATE,
					{ input },
					token
				);
				return data.createFee;
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "Failed to create fee";
				setError(message);
				throw err;
			} finally {
				setIsLoading(false);
			}
		},
		[getAccessToken]
	);

	const updateFee = useCallback(
		async (id: string, input: UpdateFeeInput) => {
			setIsLoading(true);
			setError(null);
			try {
				const token = getAccessToken();
				const data = await graphqlRequest<{ updateFee: Fee }>(
					FEE_MUTATIONS.UPDATE,
					{ id, input },
					token
				);
				return data.updateFee;
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "Failed to update fee";
				setError(message);
				throw err;
			} finally {
				setIsLoading(false);
			}
		},
		[getAccessToken]
	);

	const deleteFee = useCallback(
		async (id: string) => {
			setIsLoading(true);
			setError(null);
			try {
				const token = getAccessToken();
				await graphqlRequest<{ deleteFee: boolean }>(
					FEE_MUTATIONS.DELETE,
					{ id },
					token
				);
				return true;
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "Failed to delete fee";
				setError(message);
				throw err;
			} finally {
				setIsLoading(false);
			}
		},
		[getAccessToken]
	);

	return {
		createFee,
		updateFee,
		deleteFee,
		isLoading,
		error,
	};
}

// Hook for payments
export function usePayments(schoolId: string | null, filters?: PaymentFilters) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [payments, setPayments] = useState<Payment[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchPayments = useCallback(async () => {
		if (!schoolId || !isAuthenticated) {
			setPayments([]);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ payments: Payment[] }>(
				PAYMENT_QUERIES.BY_SCHOOL,
				{ schoolId, filters },
				token
			);

			setPayments(data.payments || []);
		} catch (err) {
			console.error("Failed to fetch payments:", err);
			setError(err instanceof Error ? err.message : "Failed to load payments");
		} finally {
			setIsLoading(false);
		}
	}, [schoolId, filters, isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchPayments();
	}, [fetchPayments]);

	return {
		payments,
		isLoading,
		error,
		refresh: fetchPayments,
	};
}

// Hook for student payment history
export function useStudentPayments(studentId: string | null) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [payments, setPayments] = useState<Payment[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!studentId || !isAuthenticated) {
			setPayments([]);
			return;
		}

		const fetchPayments = async () => {
			setIsLoading(true);
			setError(null);

			try {
				const token = getAccessToken();
				const data = await graphqlRequest<{ paymentsByStudent: Payment[] }>(
					PAYMENT_QUERIES.BY_STUDENT,
					{ studentId },
					token
				);

				setPayments(data.paymentsByStudent || []);
			} catch (err) {
				console.error("Failed to fetch student payments:", err);
				setError(
					err instanceof Error ? err.message : "Failed to load payments"
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchPayments();
	}, [studentId, isAuthenticated, getAccessToken]);

	return { payments, isLoading, error };
}

// Hook for payment mutations
export function usePaymentMutations() {
	const { getAccessToken } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const recordPayment = useCallback(
		async (input: CreatePaymentInput) => {
			setIsLoading(true);
			setError(null);
			try {
				const token = getAccessToken();
				const data = await graphqlRequest<{ recordPayment: Payment }>(
					PAYMENT_MUTATIONS.RECORD,
					{ input },
					token
				);
				return data.recordPayment;
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "Failed to record payment";
				setError(message);
				throw err;
			} finally {
				setIsLoading(false);
			}
		},
		[getAccessToken]
	);

	return {
		recordPayment,
		isLoading,
		error,
	};
}

// Hook for invoices
export function useInvoices(schoolId: string | null, filters?: InvoiceFilters) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [invoices, setInvoices] = useState<Invoice[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchInvoices = useCallback(async () => {
		if (!schoolId || !isAuthenticated) {
			setInvoices([]);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ invoices: Invoice[] }>(
				INVOICE_QUERIES.BY_SCHOOL,
				{ schoolId, filters },
				token
			);

			setInvoices(data.invoices || []);
		} catch (err) {
			console.error("Failed to fetch invoices:", err);
			setError(err instanceof Error ? err.message : "Failed to load invoices");
		} finally {
			setIsLoading(false);
		}
	}, [schoolId, filters, isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchInvoices();
	}, [fetchInvoices]);

	return {
		invoices,
		isLoading,
		error,
		refresh: fetchInvoices,
	};
}

// Hook for finance summary (dashboard stats)
export function useFinanceSummary(schoolId: string | null) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [summary, setSummary] = useState<FinanceSummary | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchSummary = useCallback(async () => {
		if (!schoolId || !isAuthenticated) {
			setSummary(null);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ financeSummary: FinanceSummary }>(
				FINANCE_QUERIES.SUMMARY,
				{ schoolId },
				token
			);

			setSummary(data.financeSummary);
		} catch (err) {
			console.error("Failed to fetch finance summary:", err);
			setError(err instanceof Error ? err.message : "Failed to load summary");
		} finally {
			setIsLoading(false);
		}
	}, [schoolId, isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchSummary();
	}, [fetchSummary]);

	return {
		summary,
		isLoading,
		error,
		refresh: fetchSummary,
	};
}
