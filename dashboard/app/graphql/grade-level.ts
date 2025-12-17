// GradeLevel GraphQL Queries and Mutations

export const GRADE_LEVEL_QUERIES = {
	GET_ALL: `
    query GetGradeLevels {
      gradeLevels {
        id
        schoolId
        branchId
        name
        code
        order
        description
        status
      }
    }
  `,

	GET_BY_ID: `
    query GetGradeLevel($id: String!) {
      gradeLevel(id: $id) {
        id
        schoolId
        branchId
        name
        code
        order
        description
        status
      }
    }
  `,

	BY_SCHOOL: `
    query GradeLevelsBySchool(
      $schoolId: String!
      $page: Int
      $pageSize: Int
      $filter: GradeLevelFilterInput
      $sort: GradeLevelSortInput
    ) {
      gradeLevelsBySchool(
        schoolId: $schoolId
        page: $page
        pageSize: $pageSize
        filter: $filter
        sort: $sort
      ) {
        items {
          id
          schoolId
          branchId
          name
          code
          order
          description
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

export const GRADE_LEVEL_MUTATIONS = {
	CREATE: `
    mutation CreateGradeLevel($input: GradeLevelInput!) {
      createGradeLevel(input: $input) {
        id
        name
        code
        order
      }
    }
  `,

	UPDATE: `
    mutation UpdateGradeLevel($id: String!, $input: UpdateGradeLevelInput!) {
      updateGradeLevel(id: $id, input: $input) {
        id
        name
        code
        order
        status
      }
    }
  `,

	DELETE: `
    mutation DeleteGradeLevel($id: String!) {
      deleteGradeLevel(id: $id)
    }
  `,
};
