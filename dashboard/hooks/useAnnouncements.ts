import { useState, useCallback, useEffect } from "react";
import { graphqlRequest } from "@/lib/graphql-client";
import { useAuth } from "@/contexts/auth-context";
import {
	ANNOUNCEMENT_QUERIES,
	ANNOUNCEMENT_MUTATIONS,
} from "@/app/graphql/announcement";
import {
	Announcement,
	AnnouncementTargetType,
	AnnouncementPriority,
	CreateAnnouncementInput,
} from "@/types/communication";
import { toast } from "sonner";

export function useAnnouncements(schoolId: string | null) {
	const [announcements, setAnnouncements] = useState<Announcement[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<Error | null>(null);
	const { getAccessToken } = useAuth();

	const fetchAnnouncements = useCallback(
		async (targetType?: AnnouncementTargetType, targetId?: string) => {
			if (!schoolId) return;

			setIsLoading(true);
			try {
				const token = getAccessToken();
				const data = await graphqlRequest<{ getAnnouncements: Announcement[] }>(
					ANNOUNCEMENT_QUERIES.GET_ANNOUNCEMENTS,
					{ schoolId, targetType, targetId },
					token
				);
				setAnnouncements(data.getAnnouncements);
				setError(null);
			} catch (err: any) {
				setError(err);
				toast.error("Failed to fetch announcements");
			} finally {
				setIsLoading(false);
			}
		},
		[schoolId, getAccessToken]
	);

	const createAnnouncement = useCallback(
		async (input: CreateAnnouncementInput) => {
			try {
				const token = getAccessToken();
				const data = await graphqlRequest<{ createAnnouncement: Announcement }>(
					ANNOUNCEMENT_MUTATIONS.CREATE_ANNOUNCEMENT,
					input as unknown as Record<string, unknown>,
					token
				);
				toast.success("Announcement created successfully");
				fetchAnnouncements();
				return data.createAnnouncement;
			} catch (err: any) {
				toast.error(err.message || "Failed to create announcement");
				throw err;
			}
		},
		[getAccessToken, fetchAnnouncements]
	);

	const deleteAnnouncement = useCallback(
		async (id: string) => {
			try {
				const token = getAccessToken();
				await graphqlRequest<{ deleteAnnouncement: boolean }>(
					ANNOUNCEMENT_MUTATIONS.DELETE_ANNOUNCEMENT,
					{ id },
					token
				);
				toast.success("Announcement deleted");
				setAnnouncements((prev) => prev.filter((a) => a.id !== id));
			} catch (err: any) {
				toast.error("Failed to delete announcement");
				throw err;
			}
		},
		[getAccessToken]
	);

	useEffect(() => {
		if (schoolId) {
			fetchAnnouncements();
		}
	}, [schoolId, fetchAnnouncements]);

	return {
		announcements,
		isLoading,
		error,
		refresh: fetchAnnouncements,
		createAnnouncement,
		deleteAnnouncement,
	};
}
