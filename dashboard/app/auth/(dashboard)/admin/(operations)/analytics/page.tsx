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
import { BarChart3, TrendingUp, Users, GraduationCap, DollarSign, UserCog } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { LoadingState } from "@/components/dashboard/loading-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ChartCard = ({
	title,
	children,
	delay,
}: {
	title: string;
	children: React.ReactNode;
	delay: number;
}) => (
	<DashboardCard delay={delay} title={title} contentClassName="min-h-75">
		{children}
	</DashboardCard>
);

export default function AnalyticsPage() {
	const { currentSchool } = useDashboard();
	const schoolId = currentSchool?.idStr || currentSchool?.id || null;
	const { academicYears } = useAcademicYears(schoolId || "");
	const {
		performanceData,
		attendanceData,
		overviewData,
		feeAnalytics,
		ratioData,
		isLoading: isAnalyticsLoading,
		fetchPerformanceAnalytics,
		fetchAttendanceAnalytics,
		fetchSchoolOverview,
		fetchFeeAnalytics,
		fetchStaffStudentRatio,
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
					fetchSchoolOverview(),
					fetchFeeAnalytics(),
					fetchStaffStudentRatio(),
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
		fetchSchoolOverview,
		fetchFeeAnalytics,
		fetchStaffStudentRatio,
	]);

	if (!schoolId) {
		return (
			<div className="flex items-center justify-center min-h-100">
				<p className="text-sm text-muted-foreground">
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
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="space-y-6 pb-10"
		>
			<PageHeader
				title="Academic Analytics"
				subtitle="Visualize and track school-wide performance trends with precision."
				icon={BarChart3}
			>
				<div className="flex items-center gap-3">
					<Select value={selectedYear} onValueChange={setSelectedYear}>
						<SelectTrigger className="w-36">
							<SelectValue placeholder="Select Year" />
						</SelectTrigger>
						<SelectContent>
							{academicYears.map((year) => (
								<SelectItem
									key={year.idStr || year.name}
									value={year.name}
								>
									{year.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select
						value={selectedSemester}
						onValueChange={setSelectedSemester}
					>
						<SelectTrigger className="w-32">
							<SelectValue placeholder="Semester" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="1">Semester 1</SelectItem>
							<SelectItem value="2">Semester 2</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</PageHeader>

			{isLoading ? (
				<LoadingState message="Loading analytics data..." />
			) : (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					className="space-y-6"
				>
					{/* Stats Summary */}
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
						<StatsCard
							title="Total Students"
							value={overviewData?.totalStudents || totalStudents}
							icon={Users}
						/>
						<StatsCard
							title="Total Staff"
							value={overviewData?.totalStaff || 0}
							icon={UserCog}
						/>
						<StatsCard
							title="Active Classes"
							value={overviewData?.totalClasses || classCount}
							icon={GraduationCap}
						/>
						<StatsCard
							title="Attendance Rate"
							value={`${(overviewData?.attendanceRate || attendanceData?.averageRate || 0).toFixed(1)}%`}
							icon={TrendingUp}
						/>
						<StatsCard
							title="Fee Collection"
							value={`${(overviewData?.feeCollectionRate || 0).toFixed(1)}%`}
							icon={DollarSign}
						/>
						<StatsCard
							title="Staff:Student"
							value={`1:${(ratioData?.ratio || overviewData?.staffStudentRatio || 0).toFixed(0)}`}
							icon={BarChart3}
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

					{/* Fee Collection Summary */}
					{feeAnalytics && (
						<DashboardCard delay={0.8} title="Fee Collection Summary">
							<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
								<div className="text-center">
									<p className="text-xs text-muted-foreground">Expected</p>
									<p className="text-lg font-bold text-foreground">${feeAnalytics.totalExpected.toLocaleString()}</p>
								</div>
								<div className="text-center">
									<p className="text-xs text-muted-foreground">Collected</p>
									<p className="text-lg font-bold text-emerald-600">${feeAnalytics.totalCollected.toLocaleString()}</p>
								</div>
								<div className="text-center">
									<p className="text-xs text-muted-foreground">Outstanding</p>
									<p className="text-lg font-bold text-red-600">${feeAnalytics.outstanding.toLocaleString()}</p>
								</div>
								<div className="text-center">
									<p className="text-xs text-muted-foreground">Collection Rate</p>
									<p className="text-lg font-bold text-primary">{feeAnalytics.collectionRate.toFixed(1)}%</p>
								</div>
							</div>
							{feeAnalytics.monthlyCollection.length > 0 && (
								<div className="space-y-2">
									<p className="text-xs font-medium text-muted-foreground">Monthly Collection</p>
									<div className="flex items-end gap-1 h-24">
										{feeAnalytics.monthlyCollection.map((m) => {
											const max = Math.max(...feeAnalytics.monthlyCollection.map(mc => mc.amount));
											const height = max > 0 ? (m.amount / max) * 100 : 0;
											return (
												<div key={m.month} className="flex-1 flex flex-col items-center gap-1">
													<div
														className="w-full bg-primary/20 rounded-t"
														style={{ height: `${height}%` }}
													>
														<div
															className="w-full bg-primary rounded-t h-full"
															style={{ opacity: 0.7 }}
														/>
													</div>
													<span className="text-[9px] text-muted-foreground">{m.month.slice(5)}</span>
												</div>
											);
										})}
									</div>
								</div>
							)}
						</DashboardCard>
					)}
				</motion.div>
			)}
		</motion.div>
	);
}
