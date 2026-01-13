"use client";

import { useState, useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarCheck, Loader2, Bell } from "lucide-react";

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

	// Read from URL params
	const activeTab = (searchParams.get("tab") as "mark" | "history") || "mark";
	const selectedClassId = searchParams.get("classId") || null;
	const selectedDate =
		searchParams.get("date") || new Date().toISOString().split("T")[0];

	// Update URL params
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

	// Fetch classes for the school
	const { classes, isLoading: isClassesLoading } = useClasses({
		schoolId,
		page: 1,
		pageSize: 100,
	});

	// Get current month/year for summary
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
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
			</div>
		);
	}

	if (!schoolId) {
		return (
			<div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
				<p className="text-muted-foreground font-black uppercase tracking-widest text-xs">
					{t("no_school_selected")}
				</p>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="p-6 space-y-10 max-w-[1600px] mx-auto bg-background/50 text-foreground"
		>
			<PageHeader
				title={t("attendance_management")}
				subtitle={t("track_attendance")}
				icon={CalendarCheck}
				gradient="green"
			>
				<Button
					onClick={() => setIsNotificationDialogOpen(true)}
					className="h-12 rounded-2xl px-6 font-black uppercase tracking-widest bg-green-500 hover:bg-green-600 shadow-xl shadow-green-500/20 border-none transition-all hover:scale-105 active:scale-95"
				>
					<Bell className="h-5 w-5 mr-2" strokeWidth={3} />
					Notify Parents
				</Button>
			</PageHeader>

			<AbsenceNotificationDialog
				open={isNotificationDialogOpen}
				onOpenChange={setIsNotificationDialogOpen}
			/>

			{/* Stats */}
			<AttendanceStats stats={stats} />

			{/* Tabs */}
			<Tabs
				value={activeTab}
				onValueChange={handleTabChange}
				className="w-full"
			>
				<TabsList className="flex w-full justify-start border-b border-border/50 bg-transparent p-0 h-auto gap-8">
					<TabsTrigger
						className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-2 pb-3 pt-2 font-semibold text-muted-foreground transition-all data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none hover:text-primary/70"
						value="mark"
					>
						{t("mark_attendance")}
					</TabsTrigger>
					<TabsTrigger
						className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-2 pb-3 pt-2 font-semibold text-muted-foreground transition-all data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none hover:text-primary/70"
						value="history"
					>
						{t("attendance_history")}
					</TabsTrigger>
				</TabsList>

				<TabsContent className="mt-4" value="mark">
					<MarkAttendance
						classes={classes}
						isClassesLoading={isClassesLoading}
						selectedClassId={selectedClassId}
						selectedDate={selectedDate}
						onClassChange={handleClassChange}
						onDateChange={handleDateChange}
					/>
				</TabsContent>
				<TabsContent className="mt-4" value="history">
					<AttendanceHistory
						classes={classes}
						selectedClassId={selectedClassId}
						selectedDate={selectedDate}
						onClassChange={handleClassChange}
						onDateChange={handleDateChange}
					/>
				</TabsContent>
			</Tabs>
		</motion.div>
	);
}
