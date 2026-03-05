"use client";

import React, { useMemo } from "react";
import { BookOpen, Users, School, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";

import { StatsCard } from "@/components/dashboard/stats-card";
import { Class, Subject } from "@/types/academic";

interface AcademicStatsProps {
	classes: Class[];
	subjects: Subject[];
	totalClasses?: number;
	totalSubjects?: number;
}

export const AcademicStats: React.FC<AcademicStatsProps> = ({
	classes,
	subjects,
	totalClasses,
	totalSubjects,
}) => {
	const { t } = useTranslation();

	const stats = useMemo(() => {
		const classCount = totalClasses ?? classes.length;
		const subjectCount = totalSubjects ?? subjects.length;

		const totalEnrolled = classes.reduce(
			(acc, cls) => acc + cls.currentEnrollment,
			0
		);
		const avgClassSize =
			classes.length > 0 ? Math.round(totalEnrolled / classes.length) : 0;

		const totalHours = subjects.reduce((acc, sub) => acc + (sub.hoursPerWeek || 0), 0);

		return {
			totalClasses: classCount,
			totalSubjects: subjectCount,
			avgClassSize,
			totalHours,
		};
	}, [classes, subjects, totalClasses, totalSubjects]);

	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
			<StatsCard
				title={t("total_classes")}
				value={stats.totalClasses.toString()}
				icon={School}
				color="blue"
				delay={0}
			/>
			<StatsCard
				title={t("total_subjects")}
				value={stats.totalSubjects.toString()}
				icon={BookOpen}
				color="emerald"
				delay={0.05}
			/>
			<StatsCard
				title={t("avg_class_size")}
				value={stats.avgClassSize.toString()}
				icon={Users}
				color="amber"
				delay={0.1}
			/>
			<StatsCard
				title={t("hours_per_week")}
				value={stats.totalHours.toString()}
				icon={GraduationCap}
				color="violet"
				delay={0.15}
			/>
		</div>
	);
};
