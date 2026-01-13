"use client";

import { useCallback } from "react";
import { graphqlRequest } from "@/lib/graphql-client";
import {
	STUDENT_PROMOTION_MUTATIONS,
	ATTENDANCE_NOTIFICATION_MUTATIONS,
} from "@/app/graphql/promotion";
import { useAuth } from "@/contexts/auth-context";

export interface PromotionResult {
	success: boolean;
	promotedCount: number;
	failedCount: number;
}

export interface NotificationResult {
	success: boolean;
	notificationsSent: number;
	notificationsFailed: number;
}

export function useStudentPromotion() {
	const { getAccessToken } = useAuth();

	const promoteStudents = useCallback(
		async (
			studentIds: string[],
			newGrade: string,
			newClassId?: string
		): Promise<PromotionResult> => {
			const token = getAccessToken();
			const data = await graphqlRequest<{ promoteStudents: PromotionResult }>(
				STUDENT_PROMOTION_MUTATIONS.PROMOTE_STUDENTS,
				{ studentIds, newGrade, newClassId },
				token
			);
			return data.promoteStudents;
		},
		[getAccessToken]
	);

	return { promoteStudents };
}

export function useAbsenceNotifications() {
	const { getAccessToken } = useAuth();

	const sendAbsenceNotifications = useCallback(
		async (classId: string, date: string): Promise<NotificationResult> => {
			const token = getAccessToken();
			const data = await graphqlRequest<{
				sendAbsenceNotifications: NotificationResult;
			}>(
				ATTENDANCE_NOTIFICATION_MUTATIONS.SEND_ABSENCE_NOTIFICATIONS,
				{ classId, date },
				token
			);
			return data.sendAbsenceNotifications;
		},
		[getAccessToken]
	);

	return { sendAbsenceNotifications };
}
