// Student Promotion GraphQL mutations

export const STUDENT_PROMOTION_MUTATIONS = {
	PROMOTE_STUDENTS: `
		mutation PromoteStudents($studentIds: [String!]!, $newGrade: String!, $newClassId: String) {
			promoteStudents(studentIds: $studentIds, newGrade: $newGrade, newClassId: $newClassId) {
				success
				promotedCount
				failedCount
			}
		}
	`,
};

export const ATTENDANCE_NOTIFICATION_MUTATIONS = {
	SEND_ABSENCE_NOTIFICATIONS: `
		mutation SendAbsenceNotifications($classId: String!, $date: String!) {
			sendAbsenceNotifications(classId: $classId, date: $date) {
				success
				notificationsSent
				notificationsFailed
			}
		}
	`,
};
