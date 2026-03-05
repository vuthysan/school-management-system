"use client";

import { useState, useEffect, useCallback } from "react";
import { graphqlRequest } from "@/lib/graphql-client";
import { INVENTORY_QUERIES, INVENTORY_MUTATIONS } from "@/app/graphql/inventory";
import { useAuth } from "@/contexts/auth-context";
import type {
	InventoryItem,
	InventoryStats,
	CreateInventoryItemInput,
	UpdateInventoryItemInput,
} from "@/types/inventory";

// ============================================================================
// INVENTORY ITEMS
// ============================================================================

interface PaginatedInventoryResult {
	items: InventoryItem[];
	total: number;
	page: number;
	totalPages: number;
}

export function useInventoryItems(schoolId: string | null) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [items, setItems] = useState<InventoryItem[]>([]);
	const [total, setTotal] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchItems = useCallback(async () => {
		if (!schoolId || !isAuthenticated) {
			setItems([]);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ inventoryItems: PaginatedInventoryResult }>(
				INVENTORY_QUERIES.GET_INVENTORY_ITEMS,
				{ schoolId, pageSize: 100 },
				token
			);
			setItems(data.inventoryItems?.items || []);
			setTotal(data.inventoryItems?.total || 0);
		} catch (err) {
			console.error("Failed to fetch inventory items:", err);
			setError(err instanceof Error ? err.message : "Failed to load inventory items");
		} finally {
			setIsLoading(false);
		}
	}, [schoolId, isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchItems();
	}, [fetchItems]);

	return { items, total, isLoading, error, refresh: fetchItems };
}

// ============================================================================
// INVENTORY STATS
// ============================================================================

export function useInventoryStats(schoolId: string | null) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [stats, setStats] = useState<InventoryStats | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchStats = useCallback(async () => {
		if (!schoolId || !isAuthenticated) {
			setStats(null);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ inventoryStats: InventoryStats }>(
				INVENTORY_QUERIES.GET_INVENTORY_STATS,
				{ schoolId },
				token
			);
			setStats(data.inventoryStats || null);
		} catch (err) {
			console.error("Failed to fetch inventory stats:", err);
			setError(err instanceof Error ? err.message : "Failed to load inventory stats");
		} finally {
			setIsLoading(false);
		}
	}, [schoolId, isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchStats();
	}, [fetchStats]);

	return { stats, isLoading, error, refresh: fetchStats };
}

// ============================================================================
// INVENTORY MUTATIONS
// ============================================================================

export function useInventoryMutations() {
	const { getAccessToken } = useAuth();

	const createItem = useCallback(
		async (input: CreateInventoryItemInput) => {
			const token = getAccessToken();
			const data = await graphqlRequest<{ createInventoryItem: InventoryItem }>(
				INVENTORY_MUTATIONS.CREATE_INVENTORY_ITEM,
				{ input },
				token
			);
			return data.createInventoryItem;
		},
		[getAccessToken]
	);

	const updateItem = useCallback(
		async (id: string, input: UpdateInventoryItemInput) => {
			const token = getAccessToken();
			const data = await graphqlRequest<{ updateInventoryItem: InventoryItem }>(
				INVENTORY_MUTATIONS.UPDATE_INVENTORY_ITEM,
				{ id, input },
				token
			);
			return data.updateInventoryItem;
		},
		[getAccessToken]
	);

	const deleteItem = useCallback(
		async (id: string) => {
			const token = getAccessToken();
			await graphqlRequest<{ deleteInventoryItem: boolean }>(
				INVENTORY_MUTATIONS.DELETE_INVENTORY_ITEM,
				{ id },
				token
			);
		},
		[getAccessToken]
	);

	return { createItem, updateItem, deleteItem };
}
