export const ACADEMIC_YEAR_QUERIES = {
	GET_ALL: `
    query GetAcademicYears($schoolId: String!) {
      academicYears(schoolId: $schoolId) {
        idStr
        name
        label
        startDateStr
        endDateStr
        isCurrent
        status
        description
      }
    }
  `,
	GET_CURRENT: `
    query GetCurrentAcademicYear($schoolId: String!) {
      currentAcademicYear(schoolId: $schoolId) {
        idStr
        name
        label
        startDateStr
        endDateStr
        isCurrent
        status
        description
      }
    }
  `,
};

export const ACADEMIC_YEAR_MUTATIONS = {
	CREATE: `
    mutation CreateAcademicYear($input: CreateAcademicYearInput!) {
      createAcademicYear(input: $input) {
        idStr
        name
        label
        startDateStr
        endDateStr
        isCurrent
        status
      }
    }
  `,
	UPDATE: `
    mutation UpdateAcademicYear($id: String!, $input: UpdateAcademicYearInput!) {
      updateAcademicYear(id: $id, input: $input) {
        idStr
        name
        label
        startDateStr
        endDateStr
        isCurrent
        status
      }
    }
  `,
	DELETE: `
    mutation DeleteAcademicYear($id: String!) {
      deleteAcademicYear(id: $id)
    }
  `,
	SET_CURRENT: `
    mutation SetCurrentAcademicYear($id: String!) {
      setCurrentAcademicYear(id: $id) {
        idStr
        isCurrent
        status
      }
    }
  `,
};
