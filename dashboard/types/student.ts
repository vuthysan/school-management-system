export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  phone: string;
  address: string;
  gradeLevel: string;
  guardianName: string;
  guardianPhone: string;
  enrollmentDate?: string;
  status?: "active" | "inactive" | "graduated";
}

export interface StudentFormData {
  firstName: string;
  lastName: string;
  email: string;
  dob: string;
  gender: "male" | "female" | "other";
  phone: string;
  address: string;
  gradeLevel: string;
  guardianName: string;
  guardianPhone: string;
}

export interface StudentFilters {
  gradeLevel: string;
  gender: string;
}

export type SortDescriptor = {
  column: string;
  direction: "ascending" | "descending";
};
