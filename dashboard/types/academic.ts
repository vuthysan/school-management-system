// Academic Types matching backend GraphQL schema

export type Status = "Active" | "Inactive" | "Archived";

export type DayOfWeek =
	| "Monday"
	| "Tuesday"
	| "Wednesday"
	| "Thursday"
	| "Friday"
	| "Saturday"
	| "Sunday";

// ============================================================================
// SCHEDULE TYPES
// ============================================================================

export interface SchedulePeriod {
	periodNumber: number;
	subjectId: string;
	teacherId: string;
	startTime: string; // "08:00"
	endTime: string; // "09:00"
	room?: string;
}

export interface ClassSchedule {
	day: DayOfWeek;
	periods: SchedulePeriod[];
}

// ============================================================================
// CLASS TYPES
// ============================================================================

export interface Class {
	id: string;
	schoolId: string;
	academicYearId: string;
	name: string;
	code: string;
	gradeLevel: string;
	section?: string;
	homeroomTeacherId?: string;
	roomNumber?: string;
	capacity: number;
	currentEnrollment: number;
	schedule?: ClassSchedule[];
	status: Status;
}

export interface ClassFilterInput {
	search?: string;
	status?: Status;
	gradeLevel?: string;
	branchId?: string;
}

export interface ClassSortInput {
	sortBy?: "name" | "code" | "gradeLevel" | "createdAt" | "currentEnrollment";
	sortOrder?: "asc" | "desc";
}

export interface PaginatedClassesResult {
	items: Class[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

export interface ClassFormData {
	schoolId: string;
	academicYearId: string;
	name: string;
	code: string;
	gradeLevel: string;
	section?: string;
	homeroomTeacherId?: string;
	roomNumber?: string;
	capacity: number;
	status?: Status;
}

// ============================================================================
// SUBJECT TYPES
// ============================================================================

export interface Subject {
	id: string;
	schoolId: string;
	branchId?: string;
	subjectName: string;
	subjectCode: string;
	description: string;
	gradeLevels: string[];
	hoursPerWeek: number;
	coefficient: number;
	subjectCategory?: string;
	status: Status;
	createdAt: string;
	updatedAt: string;
}

export interface SubjectFilterInput {
	search?: string;
	status?: Status;
	subjectCategory?: string;
	gradeLevel?: string;
	branchId?: string;
}

export interface SubjectSortInput {
	sortBy?: "subjectName" | "subjectCode" | "hoursPerWeek" | "createdAt";
	sortOrder?: "asc" | "desc";
}

export interface PaginatedSubjectsResult {
	items: Subject[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

export interface SubjectFormData {
	schoolId: string;
	branchId?: string;
	subjectName: string;
	subjectCode: string;
	description?: string;
	gradeLevels?: string[];
	hoursPerWeek?: number;
	coefficient?: number;
	subjectCategory?: string;
	status?: Status;
}

// ============================================================================
// GRADE LEVEL TYPES
// ============================================================================

export interface GradeLevel {
	id: string;
	schoolId: string;
	branchId?: string;
	name: string;
	code: string;
	order: number;
	description?: string;
	status: Status;
}

export interface GradeLevelFilterInput {
	search?: string;
	status?: Status;
	branchId?: string;
}

export interface GradeLevelSortInput {
	sortBy?: "name" | "code" | "order" | "createdAt";
	sortOrder?: "asc" | "desc";
}

export interface PaginatedGradeLevelsResult {
	items: GradeLevel[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

export interface GradeLevelFormData {
	schoolId: string;
	branchId?: string;
	name: string;
	code: string;
	order: number;
	description?: string;
	status?: Status;
}

// ============================================================================
// PAGINATION TYPES
// ============================================================================

export interface PaginationState {
	page: number;
	pageSize: number;
}

export interface SortState {
	sortBy: string;
	sortOrder: "asc" | "desc";
}

// ============================================================================
// EXAM TYPES
// ============================================================================

export interface ExamSchedule {
	id: string;
	schoolId: string;
	academicYearId: string;
	termId?: string;
	name: string;
	subjectId: string;
	classId: string;
	examDate: string; // ISO date string
	startTime: string; // "08:00"
	endTime: string; // "10:30"
	room?: string;
	examinerId?: string;
	maxScore: number;
	status: Status;
	createdAt: string;
	updatedAt: string;
}

export interface ExamFilterInput {
	search?: string;
	classId?: string;
	subjectId?: string;
	status?: Status;
	startDate?: string;
	endDate?: string;
}

export interface ExamSortInput {
	sortBy?: "examDate" | "name";
	sortOrder?: "asc" | "desc";
}

export interface PaginatedExamsResult {
	items: ExamSchedule[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}

export interface ExamScheduleFormData {
	schoolId: string;
	academicYearId: string;
	termId?: string;
	name: string;
	subjectId: string;
	classId: string;
	examDate: string;
	startTime: string;
	endTime: string;
	room?: string;
	examinerId?: string;
	maxScore: number;
}
