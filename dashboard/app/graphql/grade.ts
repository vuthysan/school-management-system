// Grade GraphQL Queries and Mutations

export const GRADE_QUERIES = {
  GET_BY_STUDENT: `
    query GradesByStudent($studentId: String!) {
      gradesByStudent(studentId: $studentId) {
        id
        studentId
        subjectId
        classId
        assessmentType
        score
        maxScore
        percentage
        letterGrade
        term
        academicYear
        remarks
      }
    }
  `,

  GET_BY_CLASS: `
    query GradesByClass($classId: String!, $subjectId: String) {
      gradesByClass(classId: $classId, subjectId: $subjectId) {
        id
        studentId
        subjectId
        assessmentType
        score
        maxScore
        percentage
        letterGrade
      }
    }
  `,

  REPORT_CARD: `
    query ReportCard($studentId: String!, $term: String!, $academicYear: String!) {
      reportCard(studentId: $studentId, term: $term, academicYear: $academicYear) {
        student {
          id
          fullName
          gradeLevel
        }
        grades {
          subjectName
          score
          maxScore
          percentage
          letterGrade
        }
        gpa
        rank
        totalStudents
        remarks
      }
    }
  `,
};

export const GRADE_MUTATIONS = {
  ADD_GRADE: `
    mutation AddGrade($input: GradeInput!) {
      addGrade(input: $input) {
        id
        studentId
        subjectId
        score
        maxScore
        letterGrade
      }
    }
  `,

  UPDATE_GRADE: `
    mutation UpdateGrade($id: String!, $input: UpdateGradeInput!) {
      updateGrade(id: $id, input: $input) {
        id
        score
        maxScore
        letterGrade
        remarks
      }
    }
  `,

  DELETE_GRADE: `
    mutation DeleteGrade($id: String!) {
      deleteGrade(id: $id)
    }
  `,
};
