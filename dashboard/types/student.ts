export interface Address {
	street?: string;
	village?: string;
	commune?: string;
	district?: string;
	province: string;
	postalCode?: string;
	country?: string;
}

export interface DateOfBirth {
	day: number;
	month: number;
	year: number;
}

export interface Guardian {
	name: string;
	relationship: string;
	phone: string;
	email?: string;
	isEmergencyContact?: boolean;
	canPickup?: boolean;
}

export interface Enrollment {
	enrollmentDate: string;
	enrollmentType: string;
	entryGrade: string;
}

export interface HealthInfo {
	bloodType?: string;
	allergies?: string[];
	medicalConditions?: string[];
}

export interface ContactInfo {
	email?: string;
	phone?: string;
	address?: Address;
}

export interface Student {
	id: string;
	schoolId: string;
	studentId: string;
	nationalId?: string;
	firstNameKm: string;
	lastNameKm: string;
	firstNameEn?: string;
	lastNameEn?: string;
	dateOfBirth: DateOfBirth;
	gender: string;
	gradeLevel: string;
	status: string;
	fullName: string;
	fullNameEn?: string;
	nationality?: string;
	religion?: string;
	age?: number;
	contact?: ContactInfo;
	guardians?: Guardian[];
	enrollment?: Enrollment;
	healthInfo?: HealthInfo;
}

export interface GuardianFormData {
	name: string;
	phone: string;
	relationship?: string;
}

export interface StudentFormData {
	studentId?: string;
	nationalId?: string;
	firstNameKm: string;
	lastNameKm: string;
	firstNameEn?: string;
	lastNameEn?: string;
	email?: string;
	dob: string;
	gender: "male" | "female" | "other";
	nationality?: string;
	religion?: string;
	phone?: string;
	address: string;
	gradeLevel: string;
	currentClassId?: string;
	guardians: GuardianFormData[];
}

export interface CreateStudentInput {
	schoolId: string;
	branchId?: string;
	studentId?: string;
	nationalId?: string;
	firstNameKm: string;
	lastNameKm: string;
	firstNameEn?: string;
	lastNameEn?: string;
	dateOfBirth: DateOfBirth;
	gender: string;
	nationality?: string;
	religion?: string;
	gradeLevel: string;
	currentClassId?: string;
	contact?: ContactInfo;
	guardians?: Guardian[];
}

export interface UpdateStudentInput {
	firstNameKm?: string;
	lastNameKm?: string;
	firstNameEn?: string;
	lastNameEn?: string;
	nationalId?: string;
	dateOfBirth?: DateOfBirth;
	gender?: string;
	nationality?: string;
	religion?: string;
	gradeLevel?: string;
	currentClassId?: string;
	contact?: ContactInfo;
	guardians?: Guardian[];
	status?: string;
}

export interface StudentFilters {
	gradeLevel: string;
	gender: string;
}

export type SortDescriptor = {
	column: string;
	direction: "ascending" | "descending";
};
