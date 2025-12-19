"use client";

import React, { useMemo } from "react";
import { BookOpen, Users, School, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";

import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { Class, Subject } from "@/types/academic";
import { cn } from "@/lib/utils";

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

		const totalCredits = subjects.reduce((acc, sub) => acc + sub.credits, 0);

		return {
			totalClasses: classCount,
			totalSubjects: subjectCount,
			avgClassSize,
			totalCredits,
		};
	}, [classes, subjects, totalClasses, totalSubjects]);

	const StatCard = ({
		title,
		value,
		icon: Icon,
		color = "blue",
		index,
	}: {
		title: string;
		value: string | number;
		icon: React.ElementType;
		color?: "blue" | "emerald" | "amber" | "violet";
		index: number;
	}) => {
		const variants = {
			blue: {
				bg: "bg-card",
				icon: "bg-blue-500 text-white shadow-blue-500/20",
				glow: "from-blue-500/10 to-transparent",
				label: "text-muted-foreground",
			},
			emerald: {
				bg: "bg-card",
				icon: "bg-emerald-500 text-white shadow-emerald-500/20",
				glow: "from-emerald-500/10 to-transparent",
				label: "text-muted-foreground",
			},
			amber: {
				bg: "bg-card",
				icon: "bg-amber-500 text-white shadow-amber-500/20",
				glow: "from-amber-500/10 to-transparent",
				label: "text-muted-foreground",
			},
			violet: {
				bg: "bg-card",
				icon: "bg-violet-500 text-white shadow-violet-500/20",
				glow: "from-violet-500/10 to-transparent",
				label: "text-muted-foreground",
			},
		};

		const style = variants[color as keyof typeof variants] || variants.blue;

		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, delay: index * 0.1 }}
			>
				<Card
					className={cn(
						"relative overflow-hidden border-none rounded-lg shadow-sm transition-all duration-300 hover:shadow-md group h-[140px]",
						style.bg
					)}
				>
					<div
						className={cn(
							"absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l opacity-50 group-hover:opacity-100 transition-opacity duration-500",
							style.glow
						)}
					/>

					<CardContent className="p-6 h-full flex items-center justify-between relative z-10">
						<div className="flex flex-col justify-between h-full py-1">
							<h3
								className={cn(
									"text-xs font-medium tracking-wide uppercase",
									style.label
								)}
							>
								{title}
							</h3>
							<span className="text-4xl font-black tracking-tighter text-foreground">
								{value}
							</span>
						</div>

						<div
							className={cn(
								"p-4 rounded-lg shadow-xl transition-transform duration-500 group-hover:scale-110",
								style.icon
							)}
						>
							<Icon className="h-7 w-7" />
						</div>
					</CardContent>
				</Card>
			</motion.div>
		);
	};

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			<StatCard
				index={0}
				title={t("total_classes")}
				value={stats.totalClasses}
				icon={School}
				color="blue"
			/>
			<StatCard
				index={1}
				title={t("total_subjects")}
				value={stats.totalSubjects}
				icon={BookOpen}
				color="emerald"
			/>
			<StatCard
				index={2}
				title={t("avg_class_size")}
				value={stats.avgClassSize}
				icon={Users}
				color="amber"
			/>
			<StatCard
				index={3}
				title={t("credits")}
				value={stats.totalCredits}
				icon={GraduationCap}
				color="violet"
			/>
		</div>
	);
};
