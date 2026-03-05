"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, Users, CalendarCheck } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/language-context";
import { useStudentsByClass } from "@/hooks/useStudents";
import {
	useAttendanceMutations,
	useAttendanceByClass,
} from "@/hooks/useAttendance";
import { useDashboard } from "@/hooks/useDashboard";
import { AttendanceStatus } from "@/types/attendance";
import { Class } from "@/types/academic";
import { cn } from "@/lib/utils";

interface MarkAttendanceProps {
	classes: Class[];
	isClassesLoading: boolean;
	selectedClassId: string | null;
	selectedDate: string;
	onClassChange: (classId: string | null) => void;
	onDateChange: (date: string) => void;
}

const STATUS_OPTIONS: { value: AttendanceStatus; label: string; color: string; activeColor: string }[] = [
	{ value: "present", label: "P", color: "text-muted-foreground border-black/6 dark:border-white/6", activeColor: "bg-emerald-500 text-white border-emerald-500" },
	{ value: "absent", label: "A", color: "text-muted-foreground border-black/6 dark:border-white/6", activeColor: "bg-rose-500 text-white border-rose-500" },
	{ value: "late", label: "L", color: "text-muted-foreground border-black/6 dark:border-white/6", activeColor: "bg-amber-500 text-white border-amber-500" },
	{ value: "excused", label: "E", color: "text-muted-foreground border-black/6 dark:border-white/6", activeColor: "bg-blue-500 text-white border-blue-500" },
];

export const MarkAttendance: React.FC<MarkAttendanceProps> = ({
	classes,
	isClassesLoading,
	selectedClassId,
	selectedDate,
	onClassChange,
	onDateChange,
}) => {
	const { t } = useLanguage();
	const { user } = useDashboard();
	const [attendanceData, setAttendanceData] = useState<
		Record<string, AttendanceStatus>
	>({});
	const [isSaving, setIsSaving] = useState(false);

	const { students, isLoading: isStudentsLoading } =
		useStudentsByClass(selectedClassId);

	const { attendance: existingAttendance, refresh: refreshAttendance } =
		useAttendanceByClass(selectedClassId, selectedDate || null);

	const { markBulkAttendance } = useAttendanceMutations();

	useEffect(() => {
		if (existingAttendance.length > 0) {
			const existing: Record<string, AttendanceStatus> = {};
			existingAttendance.forEach((record) => {
				existing[record.studentId] =
					record.status.toLowerCase() as AttendanceStatus;
			});
			setAttendanceData(existing);
		} else {
			const defaults: Record<string, AttendanceStatus> = {};
			students.forEach((student) => {
				defaults[student.id] = "present";
			});
			setAttendanceData(defaults);
		}
	}, [existingAttendance, students]);

	const handleClassChange = (classId: string) => {
		onClassChange(classId || null);
		setAttendanceData({});
	};

	const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
		setAttendanceData((prev) => ({
			...prev,
			[studentId]: status,
		}));
	};

	const handleSave = async () => {
		if (!selectedClassId || !selectedDate) return;

		setIsSaving(true);
		try {
			const records = Object.entries(attendanceData).map(
				([studentId, status]) => ({
					studentId,
					status: status.charAt(0).toUpperCase() + status.slice(1),
				})
			);

			const markedBy = user?.id || "system";
			await markBulkAttendance(
				selectedClassId,
				selectedDate,
				markedBy,
				records
			);
			await refreshAttendance();
			alert(t("attendance_saved_successfully"));
		} catch (error) {
			console.error("Failed to save attendance:", error);
			alert(t("failed_to_save_attendance"));
		} finally {
			setIsSaving(false);
		}
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase();
	};

	return (
		<div className="flex flex-col gap-4">
			{/* Controls */}
			<div className="liquid-glass-card rounded-2xl px-4 py-3">
				<div className="flex flex-col sm:flex-row gap-3 items-end">
					<div className="space-y-1.5 w-full sm:max-w-xs">
						<Label className="text-xs font-medium text-muted-foreground">{t("select_class")}</Label>
						<Select
							value={selectedClassId || ""}
							onValueChange={handleClassChange}
							disabled={isClassesLoading}
						>
							<SelectTrigger className="h-9">
								<SelectValue placeholder={t("select_class")} />
							</SelectTrigger>
							<SelectContent>
								{classes.map((cls) => (
									<SelectItem key={cls.id} value={cls.id}>
										{cls.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-1.5 w-full sm:max-w-xs">
						<Label className="text-xs font-medium text-muted-foreground">{t("select_date")}</Label>
						<Input
							type="date"
							className="h-9"
							value={selectedDate}
							onChange={(e) => onDateChange(e.target.value)}
						/>
					</div>
				</div>
			</div>

			{/* Loading State */}
			{isStudentsLoading && selectedClassId && (
				<div className="min-h-[40vh] flex items-center justify-center">
					<div className="text-center space-y-3">
						<div className="h-8 w-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin mx-auto" />
						<p className="text-sm text-muted-foreground">{t("loading") || "Loading..."}</p>
					</div>
				</div>
			)}

			{/* Empty State */}
			{!isStudentsLoading && selectedClassId && students.length === 0 && (
				<div className="min-h-[40vh] flex items-center justify-center">
					<div className="text-center space-y-3">
						<div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto">
							<Users className="h-5 w-5 text-muted-foreground" />
						</div>
						<p className="text-sm font-medium text-foreground">{t("no_students_in_class")}</p>
					</div>
				</div>
			)}

			{/* No Class Selected */}
			{!selectedClassId && (
				<div className="min-h-[40vh] flex items-center justify-center">
					<div className="text-center space-y-3">
						<div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto">
							<CalendarCheck className="h-5 w-5 text-muted-foreground" />
						</div>
						<p className="text-sm text-muted-foreground">{t("select_class_to_mark")}</p>
					</div>
				</div>
			)}

			{/* Student List */}
			{selectedClassId && students.length > 0 && !isStudentsLoading && (
				<div className="liquid-glass-card rounded-2xl overflow-hidden">
					{/* Header */}
					<div className="flex items-center justify-between px-4 py-3 border-b border-black/6 dark:border-white/6">
						<div className="flex items-center gap-3">
							<div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center">
								<Users className="w-3 h-3 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
							</div>
							<h2 className="text-sm font-semibold text-foreground">
								{t("students")}
							</h2>
							<span className="text-xs text-muted-foreground/60 tabular-nums">
								{students.length}
							</span>
						</div>
						<div className="flex items-center gap-3 text-xs text-muted-foreground">
							{STATUS_OPTIONS.map((opt) => (
								<span key={opt.value} className="flex items-center gap-1">
									<span className={cn(
										"w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold",
										opt.activeColor
									)}>
										{opt.label}
									</span>
									<span className="hidden sm:inline">{t(opt.value)}</span>
								</span>
							))}
						</div>
					</div>

					{/* Student Rows */}
					<div className="divide-y divide-black/6 dark:divide-white/6">
						{students.map((student) => (
							<div
								key={student.id}
								className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/30 transition-colors"
							>
								<div className="flex items-center gap-3">
									<Avatar className="h-8 w-8 border border-black/6 dark:border-white/6">
										<AvatarImage
											alt={student.fullName}
											src={(student as any).photoUrl || ""}
										/>
										<AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
											{getInitials(student.fullName)}
										</AvatarFallback>
									</Avatar>
									<div className="min-w-0">
										<p className="text-sm font-medium text-foreground truncate">
											{student.fullName}
										</p>
										<p className="text-xs text-muted-foreground/60 truncate">
											{student.studentId || student.id}
										</p>
									</div>
								</div>

								<div className="flex items-center gap-1.5">
									{STATUS_OPTIONS.map((opt) => (
										<button
											key={opt.value}
											type="button"
											onClick={() => handleStatusChange(student.id, opt.value)}
											className={cn(
												"w-8 h-8 rounded-lg border text-xs font-bold transition-all duration-150",
												attendanceData[student.id] === opt.value
													? opt.activeColor
													: opt.color,
												"hover:scale-105 active:scale-95"
											)}
										>
											{opt.label}
										</button>
									))}
								</div>
							</div>
						))}
					</div>

					{/* Footer with Save */}
					<div className="flex items-center justify-between px-4 py-3 border-t border-black/6 dark:border-white/6">
						<span className="text-xs text-muted-foreground">
							{students.length} {t("students")}
						</span>
						<Button
							size="sm"
							disabled={isSaving}
							onClick={handleSave}
							className="gap-2"
						>
							{isSaving ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Save className="h-4 w-4" />
							)}
							{t("save_attendance")}
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};
