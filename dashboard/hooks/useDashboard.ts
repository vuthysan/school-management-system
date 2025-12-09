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
	id: string;
	userId: string;
	schoolId: string;
	role: string;
	status: string;
	permissions: string[];
}

export interface SchoolStats {
	totalStudents: number;
	totalTeachers: number;
	totalClasses: number;
	totalBranches: number;
}

export interface School {
	id: string;
	name: {
		en: string;
		km?: string;
	};
	code: string;
	schoolType: string;
	status: string;
	stats?: SchoolStats;
}

export interface DashboardData {
	memberships: Membership[];
	currentSchool: School | null;
	currentRole: string | null;
	isLoading: boolean;
	error: string | null;
}

export function useDashboard() {
	const { user, getAccessToken, isAuthenticated } = useAuth();
	const [memberships, setMemberships] = useState<Membership[]>([]);
	const [schools, setSchools] = useState<Map<string, School>>(new Map());
	const [currentSchoolId, setCurrentSchoolId] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
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
			const memberData = await graphqlRequest<{ myMemberships: Membership[] }>(
				MEMBER_QUERIES.MY_MEMBERSHIPS,
				undefined,
				token
			);

			setMemberships(memberData.myMemberships || []);

			// If user has memberships, set the first one as current
			if (memberData.myMemberships && memberData.myMemberships.length > 0) {
				const firstMembership = memberData.myMemberships[0];
				setCurrentSchoolId(firstMembership.schoolId);

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
			}
		},
		[memberships]
	);

	// Refresh data
	const refresh = useCallback(() => {
		fetchMemberships();
	}, [fetchMemberships]);

	return {
		user,
		memberships,
		schools: Array.from(schools.values()),
		currentSchool,
		currentRole,
		currentMembership,
		isLoading,
		error,
		switchSchool,
		refresh,
		hasSchools: memberships.length > 0,
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
