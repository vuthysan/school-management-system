"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useExams } from "@/hooks/useExams";
import { useClasses } from "@/hooks/useClasses";
import { useSubjects } from "@/hooks/useSubjects";
import { ExamsTable } from "@/components/academic/exams-table";
import { ExamForm } from "@/components/academic/exam-form";
import { Button } from "@/components/ui/button";
import { Plus, ClipboardList } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { ExamSchedule, ExamScheduleFormData } from "@/types/academic";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";

export default function ExamsPage() {
	const { t } = useTranslation();
	const schoolId = "school_1"; // TODO: Get from context/auth
	const academicYearId = "year_2024"; // TODO: Get from context/auth

	const [searchTerm, setSearchTerm] = useState("");
	const [page, setPage] = useState(1);
	const [pageSize, setPageSize] = useState(100);

	const {
		exams,
		isLoading: examsLoading,
		createExam,
		updateExam,
		deleteExam,
	} = useExams({
		schoolId,
		page,
		pageSize,
		filter: searchTerm ? { search: searchTerm } : undefined,
	});

	const { classes } = useClasses({
		schoolId,
		pageSize: 1000,
	});
	const { subjects } = useSubjects({
		schoolId,
		pageSize: 1000,
	});

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedExam, setSelectedExam] = useState<ExamSchedule | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	const handleCreate = async (data: ExamScheduleFormData) => {
		try {
			await createExam(data);
			setIsModalOpen(false);
		} catch (error) {
			console.error("Failed to create exam", error);
		}
	};

	const handleUpdate = async (data: ExamScheduleFormData) => {
		if (!selectedExam) return;
		try {
			await updateExam(selectedExam.id, data);
			setIsModalOpen(false);
			setSelectedExam(null);
		} catch (error) {
			console.error("Failed to update exam", error);
		}
	};

	const handleDelete = async () => {
		if (!selectedExam) return;
		setIsDeleting(true);
		try {
			await deleteExam(selectedExam.id);
			setDeleteDialogOpen(false);
			setSelectedExam(null);
		} catch (error) {
			console.error("Failed to delete exam", error);
		} finally {
			setIsDeleting(false);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="space-y-6 pb-10"
		>
			<PageHeader
				title={t("exam_management") || "Exam Management"}
				subtitle={
					t("manage_exam_schedules_desc") ||
					"Schedule and manage class assessments"
				}
				icon={ClipboardList}
			>
				<Button
					onClick={() => {
						setSelectedExam(null);
						setIsModalOpen(true);
					}}
					className="gap-2"
				>
					<Plus className="h-4 w-4" />
					{t("add_exam") || "Add Exam"}
				</Button>
			</PageHeader>

			<SearchInput
				placeholder={t("search_exams") || "Search exams..."}
				value={searchTerm}
				onChange={setSearchTerm}
				className="max-w-md"
			/>

			<ExamsTable
				exams={exams}
				classes={classes}
				subjects={subjects}
				isLoading={examsLoading}
				onEdit={(exam) => {
					setSelectedExam(exam);
					setIsModalOpen(true);
				}}
				onDelete={(exam) => {
					setSelectedExam(exam);
					setDeleteDialogOpen(true);
				}}
			/>

			{/* Upsert Modal */}
			<Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
				<DialogContent className="max-w-2xl">
					<DialogHeader>
						<DialogTitle>
							{selectedExam
								? t("edit_exam") || "Edit Exam"
								: t("add_exam") || "Add Exam"}
						</DialogTitle>
						<DialogDescription>
							{t("enter_exam_details") ||
								"Enter the details for the examination."}
						</DialogDescription>
					</DialogHeader>
					<ExamForm
						initialData={selectedExam}
						classes={classes}
						subjects={subjects}
						schoolId={schoolId}
						academicYearId={academicYearId}
						onSubmit={selectedExam ? handleUpdate : handleCreate}
						onCancel={() => setIsModalOpen(false)}
					/>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation */}
			<DeleteConfirmDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				title={t("confirm_delete") || "Confirm Delete"}
				description={
					t("delete_exam_confirmation", { name: selectedExam?.name }) ||
					`Are you sure you want to delete "${selectedExam?.name}"?`
				}
				onConfirm={handleDelete}
				isLoading={isDeleting}
				cancelLabel={t("cancel") || "Cancel"}
				confirmLabel={t("delete") || "Delete"}
			/>
		</motion.div>
	);
}
