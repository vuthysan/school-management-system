"use client";

import React, { useMemo } from "react";
import {
	Users,
	UserCheck,
	UserPlus,
	GraduationCap,
	TrendingUp,
	TrendingDown,
} from "lucide-react";
import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { Student } from "@/types/student";
import { cn } from "@/lib/utils";

interface StudentStatsProps {
	students: Student[];
}

export const StudentStats: React.FC<StudentStatsProps> = ({ students }) => {
	const { t } = useLanguage();

	// Calculate statistics
	const stats = useMemo(() => {
		const total = students.length;
		const activeCount = students.filter((s) => s.status === "active").length;

		// Calculate students enrolled in last 30 days
		const thirtyDaysAgo = new Date();

		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
		const newThisMonth = students.filter((s) => {
			const dateStr = s.enrollment?.enrollmentDate;
			if (!dateStr) return false;
			const enrollDate = new Date(dateStr);

			return enrollDate >= thirtyDaysAgo;
		}).length;

		// Grade distribution
		const grade10 = students.filter((s) => s.gradeLevel === "10").length;
		const grade11 = students.filter((s) => s.gradeLevel === "11").length;
		const grade12 = students.filter((s) => s.gradeLevel === "12").length;

		// Gender distribution
		const maleCount = students.filter((s) => s.gender === "male").length;
		const femaleCount = students.filter((s) => s.gender === "female").length;
		const otherCount = students.filter((s) => s.gender === "other").length;

		// Calculate percentages
		const activePercentage =
			total > 0 ? ((activeCount / total) * 100).toFixed(1) : "0";
		const grade10Percentage =
			total > 0 ? ((grade10 / total) * 100).toFixed(1) : "0";
		const grade11Percentage =
			total > 0 ? ((grade11 / total) * 100).toFixed(1) : "0";
		const grade12Percentage =
			total > 0 ? ((grade12 / total) * 100).toFixed(1) : "0";
		const malePercentage =
			total > 0 ? ((maleCount / total) * 100).toFixed(1) : "0";
		const femalePercentage =
			total > 0 ? ((femaleCount / total) * 100).toFixed(1) : "0";
		const otherPercentage =
			total > 0 ? ((otherCount / total) * 100).toFixed(1) : "0";

		return {
			total,
			activeCount,
			activePercentage,
			newThisMonth,
			grade10,
			grade10Percentage,
			grade11,
			grade11Percentage,
			grade12,
			grade12Percentage,
			maleCount,
			malePercentage,
			femaleCount,
			femalePercentage,
			otherCount,
			otherPercentage,
		};
	}, [students]);

	const StatCard = ({
		title,
		value,
		subtitle,
		icon: Icon,
		color = "blue",
		trend,
		index,
	}: {
		title: string;
		value: string | number;
		subtitle?: string;
		icon: React.ElementType;
		color?: "blue" | "emerald" | "amber" | "violet";
		trend?: { value: number; isPositive: boolean };
		index: number;
	}) => {
		const variants = {
			blue: {
				bg: "bg-card",
				icon: "bg-blue-500 text-white shadow-blue-500/20",
				glow: "from-blue-500/10 to-transparent",
				label: "text-slate-400",
			},
			emerald: {
				bg: "bg-card",
				icon: "bg-emerald-500 text-white shadow-emerald-500/20",
				glow: "from-emerald-500/10 to-transparent",
				label: "text-slate-400",
			},
			amber: {
				bg: "bg-card",
				icon: "bg-amber-500 text-white shadow-amber-500/20",
				glow: "from-amber-500/10 to-transparent",
				label: "text-slate-400",
			},
			violet: {
				bg: "bg-card",
				icon: "bg-violet-500 text-white shadow-violet-500/20",
				glow: "from-violet-500/10 to-transparent",
				label: "text-slate-400",
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
					{/* Gradient Background Effect on the right */}
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
							<span className="text-4xl font-black tracking-tighter text-slate-900">
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
				title={t("total_students_stat")}
				value={stats.total}
				icon={Users}
				color="blue"
			/>
			<StatCard
				index={1}
				title={t("active_students")}
				value={stats.activeCount}
				subtitle={`${stats.activePercentage}%`}
				icon={UserCheck}
				color="emerald"
			/>
			<StatCard
				index={2}
				title={t("new_this_month")}
				value={stats.newThisMonth}
				trend={{ value: 12, isPositive: true }}
				icon={UserPlus}
				color="amber"
			/>
			<StatCard
				index={3}
				title={t("grade_distribution")}
				value="3"
				subtitle="Levels"
				icon={GraduationCap}
				color="violet"
			/>
		</div>
	);
};
