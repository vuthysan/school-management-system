"use client";

import { useState, useEffect, useCallback } from "react";
import { graphqlRequest, SCHOOL_QUERIES } from "@/lib/graphql-client";
import { School, CreateSchoolInput } from "@/types/school";

interface UseSchoolsReturn {
  schools: School[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface UseCreateSchoolReturn {
  createSchool: (input: CreateSchoolInput) => Promise<School>;
  loading: boolean;
  error: string | null;
}

export function useSchools(): UseSchoolsReturn {
  const [schools, setSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSchools = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await graphqlRequest<{ schools: School[] }>(SCHOOL_QUERIES.GET_ALL);
      setSchools(data.schools || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch schools");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchools();
  }, [fetchSchools]);

  return { schools, loading, error, refetch: fetchSchools };
}

export function useCreateSchool(): UseCreateSchoolReturn {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createSchool = async (input: CreateSchoolInput): Promise<School> => {
    setLoading(true);
    setError(null);
    try {
      const data = await graphqlRequest<{ createSchool: School }>(
        SCHOOL_QUERIES.CREATE,
        { input }
      );
      return data.createSchool;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create school";
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createSchool, loading, error };
}
