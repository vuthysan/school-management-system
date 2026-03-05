"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDashboard } from "@/hooks/useDashboard";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useAcademicYears } from "@/hooks/useAcademicYears";
import { useStudents } from "@/hooks/useStudents";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	FileText,
	Printer,
	Download,
	Search,
	Loader2,
	Trophy,
	Activity,
	Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function ProgressReportPage() {
	const { t } = useTranslation();
	const { currentSchool } = useDashboard();
	const schoolId = currentSchool?.idStr || currentSchool?.id || null;
	const { academicYears } = useAcademicYears(schoolId || "");
	const { students } = useStudents(schoolId || "");
	const { studentProgress, isLoading, fetchStudentProgress } =
		useAnalytics(schoolId);

	const [selectedStudent, setSelectedStudent] = useState<string>("");
	const [selectedYear, setSelectedYear] = useState<string>("");
	const [selectedSemester, setSelectedSemester] = useState<string>("1");
	const [searchTerm, setSearchTerm] = useState("");

	const filteredStudents = students.filter(
		(s) =>
			`${s.firstNameEn || ""} ${s.lastNameEn || ""} ${s.firstNameKm} ${s.lastNameKm}`
				.toLowerCase()
				.includes(searchTerm.toLowerCase()) ||
			s.studentId.toLowerCase().includes(searchTerm.toLowerCase())
	);

	useEffect(() => {
		if (academicYears.length > 0 && !selectedYear) {
			setSelectedYear(academicYears[0].name);
		}
	}, [academicYears, selectedYear]);

	const handleFetchReport = () => {
		if (selectedStudent && selectedYear) {
			fetchStudentProgress(selectedStudent, selectedYear, selectedSemester);
		}
	};

	const getGradeColor = (score: number) => {
		if (score >= 90) return "text-emerald-600 dark:text-emerald-400";
		if (score >= 80) return "text-blue-600 dark:text-blue-400";
		if (score >= 70) return "text-amber-600 dark:text-amber-400";
		if (score >= 60) return "text-orange-600 dark:text-orange-400";
		return "text-red-600 dark:text-red-400";
	};

	const getGradeBg = (score: number) => {
		if (score >= 90) return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
		if (score >= 80) return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
		if (score >= 70) return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
		if (score >= 60) return "bg-orange-500/10 text-orange-600 dark:text-orange-400";
		return "bg-red-500/10 text-red-600 dark:text-red-400";
	};

	const getLetterGrade = (score: number) => {
		if (score >= 90) return "A";
		if (score >= 80) return "B";
		if (score >= 70) return "C";
		if (score >= 60) return "D";
		return "F";
	};

	return (
		<div className="space-y-6 pb-10">
			{/* Page Header */}
			<div className="print:hidden">
				<PageHeader
					title={t("progress_report")}
					subtitle={t("progress_report_subtitle")}
					icon={FileText}
				>
					<Button
						variant="outline"
						size="sm"
						className="h-9 rounded-lg text-xs font-medium"
						onClick={() => window.print()}
					>
						<Printer className="w-3.5 h-3.5 mr-1.5" />
						{t("print")}
					</Button>
					<Button
						variant="outline"
						size="sm"
						className="h-9 rounded-lg text-xs font-medium"
					>
						<Download className="w-3.5 h-3.5 mr-1.5" />
						{t("export_pdf")}
					</Button>
				</PageHeader>
			</div>

			{/* Selectors */}
			<div className="liquid-glass-card rounded-2xl p-5 print:hidden">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-muted-foreground ml-0.5">
							{t("academic_year")}
						</label>
						<Select value={selectedYear} onValueChange={setSelectedYear}>
							<SelectTrigger className="h-9 rounded-lg border-black/6 dark:border-white/6 font-medium">
								<SelectValue placeholder={t("select_year")} />
							</SelectTrigger>
							<SelectContent className="rounded-xl shadow-xl">
								{academicYears.map((y) => (
									<SelectItem
										key={y.idStr || y.name}
										value={y.name}
										className="rounded-lg"
									>
										{y.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-1.5">
						<label className="text-xs font-medium text-muted-foreground ml-0.5">
							{t("semester")}
						</label>
						<Select
							value={selectedSemester}
							onValueChange={setSelectedSemester}
						>
							<SelectTrigger className="h-9 rounded-lg border-black/6 dark:border-white/6 font-medium">
								<SelectValue placeholder={t("select_semester")} />
							</SelectTrigger>
							<SelectContent className="rounded-xl shadow-xl">
								<SelectItem value="1" className="rounded-lg">
									{t("semester")} 1
								</SelectItem>
								<SelectItem value="2" className="rounded-lg">
									{t("semester")} 2
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="md:col-span-2 space-y-1.5">
						<label className="text-xs font-medium text-muted-foreground ml-0.5">
							{t("student")}
						</label>
						<div className="flex gap-2">
							<Select
								value={selectedStudent}
								onValueChange={setSelectedStudent}
							>
								<SelectTrigger className="h-9 rounded-lg border-black/6 dark:border-white/6 font-medium flex-1">
									<SelectValue placeholder={t("select_student")} />
								</SelectTrigger>
								<SelectContent className="rounded-xl shadow-xl">
									<div className="p-2 sticky top-0 bg-popover z-10">
										<Input
											placeholder={t("search_placeholder")}
											value={searchTerm}
											onChange={(e) => setSearchTerm(e.target.value)}
											className="h-8 text-xs rounded-lg border-black/6 dark:border-white/6"
										/>
									</div>
									{filteredStudents.map((s) => (
										<SelectItem
											key={s.id}
											value={s.id}
											className="rounded-lg"
										>
											{s.firstNameEn || s.firstNameKm}{" "}
											{s.lastNameEn || s.lastNameKm} ({s.studentId})
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Button
								onClick={handleFetchReport}
								disabled={!selectedStudent || isLoading}
								size="sm"
								className="h-9 rounded-lg text-xs font-medium px-4"
							>
								{isLoading ? (
									<Loader2 className="w-3.5 h-3.5 animate-spin" />
								) : (
									t("generate")
								)}
							</Button>
						</div>
					</div>
				</div>
			</div>

			{/* Report Content */}
			<AnimatePresence mode="wait">
				{studentProgress ? (
					<motion.div
						key="report"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="space-y-6 print:space-y-4"
					>
						{/* Student Info Header */}
						<div className="liquid-glass-card rounded-2xl p-5 print:border-b-2 print:border-foreground print:rounded-none print:px-0">
							<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
								<div>
									<h2 className="text-lg font-semibold text-foreground tracking-tight">
										{studentProgress.studentName}
									</h2>
									<div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground font-medium">
										<span>ID: {studentProgress.studentId}</span>
										<span className="text-muted-foreground/30">|</span>
										<span>{selectedYear}</span>
										<span className="text-muted-foreground/30">|</span>
										<span>
											{t("semester")} {selectedSemester}
										</span>
									</div>
								</div>
								<Badge
									variant="outline"
									className="rounded-lg border-primary/20 bg-primary/5 text-primary font-medium px-3 py-1 text-xs w-fit"
								>
									{t("official_report")}
								</Badge>
							</div>
						</div>

						{/* Stats Cards */}
						<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
							<StatsCard
								title={t("average_grade")}
								value={`${studentProgress.gradeAverage.toFixed(1)}%`}
								icon={Trophy}
								color="purple"
								delay={0}
							/>
							<StatsCard
								title={t("attendance_rate")}
								value={`${studentProgress.attendanceRate.toFixed(1)}%`}
								icon={Activity}
								color="blue"
								delay={0.05}
							/>
							<StatsCard
								title={t("conduct_level")}
								value={t("excellent")}
								icon={Sparkles}
								color="green"
								delay={0.1}
							/>
						</div>

						{/* Subject Breakdown */}
						<div className="liquid-glass-card rounded-2xl overflow-hidden">
							<div className="px-5 py-4 border-b border-black/6 dark:border-white/6">
								<div className="flex items-center justify-between">
									<div>
										<h3 className="text-sm font-semibold text-foreground">
											{t("academic_performance")}
										</h3>
										<p className="text-xs text-muted-foreground mt-0.5">
											{t("detailed_scores_by_subject")}
										</p>
									</div>
									<Badge
										variant="outline"
										className="rounded-lg border-black/6 dark:border-white/6 text-xs font-medium"
									>
										{studentProgress.subjectGrades.length} {t("subjects")}
									</Badge>
								</div>
							</div>

							<Table>
								<TableHeader>
									<TableRow className="hover:bg-transparent border-none">
										<TableHead className="h-10 text-xs font-medium text-muted-foreground px-5">
											{t("subject_name")}
										</TableHead>
										<TableHead className="h-10 text-xs font-medium text-muted-foreground px-4 text-center">
											{t("score")}
										</TableHead>
										<TableHead className="h-10 text-xs font-medium text-muted-foreground px-4">
											{t("progress")}
										</TableHead>
										<TableHead className="h-10 text-xs font-medium text-muted-foreground px-5 text-right">
											{t("grade")}
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									<AnimatePresence mode="popLayout">
										{studentProgress.subjectGrades.map((sub, idx) => (
											<motion.tr
												key={sub.subjectId}
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, scale: 0.95 }}
												transition={{
													duration: 0.3,
													delay: idx * 0.05,
												}}
												className="group transition-all hover:bg-muted/30 border-b border-black/6 dark:border-white/6 last:border-0"
											>
												<TableCell className="px-5 py-4">
													<p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
														{sub.subjectName}
													</p>
												</TableCell>
												<TableCell className="px-4 text-center">
													<span
														className={cn(
															"text-sm font-semibold tabular-nums",
															getGradeColor(sub.averageScore)
														)}
													>
														{sub.averageScore.toFixed(0)}%
													</span>
												</TableCell>
												<TableCell className="px-4 min-w-45">
													<Progress
														value={sub.averageScore}
														className="h-1.5"
													/>
												</TableCell>
												<TableCell className="px-5 text-right">
													<Badge
														className={cn(
															"rounded-lg px-2.5 py-0.5 text-xs border-none font-semibold",
															getGradeBg(sub.averageScore)
														)}
													>
														{getLetterGrade(sub.averageScore)}
													</Badge>
												</TableCell>
											</motion.tr>
										))}
									</AnimatePresence>
								</TableBody>
							</Table>
						</div>

						{/* Signature Area */}
						<div className="liquid-glass-card rounded-2xl p-6 print:bg-transparent print:border-none print:px-0">
							<div className="grid grid-cols-2 gap-12 pt-8">
								<div className="text-center">
									<div className="h-16" />
									<div className="border-t border-black/6 dark:border-white/6 pt-3">
										<p className="text-xs font-medium text-muted-foreground">
											{t("principal_signature")}
										</p>
									</div>
								</div>
								<div className="text-center">
									<div className="h-16" />
									<div className="border-t border-black/6 dark:border-white/6 pt-3">
										<p className="text-xs font-medium text-muted-foreground">
											{t("class_teacher_signature")}
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Print-only footer */}
						<div className="text-center text-xs text-muted-foreground/40 print:block hidden">
							{t("generated_by_weteka")} •{" "}
							{new Date().toLocaleDateString()}
						</div>
					</motion.div>
				) : (
					<motion.div
						key="empty"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="liquid-glass-card rounded-2xl"
					>
						<div className="flex flex-col items-center justify-center min-h-100 space-y-4">
							<div className="w-12 h-12 rounded-xl bg-muted/50 flex items-center justify-center">
								<FileText className="w-6 h-6 text-muted-foreground/40" />
							</div>
							<div className="text-center space-y-1">
								<h3 className="text-sm font-semibold text-foreground">
									{t("no_report_generated")}
								</h3>
								<p className="text-xs text-muted-foreground max-w-70 mx-auto">
									{t("no_report_description")}
								</p>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
