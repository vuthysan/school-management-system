"use client";

import { useState, useEffect, useCallback } from "react";

import { graphqlRequest } from "@/lib/graphql-client";
import { SUBJECT_QUERIES, SUBJECT_MUTATIONS } from "@/app/graphql/subject";
import { useAuth } from "@/contexts/auth-context";
import {
  Subject,
  SubjectFormData,
  SubjectFilterInput,
  SubjectSortInput,
  PaginatedSubjectsResult,
} from "@/types/academic";

export interface UseSubjectsOptions {
  schoolId: string | null;
  page?: number;
  pageSize?: number;
  filter?: SubjectFilterInput;
  sort?: SubjectSortInput;
}

export interface UpdateSubjectInput {
  subjectName?: string;
  subjectCode?: string;
  description?: string;
  gradeLevels?: string[];
  credits?: number;
  department?: string;
  status?: string;
}

export function useSubjects(options: UseSubjectsOptions) {
  const { schoolId, page = 1, pageSize = 10, filter, sort } = options;
  const { getAccessToken, isAuthenticated } = useAuth();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = useCallback(async () => {
    if (!schoolId || !isAuthenticated) {
      setSubjects([]);
      setTotal(0);
      setTotalPages(0);

      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = getAccessToken();
      const data = await graphqlRequest<{
        subjectsBySchool: PaginatedSubjectsResult;
      }>(
        SUBJECT_QUERIES.BY_SCHOOL,
        {
          schoolId,
          page,
          pageSize,
          filter: filter || undefined,
          sort: sort || undefined,
        },
        token,
      );

      setSubjects(data.subjectsBySchool.items || []);
      setTotal(data.subjectsBySchool.total);
      setTotalPages(data.subjectsBySchool.totalPages);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
      setError(err instanceof Error ? err.message : "Failed to load subjects");
    } finally {
      setIsLoading(false);
    }
  }, [schoolId, page, pageSize, filter, sort, isAuthenticated, getAccessToken]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const createSubject = useCallback(
    async (input: SubjectFormData) => {
      const token = getAccessToken();
      const data = await graphqlRequest<{ createSubject: Subject }>(
        SUBJECT_MUTATIONS.CREATE,
        { input },
        token,
      );

      await fetchSubjects();

      return data.createSubject;
    },
    [getAccessToken, fetchSubjects],
  );

  const updateSubject = useCallback(
    async (id: string, input: UpdateSubjectInput) => {
      const token = getAccessToken();
      const data = await graphqlRequest<{ updateSubject: Subject }>(
        SUBJECT_MUTATIONS.UPDATE,
        { id, input },
        token,
      );

      await fetchSubjects();

      return data.updateSubject;
    },
    [getAccessToken, fetchSubjects],
  );

  const deleteSubject = useCallback(
    async (id: string) => {
      const token = getAccessToken();

      await graphqlRequest<{ deleteSubject: boolean }>(
        SUBJECT_MUTATIONS.DELETE,
        { id },
        token,
      );
      await fetchSubjects();
    },
    [getAccessToken, fetchSubjects],
  );

  return {
    subjects,
    total,
    totalPages,
    isLoading,
    error,
    refresh: fetchSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
  };
}

export function useSubject(id: string | null) {
  const { getAccessToken, isAuthenticated } = useAuth();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || !isAuthenticated) {
      setSubject(null);

      return;
    }

    const fetchSubject = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = getAccessToken();
        const data = await graphqlRequest<{ subject: Subject }>(
          SUBJECT_QUERIES.GET_BY_ID,
          { id },
          token,
        );

        setSubject(data.subject || null);
      } catch (err) {
        console.error("Failed to fetch subject:", err);
        setError(err instanceof Error ? err.message : "Failed to load subject");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubject();
  }, [id, isAuthenticated, getAccessToken]);

  return { subject, isLoading, error };
}
