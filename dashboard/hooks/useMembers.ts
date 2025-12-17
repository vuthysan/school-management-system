"use client";

import { useState, useCallback, useEffect } from "react";

import { useAuth } from "@/contexts/auth-context";
import { graphqlRequest } from "@/lib/graphql-client";
import { MEMBER_QUERIES, MEMBER_MUTATIONS } from "@/app/graphql/member";

// Types
export interface User {
  idStr?: string;
  username?: string;
  email?: string;
  displayName?: string;
  avatarUrl?: string;
  fullName?: string;
}

export interface Member {
  idStr: string;
  userId: string;
  schoolId: string;
  branchId?: string;
  role: string;
  status: string;
  permissions?: string[];
  title?: string;
  isPrimaryContact?: boolean;
  user?: User;
}

export interface AddMemberInput {
  schoolId: string;
  userId: string;
  role: string;
  branchId?: string;
}

export interface UpdateMemberRoleInput {
  memberId: string;
  role: string;
}

export interface RemoveMemberInput {
  memberId: string;
}

// Hook to fetch school members
export function useSchoolMembers(schoolId: string | undefined) {
  const { isAuthenticated, getAccessToken } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMembers = useCallback(async () => {
    if (!schoolId || !isAuthenticated) {
      setMembers([]);

      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = getAccessToken();
      const data = await graphqlRequest<{ schoolMembers: Member[] }>(
        MEMBER_QUERIES.SCHOOL_MEMBERS,
        { schoolId },
        token,
      );

      setMembers(data.schoolMembers || []);
    } catch (err) {
      console.error("Failed to fetch members:", err);
      setError(err instanceof Error ? err.message : "Failed to load members");
    } finally {
      setLoading(false);
    }
  }, [schoolId, isAuthenticated, getAccessToken]);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);

  return { members, loading, error, refetch: fetchMembers };
}

// Hook to add a member
export function useAddMember() {
  const { getAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addMember = async (input: AddMemberInput): Promise<Member> => {
    setLoading(true);
    setError(null);

    try {
      const token = getAccessToken();
      const data = await graphqlRequest<{ addMember: Member }>(
        MEMBER_MUTATIONS.ADD_MEMBER,
        { input },
        token,
      );

      return data.addMember;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to add member";

      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { addMember, loading, error };
}

// Hook to update member role
export function useUpdateMemberRole() {
  const { getAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateMemberRole = async (
    input: UpdateMemberRoleInput,
  ): Promise<Member> => {
    setLoading(true);
    setError(null);

    try {
      const token = getAccessToken();
      const data = await graphqlRequest<{ updateMemberRole: Member }>(
        MEMBER_MUTATIONS.UPDATE_MEMBER_ROLE,
        { input },
        token,
      );

      return data.updateMemberRole;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to update member role";

      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { updateMemberRole, loading, error };
}

// Hook to remove member
export function useRemoveMember() {
  const { getAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const removeMember = async (input: RemoveMemberInput): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const token = getAccessToken();
      const data = await graphqlRequest<{ removeMember: boolean }>(
        MEMBER_MUTATIONS.REMOVE_MEMBER,
        { input },
        token,
      );

      return data.removeMember;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to remove member";

      setError(errorMsg);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { removeMember, loading, error };
}

// Hook to search for a user by email or username
export function useSearchUser() {
  const { getAccessToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchUser = async (query: string): Promise<User | null> => {
    if (!query.trim()) {
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const token = getAccessToken();
      const data = await graphqlRequest<{ searchUser: User | null }>(
        MEMBER_QUERIES.SEARCH_USER,
        { query: query.trim() },
        token,
      );

      return data.searchUser;
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to search user";

      setError(errorMsg);

      return null;
    } finally {
      setLoading(false);
    }
  };

  return { searchUser, loading, error };
}
