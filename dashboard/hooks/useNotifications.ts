"use client";

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { graphqlRequest } from "@/lib/graphql-client";
import { NOTIFICATION_QUERIES, NOTIFICATION_MUTATIONS } from "@/app/graphql/notification";

export interface NotificationItem {
	id: string;
	schoolId: string;
	studentId: string;
	parentUserId?: string;
	notificationType: string;
	title: string;
	message: string;
	status: string;
	isRead: boolean;
	sentAt?: string;
	readAt?: string;
	createdAt: string;
}

export function useNotifications() {
	const { isAuthenticated, getAccessToken } = useAuth();
	const [notifications, setNotifications] = useState<NotificationItem[]>([]);
	const [unreadCount, setUnreadCount] = useState(0);
	const [loading, setLoading] = useState(false);

	const fetchNotifications = useCallback(async () => {
		if (!isAuthenticated) return;

		setLoading(true);
		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{
				myNotifications: {
					items: NotificationItem[];
					total: number;
					unreadCount: number;
				};
			}>(NOTIFICATION_QUERIES.MY_NOTIFICATIONS, { pageSize: 20 }, token);
			setNotifications(data.myNotifications?.items || []);
			setUnreadCount(data.myNotifications?.unreadCount || 0);
		} catch {
			// Silently fail for notifications
		} finally {
			setLoading(false);
		}
	}, [isAuthenticated, getAccessToken]);

	const fetchUnreadCount = useCallback(async () => {
		if (!isAuthenticated) return;
		try {
			const token = getAccessToken();
			const data = await graphqlRequest<{ unreadNotificationCount: number }>(
				NOTIFICATION_QUERIES.UNREAD_COUNT,
				{},
				token
			);
			setUnreadCount(data.unreadNotificationCount || 0);
		} catch {
			// Silently fail
		}
	}, [isAuthenticated, getAccessToken]);

	const markAsRead = async (id: string) => {
		try {
			const token = getAccessToken();
			await graphqlRequest(
				NOTIFICATION_MUTATIONS.MARK_AS_READ,
				{ id },
				token
			);
			setNotifications((prev) =>
				prev.map((n) => (n.id === id ? { ...n, isRead: true, status: "Read" } : n))
			);
			setUnreadCount((prev) => Math.max(0, prev - 1));
		} catch {
			// Silently fail
		}
	};

	const markAllAsRead = async () => {
		try {
			const token = getAccessToken();
			await graphqlRequest(
				NOTIFICATION_MUTATIONS.MARK_ALL_AS_READ,
				{},
				token
			);
			setNotifications((prev) =>
				prev.map((n) => ({ ...n, isRead: true, status: "Read" }))
			);
			setUnreadCount(0);
		} catch {
			// Silently fail
		}
	};

	useEffect(() => {
		fetchNotifications();
	}, [fetchNotifications]);

	return {
		notifications,
		unreadCount,
		loading,
		refetch: fetchNotifications,
		fetchUnreadCount,
		markAsRead,
		markAllAsRead,
	};
}
