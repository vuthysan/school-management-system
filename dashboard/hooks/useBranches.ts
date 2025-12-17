"use client";

import { useState, useEffect, useCallback } from "react";

import {
  graphqlRequest,
  BRANCH_QUERIES,
  BRANCH_MUTATIONS,
} from "@/lib/graphql-client";
import { Branch, CreateBranchInput } from "@/types/branch";
import { useAuth } from "@/contexts/auth-context";

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

interface UpdateBranchInput {
  name?: string;
  address?: {
    street?: string;
    village?: string;
    commune?: string;
    district?: string;
    province?: string;
  };
  contactEmail?: string;
  contactPhone?: string;
}

interface UseUpdateBranchReturn {
  updateBranch: (id: string, input: UpdateBranchInput) => Promise<Branch>;
  loading: boolean;
  error: string | null;
}

interface UseDeleteBranchReturn {
  deleteBranch: (id: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
}

export function useBranches(schoolId?: string): UseBranchesReturn {
  const { getAccessToken, isAuthenticated } = useAuth();
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBranches = useCallback(async () => {
    if (!isAuthenticated) {
      setLoading(false);

      return;
    }

    setLoading(true);
    setError(null);
    try {
      const token = getAccessToken();

      if (schoolId) {
        const data = await graphqlRequest<{ branchesBySchool: Branch[] }>(
          BRANCH_QUERIES.BY_SCHOOL,
          { schoolId },
          token,
        );

        setBranches(data.branchesBySchool || []);
      } else {
        const data = await graphqlRequest<{ branches: Branch[] }>(
          BRANCH_QUERIES.GET_ALL,
          undefined,
          token,
        );

        setBranches(data.branches || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch branches");
    } finally {
      setLoading(false);
    }
  }, [schoolId, isAuthenticated, getAccessToken]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  return { branches, loading, error, refetch: fetchBranches };
}

export function useCreateBranch(): UseCreateBranchReturn {
  const { getAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBranch = async (input: CreateBranchInput): Promise<Branch> => {
    setLoading(true);
    setError(null);
    try {
      const token = getAccessToken();
      const data = await graphqlRequest<{ createBranch: Branch }>(
        BRANCH_MUTATIONS.CREATE,
        { input },
        token,
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

export function useUpdateBranch(): UseUpdateBranchReturn {
  const { getAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBranch = async (
    id: string,
    input: UpdateBranchInput,
  ): Promise<Branch> => {
    setLoading(true);
    setError(null);
    try {
      const token = getAccessToken();
      const data = await graphqlRequest<{ updateBranch: Branch }>(
        BRANCH_MUTATIONS.UPDATE,
        { id, input },
        token,
      );

      return data.updateBranch;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to update branch";

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateBranch, loading, error };
}

export function useDeleteBranch(): UseDeleteBranchReturn {
  const { getAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteBranch = async (id: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const token = getAccessToken();
      const data = await graphqlRequest<{ deleteBranch: boolean }>(
        BRANCH_MUTATIONS.DELETE,
        { id },
        token,
      );

      return data.deleteBranch;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete branch";

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deleteBranch, loading, error };
}
