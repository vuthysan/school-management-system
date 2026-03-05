import { useState } from "react";
import { graphqlRequest } from "@/lib/graphql-client";
import { REPORT_CARD_QUERIES } from "@/app/graphql/report-card";

export interface SubjectResult {
	subjectId: string;
	subjectName: string;
	quizAverage: number | null;
	midtermScore: number | null;
	finalScore: number | null;
	subjectAverage: number;
	grade: string;
	totalAssessments: number;
}

export interface ReportCard {
	studentId: string;
	studentCode: string;
	firstNameKm: string;
	lastNameKm: string;
	firstNameEn: string | null;
	lastNameEn: string | null;
	dateOfBirth: string | null;
	gender: string;
	gradeLevel: string;
	className: string | null;
	academicYear: string;
	academicYearBe: string;
	semester: string;
	schoolName: string | null;
	subjects: SubjectResult[];
	overallAverage: number;
	overallGrade: string;
	totalSubjects: number;
	rankInClass: number | null;
	totalStudentsInClass: number | null;
	remarks: string | null;
	generatedAt: string;
}

export const useReportCard = () => {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const getStudentReportCard = async (
		studentId: string,
		academicYear: string,
		semester: string,
	): Promise<ReportCard | null> => {
		setLoading(true);
		setError(null);

		try {
			const response = await graphqlRequest(REPORT_CARD_QUERIES.GET_STUDENT_REPORT, {
				studentId,
				academicYear,
				semester,
			});

			return (response as any).reportCard as ReportCard;
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to fetch report card";
			setError(errorMessage);
			return null;
		} finally {
			setLoading(false);
		}
	};

	const getClassReportCards = async (
		classId: string,
		academicYear: string,
		semester: string,
	): Promise<ReportCard[]> => {
		setLoading(true);
		setError(null);

		try {
			const response = await graphqlRequest(REPORT_CARD_QUERIES.GET_CLASS_REPORTS, {
				classId,
				academicYear,
				semester,
			});

			return (response as any).classReportCards as ReportCard[];
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : "Failed to fetch class report cards";
			setError(errorMessage);
			return [];
		} finally {
			setLoading(false);
		}
	};

	return {
		loading,
		error,
		getStudentReportCard,
		getClassReportCards,
	};
};
