"use client";

import { useState, useEffect, useCallback } from "react";

import { graphqlRequest } from "@/lib/graphql-client";
import { CLASS_QUERIES, CLASS_MUTATIONS } from "@/app/graphql/class";
import { useAuth } from "@/contexts/auth-context";
import {
  Class,
  ClassFormData,
  ClassFilterInput,
  ClassSortInput,
  PaginatedClassesResult,
} from "@/types/academic";

export interface UseClassesOptions {
  schoolId: string | null;
  page?: number;
  pageSize?: number;
  filter?: ClassFilterInput;
  sort?: ClassSortInput;
}

export interface UpdateClassInput {
  name?: string;
  section?: string;
  homeroomTeacherId?: string;
  roomNumber?: string;
  capacity?: number;
  status?: string;
}

export function useClasses(options: UseClassesOptions) {
  const { schoolId, page = 1, pageSize = 10, filter, sort } = options;
  const { getAccessToken, isAuthenticated } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = useCallback(async () => {
    if (!schoolId || !isAuthenticated) {
      setClasses([]);
      setTotal(0);
      setTotalPages(0);

      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = getAccessToken();
      const data = await graphqlRequest<{
        classesBySchool: PaginatedClassesResult;
      }>(
        CLASS_QUERIES.BY_SCHOOL,
        {
          schoolId,
          page,
          pageSize,
          filter: filter || undefined,
          sort: sort || undefined,
        },
        token,
      );

      setClasses(data.classesBySchool.items || []);
      setTotal(data.classesBySchool.total);
      setTotalPages(data.classesBySchool.totalPages);
    } catch (err) {
      console.error("Failed to fetch classes:", err);
      setError(err instanceof Error ? err.message : "Failed to load classes");
    } finally {
      setIsLoading(false);
    }
  }, [schoolId, page, pageSize, filter, sort, isAuthenticated, getAccessToken]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const createClass = useCallback(
    async (input: ClassFormData) => {
      const token = getAccessToken();
      const data = await graphqlRequest<{ createClass: Class }>(
        CLASS_MUTATIONS.CREATE,
        { input },
        token,
      );

      await fetchClasses();

      return data.createClass;
    },
    [getAccessToken, fetchClasses],
  );

  const updateClass = useCallback(
    async (id: string, input: UpdateClassInput) => {
      const token = getAccessToken();
      const data = await graphqlRequest<{ updateClass: Class }>(
        CLASS_MUTATIONS.UPDATE,
        { id, input },
        token,
      );

      await fetchClasses();

      return data.updateClass;
    },
    [getAccessToken, fetchClasses],
  );

  const deleteClass = useCallback(
    async (id: string) => {
      const token = getAccessToken();

      await graphqlRequest<{ deleteClass: boolean }>(
        CLASS_MUTATIONS.DELETE,
        { id },
        token,
      );
      await fetchClasses();
    },
    [getAccessToken, fetchClasses],
  );

  return {
    classes,
    total,
    totalPages,
    isLoading,
    error,
    refresh: fetchClasses,
    createClass,
    updateClass,
    deleteClass,
  };
}

export function useClass(id: string | null) {
  const { getAccessToken, isAuthenticated } = useAuth();
  const [classData, setClassData] = useState<Class | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !isAuthenticated) {
      setClassData(null);

      return;
    }

    const fetchClass = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = getAccessToken();
        const data = await graphqlRequest<{ class: Class }>(
          CLASS_QUERIES.GET_BY_ID,
          { id },
          token,
        );

        setClassData(data.class || null);
      } catch (err) {
        console.error("Failed to fetch class:", err);
        setError(err instanceof Error ? err.message : "Failed to load class");
      } finally {
        setIsLoading(false);
      }
    };

    fetchClass();
  }, [id, isAuthenticated, getAccessToken]);

  return { classData, isLoading, error };
}
