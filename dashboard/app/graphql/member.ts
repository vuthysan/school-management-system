// Member GraphQL Queries and Mutations

export const MEMBER_QUERIES = {
	MY_MEMBERSHIPS: `
    query MyMemberships {
      myMemberships {
        idStr
        userId
        schoolId
        branchId
        role
        status
        permissions
        title
        isPrimaryContact
        user {
          idStr
          username
          email
          displayName
          avatarUrl
          fullName
        }
      }
    }
  `,

	SCHOOL_MEMBERS: `
    query SchoolMembers($schoolId: String!) {
      schoolMembers(schoolId: $schoolId) {
        idStr
        userId
        schoolId
        branchId
        role
        status
        permissions
        title
        isPrimaryContact
        user {
          idStr
          username
          email
          displayName
          avatarUrl
          fullName
        }
      }
    }
  `,

	MEMBERS_BY_BRANCH: `
    query MembersByBranch($schoolId: String!, $branchId: String) {
      membersByBranch(schoolId: $schoolId, branchId: $branchId) {
        idStr
        userId
        schoolId
        branchId
        role
        status
        permissions
        title
        isPrimaryContact
        user {
          idStr
          username
          email
          displayName
          avatarUrl
          fullName
        }
      }
    }
  `,

	MEMBERS_BY_ROLE: `
    query MembersByRole($schoolId: String!, $role: String!) {
      membersByRole(schoolId: $schoolId, role: $role) {
        idStr
        userId
        role
        status
        title
        user {
          idStr
          username
          email
          displayName
          avatarUrl
          fullName
        }
      }
    }
  `,

	SEARCH_USER: `
    query SearchUser($query: String!) {
      searchUser(query: $query) {
        idStr
        username
        email
        displayName
        avatarUrl
        fullName
      }
    }
  `,
};

export const MEMBER_MUTATIONS = {
	ADD_MEMBER: `
    mutation AddMember($input: AddMemberInput!) {
      addMember(input: $input) {
        idStr
        userId
        schoolId
        branchId
        role
        status
      }
    }
  `,

	UPDATE_MEMBER_ROLE: `
    mutation UpdateMemberRole($input: UpdateMemberRoleInput!) {
      updateMemberRole(input: $input) {
        idStr
        role
      }
    }
  `,

	REMOVE_MEMBER: `
    mutation RemoveMember($input: RemoveMemberInput!) {
      removeMember(input: $input)
    }
  `,
};
