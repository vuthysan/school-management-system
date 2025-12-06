export type AttendanceStatus = "present" | "absent" | "late" | "excused";

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remarks?: string;
}

export interface DailyAttendance {
  id: string;
  classId: string;
  className: string;
  date: string;
  records: AttendanceRecord[];
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalExcused: number;
}

export interface AttendanceStats {
  attendanceRate: number;
  totalPresent: number;
  totalAbsent: number;
  totalLate: number;
  totalExcused: number;
}
