"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, BookOpen, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { SubjectsTable } from "@/components/academic/subjects-table";
import { SubjectForm } from "@/components/academic/subject-form";
import { useDashboard } from "@/hooks/useDashboard";
import { useSubjects } from "@/hooks/useSubjects";
import {
	Subject,
	Status,
	SubjectFilterInput,
	SubjectSortInput,
} from "@/types/academic";

const PAGE_SIZE = 10;

function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}

export default function SubjectsPage() {
	const { t } = useTranslation();
	const { currentSchool, isLoading: isDashboardLoading } = useDashboard();
	const schoolId = currentSchool?.idStr || currentSchool?.id || null;

	// Modal states
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Subjects state
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<Status | "">("");
	const [categoryFilter, setCategoryFilter] = useState("");
	const [sort, setSort] = useState<SubjectSortInput>({
		sortBy: "subjectName",
		sortOrder: "asc",
	});

	const debouncedSearch = useDebounce(search, 300);

	const filter = useMemo<SubjectFilterInput | undefined>(() => {
		const f: SubjectFilterInput = {};
		if (debouncedSearch) f.search = debouncedSearch;
		if (statusFilter) f.status = statusFilter;
		if (categoryFilter) f.subjectCategory = categoryFilter;
		return Object.keys(f).length > 0 ? f : undefined;
	}, [debouncedSearch, statusFilter, categoryFilter]);

	const {
		subjects,
		total,
		totalPages,
		isLoading,
		error,
		createSubject,
		updateSubject,
		deleteSubject,
		refresh,
	} = useSubjects({
		schoolId,
		page,
		pageSize: PAGE_SIZE,
		filter,
		sort,
	});

	useEffect(() => {
		setPage(1);
	}, [debouncedSearch, statusFilter, categoryFilter]);

	// Handlers
	const handleAdd = () => {
		setSelectedSubject(null);
		setIsAddModalOpen(true);
	};

	const handleEdit = (sub: Subject) => {
		setSelectedSubject(sub);
		setIsEditModalOpen(true);
	};

	const handleDelete = (sub: Subject) => {
		setSelectedSubject(sub);
		setDeleteDialogOpen(true);
	};

	const confirmDelete = async () => {
		if (!selectedSubject) return;
		setIsSubmitting(true);
		try {
			await deleteSubject(selectedSubject.id);
		} catch (error) {
			console.error(
				t("error"),
				error instanceof Error ? error.message : t("delete_failed")
			);
		} finally {
			setIsSubmitting(false);
			setDeleteDialogOpen(false);
			setSelectedSubject(null);
		}
	};

	const handleFormSuccess = async (data: any) => {
		if (!schoolId) return;
		setIsSubmitting(true);
		try {
			if (isEditModalOpen && selectedSubject) {
				await updateSubject(selectedSubject.id, data);
			} else {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { status, ...createData } = data;
				await createSubject({ ...createData, schoolId });
			}
			setIsAddModalOpen(false);
			setIsEditModalOpen(false);
		} catch (error) {
			console.error(
				t("error"),
				error instanceof Error ? error.message : t("save_failed")
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Render
	if (isDashboardLoading) {
		return (
			<div className="min-h-[60vh] flex items-center justify-center">
				<div className="text-center space-y-3">
					<div className="h-8 w-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin mx-auto" />
					<p className="text-sm text-muted-foreground">{t("loading") || "Loading..."}</p>
				</div>
			</div>
		);
	}

	if (!schoolId) {
		return (
			<div className="min-h-[60vh] flex items-center justify-center">
				<div className="text-center space-y-3">
					<div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center mx-auto">
						<AlertCircle className="h-5 w-5 text-amber-500" />
					</div>
					<p className="text-sm text-muted-foreground">
						{t("no_school_selected")}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6 pb-10">
			<PageHeader
				title={t("subjects")}
				subtitle={t("manage_subjects")}
				icon={BookOpen}
			>
				<Button onClick={handleAdd} size="sm" className="gap-2">
					<Plus className="h-4 w-4" />
					{t("add_subject")}
				</Button>
			</PageHeader>

			{error ? (
				<div className="min-h-[40vh] flex items-center justify-center">
					<div className="text-center space-y-3">
						<p className="text-sm text-destructive">{error}</p>
						<Button variant="outline" size="sm" onClick={() => refresh()}>
							{t("retry")}
						</Button>
					</div>
				</div>
			) : (
				<SubjectsTable
					categoryFilter={categoryFilter}
					isLoading={isLoading}
					page={page}
					pageSize={PAGE_SIZE}
					search={search}
					sort={sort}
					statusFilter={statusFilter}
					subjects={subjects}
					total={total}
					totalPages={totalPages}
					onCategoryFilterChange={setCategoryFilter}
					onDelete={handleDelete}
					onEdit={handleEdit}
					onPageChange={setPage}
					onSearchChange={setSearch}
					onSortChange={setSort}
					onStatusFilterChange={setStatusFilter}
				/>
			)}

			{/* Add/Edit Modal */}
			<Dialog
				open={isAddModalOpen || isEditModalOpen}
				onOpenChange={() => {
					setIsAddModalOpen(false);
					setIsEditModalOpen(false);
				}}
			>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							{isEditModalOpen ? t("edit_subject") : t("add_subject")}
						</DialogTitle>
					</DialogHeader>
					<SubjectForm
						initialData={selectedSubject}
						onCancel={() => {
							setIsAddModalOpen(false);
							setIsEditModalOpen(false);
						}}
						onSuccess={handleFormSuccess}
					/>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation */}
			<DeleteConfirmDialog
				open={deleteDialogOpen}
				onOpenChange={setDeleteDialogOpen}
				title={t("confirm_delete") || "Confirm Delete"}
				description={t("delete_subject_confirmation", {
					name: selectedSubject?.subjectName,
				})}
				onConfirm={confirmDelete}
				isLoading={isSubmitting}
				cancelLabel={t("cancel") || "Cancel"}
				confirmLabel={t("delete") || "Delete"}
			/>
		</div>
	);
}
