"use client";

import { useState, useEffect, useCallback } from "react";
import { graphqlRequest } from "@/lib/graphql-client";
import { ROOM_QUERIES, ROOM_MUTATIONS } from "@/app/graphql/room";
import { useAuth } from "@/contexts/auth-context";

export interface Room {
	id: string;
	schoolId: string;
	name: string;
	building?: string;
	floor?: string;
	capacity?: number;
	roomType?:
		| "Classroom"
		| "Lab"
		| "Library"
		| "Auditorium"
		| "Office"
		| "Other";
	status?: "Available" | "Occupied" | "Maintenance";
	facilities?: string[];
	description?: string;
}

export interface CreateRoomInput {
	schoolId: string;
	name: string;
	building?: string;
	floor?: string;
	capacity?: number;
	roomType?: string;
	status?: string;
	facilities?: string[];
	description?: string;
}

export interface UpdateRoomInput {
	name?: string;
	building?: string;
	floor?: string;
	capacity?: number;
	roomType?: string;
	status?: string;
	facilities?: string[];
	description?: string;
}

export function useRooms(schoolId: string | null) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [rooms, setRooms] = useState<Room[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchRooms = useCallback(async () => {
		if (!schoolId || !isAuthenticated) {
			setRooms([]);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ rooms: Room[] }>(
				ROOM_QUERIES.GET_ALL,
				{ schoolId },
				token
			);
			setRooms(data.rooms || []);
		} catch (err) {
			console.error("Failed to fetch rooms:", err);
			setError(err instanceof Error ? err.message : "Failed to load rooms");
		} finally {
			setIsLoading(false);
		}
	}, [schoolId, isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchRooms();
	}, [fetchRooms]);

	return { rooms, isLoading, error, refresh: fetchRooms };
}

export function useRoomMutations() {
	const { getAccessToken } = useAuth();

	const createRoom = useCallback(
		async (input: CreateRoomInput) => {
			const token = getAccessToken();
			const data = await graphqlRequest<{ createRoom: Room }>(
				ROOM_MUTATIONS.CREATE,
				{ input },
				token
			);
			return data.createRoom;
		},
		[getAccessToken]
	);

	const updateRoom = useCallback(
		async (id: string, input: UpdateRoomInput) => {
			const token = getAccessToken();
			const data = await graphqlRequest<{ updateRoom: Room }>(
				ROOM_MUTATIONS.UPDATE,
				{ id, input },
				token
			);
			return data.updateRoom;
		},
		[getAccessToken]
	);

	const deleteRoom = useCallback(
		async (id: string) => {
			const token = getAccessToken();
			await graphqlRequest<{ deleteRoom: boolean }>(
				ROOM_MUTATIONS.DELETE,
				{ id },
				token
			);
		},
		[getAccessToken]
	);

	return { createRoom, updateRoom, deleteRoom };
}
