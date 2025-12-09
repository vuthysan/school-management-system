// Branch GraphQL Queries and Mutations

export const BRANCH_QUERIES = {
	GET_ALL: `
    query GetBranches {
      branches {
        id
        schoolId
        name
        code
        address {
          street
          village
          commune
          district
          province
        }
        contact {
          phone
          email
        }
        isMainBranch
        status
      }
    }
  `,

	GET_BY_ID: `
    query GetBranch($id: String!) {
      branch(id: $id) {
        id
        schoolId
        name
        code
        address {
          street
          village
          commune
          district
          province
          postalCode
        }
        contact {
          phone
          email
        }
        isMainBranch
        status
        managerId
      }
    }
  `,

	BY_SCHOOL: `
    query BranchesBySchool($schoolId: String!) {
      branchesBySchool(schoolId: $schoolId) {
        id
        name
        code
        address {
          province
          district
        }
        isMainBranch
        status
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
        code
      }
    }
  `,

	UPDATE: `
    mutation UpdateBranch($id: String!, $input: UpdateBranchInput!) {
      updateBranch(id: $id, input: $input) {
        id
        name
        status
      }
    }
  `,

	DELETE: `
    mutation DeleteBranch($id: String!) {
      deleteBranch(id: $id)
    }
  `,
};
