"use client";

import { useState, useEffect, useCallback } from "react";

import { graphqlRequest } from "@/lib/graphql-client";
import {
  GRADE_LEVEL_QUERIES,
  GRADE_LEVEL_MUTATIONS,
} from "@/app/graphql/grade-level";
import { useAuth } from "@/contexts/auth-context";
import {
  GradeLevel,
  GradeLevelFormData,
  GradeLevelFilterInput,
  GradeLevelSortInput,
  PaginatedGradeLevelsResult,
} from "@/types/academic";

export interface UseGradeLevelsOptions {
  schoolId: string | null;
  page?: number;
  pageSize?: number;
  filter?: GradeLevelFilterInput;
  sort?: GradeLevelSortInput;
}

export interface UpdateGradeLevelInput {
  name?: string;
  code?: string;
  order?: number;
  description?: string;
  status?: string;
  branchId?: string;
}

export function useGradeLevels(options: UseGradeLevelsOptions) {
  const { schoolId, page = 1, pageSize = 100, filter, sort } = options;
  const { getAccessToken, isAuthenticated } = useAuth();
  const [gradeLevels, setGradeLevels] = useState<GradeLevel[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGradeLevels = useCallback(async () => {
    if (!schoolId || !isAuthenticated) {
      setGradeLevels([]);
      setTotal(0);
      setTotalPages(0);

      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = getAccessToken();
      const data = await graphqlRequest<{
        gradeLevelsBySchool: PaginatedGradeLevelsResult;
      }>(
        GRADE_LEVEL_QUERIES.BY_SCHOOL,
        {
          schoolId,
          page,
          pageSize,
          filter: filter || undefined,
          sort: sort || undefined,
        },
        token,
      );

      setGradeLevels(data.gradeLevelsBySchool.items || []);
      setTotal(data.gradeLevelsBySchool.total);
      setTotalPages(data.gradeLevelsBySchool.totalPages);
    } catch (err) {
      console.error("Failed to fetch grade levels:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load grade levels",
      );
    } finally {
      setIsLoading(false);
    }
  }, [schoolId, page, pageSize, filter, sort, isAuthenticated, getAccessToken]);

  useEffect(() => {
    fetchGradeLevels();
  }, [fetchGradeLevels]);

  const createGradeLevel = useCallback(
    async (input: GradeLevelFormData) => {
      const token = getAccessToken();
      const data = await graphqlRequest<{ createGradeLevel: GradeLevel }>(
        GRADE_LEVEL_MUTATIONS.CREATE,
        { input },
        token,
      );

      await fetchGradeLevels();

      return data.createGradeLevel;
    },
    [getAccessToken, fetchGradeLevels],
  );

  const updateGradeLevel = useCallback(
    async (id: string, input: UpdateGradeLevelInput) => {
      const token = getAccessToken();
      const data = await graphqlRequest<{ updateGradeLevel: GradeLevel }>(
        GRADE_LEVEL_MUTATIONS.UPDATE,
        { id, input },
        token,
      );

      await fetchGradeLevels();

      return data.updateGradeLevel;
    },
    [getAccessToken, fetchGradeLevels],
  );

  const deleteGradeLevel = useCallback(
    async (id: string) => {
      const token = getAccessToken();

      await graphqlRequest<{ deleteGradeLevel: boolean }>(
        GRADE_LEVEL_MUTATIONS.DELETE,
        { id },
        token,
      );
      await fetchGradeLevels();
    },
    [getAccessToken, fetchGradeLevels],
  );

  return {
    gradeLevels,
    total,
    totalPages,
    isLoading,
    error,
    refresh: fetchGradeLevels,
    createGradeLevel,
    updateGradeLevel,
    deleteGradeLevel,
  };
}

export function useGradeLevel(id: string | null) {
  const { getAccessToken, isAuthenticated } = useAuth();
  const [gradeLevel, setGradeLevel] = useState<GradeLevel | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !isAuthenticated) {
      setGradeLevel(null);

      return;
    }

    const fetchGradeLevel = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = getAccessToken();
        const data = await graphqlRequest<{ gradeLevel: GradeLevel }>(
          GRADE_LEVEL_QUERIES.GET_BY_ID,
          { id },
          token,
        );

        setGradeLevel(data.gradeLevel || null);
      } catch (err) {
        console.error("Failed to fetch grade level:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load grade level",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchGradeLevel();
  }, [id, isAuthenticated, getAccessToken]);

  return { gradeLevel, isLoading, error };
}
