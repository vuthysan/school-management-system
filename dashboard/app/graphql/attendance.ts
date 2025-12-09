// Attendance GraphQL Queries and Mutations

export const ATTENDANCE_QUERIES = {
	GET_BY_CLASS: `
    query AttendanceByClass($classId: String!, $date: String!) {
      attendanceByClass(classId: $classId, date: $date) {
        id
        studentId
        classId
        date
        status
        remarks
      }
    }
  `,

	GET_BY_STUDENT: `
    query AttendanceByStudent($studentId: String!, $startDate: String, $endDate: String) {
      attendanceByStudent(studentId: $studentId, startDate: $startDate, endDate: $endDate) {
        id
        classId
        date
        status
        remarks
      }
    }
  `,

	SUMMARY_BY_CLASS: `
    query AttendanceSummaryByClass($classId: String!, $month: Int!, $year: Int!) {
      attendanceSummaryByClass(classId: $classId, month: $month, year: $year) {
        totalDays
        presentCount
        absentCount
        lateCount
        attendanceRate
      }
    }
  `,
};

export const ATTENDANCE_MUTATIONS = {
	MARK_ATTENDANCE: `
    mutation MarkAttendance($input: AttendanceInput!) {
      markAttendance(input: $input) {
        id
        studentId
        classId
        date
        status
      }
    }
  `,

	MARK_BULK_ATTENDANCE: `
    mutation MarkBulkAttendance($classId: String!, $date: String!, $records: [AttendanceRecordInput!]!) {
      markBulkAttendance(classId: $classId, date: $date, records: $records) {
        success
        count
      }
    }
  `,

	UPDATE_ATTENDANCE: `
    mutation UpdateAttendance($id: String!, $status: String!, $remarks: String) {
      updateAttendance(id: $id, status: $status, remarks: $remarks) {
        id
        status
        remarks
      }
    }
  `,
};
