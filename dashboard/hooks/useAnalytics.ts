"use client";

import { useState, useCallback, useEffect } from "react";
import { graphqlRequest } from "@/lib/graphql-client";
import { useAuth } from "@/contexts/auth-context";
import { ANALYTICS_QUERIES } from "@/app/graphql/analytics";
import {
	PerformanceAnalytics,
	AttendanceAnalytics,
	StudentProgress,
	SchoolOverviewAnalytics,
	FeeCollectionSummary,
	StaffStudentRatio,
} from "@/types/analytics";
import { toast } from "sonner";

export function useAnalytics(schoolId: string | null) {
	const [performanceData, setPerformanceData] =
		useState<PerformanceAnalytics | null>(null);
	const [attendanceData, setAttendanceData] =
		useState<AttendanceAnalytics | null>(null);
	const [studentProgress, setStudentProgress] =
		useState<StudentProgress | null>(null);
	const [overviewData, setOverviewData] =
		useState<SchoolOverviewAnalytics | null>(null);
	const [feeAnalytics, setFeeAnalytics] =
		useState<FeeCollectionSummary | null>(null);
	const [ratioData, setRatioData] =
		useState<StaffStudentRatio | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const { getAccessToken } = useAuth();

	const fetchPerformanceAnalytics = useCallback(
		async (academicYear: string, semester: string) => {
			if (!schoolId) return;
			setIsLoading(true);
			try {
				const token = getAccessToken();
				const data = await graphqlRequest<{
					getPerformanceAnalytics: PerformanceAnalytics;
				}>(
					ANALYTICS_QUERIES.GET_PERFORMANCE_ANALYTICS,
					{ schoolId, academicYear, semester },
					token
				);
				setPerformanceData(data.getPerformanceAnalytics);
			} catch (error: any) {
				toast.error("Failed to fetch performance analytics");
			} finally {
				setIsLoading(false);
			}
		},
		[schoolId, getAccessToken]
	);

	const fetchAttendanceAnalytics = useCallback(async () => {
		if (!schoolId) return;
		setIsLoading(true);
		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{
				getAttendanceAnalytics: AttendanceAnalytics;
			}>(ANALYTICS_QUERIES.GET_ATTENDANCE_ANALYTICS, { schoolId }, token);
			setAttendanceData(data.getAttendanceAnalytics);
		} catch (error: any) {
			toast.error("Failed to fetch attendance analytics");
		} finally {
			setIsLoading(false);
		}
	}, [schoolId, getAccessToken]);

	const fetchStudentProgress = useCallback(
		async (studentId: string, academicYear: string, semester: string) => {
			if (!schoolId) return;
			setIsLoading(true);
			try {
				const token = getAccessToken();
				const data = await graphqlRequest<{
					getStudentProgress: StudentProgress;
				}>(
					ANALYTICS_QUERIES.GET_STUDENT_PROGRESS,
					{ studentId, academicYear, semester },
					token
				);
				setStudentProgress(data.getStudentProgress);
			} catch (error: any) {
				toast.error("Failed to fetch student progress");
			} finally {
				setIsLoading(false);
			}
		},
		[schoolId, getAccessToken]
	);

	const fetchSchoolOverview = useCallback(async () => {
		if (!schoolId) return;
		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{
				getSchoolOverview: SchoolOverviewAnalytics;
			}>(ANALYTICS_QUERIES.GET_SCHOOL_OVERVIEW, { schoolId }, token);
			setOverviewData(data.getSchoolOverview);
		} catch {
			// Silently fail for overview
		}
	}, [schoolId, getAccessToken]);

	const fetchFeeAnalytics = useCallback(async () => {
		if (!schoolId) return;
		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{
				getFeeCollectionAnalytics: FeeCollectionSummary;
			}>(ANALYTICS_QUERIES.GET_FEE_COLLECTION_ANALYTICS, { schoolId }, token);
			setFeeAnalytics(data.getFeeCollectionAnalytics);
		} catch {
			// Silently fail
		}
	}, [schoolId, getAccessToken]);

	const fetchStaffStudentRatio = useCallback(async () => {
		if (!schoolId) return;
		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{
				getStaffStudentRatio: StaffStudentRatio;
			}>(ANALYTICS_QUERIES.GET_STAFF_STUDENT_RATIO, { schoolId }, token);
			setRatioData(data.getStaffStudentRatio);
		} catch {
			// Silently fail
		}
	}, [schoolId, getAccessToken]);

	return {
		performanceData,
		attendanceData,
		studentProgress,
		overviewData,
		feeAnalytics,
		ratioData,
		isLoading,
		fetchPerformanceAnalytics,
		fetchAttendanceAnalytics,
		fetchStudentProgress,
		fetchSchoolOverview,
		fetchFeeAnalytics,
		fetchStaffStudentRatio,
	};
}
