// Member GraphQL Queries and Mutations

export const MEMBER_QUERIES = {
	MY_MEMBERSHIPS: `
    query MyMemberships {
      myMemberships {
        id
        userId
        schoolId
        role
        status
        permissions
        joinedAt
      }
    }
  `,

	SCHOOL_MEMBERS: `
    query SchoolMembers($schoolId: String!) {
      schoolMembers(schoolId: $schoolId) {
        id
        userId
        role
        status
        permissions
      }
    }
  `,

	MEMBERS_BY_ROLE: `
    query MembersByRole($schoolId: String!, $role: String!) {
      membersByRole(schoolId: $schoolId, role: $role) {
        id
        userId
        role
        status
      }
    }
  `,
};

export const MEMBER_MUTATIONS = {
	ADD_MEMBER: `
    mutation AddMember($input: AddMemberInput!) {
      addMember(input: $input) {
        id
        userId
        schoolId
        role
        status
      }
    }
  `,

	UPDATE_MEMBER_ROLE: `
    mutation UpdateMemberRole($id: String!, $role: String!) {
      updateMemberRole(id: $id, role: $role) {
        id
        role
      }
    }
  `,

	REMOVE_MEMBER: `
    mutation RemoveMember($id: String!) {
      removeMember(id: $id)
    }
  `,
};
