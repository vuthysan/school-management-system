"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { graphqlRequest } from "@/lib/graphql-client";
import { SCHOOL_QUERIES, SCHOOL_MUTATIONS } from "@/app/graphql/school";
import { useAuth } from "@/contexts/auth-context";
import { LookupEntry } from "@/types/school";
import { toast } from "sonner";

// Default lookup values (used as fallback if school has none)
const DEFAULT_LOOKUP_VALUES: Record<string, string[]> = {
  subject_categories: [
    "Science",
    "Mathematics",
    "Language",
    "Social Studies",
    "Arts",
    "Physical Education",
    "Technology",
    "Other",
  ],
  room_types: [
    "Classroom",
    "Lab",
    "Library",
    "Auditorium",
    "Office",
    "Other",
  ],
  leave_types: [
    "Sick Leave",
    "Annual Leave",
    "Maternity Leave",
    "Personal Leave",
    "Other",
  ],
  payment_methods: ["Cash", "Bank Transfer", "ABA", "Wing", "Other"],
};

export function useLookupValues(schoolId: string | null) {
  const [lookupMap, setLookupMap] = useState<Record<string, string[]>>(
    DEFAULT_LOOKUP_VALUES
  );
  const [isLoading, setIsLoading] = useState(false);
  const { getAccessToken, isAuthenticated } = useAuth();

  const fetchLookupValues = useCallback(async () => {
    if (!schoolId || !isAuthenticated) return;

    setIsLoading(true);
    try {
      const token = getAccessToken();
      const data = await graphqlRequest<{
        school: { lookupValues: LookupEntry[] } | null;
      }>(SCHOOL_QUERIES.GET_BY_ID, { id: schoolId }, token);

      if (data.school?.lookupValues) {
        const map: Record<string, string[]> = { ...DEFAULT_LOOKUP_VALUES };
        for (const entry of data.school.lookupValues) {
          map[entry.key] = entry.values;
        }
        setLookupMap(map);
      }
    } catch {
      // Use defaults silently
    } finally {
      setIsLoading(false);
    }
  }, [schoolId, isAuthenticated, getAccessToken]);

  useEffect(() => {
    fetchLookupValues();
  }, [fetchLookupValues]);

  const updateLookupValues = useCallback(
    async (key: string, values: string[]) => {
      if (!schoolId) return;
      try {
        const token = getAccessToken();
        await graphqlRequest<{ updateLookupValues: boolean }>(
          SCHOOL_MUTATIONS.UPDATE_LOOKUP_VALUES,
          { schoolId, key, values },
          token
        );
        setLookupMap((prev) => ({ ...prev, [key]: values }));
        toast.success("Settings updated");
      } catch {
        toast.error("Failed to update settings");
      }
    },
    [schoolId, getAccessToken]
  );

  const getValues = useCallback(
    (key: string): string[] => {
      return lookupMap[key] || DEFAULT_LOOKUP_VALUES[key] || [];
    },
    [lookupMap]
  );

  const allEntries = useMemo(() => {
    return Object.entries(lookupMap).map(([key, values]) => ({
      key,
      values,
    }));
  }, [lookupMap]);

  return {
    lookupMap,
    allEntries,
    isLoading,
    getValues,
    updateLookupValues,
    refresh: fetchLookupValues,
  };
}
