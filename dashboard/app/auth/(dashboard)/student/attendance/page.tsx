"use client";

import { UserCheck, Calendar, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { cn } from "@/lib/utils";

const demoAttendance: Record<string, "present" | "absent" | "late" | "excused"> = {
	"2026-03-01": "present",
	"2026-03-02": "present",
	"2026-03-03": "late",
	"2026-03-04": "present",
	"2026-02-24": "present",
	"2026-02-25": "absent",
	"2026-02-26": "present",
	"2026-02-27": "present",
	"2026-02-28": "present",
	"2026-02-17": "present",
	"2026-02-18": "present",
	"2026-02-19": "excused",
	"2026-02-20": "present",
	"2026-02-21": "present",
	"2026-02-10": "present",
	"2026-02-11": "late",
	"2026-02-12": "present",
	"2026-02-13": "present",
	"2026-02-14": "present",
};

const statusColors = {
	present: "bg-emerald-500",
	absent: "bg-red-500",
	late: "bg-amber-500",
	excused: "bg-gray-400",
};

const statusLegend = [
	{ key: "present", color: "bg-emerald-500" },
	{ key: "absent", color: "bg-red-500" },
	{ key: "late", color: "bg-amber-500" },
	{ key: "excused", color: "bg-gray-400" },
];

function getMonthDays(year: number, month: number) {
	const firstDay = new Date(year, month, 1).getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();
	return { firstDay, daysInMonth };
}

export default function StudentAttendancePage() {
	const { t } = useTranslation();
	const now = new Date();
	const year = now.getFullYear();
	const month = now.getMonth();
	const { firstDay, daysInMonth } = getMonthDays(year, month);

	const entries = Object.values(demoAttendance);
	const presentCount = entries.filter((s) => s === "present").length;
	const absentCount = entries.filter((s) => s === "absent").length;
	const lateCount = entries.filter((s) => s === "late").length;
	const rate = entries.length > 0 ? Math.round((presentCount / entries.length) * 100) : 0;

	return (
		<div className="space-y-6 pb-10">
			<PageHeader
				title={t("student_attendance")}
				subtitle={t("view_my_attendance")}
				icon={UserCheck}
			/>

			{/* Stats */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
				<StatsCard title={t("present_days")} value={presentCount} icon={UserCheck} />
				<StatsCard title={t("absent_days")} value={absentCount} icon={Calendar} />
				<StatsCard title={t("late_days")} value={lateCount} icon={Calendar} />
				<StatsCard title={t("attendance_rate")} value={`${rate}%`} icon={TrendingUp} />
			</div>

			{/* Calendar */}
			<motion.div
				initial={{ opacity: 0, y: 8 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<div className="liquid-glass-card rounded-2xl p-4">
					<h3 className="text-sm font-semibold text-foreground mb-3">
						{now.toLocaleString("en", { month: "long", year: "numeric" })}
					</h3>

					{/* Day headers */}
					<div className="grid grid-cols-7 gap-1 mb-1">
						{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
							<div key={d} className="text-center text-[10px] font-medium text-muted-foreground py-1">
								{d}
							</div>
						))}
					</div>

					{/* Calendar grid */}
					<div className="grid grid-cols-7 gap-1">
						{Array.from({ length: firstDay }).map((_, i) => (
							<div key={`empty-${i}`} />
						))}
						{Array.from({ length: daysInMonth }).map((_, i) => {
							const day = i + 1;
							const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
							const status = demoAttendance[dateStr];
							const isToday = day === now.getDate();

							return (
								<div
									key={day}
									className={cn(
										"aspect-square rounded-lg flex items-center justify-center text-xs relative",
										isToday && "ring-2 ring-primary ring-offset-1",
										!status && "text-muted-foreground"
									)}
								>
									{day}
									{status && (
										<div className={cn("absolute bottom-0.5 w-1.5 h-1.5 rounded-full", statusColors[status])} />
									)}
								</div>
							);
						})}
					</div>

					{/* Legend */}
					<div className="flex items-center gap-4 mt-4 pt-3 border-t border-black/4 dark:border-white/4">
						{statusLegend.map((item) => (
							<div key={item.key} className="flex items-center gap-1.5">
								<div className={cn("w-2.5 h-2.5 rounded-full", item.color)} />
								<span className="text-xs text-muted-foreground capitalize">{t(item.key)}</span>
							</div>
						))}
					</div>
				</div>
			</motion.div>
		</div>
	);
}
