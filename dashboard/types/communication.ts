export enum AnnouncementTargetType {
	School = "School",
	Grade = "Grade",
	Class = "Class",
}

export enum AnnouncementPriority {
	Low = "Low",
	Normal = "Normal",
	High = "High",
	Urgent = "Urgent",
}

export interface Announcement {
	id: string;
	schoolId: string;
	authorId: string;
	authorName: string;
	title: string;
	content: string;
	targetType: AnnouncementTargetType;
	targetIds: string[];
	priority: AnnouncementPriority;
	expiresAt?: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateAnnouncementInput {
	title: string;
	content: string;
	targetType: AnnouncementTargetType;
	targetIds: string[];
	priority: AnnouncementPriority;
}
