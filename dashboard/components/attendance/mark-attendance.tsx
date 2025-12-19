"use client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, Users } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
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

interface MarkAttendanceProps {
	classes: Class[];
	isClassesLoading: boolean;
	selectedClassId: string | null;
	selectedDate: string;
	onClassChange: (classId: string | null) => void;
	onDateChange: (date: string) => void;
}

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

	// Fetch students for selected class
	const { students, isLoading: isStudentsLoading } =
		useStudentsByClass(selectedClassId);

	// Fetch existing attendance for this class/date
	const { attendance: existingAttendance, refresh: refreshAttendance } =
		useAttendanceByClass(selectedClassId, selectedDate || null);

	// Mutations
	const { markBulkAttendance } = useAttendanceMutations();

	// Pre-fill attendance data from existing records
	useEffect(() => {
		if (existingAttendance.length > 0) {
			const existing: Record<string, AttendanceStatus> = {};
			existingAttendance.forEach((record) => {
				existing[record.studentId] =
					record.status.toLowerCase() as AttendanceStatus;
			});
			setAttendanceData(existing);
		} else {
			// Default all students to present
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

	const handleDateChange = (date: string) => {
		onDateChange(date);
	};

	const handleStatusChange = (studentId: string, status: string) => {
		setAttendanceData((prev) => ({
			...prev,
			[studentId]: status as AttendanceStatus,
		}));
	};

	const handleSave = async () => {
		if (!selectedClassId || !selectedDate) return;

		setIsSaving(true);
		try {
			const records = Object.entries(attendanceData).map(
				([studentId, status]) => ({
					studentId,
					status: status.charAt(0).toUpperCase() + status.slice(1), // Capitalize
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
		<div className="flex flex-col gap-6">
			{/* Controls */}
			<Card className="border">
				<CardContent className="flex flex-col sm:flex-row gap-4 items-end p-6">
					<div className="space-y-2 w-full sm:max-w-xs">
						<Label>{t("select_class")}</Label>
						<Select
							value={selectedClassId || ""}
							onValueChange={handleClassChange}
							disabled={isClassesLoading}
						>
							<SelectTrigger className="h-11 rounded-lg">
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
					<div className="space-y-2 w-full sm:max-w-xs">
						<Label>{t("select_date")}</Label>
						<Input
							type="date"
							className="h-11 rounded-lg"
							value={selectedDate}
							onChange={(e) => handleDateChange(e.target.value)}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Loading State */}
			{isStudentsLoading && selectedClassId && (
				<div className="flex items-center justify-center py-12">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
				</div>
			)}

			{/* Empty State */}
			{!isStudentsLoading && selectedClassId && students.length === 0 && (
				<Card className="border">
					<CardContent className="flex flex-col items-center justify-center py-12 gap-4">
						<Users className="h-12 w-12 text-muted-foreground" />
						<p className="text-muted-foreground">{t("no_students_in_class")}</p>
					</CardContent>
				</Card>
			)}

			{/* Student List */}
			{selectedClassId && students.length > 0 && !isStudentsLoading && (
				<div className="grid grid-cols-1 gap-4">
					{students.map((student) => (
						<Card
							key={student.id}
							className="border hover:bg-muted/50 transition-colors"
						>
							<CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4">
								<div className="flex items-center gap-3 w-full sm:w-auto">
									<Avatar className="h-10 w-10">
										<AvatarImage
											alt={student.fullName}
											src={student.photoUrl}
										/>
										<AvatarFallback className="bg-primary/10 text-primary">
											{getInitials(student.fullName)}
										</AvatarFallback>
									</Avatar>
									<div className="flex flex-col">
										<span className="font-semibold">{student.fullName}</span>
										<span className="text-sm text-muted-foreground">
											{student.studentId || student.id}
										</span>
									</div>
								</div>

								<RadioGroup
									className="flex gap-4"
									value={attendanceData[student.id] || "present"}
									onValueChange={(val) => handleStatusChange(student.id, val)}
								>
									<div className="flex items-center space-x-2">
										<RadioGroupItem
											id={`${student.id}-present`}
											value="present"
										/>
										<Label
											className="text-green-600 font-medium cursor-pointer"
											htmlFor={`${student.id}-present`}
										>
											P
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<RadioGroupItem
											id={`${student.id}-absent`}
											value="absent"
										/>
										<Label
											className="text-red-600 font-medium cursor-pointer"
											htmlFor={`${student.id}-absent`}
										>
											A
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<RadioGroupItem id={`${student.id}-late`} value="late" />
										<Label
											className="text-yellow-600 font-medium cursor-pointer"
											htmlFor={`${student.id}-late`}
										>
											L
										</Label>
									</div>
									<div className="flex items-center space-x-2">
										<RadioGroupItem
											id={`${student.id}-excused`}
											value="excused"
										/>
										<Label
											className="text-primary font-medium cursor-pointer"
											htmlFor={`${student.id}-excused`}
										>
											E
										</Label>
									</div>
								</RadioGroup>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Save Button */}
			{selectedClassId && students.length > 0 && (
				<div className="flex justify-end sticky bottom-6 z-20">
					<Button
						className="shadow-lg shadow-primary/20 rounded-lg px-8 h-12"
						disabled={isSaving}
						size="lg"
						onClick={handleSave}
					>
						{isSaving ? (
							<Loader2 className="mr-2 h-5 w-5 animate-spin" />
						) : (
							<Save className="mr-2 h-5 w-5" />
						)}
						{t("save_attendance")}
					</Button>
				</div>
			)}
		</div>
	);
};
