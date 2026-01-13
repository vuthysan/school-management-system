"use client";

import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useExams } from "@/hooks/useExams";
import { useClasses } from "@/hooks/useClasses";
import { useSubjects } from "@/hooks/useSubjects";
import { ExamsTable } from "@/components/academic/exams-table";
import { ExamForm } from "@/components/academic/exam-form";
import { Button } from "@/components/ui/button";
import { Plus, Search, Calendar as CalendarIcon, Filter } from "lucide-react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ExamSchedule, ExamScheduleFormData } from "@/types/academic";
import { motion } from "framer-motion";

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

	const { classes, isLoading: classesLoading } = useClasses({
		schoolId,
		pageSize: 1000,
	});
	const { subjects, isLoading: subjectsLoading } = useSubjects({
		schoolId,
		pageSize: 1000,
	});

	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedExam, setSelectedExam] = useState<ExamSchedule | null>(null);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
		try {
			await deleteExam(selectedExam.id);
			setDeleteDialogOpen(false);
			setSelectedExam(null);
		} catch (error) {
			console.error("Failed to delete exam", error);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="p-6 space-y-6"
		>
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">
						{t("exam_management") || "Exam Management"}
					</h1>
					<p className="text-muted-foreground">
						{t("manage_exam_schedules_desc") ||
							"Schedule and manage class assessments"}
					</p>
				</div>
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
			</div>

			<div className="flex flex-col md:flex-row gap-4">
				<div className="relative flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder={t("search_exams") || "Search exams..."}
						className="pl-10"
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
					/>
				</div>
				<Button variant="outline" className="gap-2">
					<Filter className="h-4 w-4" />
					{t("filters")}
				</Button>
			</div>

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
			<Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{t("confirm_delete")}</DialogTitle>
						<DialogDescription>
							{t("delete_exam_confirmation", { name: selectedExam?.name }) ||
								`Are you sure you want to delete "${selectedExam?.name}"?`}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeleteDialogOpen(false)}
						>
							{t("cancel")}
						</Button>
						<Button variant="destructive" onClick={handleDelete}>
							{t("delete")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</motion.div>
	);
}
