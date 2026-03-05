"use client";

import { useState, useEffect, useCallback } from "react";
import { graphqlRequest } from "@/lib/graphql-client";
import { LIBRARY_QUERIES, LIBRARY_MUTATIONS } from "@/app/graphql/library";
import { useAuth } from "@/contexts/auth-context";
import type {
	Book,
	BorrowRecord,
	CreateBookInput,
	UpdateBookInput,
	CreateBorrowRecordInput,
	UpdateBorrowRecordInput,
} from "@/types/library";

// ============================================================================
// BOOKS
// ============================================================================

interface PaginatedBooksResult {
	items: Book[];
	total: number;
	page: number;
	totalPages: number;
}

export function useBooks(schoolId: string | null) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [books, setBooks] = useState<Book[]>([]);
	const [total, setTotal] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchBooks = useCallback(async () => {
		if (!schoolId || !isAuthenticated) {
			setBooks([]);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ books: PaginatedBooksResult }>(
				LIBRARY_QUERIES.GET_BOOKS,
				{ schoolId, pageSize: 100 },
				token
			);
			setBooks(data.books?.items || []);
			setTotal(data.books?.total || 0);
		} catch (err) {
			console.error("Failed to fetch books:", err);
			setError(err instanceof Error ? err.message : "Failed to load books");
		} finally {
			setIsLoading(false);
		}
	}, [schoolId, isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchBooks();
	}, [fetchBooks]);

	return { books, total, isLoading, error, refresh: fetchBooks };
}

export function useBookMutations() {
	const { getAccessToken } = useAuth();

	const createBook = useCallback(
		async (input: CreateBookInput) => {
			const token = getAccessToken();
			const data = await graphqlRequest<{ createBook: Book }>(
				LIBRARY_MUTATIONS.CREATE_BOOK,
				{ input },
				token
			);
			return data.createBook;
		},
		[getAccessToken]
	);

	const updateBook = useCallback(
		async (id: string, input: UpdateBookInput) => {
			const token = getAccessToken();
			const data = await graphqlRequest<{ updateBook: Book }>(
				LIBRARY_MUTATIONS.UPDATE_BOOK,
				{ id, input },
				token
			);
			return data.updateBook;
		},
		[getAccessToken]
	);

	const deleteBook = useCallback(
		async (id: string) => {
			const token = getAccessToken();
			await graphqlRequest<{ deleteBook: boolean }>(
				LIBRARY_MUTATIONS.DELETE_BOOK,
				{ id },
				token
			);
		},
		[getAccessToken]
	);

	return { createBook, updateBook, deleteBook };
}

// ============================================================================
// BORROW RECORDS
// ============================================================================

interface PaginatedBorrowsResult {
	items: BorrowRecord[];
	total: number;
	page: number;
	totalPages: number;
}

export function useBorrowRecords(schoolId: string | null) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
	const [total, setTotal] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchBorrows = useCallback(async () => {
		if (!schoolId || !isAuthenticated) {
			setBorrows([]);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ borrowRecords: PaginatedBorrowsResult }>(
				LIBRARY_QUERIES.GET_BORROW_RECORDS,
				{ schoolId, pageSize: 100 },
				token
			);
			setBorrows(data.borrowRecords?.items || []);
			setTotal(data.borrowRecords?.total || 0);
		} catch (err) {
			console.error("Failed to fetch borrow records:", err);
			setError(err instanceof Error ? err.message : "Failed to load borrow records");
		} finally {
			setIsLoading(false);
		}
	}, [schoolId, isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchBorrows();
	}, [fetchBorrows]);

	return { borrows, total, isLoading, error, refresh: fetchBorrows };
}

export function useBorrowMutations() {
	const { getAccessToken } = useAuth();

	const createBorrow = useCallback(
		async (input: CreateBorrowRecordInput) => {
			const token = getAccessToken();
			const data = await graphqlRequest<{ createBorrowRecord: BorrowRecord }>(
				LIBRARY_MUTATIONS.CREATE_BORROW_RECORD,
				{ input },
				token
			);
			return data.createBorrowRecord;
		},
		[getAccessToken]
	);

	const updateBorrow = useCallback(
		async (id: string, input: UpdateBorrowRecordInput) => {
			const token = getAccessToken();
			const data = await graphqlRequest<{ updateBorrowRecord: BorrowRecord }>(
				LIBRARY_MUTATIONS.UPDATE_BORROW_RECORD,
				{ id, input },
				token
			);
			return data.updateBorrowRecord;
		},
		[getAccessToken]
	);

	const deleteBorrow = useCallback(
		async (id: string) => {
			const token = getAccessToken();
			await graphqlRequest<{ deleteBorrowRecord: boolean }>(
				LIBRARY_MUTATIONS.DELETE_BORROW_RECORD,
				{ id },
				token
			);
		},
		[getAccessToken]
	);

	const returnBook = useCallback(
		async (id: string) => {
			const token = getAccessToken();
			const data = await graphqlRequest<{ returnBook: BorrowRecord }>(
				LIBRARY_MUTATIONS.RETURN_BOOK,
				{ id },
				token
			);
			return data.returnBook;
		},
		[getAccessToken]
	);

	return { createBorrow, updateBorrow, deleteBorrow, returnBook };
}
