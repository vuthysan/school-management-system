"use client";

import { useState, useEffect, useCallback } from "react";
import {
	graphqlRequest,
	MEMBER_QUERIES,
	MEMBER_MUTATIONS,
} from "@/lib/graphql-client";
import { useAuth } from "@/contexts/auth-context";

export interface Member {
	id: string;
	userId: string;
	schoolId: string;
	role: string;
	status: string;
	permissions: string[];
	joinedAt?: string;
}

export interface AddMemberInput {
	userId: string;
	schoolId: string;
	role: string;
	permissions?: string[];
}

export function useSchoolMembers(schoolId: string | null) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [members, setMembers] = useState<Member[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchMembers = useCallback(async () => {
		if (!schoolId || !isAuthenticated) {
			setMembers([]);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ schoolMembers: Member[] }>(
				MEMBER_QUERIES.SCHOOL_MEMBERS,
				{ schoolId },
				token
			);
			setMembers(data.schoolMembers || []);
		} catch (err) {
			console.error("Failed to fetch members:", err);
			setError(err instanceof Error ? err.message : "Failed to load members");
		} finally {
			setIsLoading(false);
		}
	}, [schoolId, isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchMembers();
	}, [fetchMembers]);

	const addMember = useCallback(
		async (input: AddMemberInput) => {
			const token = getAccessToken();
			const data = await graphqlRequest<{ addMember: Member }>(
				MEMBER_MUTATIONS.ADD_MEMBER,
				{ input },
				token
			);
			await fetchMembers();
			return data.addMember;
		},
		[getAccessToken, fetchMembers]
	);

	const updateMemberRole = useCallback(
		async (id: string, role: string) => {
			const token = getAccessToken();
			const data = await graphqlRequest<{ updateMemberRole: Member }>(
				MEMBER_MUTATIONS.UPDATE_MEMBER_ROLE,
				{ id, role },
				token
			);
			await fetchMembers();
			return data.updateMemberRole;
		},
		[getAccessToken, fetchMembers]
	);

	const removeMember = useCallback(
		async (id: string) => {
			const token = getAccessToken();
			await graphqlRequest<{ removeMember: boolean }>(
				MEMBER_MUTATIONS.REMOVE_MEMBER,
				{ id },
				token
			);
			await fetchMembers();
		},
		[getAccessToken, fetchMembers]
	);

	return {
		members,
		isLoading,
		error,
		refresh: fetchMembers,
		addMember,
		updateMemberRole,
		removeMember,
	};
}

export function useMembersByRole(schoolId: string | null, role: string | null) {
	const { getAccessToken, isAuthenticated } = useAuth();
	const [members, setMembers] = useState<Member[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const fetchMembers = useCallback(async () => {
		if (!schoolId || !role || !isAuthenticated) {
			setMembers([]);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ membersByRole: Member[] }>(
				MEMBER_QUERIES.MEMBERS_BY_ROLE,
				{ schoolId, role },
				token
			);
			setMembers(data.membersByRole || []);
		} catch (err) {
			console.error("Failed to fetch members by role:", err);
			setError(err instanceof Error ? err.message : "Failed to load members");
		} finally {
			setIsLoading(false);
		}
	}, [schoolId, role, isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchMembers();
	}, [fetchMembers]);

	return { members, isLoading, error, refresh: fetchMembers };
}
