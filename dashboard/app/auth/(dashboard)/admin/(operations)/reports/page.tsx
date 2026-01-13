"use client";

import { useState, useEffect } from "react";
import { useDashboard } from "@/hooks/useDashboard";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useAcademicYears } from "@/hooks/useAcademicYears";
import { useStudents } from "@/hooks/useStudents";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	FileText,
	Printer,
	Download,
	Search,
	Loader2,
	Trophy,
	Activity,
	Calendar,
	Sparkles,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";

export default function ProgressReportPage() {
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
		if (score >= 90) return "text-green-600";
		if (score >= 80) return "text-blue-600";
		if (score >= 70) return "text-yellow-600";
		if (score >= 60) return "text-orange-600";
		return "text-red-600";
	};

	return (
		<div className="p-6 space-y-8 max-w-[1200px] mx-auto">
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
				<div>
					<h1 className="text-3xl font-black uppercase tracking-tighter text-foreground">
						Student Progress Report
					</h1>
					<p className="text-muted-foreground text-sm font-medium">
						Generate and view detailed academic performance reports.
					</p>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						className="font-bold uppercase tracking-widest text-[10px]"
						onClick={() => window.print()}
					>
						<Printer className="w-3 h-3 mr-2" />
						Print Report
					</Button>
					<Button
						variant="outline"
						className="font-bold uppercase tracking-widest text-[10px]"
					>
						<Download className="w-3 h-3 mr-2" />
						Export PDF
					</Button>
				</div>
			</div>

			{/* Selectors */}
			<Card className="border-none premium-shadow bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm print:hidden">
				<CardContent className="p-6">
					<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
						<div className="space-y-1">
							<span className="text-[10px] font-bold uppercase text-muted-foreground ml-1">
								Academic Year
							</span>
							<Select value={selectedYear} onValueChange={setSelectedYear}>
								<SelectTrigger className="font-bold">
									<SelectValue placeholder="Year" />
								</SelectTrigger>
								<SelectContent>
									{academicYears.map((y) => (
										<SelectItem key={y.idStr || y.name} value={y.name}>
											{y.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<div className="space-y-1">
							<span className="text-[10px] font-bold uppercase text-muted-foreground ml-1">
								Semester
							</span>
							<Select
								value={selectedSemester}
								onValueChange={setSelectedSemester}
							>
								<SelectTrigger className="font-bold">
									<SelectValue placeholder="Semester" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="1">Semester 1</SelectItem>
									<SelectItem value="2">Semester 2</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="md:col-span-2 space-y-1">
							<span className="text-[10px] font-bold uppercase text-muted-foreground ml-1">
								Student
							</span>
							<div className="flex gap-2">
								<Select
									value={selectedStudent}
									onValueChange={setSelectedStudent}
								>
									<SelectTrigger className="font-bold flex-1">
										<SelectValue placeholder="Select Student" />
									</SelectTrigger>
									<SelectContent>
										<div className="p-2 sticky top-0 bg-popover z-10">
											<Input
												placeholder="Search student..."
												value={searchTerm}
												onChange={(e) => setSearchTerm(e.target.value)}
												className="h-8 text-xs"
											/>
										</div>
										{filteredStudents.map((s) => (
											<SelectItem key={s.id} value={s.id}>
												{s.firstNameEn || s.firstNameKm}{" "}
												{s.lastNameEn || s.lastNameKm} ({s.studentId})
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Button
									onClick={handleFetchReport}
									disabled={!selectedStudent || isLoading}
									className="font-bold uppercase tracking-widest text-[10px]"
								>
									{isLoading ? (
										<Loader2 className="w-3 h-3 animate-spin" />
									) : (
										"Generate"
									)}
								</Button>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Report View */}
			<AnimatePresence mode="wait">
				{studentProgress ? (
					<motion.div
						key="report"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						className="space-y-8 print:space-y-4"
					>
						{/* Header / Basic Info */}
						<div className="flex justify-between items-start border-b-4 border-foreground pb-6">
							<div className="space-y-1">
								<h2 className="text-4xl font-black uppercase tracking-tighter">
									{studentProgress.studentName}
								</h2>
								<div className="flex items-center gap-4 text-sm font-bold text-muted-foreground">
									<span>ID: {studentProgress.studentId}</span>
									<span>•</span>
									<span>{selectedYear}</span>
									<span>•</span>
									<span>Semester {selectedSemester}</span>
								</div>
							</div>
							<div className="text-right">
								<Badge
									variant="outline"
									className="border-2 font-black uppercase tracking-widest py-1.5 px-4"
								>
									Official Progress Report
								</Badge>
							</div>
						</div>

						{/* Top Metrics */}
						<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
							<Card className="bg-white dark:bg-neutral-900 border-none premium-shadow overflow-hidden group">
								<CardContent className="p-8 flex items-center justify-between">
									<div className="space-y-1">
										<p className="text-[10px] font-black uppercase text-purple-600/60 tracking-widest">
											Average Grade
										</p>
										<p
											className={`text-5xl font-black text-purple-600 tracking-tighter`}
										>
											{studentProgress.gradeAverage.toFixed(1)}%
										</p>
									</div>
									<div className="p-4 bg-purple-500 rounded-3xl text-white shadow-xl shadow-purple-200">
										<Trophy className="w-8 h-8" />
									</div>
								</CardContent>
							</Card>

							<Card className="bg-white dark:bg-neutral-900 border-none premium-shadow overflow-hidden group">
								<CardContent className="p-8 flex items-center justify-between">
									<div className="space-y-1">
										<p className="text-[10px] font-black uppercase text-blue-600/60 tracking-widest">
											Attendance Rate
										</p>
										<p className="text-5xl font-black text-blue-600 tracking-tighter">
											{studentProgress.attendanceRate.toFixed(1)}%
										</p>
									</div>
									<div className="p-4 bg-blue-500 rounded-3xl text-white shadow-xl shadow-blue-200">
										<Activity className="w-8 h-8" />
									</div>
								</CardContent>
							</Card>

							<Card className="bg-white dark:bg-neutral-900 border-none premium-shadow overflow-hidden group">
								<CardContent className="p-8 flex items-center justify-between">
									<div className="space-y-1">
										<p className="text-[10px] font-black uppercase text-green-600/60 tracking-widest">
											Conduct Level
										</p>
										<p className="text-5xl font-black text-green-600 tracking-tighter">
											EXCELLENT
										</p>
									</div>
									<div className="p-4 bg-green-500 rounded-3xl text-white shadow-xl shadow-green-200">
										<Sparkles className="w-8 h-8" />
									</div>
								</CardContent>
							</Card>
						</div>

						{/* Subject Breakdown */}
						<Card className="border-none premium-shadow overflow-hidden bg-white dark:bg-neutral-900">
							<CardHeader className="bg-neutral-950 text-white p-8">
								<div className="flex justify-between items-center">
									<div>
										<CardTitle className="text-sm font-black uppercase tracking-widest">
											Academic Performance Breakdown
										</CardTitle>
										<CardDescription className="text-neutral-500 text-[10px] font-black uppercase tracking-widest mt-1">
											Detailed scores by curriculum subject
										</CardDescription>
									</div>
									<Badge className="bg-white/10 text-white border-white/20">
										Official
									</Badge>
								</div>
							</CardHeader>
							<CardContent className="p-0">
								<table className="w-full border-collapse">
									<thead>
										<tr className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-100 dark:border-neutral-700">
											<th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">
												Subject Name
											</th>
											<th className="px-6 py-4 text-center text-[10px] font-black uppercase tracking-widest text-muted-foreground">
												Score
											</th>
											<th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground">
												Progress
											</th>
											<th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-widest text-muted-foreground">
												Grade
											</th>
										</tr>
									</thead>
									<tbody>
										{studentProgress.subjectGrades.map((sub, idx) => (
											<tr
												key={sub.subjectId}
												className={`border-b border-neutral-50 dark:border-neutral-800 transition-colors hover:bg-neutral-50/50 dark:hover:bg-neutral-800/30 ${idx % 2 === 0 ? "" : "bg-neutral-50/30 dark:bg-neutral-800/10"}`}
											>
												<td className="px-6 py-5 font-black text-sm">
													{sub.subjectName}
												</td>
												<td className="px-6 py-5 text-center">
													<span
														className={`text-lg font-black ${getGradeColor(sub.averageScore)}`}
													>
														{sub.averageScore.toFixed(0)}%
													</span>
												</td>
												<td className="px-6 py-5 min-w-[200px]">
													<div className="space-y-1.5">
														<Progress
															value={sub.averageScore}
															className="h-2"
														/>
													</div>
												</td>
												<td className="px-6 py-5 text-right font-black text-lg">
													{sub.averageScore >= 90
														? "A"
														: sub.averageScore >= 80
															? "B"
															: sub.averageScore >= 70
																? "C"
																: sub.averageScore >= 60
																	? "D"
																	: "F"}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</CardContent>
						</Card>

						{/* Footer / Signature Area */}
						<div className="grid grid-cols-2 gap-12 pt-20 pb-12 print:pt-10">
							<div className="border-t-2 border-dashed border-neutral-300 dark:border-neutral-700 pt-4 text-center">
								<p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
									Principal Signature
								</p>
								<div className="h-20" />
								<p className="font-bold">__________________________</p>
							</div>
							<div className="border-t-2 border-dashed border-neutral-300 dark:border-neutral-700 pt-4 text-center">
								<p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
									Class Teacher Signature
								</p>
								<div className="h-20" />
								<p className="font-bold">__________________________</p>
							</div>
						</div>

						<div className="text-center text-[10px] font-black uppercase text-muted-foreground/40 print:block hidden">
							Generated by Weteka School Management System •{" "}
							{new Date().toLocaleDateString()}
						</div>
					</motion.div>
				) : (
					<div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed rounded-3xl border-neutral-200 dark:border-neutral-800 space-y-4">
						<div className="p-4 bg-neutral-100 dark:bg-neutral-900 rounded-2xl">
							<FileText className="w-12 h-12 text-muted-foreground/30" />
						</div>
						<div className="text-center">
							<h3 className="text-lg font-black uppercase tracking-widest text-foreground">
								No Report Generated
							</h3>
							<p className="text-sm text-muted-foreground font-medium max-w-[300px] mx-auto">
								Select a student and academic term above to generate a progress
								report.
							</p>
						</div>
					</div>
				)}
			</AnimatePresence>
		</div>
	);
}
