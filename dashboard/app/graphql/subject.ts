// Subject GraphQL Queries and Mutations

export const SUBJECT_QUERIES = {
	GET_ALL: `
    query GetSubjects {
      subjects {
        id
        schoolId
        name
        code
        description
        category
        credits
        isElective
        status
      }
    }
  `,

	GET_BY_ID: `
    query GetSubject($id: String!) {
      subject(id: $id) {
        id
        schoolId
        name
        code
        description
        category
        credits
        isElective
        status
        prerequisites
        assessmentWeights {
          type
          weight
        }
      }
    }
  `,

	BY_SCHOOL: `
    query SubjectsBySchool($schoolId: String!) {
      subjectsBySchool(schoolId: $schoolId) {
        id
        name
        code
        category
        credits
        status
      }
    }
  `,

	BY_GRADE_LEVEL: `
    query SubjectsByGradeLevel($schoolId: String!, $gradeLevel: String!) {
      subjectsByGradeLevel(schoolId: $schoolId, gradeLevel: $gradeLevel) {
        id
        name
        code
        category
        isElective
      }
    }
  `,
};

export const SUBJECT_MUTATIONS = {
	CREATE: `
    mutation CreateSubject($input: SubjectInput!) {
      createSubject(input: $input) {
        id
        name
        code
        category
      }
    }
  `,

	UPDATE: `
    mutation UpdateSubject($id: String!, $input: UpdateSubjectInput!) {
      updateSubject(id: $id, input: $input) {
        id
        name
        code
        description
        status
      }
    }
  `,

	DELETE: `
    mutation DeleteSubject($id: String!) {
      deleteSubject(id: $id)
    }
  `,
};
