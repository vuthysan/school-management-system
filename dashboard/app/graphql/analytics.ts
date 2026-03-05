export const ANALYTICS_QUERIES = {
	GET_PERFORMANCE_ANALYTICS: `
    query GetPerformanceAnalytics($schoolId: String!, $academicYear: String!, $semester: String!) {
      getPerformanceAnalytics(schoolId: $schoolId, academicYear: $academicYear, semester: $semester) {
        classPerformances {
          classId
          className
          averageScore
          studentCount
        }
        subjectPerformances {
          subjectId
          subjectName
          averageScore
        }
        gradeDistribution {
          grade
          count
        }
      }
    }
  `,
	GET_ATTENDANCE_ANALYTICS: `
    query GetAttendanceAnalytics($schoolId: String!) {
      getAttendanceAnalytics(schoolId: $schoolId) {
        weeklyTrends {
          date
          attendanceRate
        }
        monthlyTrends {
          date
          attendanceRate
        }
        averageRate
      }
    }
  `,
	GET_STUDENT_PROGRESS: `
    query GetStudentProgress($studentId: String!, $academicYear: String!, $semester: String!) {
      getStudentProgress(studentId: $studentId, academicYear: $academicYear, semester: $semester) {
        studentId
        studentName
        gradeAverage
        attendanceRate
        subjectGrades {
          subjectId
          subjectName
          averageScore
        }
        gradeHistory {
          date
          attendanceRate
        }
      }
    }
  `,
	GET_SCHOOL_OVERVIEW: `
    query GetSchoolOverview($schoolId: String!) {
      getSchoolOverview(schoolId: $schoolId) {
        totalStudents
        totalStaff
        totalClasses
        attendanceRate
        feeCollectionRate
        staffStudentRatio
      }
    }
  `,
	GET_FEE_COLLECTION_ANALYTICS: `
    query GetFeeCollectionAnalytics($schoolId: String!) {
      getFeeCollectionAnalytics(schoolId: $schoolId) {
        totalExpected
        totalCollected
        collectionRate
        outstanding
        monthlyCollection {
          month
          amount
        }
      }
    }
  `,
	GET_STAFF_STUDENT_RATIO: `
    query GetStaffStudentRatio($schoolId: String!) {
      getStaffStudentRatio(schoolId: $schoolId) {
        totalTeachers
        totalStudents
        ratio
      }
    }
  `,
};
