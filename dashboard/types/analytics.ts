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

export interface MonthlyCollection {
	month: string;
	amount: number;
}

export interface FeeCollectionSummary {
	totalExpected: number;
	totalCollected: number;
	collectionRate: number;
	outstanding: number;
	monthlyCollection: MonthlyCollection[];
}

export interface StaffStudentRatio {
	totalTeachers: number;
	totalStudents: number;
	ratio: number;
}

export interface SchoolOverviewAnalytics {
	totalStudents: number;
	totalStaff: number;
	totalClasses: number;
	attendanceRate: number;
	feeCollectionRate: number;
	staffStudentRatio: number;
}
