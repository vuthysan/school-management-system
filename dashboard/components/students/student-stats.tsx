"use client";

import React, { useMemo } from "react";
import { Users, UserCheck, UserPlus, GraduationCap } from "lucide-react";

import { StatsCard } from "@/components/dashboard/stats-card";
import { useLanguage } from "@/contexts/language-context";
import { Student } from "@/types/student";

interface StudentStatsProps {
	students: Student[];
}

export const StudentStats: React.FC<StudentStatsProps> = ({ students }) => {
	const { t } = useLanguage();

	const stats = useMemo(() => {
		const total = students.length;
		const activeCount = students.filter((s) => s.status === "active").length;

		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
		const newThisMonth = students.filter((s) => {
			const dateStr = s.enrollment?.enrollmentDate;
			if (!dateStr) return false;
			return new Date(dateStr) >= thirtyDaysAgo;
		}).length;

		const activePercentage =
			total > 0 ? ((activeCount / total) * 100).toFixed(0) : "0";

		return { total, activeCount, activePercentage, newThisMonth };
	}, [students]);

	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
			<StatsCard
				title={t("total_students_stat")}
				value={stats.total.toString()}
				icon={Users}
				color="blue"
				delay={0}
			/>
			<StatsCard
				title={t("active_students")}
				value={stats.activeCount.toString()}
				subtitle={`${stats.activePercentage}%`}
				icon={UserCheck}
				color="emerald"
				delay={0.05}
			/>
			<StatsCard
				title={t("new_this_month")}
				value={stats.newThisMonth.toString()}
				icon={UserPlus}
				color="amber"
				delay={0.1}
			/>
			<StatsCard
				title={t("grade_distribution")}
				value="3"
				subtitle="Levels"
				icon={GraduationCap}
				color="violet"
				delay={0.15}
			/>
		</div>
	);
};
