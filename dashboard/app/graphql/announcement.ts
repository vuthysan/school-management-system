export const ANNOUNCEMENT_QUERIES = {
	GET_ANNOUNCEMENTS: `
    query GetAnnouncements($schoolId: String!, $targetType: AnnouncementTargetType, $targetId: String) {
      getAnnouncements(schoolId: $schoolId, targetType: $targetType, targetId: $targetId) {
        id
        schoolId
        authorId
        authorName
        title
        content
        targetType
        targetIds
        priority
        expiresAt
        createdAt
        updatedAt
      }
    }
  `,
	GET_ANNOUNCEMENT: `
    query GetAnnouncement($id: String!) {
      getAnnouncement(id: $id) {
        id
        schoolId
        authorId
        authorName
        title
        content
        targetType
        targetIds
        priority
        expiresAt
        createdAt
        updatedAt
      }
    }
  `,
};

export const ANNOUNCEMENT_MUTATIONS = {
	CREATE_ANNOUNCEMENT: `
    mutation CreateAnnouncement($title: String!, $content: String!, $targetType: AnnouncementTargetType!, $targetIds: [String!]!, $priority: AnnouncementPriority!) {
      createAnnouncement(title: $title, content: $content, targetType: $targetType, targetIds: $targetIds, priority: $priority) {
        id
        title
        content
        createdAt
      }
    }
  `,
	DELETE_ANNOUNCEMENT: `
    mutation DeleteAnnouncement($id: String!) {
      deleteAnnouncement(id: $id)
    }
  `,
};
