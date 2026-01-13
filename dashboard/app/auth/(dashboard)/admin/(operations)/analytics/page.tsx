"use client";

import { useState, useEffect } from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useAcademicYears } from "@/hooks/useAcademicYears";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { ClassPerformanceChart } from "@/components/analytics/performance-chart";
import { GradeDistributionChart } from "@/components/analytics/grade-distribution-chart";
import { SubjectPerformanceChart } from "@/components/analytics/subject-performance-chart";
import { AttendanceTrendChart } from "@/components/analytics/attendance-trend-chart";
import { BarChart3, TrendingUp, Users, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { cn } from "@/lib/utils";

// Reusable glass container for charts - using glass-panel and rounded-2xl
const ChartCard = ({
	title,
	children,
	delay,
}: {
	title: string;
	children: React.ReactNode;
	delay: number;
}) => (
	<motion.div
		initial={{ opacity: 0, y: 20 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.5, delay }}
		className="glass-panel p-6 flex flex-col h-full rounded-2xl"
	>
		<h3 className="text-lg font-bold text-foreground mb-6 flex items-center gap-2">
			<div className="w-1 h-6 bg-primary rounded-full" />
			{title}
		</h3>
		<div className="flex-1 min-h-[300px] w-full">{children}</div>
	</motion.div>
);

export default function AnalyticsPage() {
	const { currentSchool } = useDashboard();
	const schoolId = currentSchool?.idStr || currentSchool?.id || null;
	const { academicYears } = useAcademicYears(schoolId || "");
	const {
		performanceData,
		attendanceData,
		isLoading: isAnalyticsLoading,
		fetchPerformanceAnalytics,
		fetchAttendanceAnalytics,
	} = useAnalytics(schoolId);

	const [isLoading, setIsLoading] = useState(true);
	const [selectedYear, setSelectedYear] = useState<string>("");
	const [selectedSemester, setSelectedSemester] = useState<string>("1");

	useEffect(() => {
		if (academicYears.length > 0 && !selectedYear) {
			setSelectedYear(academicYears[0].name);
		}
	}, [academicYears, selectedYear]);

	useEffect(() => {
		const loadData = async () => {
			if (schoolId && selectedYear) {
				setIsLoading(true);
				await Promise.all([
					fetchPerformanceAnalytics(selectedYear, selectedSemester),
					fetchAttendanceAnalytics(),
				]);
				setIsLoading(false);
			}
		};
		loadData();
	}, [
		schoolId,
		selectedYear,
		selectedSemester,
		fetchPerformanceAnalytics,
		fetchAttendanceAnalytics,
	]);

	if (!schoolId) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">
					Please select a school to view analytics.
				</p>
			</div>
		);
	}

	const avgScore =
		performanceData?.classPerformances.reduce(
			(acc, curr) => acc + curr.averageScore,
			0
		) || 0;
	const totalStudents =
		performanceData?.classPerformances.reduce(
			(acc, curr) => acc + curr.studentCount,
			0
		) || 0;
	const classCount = performanceData?.classPerformances.length || 0;
	const overallAvg = classCount > 0 ? (avgScore / classCount).toFixed(1) : "0";

	return (
		<div className="space-y-10 pb-10">
			<PageHeader
				title="Academic Analytics"
				subtitle="Visualize and track school-wide performance trends with precision."
				icon={BarChart3}
			>
				<div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-1.5 rounded-2xl border border-white/10">
					<div className="flex flex-col gap-0.5 px-3">
						<span className="text-[9px] font-black uppercase text-muted-foreground/70 tracking-widest">
							Academic Year
						</span>
						<Select value={selectedYear} onValueChange={setSelectedYear}>
							<SelectTrigger className="w-[140px] h-7 bg-transparent border-none font-bold text-sm focus:ring-0 p-0 text-foreground">
								<SelectValue placeholder="Select Year" />
							</SelectTrigger>
							<SelectContent className="rounded-xl border-white/10 bg-black/80 backdrop-blur-xl">
								{academicYears.map((year) => (
									<SelectItem
										key={year.idStr || year.name}
										value={year.name}
										className="rounded-lg focus:bg-white/10 focus:text-primary cursor-pointer font-medium"
									>
										{year.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="w-px h-8 bg-white/10" />

					<div className="flex flex-col gap-0.5 px-3">
						<span className="text-[9px] font-black uppercase text-muted-foreground/70 tracking-widest">
							Semester
						</span>
						<Select
							value={selectedSemester}
							onValueChange={setSelectedSemester}
						>
							<SelectTrigger className="w-[120px] h-7 bg-transparent border-none font-bold text-sm focus:ring-0 p-0 text-foreground">
								<SelectValue placeholder="Semester" />
							</SelectTrigger>
							<SelectContent className="rounded-xl border-white/10 bg-black/80 backdrop-blur-xl">
								<SelectItem
									value="1"
									className="rounded-lg focus:bg-white/10 focus:text-primary cursor-pointer font-medium"
								>
									Semester 1
								</SelectItem>
								<SelectItem
									value="2"
									className="rounded-lg focus:bg-white/10 focus:text-primary cursor-pointer font-medium"
								>
									Semester 2
								</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</PageHeader>

			{isLoading ? (
				<div className="flex flex-col items-center justify-center min-h-[400px] space-y-6">
					<div className="w-16 h-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
					<p className="text-xs font-black uppercase tracking-[0.3em] text-primary/60 animate-pulse">
						Aggregating Analytics Data...
					</p>
				</div>
			) : (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="space-y-10"
				>
					{/* Stats Summary */}
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
						<StatsCard
							title="Overall Average"
							value={`${overallAvg}%`}
							icon={BarChart3}
							color="blue"
							delay={0}
						/>
						<StatsCard
							title="Total Students"
							value={totalStudents.toString()}
							icon={Users}
							color="green"
							delay={0.1}
						/>
						<StatsCard
							title="Active Classes"
							value={classCount.toString()}
							icon={GraduationCap}
							color="purple"
							delay={0.2}
						/>
						<StatsCard
							title="Attendance Rate"
							value={`${attendanceData?.averageRate.toFixed(1) || 0}%`}
							icon={TrendingUp}
							color="orange"
							delay={0.3}
						/>
					</div>

					{/* Charts Grid */}
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
						<div className="lg:col-span-2">
							<ChartCard delay={0.4} title="Class Performance Trends">
								<ClassPerformanceChart
									data={performanceData?.classPerformances || []}
								/>
							</ChartCard>
						</div>
						<div className="lg:col-span-2">
							<ChartCard delay={0.5} title="Attendance Trends">
								<AttendanceTrendChart
									data={attendanceData?.weeklyTrends || []}
								/>
							</ChartCard>
						</div>
						<ChartCard delay={0.6} title="Grade Distribution">
							<GradeDistributionChart
								data={performanceData?.gradeDistribution || []}
							/>
						</ChartCard>
						<ChartCard delay={0.7} title="Subject Performance">
							<SubjectPerformanceChart
								data={performanceData?.subjectPerformances || []}
							/>
						</ChartCard>
					</div>
				</motion.div>
			)}
		</div>
	);
}
