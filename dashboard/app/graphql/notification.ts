// Notification GraphQL Queries and Mutations

const NOTIFICATION_FIELDS = `
	id
	schoolId
	studentId
	parentUserId
	notificationType
	title
	message
	status
	isRead
	sentAt
	readAt
	createdAt
`;

export const NOTIFICATION_QUERIES = {
	MY_NOTIFICATIONS: `
		query MyNotifications($page: Int, $pageSize: Int, $isRead: Boolean) {
			myNotifications(page: $page, pageSize: $pageSize, isRead: $isRead) {
				items {
					${NOTIFICATION_FIELDS}
				}
				total
				page
				totalPages
				unreadCount
			}
		}
	`,

	UNREAD_COUNT: `
		query UnreadNotificationCount {
			unreadNotificationCount
		}
	`,
};

export const NOTIFICATION_MUTATIONS = {
	MARK_AS_READ: `
		mutation MarkNotificationAsRead($id: String!) {
			markNotificationAsRead(id: $id)
		}
	`,

	MARK_ALL_AS_READ: `
		mutation MarkAllNotificationsAsRead {
			markAllNotificationsAsRead
		}
	`,

	DELETE_NOTIFICATION: `
		mutation DeleteNotification($id: String!) {
			deleteNotification(id: $id)
		}
	`,
};
