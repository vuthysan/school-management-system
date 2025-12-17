// GraphQL client for communicating with the Rust server

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8081";

interface GraphQLResponse<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

/**
 * Make a GraphQL request to the backend
 * @param query - GraphQL query or mutation string
 * @param variables - Variables for the query
 * @param token - Optional auth token
 */
export async function graphqlRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
  token?: string | null,
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/graphql`, {
    method: "POST",
    headers,
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

// Re-export all queries and mutations from the graphql directory
export * from "@/app/graphql";
