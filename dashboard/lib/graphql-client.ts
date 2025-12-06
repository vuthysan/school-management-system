// GraphQL client for communicating with the Rust server

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T> {
  const response = await fetch(`${API_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const json: GraphQLResponse<T> = await response.json();

  if (json.errors) {
    throw new Error(json.errors.map((e) => e.message).join(", "));
  }

  if (!json.data) {
    throw new Error("No data returned from GraphQL");
  }

  return json.data;
}

// School mutations and queries
export const SCHOOL_QUERIES = {
  GET_ALL: `
    query GetSchools {
      schools {
        id
        ownerId
        name
        banners
        logoUrl
        website
        contactEmail
        contactPhone
        createdAt
        updatedAt
      }
    }
  `,
  CREATE: `
    mutation CreateSchool($input: SchoolInput!) {
      createSchool(input: $input) {
        id
        ownerId
        name
        banners
        logoUrl
        website
        contactEmail
        contactPhone
        createdAt
        updatedAt
      }
    }
  `,
};

// Branch mutations and queries  
export const BRANCH_QUERIES = {
  GET_ALL: `
    query GetBranches {
      branches {
        id
        schoolId
        name
        address {
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
  GET_BY_SCHOOL: `
    query GetBranchesBySchool($schoolId: String!) {
      branchesBySchool(schoolId: $schoolId) {
        id
        schoolId
        name
        address {
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
  CREATE: `
    mutation CreateBranch($input: BranchInput!) {
      createBranch(input: $input) {
        id
        schoolId
        name
        address {
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
