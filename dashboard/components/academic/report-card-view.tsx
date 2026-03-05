"use client";

import { ReportCard } from "@/hooks/useReportCard";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

interface ReportCardViewProps {
	reportCard: ReportCard;
}

export function ReportCardView({ reportCard }: ReportCardViewProps) {
	const { t } = useTranslation();

	const getGradeBadgeVariant = (grade: string) => {
		switch (grade) {
			case "A":
				return "default";
			case "B":
				return "secondary";
			case "C":
				return "outline";
			case "D":
				return "destructive";
			case "F":
				return "destructive";
			default:
				return "outline";
		}
	};

	return (
		<div className="space-y-6">
			{/* Header Section */}
			<Card>
				<CardHeader>
					<div className="flex items-start justify-between">
						<div>
							<CardTitle className="text-2xl">
								{reportCard.lastNameKm} {reportCard.firstNameKm}
							</CardTitle>
							<CardDescription>
								{reportCard.studentCode} • {reportCard.gradeLevel}
								{reportCard.className && ` • ${reportCard.className}`}
							</CardDescription>
						</div>
						<div className="text-right">
							<div className="text-sm text-muted-foreground">
								{reportCard.academicYear} • {t("semester")} {reportCard.semester}
							</div>
							<div className="text-xs text-muted-foreground">{reportCard.academicYearBe}</div>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
						<div>
							<div className="text-sm text-muted-foreground">{t("overall_average")}</div>
							<div className="text-2xl font-bold">{reportCard.overallAverage.toFixed(2)}%</div>
						</div>
						<div>
							<div className="text-sm text-muted-foreground">{t("overall_grade")}</div>
							<div className="text-2xl font-bold">
								<Badge variant={getGradeBadgeVariant(reportCard.overallGrade)}>
									{reportCard.overallGrade}
								</Badge>
							</div>
						</div>
						{reportCard.rankInClass && reportCard.totalStudentsInClass && (
							<div>
								<div className="text-sm text-muted-foreground">{t("rank_in_class")}</div>
								<div className="text-2xl font-bold">
									{reportCard.rankInClass} / {reportCard.totalStudentsInClass}
								</div>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Subject Results */}
			<Card>
				<CardHeader>
					<CardTitle>{t("subject_results")}</CardTitle>
					<CardDescription>
						{t("total_subjects")}: {reportCard.totalSubjects}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>{t("subject")}</TableHead>
								<TableHead className="text-right">{t("quiz_homework")}</TableHead>
								<TableHead className="text-right">{t("midterm")}</TableHead>
								<TableHead className="text-right">{t("final_exam")}</TableHead>
								<TableHead className="text-right">{t("subject_average")}</TableHead>
								<TableHead className="text-center">{t("grade")}</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{reportCard.subjects.map((subject) => (
								<TableRow key={subject.subjectId}>
									<TableCell className="font-medium">{subject.subjectName}</TableCell>
									<TableCell className="text-right">
										{subject.quizAverage?.toFixed(1) || "—"}
									</TableCell>
									<TableCell className="text-right">
										{subject.midtermScore?.toFixed(1) || "—"}
									</TableCell>
									<TableCell className="text-right">
										{subject.finalScore?.toFixed(1) || "—"}
									</TableCell>
									<TableCell className="text-right font-semibold">
										{subject.subjectAverage.toFixed(1)}%
									</TableCell>
									<TableCell className="text-center">
										<Badge variant={getGradeBadgeVariant(subject.grade)}>{subject.grade}</Badge>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</CardContent>
			</Card>

			{/* Remarks */}
			{reportCard.remarks && (
				<Card>
					<CardHeader>
						<CardTitle>{t("remarks")}</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="text-sm">{reportCard.remarks}</p>
					</CardContent>
				</Card>
			)}

			{/* MoEYS Grading Scale Reference */}
			<Card>
				<CardHeader>
					<CardTitle className="text-sm">{t("moeys_grading_scale")}</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-1 text-xs text-muted-foreground">
						<div>{t("grade_a")}</div>
						<div>{t("grade_b")}</div>
						<div>{t("grade_c")}</div>
						<div>{t("grade_d")}</div>
						<div>{t("grade_f")}</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
