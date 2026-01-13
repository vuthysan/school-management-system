"use client";

import React, { useState, useMemo } from "react";
import { Save, Loader2, AlertCircle } from "lucide-react";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";
import { useDashboard } from "@/hooks/useDashboard";
import { useClasses } from "@/hooks/useClasses";
import { useSubjects } from "@/hooks/useSubjects";
import { useStudents } from "@/hooks/useStudents";
import { useGradeMutations } from "@/hooks/useGrades";

interface StudentScore {
	score: string;
	remarks: string;
}

export const GradeEntry = () => {
	const { t } = useLanguage();
	const { currentSchool } = useDashboard();
	const schoolId = currentSchool?.idStr || currentSchool?.id || null;

	// Fetch real data
	const { classes, isLoading: classesLoading } = useClasses({
		schoolId,
		pageSize: 100,
	});
	const { subjects, isLoading: subjectsLoading } = useSubjects({
		schoolId,
		pageSize: 100,
	});
	const { students, isLoading: studentsLoading } = useStudents(schoolId);
	const { addGrade } = useGradeMutations();

	// State
	const [selectedClass, setSelectedClass] = useState("");
	const [selectedSubject, setSelectedSubject] = useState("");
	const [assessmentType, setAssessmentType] = useState("exam");
	const [maxScore, setMaxScore] = useState("100");
	const [scores, setScores] = useState<Record<string, StudentScore>>({});
	const [isSaving, setIsSaving] = useState(false);
	const [saveError, setSaveError] = useState<string | null>(null);

	// Filter students by selected class
	const filteredStudents = useMemo(() => {
		if (!selectedClass) return [];
		// Find students in the selected class
		const selectedClassData = classes.find((c) => c.id === selectedClass);
		const classStudentIds = (selectedClassData as any)?.studentIds as
			| string[]
			| undefined;
		if (!selectedClassData || !classStudentIds) return students;
		return students.filter((s) => classStudentIds.includes(s.id));
	}, [selectedClass, classes, students]);

	const handleScoreChange = (
		studentId: string,
		field: "score" | "remarks",
		value: string
	) => {
		if (field === "score") {
			if (
				value === "" ||
				(/^\d*\.?\d*$/.test(value) && Number(value) <= Number(maxScore))
			) {
				setScores((prev) => ({
					...prev,
					[studentId]: {
						...prev[studentId],
						score: value,
						remarks: prev[studentId]?.remarks || "",
					},
				}));
			}
		} else {
			setScores((prev) => ({
				...prev,
				[studentId]: {
					...prev[studentId],
					remarks: value,
					score: prev[studentId]?.score || "",
				},
			}));
		}
	};

	const handleSave = async () => {
		setIsSaving(true);
		setSaveError(null);

		try {
			const promises = Object.entries(scores)
				.filter(([_, data]) => data.score !== "")
				.map(([studentId, data]) =>
					addGrade({
						studentId,
						subjectId: selectedSubject,
						classId: selectedClass,
						assessmentType,
						score: Number(data.score),
						maxScore: Number(maxScore),
						term: "Term 1", // TODO: Make dynamic
						academicYear: "2024-2025", // TODO: Make dynamic
						remarks: data.remarks || undefined,
					})
				);

			await Promise.all(promises);
			setScores({});
			alert(t("grades_saved_successfully") || "Grades saved successfully!");
		} catch (err) {
			console.error("Failed to save grades:", err);
			setSaveError(
				err instanceof Error ? err.message : "Failed to save grades"
			);
		} finally {
			setIsSaving(false);
		}
	};

	const getGradeLetter = (score: string) => {
		const percentage = Number(score) / Number(maxScore);

		if (percentage >= 0.9) return { letter: "A", color: "text-green-600" };
		if (percentage >= 0.8) return { letter: "B", color: "text-primary" };
		if (percentage >= 0.7) return { letter: "C", color: "text-yellow-600" };
		if (percentage >= 0.6) return { letter: "D", color: "text-orange-600" };

		return { letter: "F", color: "text-red-600" };
	};

	const getInitials = (name: string) =>
		name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);

	const isLoading = classesLoading || subjectsLoading || studentsLoading;

	return (
		<div className="flex flex-col gap-6">
			{/* Controls */}
			<Card className="border">
				<CardContent className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end p-6">
					<div className="space-y-2">
						<Label>{t("select_class")}</Label>
						<Select
							value={selectedClass}
							onValueChange={setSelectedClass}
							disabled={classesLoading}
						>
							<SelectTrigger>
								<SelectValue
									placeholder={classesLoading ? "Loading..." : "Select class"}
								/>
							</SelectTrigger>
							<SelectContent>
								{classes.map((cls) => (
									<SelectItem key={cls.id} value={cls.id}>
										{cls.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label>{t("subject")}</Label>
						<Select
							value={selectedSubject}
							onValueChange={setSelectedSubject}
							disabled={subjectsLoading}
						>
							<SelectTrigger>
								<SelectValue
									placeholder={
										subjectsLoading ? "Loading..." : "Select subject"
									}
								/>
							</SelectTrigger>
							<SelectContent>
								{subjects.map((sub) => (
									<SelectItem key={sub.id} value={sub.id}>
										{sub.subjectName}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label>{t("assessment_type")}</Label>
						<Select value={assessmentType} onValueChange={setAssessmentType}>
							<SelectTrigger>
								<SelectValue placeholder="Select type" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="exam">{t("exam")}</SelectItem>
								<SelectItem value="quiz">{t("quiz")}</SelectItem>
								<SelectItem value="assignment">{t("assignment")}</SelectItem>
								<SelectItem value="project">{t("project")}</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-2">
						<Label>{t("max_score")}</Label>
						<Input
							placeholder="100"
							type="number"
							value={maxScore}
							onChange={(e) => setMaxScore(e.target.value)}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Error display */}
			{saveError && (
				<div className="flex items-center gap-2 p-4 bg-destructive/10 text-destructive rounded-lg">
					<AlertCircle className="h-5 w-5" />
					<span>{saveError}</span>
				</div>
			)}

			{/* Grade Entry Table */}
			{selectedClass && selectedSubject && (
				<div className="flex flex-col gap-4">
					{isLoading ? (
						<div className="flex items-center justify-center h-32">
							<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
						</div>
					) : filteredStudents.length === 0 ? (
						<div className="flex items-center justify-center h-32 text-muted-foreground">
							{t("no_students_in_class") || "No students in this class"}
						</div>
					) : (
						<>
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>{t("name").toUpperCase()}</TableHead>
											<TableHead>{t("score").toUpperCase()}</TableHead>
											<TableHead>{t("grade_letter").toUpperCase()}</TableHead>
											<TableHead>{t("remarks").toUpperCase()}</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{filteredStudents.map((student) => (
											<TableRow key={student.id}>
												<TableCell>
													<div className="flex items-center gap-3">
														<Avatar className="h-8 w-8">
															<AvatarImage
																alt={student.fullName || ""}
																src=""
															/>
															<AvatarFallback>
																{getInitials(
																	student.fullName || student.firstNameEn || "?"
																)}
															</AvatarFallback>
														</Avatar>
														<div className="flex flex-col">
															<span className="text-sm font-medium">
																{student.fullName ||
																	`${student.firstNameEn} ${student.lastNameEn}`}
															</span>
															<span className="text-xs text-muted-foreground">
																ID: {student.studentId}
															</span>
														</div>
													</div>
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-1">
														<Input
															className="max-w-[80px] h-8"
															placeholder="0"
															type="text"
															value={scores[student.id]?.score || ""}
															onChange={(e) =>
																handleScoreChange(
																	student.id,
																	"score",
																	e.target.value
																)
															}
														/>
														<span className="text-muted-foreground text-sm">
															/{maxScore}
														</span>
													</div>
												</TableCell>
												<TableCell>
													{scores[student.id]?.score ? (
														<span
															className={cn(
																"font-bold",
																getGradeLetter(scores[student.id].score).color
															)}
														>
															{getGradeLetter(scores[student.id].score).letter}
														</span>
													) : (
														"-"
													)}
												</TableCell>
												<TableCell>
													<Input
														className="max-w-[200px] h-8"
														placeholder="Optional remarks"
														value={scores[student.id]?.remarks || ""}
														onChange={(e) =>
															handleScoreChange(
																student.id,
																"remarks",
																e.target.value
															)
														}
													/>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>

							<div className="flex justify-end sticky bottom-6 z-20">
								<Button
									className="shadow-lg"
									disabled={isSaving || Object.keys(scores).length === 0}
									size="lg"
									onClick={handleSave}
								>
									{isSaving ? (
										<Loader2 className="mr-2 h-5 w-5 animate-spin" />
									) : (
										<Save className="mr-2 h-5 w-5" />
									)}
									{t("save_changes")}
								</Button>
							</div>
						</>
					)}
				</div>
			)}
		</div>
	);
};
