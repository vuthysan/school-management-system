export interface ClassPerformance {
	classId: string;
	className: string;
	averageScore: number;
	studentCount: number;
	[key: string]: any;
}

export interface SubjectPerformance {
	subjectId: string;
	subjectName: string;
	averageScore: number;
	[key: string]: any;
}

export interface GradeDistribution {
	grade: string;
	count: number;
	[key: string]: any;
}

export interface PerformanceAnalytics {
	classPerformances: ClassPerformance[];
	subjectPerformances: SubjectPerformance[];
	gradeDistribution: GradeDistribution[];
}

export interface AttendanceTrend {
	date: string;
	attendanceRate: number;
	[key: string]: any;
}

export interface AttendanceAnalytics {
	weeklyTrends: AttendanceTrend[];
	monthlyTrends: AttendanceTrend[];
	averageRate: number;
}

export interface StudentProgress {
	studentId: string;
	studentName: string;
	gradeAverage: number;
	attendanceRate: number;
	subjectGrades: SubjectPerformance[];
	gradeHistory: AttendanceTrend[];
}
