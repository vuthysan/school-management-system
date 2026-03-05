"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { graphqlRequest } from "@/lib/graphql-client";
import { CLASS_QUERIES, CLASS_MUTATIONS } from "@/app/graphql/class";
import { useAuth } from "@/contexts/auth-context";
import { TimetableGridEditor } from "@/components/academic/timetable-grid";
import type { Class, ClassSchedule } from "@/types/academic";

export default function TimetableEditPage() {
	const { t } = useTranslation();
	const router = useRouter();
	const params = useParams();
	const classId = params.classId as string;
	const { getAccessToken } = useAuth();

	const [classData, setClassData] = useState<Class | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const fetchClass = useCallback(async () => {
		try {
			setIsLoading(true);
			const token = getAccessToken();
			const data = await graphqlRequest<{ class: Class }>(
				CLASS_QUERIES.GET_BY_ID,
				{ id: classId },
				token
			);
			setClassData(data.class);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load class");
		} finally {
			setIsLoading(false);
		}
	}, [classId, getAccessToken]);

	useEffect(() => {
		if (classId) fetchClass();
	}, [classId, fetchClass]);

	const handleAutoSave = async (schedule: ClassSchedule[]) => {
		const token = getAccessToken();
		await graphqlRequest(
			CLASS_MUTATIONS.UPDATE,
			{ id: classId, input: { schedule } },
			token
		);
	};

	const handleBack = () => {
		router.back();
	};

	if (isLoading) {
		return (
			<div className="min-h-[60vh] flex items-center justify-center">
				<div className="text-center space-y-3">
					<div className="h-8 w-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin mx-auto" />
					<p className="text-sm text-muted-foreground">
						{t("loading") || "Loading..."}
					</p>
				</div>
			</div>
		);
	}

	if (error || !classData) {
		return (
			<div className="min-h-[60vh] flex items-center justify-center">
				<div className="text-center space-y-3">
					<div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center mx-auto">
						<AlertCircle className="h-5 w-5 text-amber-500" />
					</div>
					<p className="text-sm text-muted-foreground">
						{error || t("class_not_found") || "Class not found"}
					</p>
				</div>
			</div>
		);
	}

	return (
		<TimetableGridEditor
			classData={classData}
			onSave={handleAutoSave}
			onBack={handleBack}
		/>
	);
}
