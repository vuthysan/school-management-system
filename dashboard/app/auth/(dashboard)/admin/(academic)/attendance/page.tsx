"use client";

import { useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { CalendarCheck, Loader2 } from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { useDashboard } from "@/hooks/useDashboard";
import { useClasses } from "@/hooks/useClasses";
import { useAttendanceSummary } from "@/hooks/useAttendance";
import { AttendanceStats } from "@/components/attendance/attendance-stats";
import { MarkAttendance } from "@/components/attendance/mark-attendance";
import { AttendanceHistory } from "@/components/attendance/attendance-history";

export default function AttendancePage() {
	const { t } = useLanguage();
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
			totalExcused: summary.excusedCount || 0,
		};
	}, [summary]);

	if (isDashboardLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (!schoolId) {
		return (
			<div className="flex flex-col items-center justify-center h-64 gap-2">
				<p className="text-muted-foreground">{t("no_school_selected")}</p>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="space-y-6 pb-10"
		>
			{/* Hero Header Section */}
			<Card className="p-4">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
					<div className="flex items-center gap-5">
						<div className="relative group">
							<div className="absolute -inset-1 bg-primary/20 blur opacity-0 group-hover:opacity-100 transition duration-500 rounded-lg" />
							<div className="relative p-4 bg-primary rounded-lg shadow-lg shadow-primary/20 text-primary-foreground">
								<CalendarCheck className="w-8 h-8" />
							</div>
						</div>
						<div className="space-y-1">
							<h1 className="text-3xl font-bold tracking-tight text-foreground/90">
								{t("attendance_management")}
							</h1>
							<p className="text-sm text-muted-foreground/80 font-medium">
								{t("track_attendance")}
							</p>
						</div>
					</div>
				</div>
			</Card>

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
