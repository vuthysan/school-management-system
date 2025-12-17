// Academic Types matching backend GraphQL schema

export type Status = "Active" | "Inactive" | "Archived";

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
	credits: number;
	department?: string;
	status: Status;
	createdAt: string;
	updatedAt: string;
}

export interface SubjectFilterInput {
	search?: string;
	status?: Status;
	department?: string;
	gradeLevel?: string;
	branchId?: string;
}

export interface SubjectSortInput {
	sortBy?: "subjectName" | "subjectCode" | "credits" | "createdAt";
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
	credits?: number;
	department?: string;
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
