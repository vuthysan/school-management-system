export type AssessmentType = "exam" | "quiz" | "assignment" | "project";

export interface GradeRecord {
  id: string;
  studentId: string;
  studentName: string;
  subjectId: string;
  subjectName: string;
  assessmentType: AssessmentType;
  score: number;
  maxScore: number;
  weight: number; // Percentage weight of this assessment
  date: string;
  remarks?: string;
}

export interface SubjectGrade {
  subjectId: string;
  subjectName: string;
  score: number; // Final score (0-100)
  grade: string; // A, B, C, etc.
  credits: number;
}

export interface StudentReport {
  studentId: string;
  studentName: string;
  className: string;
  academicYear: string;
  gpa: number;
  totalCredits: number;
  grades: SubjectGrade[];
}

export interface GradingStats {
  averageGpa: number;
  passRate: number;
  topPerformers: number;
  totalAssessments: number;
}
