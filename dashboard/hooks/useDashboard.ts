"use client";

import { useState, useEffect, useCallback } from "react";
import {
	graphqlRequest,
	MEMBER_QUERIES,
	SCHOOL_QUERIES,
} from "@/lib/graphql-client";
import { useAuth } from "@/contexts/auth-context";

// Types for dashboard data
export interface Membership {
	idStr: string;
	userId: string;
	schoolId: string;
	branchId?: string;
	role: string;
	status: string;
	permissions: string[];
	title?: string;
	isPrimaryContact?: boolean;
}

const CURRENT_SCHOOL_KEY = "sms_current_school";

export interface SchoolStats {
	totalStudents: number;
	totalTeachers: number;
	totalClasses: number;
	totalBranches: number;
}

export interface School {
	id?: string;
	idStr?: string;
	displayName?: string;
	name: {
		en: string;
		km?: string;
	};
	code?: string;
	schoolType?: string;
	status?: string;
	stats?: SchoolStats;
}

export interface DashboardData {
	memberships: Membership[];
	currentSchool: School | null;
	currentRole: string | null;
	isLoading: boolean;
	error: string | null;
}

export interface PendingSchool {
	idStr: string;
	name: {
		en: string;
		km?: string;
	};
	status: string;
}

export function useDashboard() {
	const { user, getAccessToken, isAuthenticated } = useAuth();
	const [memberships, setMemberships] = useState<Membership[]>([]);
	const [schools, setSchools] = useState<Map<string, School>>(new Map());
	const [pendingSchools, setPendingSchools] = useState<PendingSchool[]>([]);
	const [currentSchoolId, setCurrentSchoolId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [hasFetched, setHasFetched] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Fetch user's memberships
	const fetchMemberships = useCallback(async () => {
		if (!isAuthenticated) {
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const token = getAccessToken();

			// Fetch memberships
			console.log("useDashboard: Fetching memberships...");
			const memberData = await graphqlRequest<{ myMemberships: Membership[] }>(
				MEMBER_QUERIES.MY_MEMBERSHIPS,
				undefined,
				token
			);

			console.log(
				"useDashboard: Received memberships:",
				memberData.myMemberships
			);
			setMemberships(memberData.myMemberships || []);

			// Also fetch pending schools for this user
			try {
				const pendingData = await graphqlRequest<{
					pendingSchools: PendingSchool[];
				}>(SCHOOL_QUERIES.PENDING_SCHOOLS, undefined, token);
				setPendingSchools(pendingData.pendingSchools || []);
			} catch {
				// User may not have permission to view pending schools
				setPendingSchools([]);
			}

			// If user has memberships, use saved school or first one
			if (memberData.myMemberships && memberData.myMemberships.length > 0) {
				const savedSchoolId = localStorage.getItem(CURRENT_SCHOOL_KEY);
				const validSavedSchool =
					savedSchoolId &&
					memberData.myMemberships.some((m) => m.schoolId === savedSchoolId);

				const selectedSchoolId = validSavedSchool
					? savedSchoolId
					: memberData.myMemberships[0].schoolId;
				setCurrentSchoolId(selectedSchoolId);

				// Fetch school details for each membership
				const schoolMap = new Map<string, School>();
				for (const membership of memberData.myMemberships) {
					try {
						const schoolData = await graphqlRequest<{ school: School }>(
							SCHOOL_QUERIES.GET_BY_ID,
							{ id: membership.schoolId },
							token
						);
						if (schoolData.school) {
							schoolMap.set(membership.schoolId, schoolData.school);
						}
					} catch {
						console.warn(`Failed to fetch school ${membership.schoolId}`);
					}
				}
				setSchools(schoolMap);
			}
		} catch (err) {
			console.error("Failed to fetch dashboard data:", err);
			setError(err instanceof Error ? err.message : "Failed to load dashboard");
		} finally {
			setIsLoading(false);
			setHasFetched(true);
		}
	}, [isAuthenticated, getAccessToken]);

	useEffect(() => {
		fetchMemberships();
	}, [fetchMemberships]);

	// Get current school
	const currentSchool = currentSchoolId
		? schools.get(currentSchoolId) || null
		: null;

	// Get current role in the selected school
	const currentMembership = memberships.find(
		(m) => m.schoolId === currentSchoolId
	);
	const currentRole = currentMembership?.role || null;

	// Switch to a different school
	const switchSchool = useCallback(
		(schoolId: string) => {
			if (memberships.some((m) => m.schoolId === schoolId)) {
				setCurrentSchoolId(schoolId);
				localStorage.setItem(CURRENT_SCHOOL_KEY, schoolId);
			}
		},
		[memberships]
	);

	// Check if user is owner of current school
	const isOwner = currentRole === "Owner" || currentRole === "OWNER";
	const isAdmin = currentRole === "Admin" || currentRole === "ADMIN" || isOwner;

	// Check if user has any approved school (not pending)
	const schoolsArray = Array.from(schools.values());
	const hasApprovedSchool = schoolsArray.some(
		(school) => school.status === "Approved" || school.status === "APPROVED"
	);
	const hasPendingSchoolMembership =
		memberships.length > 0 && !hasApprovedSchool;

	// Refresh data
	const refresh = useCallback(() => {
		fetchMemberships();
	}, [fetchMemberships]);

	return {
		user,
		memberships,
		schools: schoolsArray,
		pendingSchools,
		currentSchool,
		currentRole,
		currentMembership,
		isLoading,
		loading: isLoading,
		hasFetched,
		error,
		switchSchool,
		refresh,
		refetch: refresh,
		hasSchools: memberships.length > 0,
		hasApprovedSchool,
		hasPendingSchoolMembership,
		isOwner,
		isAdmin,
	};
}

// Hook for getting dashboard stats based on role
export function useDashboardStats(
	schoolId: string | null,
	role: string | null
) {
	const { getAccessToken } = useAuth();
	const [stats, setStats] = useState<SchoolStats | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
		if (!schoolId) {
			setStats(null);
			return;
		}

		const fetchStats = async () => {
			setIsLoading(true);
			try {
				const token = getAccessToken();
				const data = await graphqlRequest<{ school: { stats: SchoolStats } }>(
					SCHOOL_QUERIES.GET_BY_ID,
					{ id: schoolId },
					token
				);
				setStats(data.school?.stats || null);
			} catch (err) {
				console.error("Failed to fetch stats:", err);
			} finally {
				setIsLoading(false);
			}
		};

		fetchStats();
	}, [schoolId, getAccessToken]);

	return { stats, isLoading };
}
