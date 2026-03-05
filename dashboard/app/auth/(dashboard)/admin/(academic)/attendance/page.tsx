"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { CalendarCheck, Bell, AlertCircle } from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/language-context";
import { useDashboard } from "@/hooks/useDashboard";
import { useClasses } from "@/hooks/useClasses";
import { useAttendanceSummary } from "@/hooks/useAttendance";
import { AttendanceStats } from "@/components/attendance/attendance-stats";
import { MarkAttendance } from "@/components/attendance/mark-attendance";
import { AttendanceHistory } from "@/components/attendance/attendance-history";
import { AbsenceNotificationDialog } from "@/components/attendance/absence-notification-dialog";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";

export default function AttendancePage() {
	const { t } = useLanguage();
	const [isNotificationDialogOpen, setIsNotificationDialogOpen] =
		useState(false);
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	const { currentSchool, isLoading: isDashboardLoading } = useDashboard();
	const schoolId = currentSchool?.idStr || currentSchool?.id || null;

	const activeTab = (searchParams.get("tab") as "mark" | "history") || "mark";
	const selectedClassId = searchParams.get("classId") || null;
	const selectedDate =
		searchParams.get("date") || new Date().toISOString().split("T")[0];

	const updateParams = useCallback(
		(updates: Record<string, string | null>) => {
			const params = new URLSearchParams(searchParams.toString());
			Object.entries(updates).forEach(([key, value]) => {
				if (value) {
					params.set(key, value);
				} else {
					params.delete(key);
				}
			});
			router.replace(`${pathname}?${params.toString()}`, { scroll: false });
		},
		[searchParams, router, pathname]
	);

	const handleTabChange = useCallback(
		(tab: string) => {
			updateParams({ tab });
		},
		[updateParams]
	);

	const handleClassChange = useCallback(
		(classId: string | null) => {
			updateParams({ classId });
		},
		[updateParams]
	);

	const handleDateChange = useCallback(
		(date: string) => {
			updateParams({ date });
		},
		[updateParams]
	);

	const { classes, isLoading: isClassesLoading } = useClasses({
		schoolId,
		page: 1,
		pageSize: 100,
	});

	const now = new Date();
	const { summary } = useAttendanceSummary(
		selectedClassId,
		now.getMonth() + 1,
		now.getFullYear()
	);

	const stats = useMemo(() => {
		if (!summary) {
			return {
				attendanceRate: 0,
				totalPresent: 0,
				totalAbsent: 0,
				totalLate: 0,
				totalExcused: 0,
			};
		}
		return {
			attendanceRate: Math.round(summary.attendanceRate),
			totalPresent: summary.presentCount,
			totalAbsent: summary.absentCount,
			totalLate: summary.lateCount,
			totalExcused: (summary as any).excusedCount || 0,
		};
	}, [summary]);

	if (isDashboardLoading) {
		return (
			<div className="min-h-[60vh] flex items-center justify-center">
				<div className="text-center space-y-3">
					<div className="h-8 w-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin mx-auto" />
					<p className="text-sm text-muted-foreground">{t("loading") || "Loading..."}</p>
				</div>
			</div>
		);
	}

	if (!schoolId) {
		return (
			<div className="min-h-[60vh] flex items-center justify-center">
				<div className="text-center space-y-3">
					<div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center mx-auto">
						<AlertCircle className="h-5 w-5 text-amber-500" />
					</div>
					<p className="text-sm text-muted-foreground">
						{t("no_school_selected")}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6 pb-10">
			<PageHeader
				title={t("attendance_management")}
				subtitle={t("track_attendance")}
				icon={CalendarCheck}
			>
				<Button
					onClick={() => setIsNotificationDialogOpen(true)}
					size="sm"
					variant="outline"
					className="gap-2"
				>
					<Bell className="h-4 w-4" />
					{t("notify_parents") || "Notify Parents"}
				</Button>
			</PageHeader>

			<AbsenceNotificationDialog
				open={isNotificationDialogOpen}
				onOpenChange={setIsNotificationDialogOpen}
			/>

			{/* Stats */}
			{selectedClassId && summary && (
				<AttendanceStats stats={stats} />
			)}

			{/* Tabs */}
			<Tabs
				value={activeTab}
				onValueChange={handleTabChange}
			>
				<TabsList>
					<TabsTrigger value="mark">
						{t("mark_attendance")}
					</TabsTrigger>
					<TabsTrigger value="history">
						{t("attendance_history")}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="mark">
					<MarkAttendance
						classes={classes}
						isClassesLoading={isClassesLoading}
						selectedClassId={selectedClassId}
						selectedDate={selectedDate}
						onClassChange={handleClassChange}
						onDateChange={handleDateChange}
					/>
				</TabsContent>
				<TabsContent value="history">
					<AttendanceHistory
						classes={classes}
						selectedClassId={selectedClassId}
						selectedDate={selectedDate}
						onClassChange={handleClassChange}
						onDateChange={handleDateChange}
					/>
				</TabsContent>
			</Tabs>
		</div>
	);
}
