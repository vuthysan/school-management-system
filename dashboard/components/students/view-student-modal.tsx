"use client";

import React from "react";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/contexts/language-context";
import { Student, DateOfBirth } from "@/types/student";
import { cn } from "@/lib/utils";

interface ViewStudentModalProps {
	isOpen: boolean;
	onClose: () => void;
	student: Student | null;
}

export const ViewStudentModal: React.FC<ViewStudentModalProps> = ({
	isOpen,
	onClose,
	student,
}) => {
	const { t } = useLanguage();

	if (!student) return null;

	const formatDOB = (dob?: DateOfBirth): string => {
		if (!dob) return "-";
		const month = dob.month.toString().padStart(2, "0");
		const day = dob.day.toString().padStart(2, "0");
		return `${dob.year}-${month}-${day}`;
	};

	const InfoRow = ({
		label,
		value,
		fullWidth = false,
	}: {
		label: string;
		value: string;
		fullWidth?: boolean;
	}) => (
		<div
			className={cn(
				"flex flex-col sm:flex-row sm:justify-between py-3 px-4 rounded-lg bg-card border border-transparent hover:border-border/50 transition-colors gap-1 sm:gap-4",
				fullWidth ? "sm:col-span-2" : ""
			)}
		>
			<span className="text-sm text-muted-foreground font-medium shrink-0">
				{label}:
			</span>
			<span className="text-sm text-foreground font-semibold break-words sm:text-right">
				{value}
			</span>
		</div>
	);

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-2xl w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto p-0 rounded-lg">
				<div className="p-6">
					<DialogHeader className="mb-6">
						<DialogTitle className="text-2xl font-black tracking-tight">
							{t("student_details")}
						</DialogTitle>
						<DialogDescription className="text-base font-medium text-muted-foreground">
							{student.fullName ||
								`${student.firstNameKm} ${student.lastNameKm}`}
						</DialogDescription>
					</DialogHeader>

					<div className="space-y-8">
						{/* Personal Information */}
						<section>
							<div className="flex items-center gap-2 mb-4">
								<div className="w-1.5 h-6 bg-primary rounded-full" />
								<h3 className="text-lg font-bold tracking-tight">
									{t("personal_info")}
								</h3>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<InfoRow
									label={t("first_name_km")}
									value={`${student.firstNameKm} ${
										student.firstNameEn ? `(${student.firstNameEn})` : ""
									}`}
								/>
								<InfoRow
									label={t("last_name_km")}
									value={`${student.lastNameKm} ${
										student.lastNameEn ? `(${student.lastNameEn})` : ""
									}`}
								/>
								<InfoRow
									label={t("student_id")}
									value={student.studentId || "-"}
								/>
								<InfoRow
									label={t("national_id")}
									value={student.nationalId || "-"}
								/>
								<InfoRow
									label={t("email")}
									value={student.contact?.email || "-"}
									fullWidth
								/>
								<InfoRow
									label={t("phone")}
									value={student.contact?.phone || "-"}
								/>
								<InfoRow
									label={t("gender")}
									value={t(student.gender.toLowerCase() || "other")}
								/>
								<InfoRow
									label={t("dob")}
									value={formatDOB(student.dateOfBirth)}
								/>
								<InfoRow
									label={t("nationality")}
									value={student.nationality || "-"}
								/>
								<InfoRow
									label={t("address")}
									value={student.contact?.address?.province || "-"}
									fullWidth
								/>
							</div>
						</section>

						{/* Academic Information */}
						<section>
							<div className="flex items-center gap-2 mb-4">
								<div className="w-1.5 h-6 bg-blue-500 rounded-full" />
								<h3 className="text-lg font-bold tracking-tight">
									{t("academic_info")}
								</h3>
							</div>
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
								<InfoRow
									label={t("grade_level")}
									value={student.gradeLevel || "-"}
								/>
								{student.enrollment?.enrollmentDate && (
									<InfoRow
										label={t("enrollment_date")}
										value={student.enrollment.enrollmentDate}
									/>
								)}
								{student.status && (
									<InfoRow label={t("status")} value={t(student.status)} />
								)}
							</div>
						</section>

						{/* Guardian Information */}
						<section>
							<div className="flex items-center gap-2 mb-4">
								<div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
								<h3 className="text-lg font-bold tracking-tight">
									{t("guardian_info")}
								</h3>
							</div>
							<div className="space-y-4">
								{student.guardians?.map((guardian, index) => (
									<div
										key={index}
										className="bg-card/50 border p-2 rounded-lg "
									>
										<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
											<InfoRow
												label={`${t("guardian_name")} (${t(
													guardian.relationship?.toLowerCase() || "guardian"
												)})`}
												value={guardian.name}
											/>
											<InfoRow
												label={t("guardian_phone")}
												value={guardian.phone || "-"}
											/>
										</div>
									</div>
								))}
								{(!student.guardians || student.guardians.length === 0) && (
									<p className="text-sm text-muted-foreground italic px-2">
										No guardian information available
									</p>
								)}
							</div>
						</section>
					</div>
				</div>

				<DialogFooter className="p-6 pt-0">
					<Button
						onClick={onClose}
						className="w-full text-red-600 shadow-none border border-red-200 hover:border-red-300 hover:bg-red-50 sm:w-auto cursor-pointer rounded-lg h-11 font-bold bg-red-100 px-8"
					>
						{t("close")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
