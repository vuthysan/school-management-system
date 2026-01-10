export const TERM_QUERIES = {
	GET_ALL: `
    query GetTerms($schoolId: String!) {
      terms(schoolId: $schoolId) {
        idStr
        academicYearIdStr
        name
        termNumber
        termType
        startDateStr
        endDateStr
        isCurrent
        description
      }
    }
  `,
	BY_YEAR: `
    query GetTermsByYear($academicYearId: String!) {
      termsByAcademicYear(academicYearId: $academicYearId) {
        idStr
        name
        termNumber
        termType
        startDateStr
        endDateStr
        isCurrent
      }
    }
  `,
};

export const TERM_MUTATIONS = {
	CREATE: `
    mutation CreateTerm($input: CreateTermInput!) {
      createTerm(input: $input) {
        idStr
        name
        termNumber
        isCurrent
      }
    }
  `,
	UPDATE: `
    mutation UpdateTerm($id: String!, $input: UpdateTermInput!) {
      updateTerm(id: $id, input: $input) {
        idStr
        name
        termNumber
        isCurrent
      }
    }
  `,
	DELETE: `
    mutation DeleteTerm($id: String!) {
      deleteTerm(id: $id)
    }
  `,
};
