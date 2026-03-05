"use client";

import { FileText, TrendingUp, BookOpen, Award } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const demoGrades = [
	{ subject: "Mathematics", score: 92, grade: "A", teacher: "Mr. Sokha" },
	{ subject: "Khmer Literature", score: 88, grade: "A-", teacher: "Ms. Channa" },
	{ subject: "English", score: 85, grade: "B+", teacher: "Mr. David" },
	{ subject: "Science", score: 90, grade: "A", teacher: "Ms. Sreymom" },
	{ subject: "History", score: 78, grade: "B", teacher: "Mr. Vichea" },
	{ subject: "Physical Education", score: 95, grade: "A+", teacher: "Mr. Bunna" },
	{ subject: "Art", score: 82, grade: "B+", teacher: "Ms. Dara" },
	{ subject: "Music", score: 88, grade: "A-", teacher: "Mr. Samnang" },
];

function getGradeColor(grade: string): string {
	if (grade.startsWith("A")) return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400";
	if (grade.startsWith("B")) return "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400";
	if (grade.startsWith("C")) return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400";
	return "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400";
}

function getScoreBarColor(score: number): string {
	if (score >= 90) return "bg-emerald-500";
	if (score >= 80) return "bg-blue-500";
	if (score >= 70) return "bg-amber-500";
	return "bg-red-500";
}

export default function StudentGradesPage() {
	const { t } = useTranslation();

	const avgScore = Math.round(demoGrades.reduce((s, g) => s + g.score, 0) / demoGrades.length);
	const highestSubject = demoGrades.reduce((a, b) => (a.score > b.score ? a : b));

	return (
		<div className="space-y-6 pb-10">
			<PageHeader
				title={t("student_grades")}
				subtitle={t("view_my_grades")}
				icon={FileText}
			/>

			{/* Stats */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
				<StatsCard title={t("overall_gpa")} value="3.6" icon={TrendingUp} />
				<StatsCard title={t("completed_courses")} value={demoGrades.length} icon={BookOpen} />
				<StatsCard title={t("average") || "Average"} value={`${avgScore}%`} icon={Award} />
				<StatsCard title={t("highest") || "Highest"} value={highestSubject.subject} icon={Award} />
			</div>

			{/* Grades List */}
			<div className="space-y-2">
				{demoGrades.map((item, idx) => (
					<motion.div
						key={item.subject}
						initial={{ opacity: 0, y: 6 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: idx * 0.04 }}
					>
						<div className="liquid-glass-card rounded-2xl p-4">
							<div className="flex items-center justify-between mb-2">
								<div>
									<h3 className="text-sm font-semibold text-foreground">{item.subject}</h3>
									<p className="text-xs text-muted-foreground">{item.teacher}</p>
								</div>
								<div className="flex items-center gap-2">
									<span className="text-sm font-bold text-foreground">{item.score}%</span>
									<Badge variant="secondary" className={cn("border-none text-xs font-bold", getGradeColor(item.grade))}>
										{item.grade}
									</Badge>
								</div>
							</div>
							{/* Score bar */}
							<div className="w-full h-1.5 bg-muted/40 rounded-full overflow-hidden">
								<motion.div
									className={cn("h-full rounded-full", getScoreBarColor(item.score))}
									initial={{ width: 0 }}
									animate={{ width: `${item.score}%` }}
									transition={{ delay: idx * 0.04 + 0.2, duration: 0.5 }}
								/>
							</div>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
}
