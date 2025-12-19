// Class GraphQL Queries and Mutations

export const CLASS_QUERIES = {
	GET_ALL: `
    query GetClasses {
      classes {
        id
        schoolId
        academicYearId
        name
        code
        gradeLevel
        section
        capacity
        currentEnrollment
        status
        hasCapacity
        availableSpots
      }
    }
  `,

	GET_BY_ID: `
    query GetClass($id: String!) {
      class(id: $id) {
        id
        schoolId
        academicYearId
        name
        code
        gradeLevel
        section
        homeroomTeacherId
        roomNumber
        capacity
        currentEnrollment
        status
        schedule {
          day
          periods {
            periodNumber
            subjectId
            teacherId
            startTime
            endTime
          }
        }
        hasCapacity
        availableSpots
      }
    }
  `,

	BY_SCHOOL: `
    query ClassesBySchool(
      $schoolId: String!
      $page: Int
      $pageSize: Int
      $filter: ClassFilterInput
      $sort: ClassSortInput
    ) {
      classesBySchool(
        schoolId: $schoolId
        page: $page
        pageSize: $pageSize
        filter: $filter
        sort: $sort
      ) {
        items {
          id
          schoolId
          academicYearId
          name
          code
          gradeLevel
          section
          homeroomTeacherId
          roomNumber
          capacity
          currentEnrollment
          status
        }
        total
        page
        pageSize
        totalPages
      }
    }
  `,
};

export const CLASS_MUTATIONS = {
	CREATE: `
    mutation CreateClass($input: ClassInput!) {
      createClass(input: $input) {
        id
        name
        code
        gradeLevel
      }
    }
  `,

	UPDATE: `
    mutation UpdateClass($id: String!, $input: UpdateClassInput!) {
      updateClass(id: $id, input: $input) {
        id
        name
        section
        capacity
        status
      }
    }
  `,

	DELETE: `
    mutation DeleteClass($id: String!) {
      deleteClass(id: $id)
    }
  `,
};
