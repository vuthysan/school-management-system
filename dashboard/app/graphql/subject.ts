// Subject GraphQL Queries and Mutations

export const SUBJECT_QUERIES = {
  GET_ALL: `
    query GetSubjects {
      subjects {
        id
        schoolId
        branchId
        subjectName
        subjectCode
        description
        gradeLevels
        credits
        department
        status
        createdAt
        updatedAt
      }
    }
  `,

  GET_BY_ID: `
    query GetSubject($id: String!) {
      subject(id: $id) {
        id
        schoolId
        branchId
        subjectName
        subjectCode
        description
        gradeLevels
        credits
        department
        status
        createdAt
        updatedAt
      }
    }
  `,

  BY_SCHOOL: `
    query SubjectsBySchool(
      $schoolId: String!
      $page: Int
      $pageSize: Int
      $filter: SubjectFilterInput
      $sort: SubjectSortInput
    ) {
      subjectsBySchool(
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
          subjectName
          subjectCode
          description
          gradeLevels
          credits
          department
          status
          createdAt
          updatedAt
        }
        total
        page
        pageSize
        totalPages
      }
    }
  `,
};

export const SUBJECT_MUTATIONS = {
  CREATE: `
    mutation CreateSubject($input: SubjectInput!) {
      createSubject(input: $input) {
        id
        subjectName
        subjectCode
      }
    }
  `,

  UPDATE: `
    mutation UpdateSubject($id: String!, $input: UpdateSubjectInput!) {
      updateSubject(id: $id, input: $input) {
        id
        subjectName
        subjectCode
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
