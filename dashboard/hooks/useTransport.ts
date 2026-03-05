"use client";

import { useState, useEffect, useCallback } from "react";
import { graphqlRequest } from "@/lib/graphql-client";
import { TRANSPORT_QUERIES, TRANSPORT_MUTATIONS } from "@/app/graphql/transport";
import { useAuth } from "@/contexts/auth-context";
import type {
	Vehicle,
	TransportRoute,
	StudentTransportAssignment,
	CreateVehicleInput,
	UpdateVehicleInput,
	CreateRouteInput,
	UpdateRouteInput,
	CreateAssignmentInput,
	UpdateAssignmentInput,
} from "@/types/transport";

// ============================================================================
// VEHICLES
// ============================================================================

interface PaginatedVehiclesResult {
	items: Vehicle[];
	total: number;
	page: number;
	totalPages: number;
}

export function useVehicles(schoolId: string | null) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [vehicles, setVehicles] = useState<Vehicle[]>([]);
	const [total, setTotal] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchVehicles = useCallback(async () => {
		if (!schoolId || !isAuthenticated) {
			setVehicles([]);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ vehicles: PaginatedVehiclesResult }>(
				TRANSPORT_QUERIES.GET_VEHICLES,
				{ schoolId, pageSize: 100 },
				token
			);
			setVehicles(data.vehicles?.items || []);
			setTotal(data.vehicles?.total || 0);
		} catch (err) {
			console.error("Failed to fetch vehicles:", err);
			setError(err instanceof Error ? err.message : "Failed to load vehicles");
		} finally {
			setIsLoading(false);
		}
	}, [schoolId, isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchVehicles();
	}, [fetchVehicles]);

	return { vehicles, total, isLoading, error, refresh: fetchVehicles };
}

export function useVehicleMutations() {
	const { getAccessToken } = useAuth();

	const createVehicle = useCallback(
		async (input: CreateVehicleInput) => {
			const token = getAccessToken();
			const data = await graphqlRequest<{ createVehicle: Vehicle }>(
				TRANSPORT_MUTATIONS.CREATE_VEHICLE,
				{ input },
				token
			);
			return data.createVehicle;
		},
		[getAccessToken]
	);

	const updateVehicle = useCallback(
		async (id: string, input: UpdateVehicleInput) => {
			const token = getAccessToken();
			const data = await graphqlRequest<{ updateVehicle: Vehicle }>(
				TRANSPORT_MUTATIONS.UPDATE_VEHICLE,
				{ id, input },
				token
			);
			return data.updateVehicle;
		},
		[getAccessToken]
	);

	const deleteVehicle = useCallback(
		async (id: string) => {
			const token = getAccessToken();
			await graphqlRequest<{ deleteVehicle: boolean }>(
				TRANSPORT_MUTATIONS.DELETE_VEHICLE,
				{ id },
				token
			);
		},
		[getAccessToken]
	);

	return { createVehicle, updateVehicle, deleteVehicle };
}

// ============================================================================
// ROUTES
// ============================================================================

interface PaginatedRoutesResult {
	items: TransportRoute[];
	total: number;
	page: number;
	totalPages: number;
}

export function useTransportRoutes(schoolId: string | null) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [routes, setRoutes] = useState<TransportRoute[]>([]);
	const [total, setTotal] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchRoutes = useCallback(async () => {
		if (!schoolId || !isAuthenticated) {
			setRoutes([]);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ transportRoutes: PaginatedRoutesResult }>(
				TRANSPORT_QUERIES.GET_ROUTES,
				{ schoolId, pageSize: 100 },
				token
			);
			setRoutes(data.transportRoutes?.items || []);
			setTotal(data.transportRoutes?.total || 0);
		} catch (err) {
			console.error("Failed to fetch routes:", err);
			setError(err instanceof Error ? err.message : "Failed to load routes");
		} finally {
			setIsLoading(false);
		}
	}, [schoolId, isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchRoutes();
	}, [fetchRoutes]);

	return { routes, total, isLoading, error, refresh: fetchRoutes };
}

export function useRouteMutations() {
	const { getAccessToken } = useAuth();

	const createRoute = useCallback(
		async (input: CreateRouteInput) => {
			const token = getAccessToken();
			const data = await graphqlRequest<{ createTransportRoute: TransportRoute }>(
				TRANSPORT_MUTATIONS.CREATE_ROUTE,
				{ input },
				token
			);
			return data.createTransportRoute;
		},
		[getAccessToken]
	);

	const updateRoute = useCallback(
		async (id: string, input: UpdateRouteInput) => {
			const token = getAccessToken();
			const data = await graphqlRequest<{ updateTransportRoute: TransportRoute }>(
				TRANSPORT_MUTATIONS.UPDATE_ROUTE,
				{ id, input },
				token
			);
			return data.updateTransportRoute;
		},
		[getAccessToken]
	);

	const deleteRoute = useCallback(
		async (id: string) => {
			const token = getAccessToken();
			await graphqlRequest<{ deleteTransportRoute: boolean }>(
				TRANSPORT_MUTATIONS.DELETE_ROUTE,
				{ id },
				token
			);
		},
		[getAccessToken]
	);

	return { createRoute, updateRoute, deleteRoute };
}

// ============================================================================
// ASSIGNMENTS
// ============================================================================

interface PaginatedAssignmentsResult {
	items: StudentTransportAssignment[];
	total: number;
	page: number;
	totalPages: number;
}

export function useTransportAssignments(schoolId: string | null) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [assignments, setAssignments] = useState<StudentTransportAssignment[]>([]);
	const [total, setTotal] = useState(0);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchAssignments = useCallback(async () => {
		if (!schoolId || !isAuthenticated) {
			setAssignments([]);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ transportAssignments: PaginatedAssignmentsResult }>(
				TRANSPORT_QUERIES.GET_ASSIGNMENTS,
				{ schoolId, pageSize: 100 },
				token
			);
			setAssignments(data.transportAssignments?.items || []);
			setTotal(data.transportAssignments?.total || 0);
		} catch (err) {
			console.error("Failed to fetch assignments:", err);
			setError(err instanceof Error ? err.message : "Failed to load assignments");
		} finally {
			setIsLoading(false);
		}
	}, [schoolId, isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchAssignments();
	}, [fetchAssignments]);

	return { assignments, total, isLoading, error, refresh: fetchAssignments };
}

export function useAssignmentMutations() {
	const { getAccessToken } = useAuth();

	const createAssignment = useCallback(
		async (input: CreateAssignmentInput) => {
			const token = getAccessToken();
			const data = await graphqlRequest<{ createTransportAssignment: StudentTransportAssignment }>(
				TRANSPORT_MUTATIONS.CREATE_ASSIGNMENT,
				{ input },
				token
			);
			return data.createTransportAssignment;
		},
		[getAccessToken]
	);

	const updateAssignment = useCallback(
		async (id: string, input: UpdateAssignmentInput) => {
			const token = getAccessToken();
			const data = await graphqlRequest<{ updateTransportAssignment: StudentTransportAssignment }>(
				TRANSPORT_MUTATIONS.UPDATE_ASSIGNMENT,
				{ id, input },
				token
			);
			return data.updateTransportAssignment;
		},
		[getAccessToken]
	);

	const deleteAssignment = useCallback(
		async (id: string) => {
			const token = getAccessToken();
			await graphqlRequest<{ deleteTransportAssignment: boolean }>(
				TRANSPORT_MUTATIONS.DELETE_ASSIGNMENT,
				{ id },
				token
			);
		},
		[getAccessToken]
	);

	return { createAssignment, updateAssignment, deleteAssignment };
}
