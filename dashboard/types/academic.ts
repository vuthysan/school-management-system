export type ClassStatus = "active" | "inactive" | "archived";
export type SubjectStatus = "active" | "inactive" | "archived";

export interface Class {
  id: string;
  name: string;
  gradeLevel: string;
  section: string;
  teacherId: string; // In a real app, this would link to a Teacher entity
  teacherName: string; // Mock data for display
  room: string;
  capacity: number;
  enrolledCount: number;
  status: ClassStatus;
  academicYear: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
  description: string;
  credits: number;
  department: string;
  status: SubjectStatus;
}

export interface ClassFormData {
  name: string;
  gradeLevel: string;
  section: string;
  teacherName: string;
  room: string;
  capacity: number;
  status: ClassStatus;
  academicYear: string;
}

export interface SubjectFormData {
  name: string;
  code: string;
  description: string;
  credits: number;
  department: string;
  status: SubjectStatus;
}
