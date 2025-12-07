"use client";

import { useState, useEffect, useCallback } from "react";

import { graphqlRequest, BRANCH_QUERIES } from "@/lib/graphql-client";
import { Branch, CreateBranchInput } from "@/types/branch";

interface UseBranchesReturn {
  branches: Branch[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseCreateBranchReturn {
  createBranch: (input: CreateBranchInput) => Promise<Branch>;
  loading: boolean;
  error: string | null;
}

export function useBranches(schoolId?: string): UseBranchesReturn {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBranches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (schoolId) {
        const data = await graphqlRequest<{ branchesBySchool: Branch[] }>(
          BRANCH_QUERIES.GET_BY_SCHOOL,
          { schoolId },
        );

        setBranches(data.branchesBySchool || []);
      } else {
        const data = await graphqlRequest<{ branches: Branch[] }>(
          BRANCH_QUERIES.GET_ALL,
        );

        setBranches(data.branches || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch branches");
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  return { branches, loading, error, refetch: fetchBranches };
}

export function useCreateBranch(): UseCreateBranchReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBranch = async (input: CreateBranchInput): Promise<Branch> => {
    setLoading(true);
    setError(null);
    try {
      const data = await graphqlRequest<{ createBranch: Branch }>(
        BRANCH_QUERIES.CREATE,
        { input },
      );

      return data.createBranch;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create branch";

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createBranch, loading, error };
}
