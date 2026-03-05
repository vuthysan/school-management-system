"use client";

import React from "react";
import { TrendingUp, Award, CheckCircle, FileText } from "lucide-react";

import { StatsCard } from "@/components/dashboard/stats-card";
import { useLanguage } from "@/contexts/language-context";
import { GradingStats as GradingStatsType } from "@/types/grading";

interface GradingStatsProps {
	stats: GradingStatsType;
}

export const GradingStats: React.FC<GradingStatsProps> = ({ stats }) => {
	const { t } = useLanguage();

	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
			<StatsCard
				title={t("average_gpa")}
				value={stats.averageGpa.toFixed(2)}
				icon={TrendingUp}
				color="blue"
				delay={0}
			/>
			<StatsCard
				title={t("pass_rate")}
				value={`${stats.passRate}%`}
				icon={CheckCircle}
				color="emerald"
				delay={0.05}
			/>
			<StatsCard
				title={t("top_performers")}
				value={stats.topPerformers.toString()}
				icon={Award}
				color="amber"
				delay={0.1}
			/>
			<StatsCard
				title={t("total_assessments") || "Total Assessments"}
				value={stats.totalAssessments.toString()}
				icon={FileText}
				color="violet"
				delay={0.15}
			/>
		</div>
	);
};
