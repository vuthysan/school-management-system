"use client";

import React from "react";
import { CalendarCheck, UserCheck, UserX, Clock } from "lucide-react";

import { StatsCard } from "@/components/dashboard/stats-card";
import { useLanguage } from "@/contexts/language-context";
import { AttendanceStats as AttendanceStatsType } from "@/types/attendance";

interface AttendanceStatsProps {
	stats: AttendanceStatsType;
}

export const AttendanceStats: React.FC<AttendanceStatsProps> = ({ stats }) => {
	const { t } = useLanguage();

	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
			<StatsCard
				title={t("todays_rate")}
				value={`${stats.attendanceRate}%`}
				icon={CalendarCheck}
				color="blue"
				delay={0}
			/>
			<StatsCard
				title={t("total_present")}
				value={stats.totalPresent.toString()}
				icon={UserCheck}
				color="emerald"
				delay={0.05}
			/>
			<StatsCard
				title={t("total_absent")}
				value={stats.totalAbsent.toString()}
				icon={UserX}
				color="rose"
				delay={0.1}
			/>
			<StatsCard
				title={t("total_late")}
				value={stats.totalLate.toString()}
				icon={Clock}
				color="amber"
				delay={0.15}
			/>
		</div>
	);
};
