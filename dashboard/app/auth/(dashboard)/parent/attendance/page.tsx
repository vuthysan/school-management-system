"use client";

import { useState } from "react";
import { CalendarDays, Check, X, Clock, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { cn } from "@/lib/utils";
import { useParentChildren } from "@/hooks/useParentChildren";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function ParentAttendancePage() {
	const { t } = useTranslation();
	const { children, isLoading: loading } = useParentChildren();
	const [selectedChildId, setSelectedChildId] = useState<string>("");

	const selectedChild = children.find((c) => c.id === selectedChildId) || children[0];

	// Mock monthly attendance data
	const daysInMonth = 30;
	const attendanceData: Record<number, string> = {};
	for (let i = 1; i <= daysInMonth; i++) {
		const rand = Math.random();
		if (rand > 0.15) attendanceData[i] = "present";
		else if (rand > 0.08) attendanceData[i] = "absent";
		else if (rand > 0.03) attendanceData[i] = "late";
		else attendanceData[i] = "excused";
	}

	const presentCount = Object.values(attendanceData).filter((v) => v === "present").length;
	const absentCount = Object.values(attendanceData).filter((v) => v === "absent").length;
	const lateCount = Object.values(attendanceData).filter((v) => v === "late").length;

	const statusColors: Record<string, string> = {
		present: "bg-emerald-500",
		absent: "bg-red-500",
		late: "bg-amber-500",
		excused: "bg-gray-400",
	};

	return (
		<div className="space-y-6 pb-10">
			<PageHeader
				title={t("attendance_calendar")}
				subtitle={t("track_child_attendance")}
				icon={CalendarDays}
			>
				{children.length > 1 && (
					<Select
						value={selectedChildId || children[0]?.id}
						onValueChange={setSelectedChildId}
					>
						<SelectTrigger className="w-48">
							<SelectValue placeholder={t("select_child")} />
						</SelectTrigger>
						<SelectContent>
							{children.map((child) => (
								<SelectItem key={child.id} value={child.id}>
									{child.fullName}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
			</PageHeader>

			{/* Stats */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<StatsCard title={t("present")} value={presentCount.toString()} icon={Check} color="emerald" delay={0} />
				<StatsCard title={t("absent")} value={absentCount.toString()} icon={X} color="rose" delay={0.05} />
				<StatsCard title={t("late")} value={lateCount.toString()} icon={Clock} color="amber" delay={0.1} />
				<StatsCard
					title={t("attendance_rate")}
					value={`${((presentCount / daysInMonth) * 100).toFixed(1)}%`}
					icon={CalendarDays}
					color="blue"
					delay={0.15}
				/>
			</div>

			{/* Calendar Grid */}
			<motion.div
				initial={{ opacity: 0, y: 8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				<div className="liquid-glass-card rounded-2xl p-6">
					<h3 className="text-sm font-semibold text-foreground mb-4">
						{selectedChild?.fullName || t("attendance_calendar")}
					</h3>

					{/* Legend */}
					<div className="flex items-center gap-4 mb-4">
						{["present", "absent", "late", "excused"].map((status) => (
							<div key={status} className="flex items-center gap-1.5">
								<div className={cn("w-3 h-3 rounded-sm", statusColors[status])} />
								<span className="text-xs text-muted-foreground capitalize">
									{t(status)}
								</span>
							</div>
						))}
					</div>

					{/* Calendar Grid */}
					<div className="grid grid-cols-7 gap-2">
						{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
							<div key={day} className="text-center text-xs font-medium text-muted-foreground py-1">
								{day}
							</div>
						))}
						{/* Empty cells for alignment (assume month starts on Wednesday) */}
						{[...Array(2)].map((_, i) => (
							<div key={`empty-${i}`} />
						))}
						{Object.entries(attendanceData).map(([day, status]) => (
							<div
								key={day}
								className={cn(
									"aspect-square rounded-lg flex items-center justify-center text-xs font-medium transition-colors",
									status === "present" && "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
									status === "absent" && "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
									status === "late" && "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
									status === "excused" && "bg-gray-50 text-gray-500 dark:bg-gray-950/40 dark:text-gray-400"
								)}
							>
								{day}
							</div>
						))}
					</div>
				</div>
			</motion.div>
		</div>
	);
}
