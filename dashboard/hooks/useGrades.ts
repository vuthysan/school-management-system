"use client";

import { useState, useEffect, useCallback } from "react";

import {
  graphqlRequest,
  GRADE_QUERIES,
  GRADE_MUTATIONS,
} from "@/lib/graphql-client";
import { useAuth } from "@/contexts/auth-context";

export interface Grade {
  id: string;
  studentId: string;
  subjectId: string;
  classId: string;
  assessmentType: string;
  score: number;
  maxScore: number;
  percentage: number;
  letterGrade: string;
  term: string;
  academicYear: string;
  remarks?: string;
}

export interface ReportCardGrade {
  subjectName: string;
  score: number;
  maxScore: number;
  percentage: number;
  letterGrade: string;
}

export interface ReportCard {
  student: {
    id: string;
    fullName: string;
    gradeLevel: string;
  };
  grades: ReportCardGrade[];
  gpa: number;
  rank: number;
  totalStudents: number;
  remarks?: string;
}

export interface CreateGradeInput {
  studentId: string;
  subjectId: string;
  classId: string;
  assessmentType: string;
  score: number;
  maxScore: number;
  term: string;
  academicYear: string;
  remarks?: string;
}

export interface UpdateGradeInput {
  score?: number;
  maxScore?: number;
  remarks?: string;
}

export function useGradesByStudent(studentId: string | null) {
  const { getAccessToken, isAuthenticated } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGrades = useCallback(async () => {
    if (!studentId || !isAuthenticated) {
      setGrades([]);

      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = getAccessToken();
      const data = await graphqlRequest<{ gradesByStudent: Grade[] }>(
        GRADE_QUERIES.GET_BY_STUDENT,
        { studentId },
        token,
      );

      setGrades(data.gradesByStudent || []);
    } catch (err) {
      console.error("Failed to fetch grades:", err);
      setError(err instanceof Error ? err.message : "Failed to load grades");
    } finally {
      setIsLoading(false);
    }
  }, [studentId, isAuthenticated, getAccessToken]);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  return { grades, isLoading, error, refresh: fetchGrades };
}

export function useGradesByClass(classId: string | null, subjectId?: string) {
  const { getAccessToken, isAuthenticated } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchGrades = useCallback(async () => {
    if (!classId || !isAuthenticated) {
      setGrades([]);

      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = getAccessToken();
      const data = await graphqlRequest<{ gradesByClass: Grade[] }>(
        GRADE_QUERIES.GET_BY_CLASS,
        { classId, subjectId },
        token,
      );

      setGrades(data.gradesByClass || []);
    } catch (err) {
      console.error("Failed to fetch grades:", err);
      setError(err instanceof Error ? err.message : "Failed to load grades");
    } finally {
      setIsLoading(false);
    }
  }, [classId, subjectId, isAuthenticated, getAccessToken]);

  useEffect(() => {
    fetchGrades();
  }, [fetchGrades]);

  return { grades, isLoading, error, refresh: fetchGrades };
}

export function useReportCard(
  studentId: string | null,
  term: string,
  academicYear: string,
) {
  const { getAccessToken, isAuthenticated } = useAuth();
  const [reportCard, setReportCard] = useState<ReportCard | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId || !term || !academicYear || !isAuthenticated) {
      setReportCard(null);

      return;
    }

    const fetchReportCard = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const token = getAccessToken();
        const data = await graphqlRequest<{ reportCard: ReportCard }>(
          GRADE_QUERIES.REPORT_CARD,
          { studentId, term, academicYear },
          token,
        );

        setReportCard(data.reportCard || null);
      } catch (err) {
        console.error("Failed to fetch report card:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load report card",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchReportCard();
  }, [studentId, term, academicYear, isAuthenticated, getAccessToken]);

  return { reportCard, isLoading, error };
}

export function useGradeMutations() {
  const { getAccessToken } = useAuth();

  const addGrade = useCallback(
    async (input: CreateGradeInput) => {
      const token = getAccessToken();
      const data = await graphqlRequest<{ addGrade: Grade }>(
        GRADE_MUTATIONS.ADD_GRADE,
        { input },
        token,
      );

      return data.addGrade;
    },
    [getAccessToken],
  );

  const updateGrade = useCallback(
    async (id: string, input: UpdateGradeInput) => {
      const token = getAccessToken();
      const data = await graphqlRequest<{ updateGrade: Grade }>(
        GRADE_MUTATIONS.UPDATE_GRADE,
        { id, input },
        token,
      );

      return data.updateGrade;
    },
    [getAccessToken],
  );

  const deleteGrade = useCallback(
    async (id: string) => {
      const token = getAccessToken();

      await graphqlRequest<{ deleteGrade: boolean }>(
        GRADE_MUTATIONS.DELETE_GRADE,
        { id },
        token,
      );
    },
    [getAccessToken],
  );

  return { addGrade, updateGrade, deleteGrade };
}
