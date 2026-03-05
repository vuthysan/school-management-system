export const REPORT_CARD_QUERIES = {
	GET_STUDENT_REPORT: `
    query GetReportCard($studentId: String!, $academicYear: String!, $semester: String!) {
      reportCard(studentId: $studentId, academicYear: $academicYear, semester: $semester) {
        studentId
        studentCode
        firstNameKm
        lastNameKm
        firstNameEn
        lastNameEn
        dateOfBirth
        gender
        gradeLevel
        className
        academicYear
        academicYearBe
        semester
        schoolName
        subjects {
          subjectId
          subjectName
          quizAverage
          midtermScore
          finalScore
          subjectAverage
          grade
          totalAssessments
        }
        overallAverage
        overallGrade
        totalSubjects
        rankInClass
        totalStudentsInClass
        remarks
        generatedAt
      }
    }
  `,
	GET_CLASS_REPORTS: `
    query GetClassReportCards($classId: String!, $academicYear: String!, $semester: String!) {
      classReportCards(classId: $classId, academicYear: $academicYear, semester: $semester) {
        studentId
        studentCode
        firstNameKm
        lastNameKm
        firstNameEn
        lastNameEn
        gradeLevel
        className
        academicYear
        academicYearBe
        semester
        subjects {
          subjectName
          subjectAverage
          grade
        }
        overallAverage
        overallGrade
        rankInClass
        totalStudentsInClass
        remarks
      }
    }
  `,
};
