// Branch GraphQL Queries and Mutations

export const BRANCH_QUERIES = {
	GET_ALL: `
    query GetBranches {
      branches {
        id
        schoolId
        name
        address {
          street
          village
          commune
          district
          province
          postalCode
          country
        }
        contactEmail
        contactPhone
        createdAt
        updatedAt
      }
    }
  `,

	GET_BY_ID: `
    query GetBranch($id: String!) {
      branch(id: $id) {
        id
        schoolId
        name
        address {
          street
          village
          commune
          district
          province
          postalCode
          country
        }
        contactEmail
        contactPhone
        createdAt
        updatedAt
      }
    }
  `,

	BY_SCHOOL: `
    query BranchesBySchool($schoolId: String!) {
      branchesBySchool(schoolId: $schoolId) {
        id
        schoolId
        name
        address {
          street
          village
          commune
          district
          province
        }
        contactEmail
        contactPhone
        createdAt
        updatedAt
      }
    }
  `,
};

export const BRANCH_MUTATIONS = {
	CREATE: `
    mutation CreateBranch($input: BranchInput!) {
      createBranch(input: $input) {
        id
        schoolId
        name
        contactEmail
        contactPhone
      }
    }
  `,

	UPDATE: `
    mutation UpdateBranch($id: String!, $input: UpdateBranchInput!) {
      updateBranch(id: $id, input: $input) {
        id
        name
        contactEmail
        contactPhone
        updatedAt
      }
    }
  `,

	DELETE: `
    mutation DeleteBranch($id: String!) {
      deleteBranch(id: $id)
    }
  `,
};
