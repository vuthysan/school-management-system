"use client";

import { useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
	Plus,
	Loader2,
	Settings2,
	AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { useDashboard } from "@/hooks/useDashboard";
import {
	useAcademicYears,
	AcademicYear,
	CreateAcademicYearInput,
	UpdateAcademicYearInput,
	useCreateAcademicYear,
	useUpdateAcademicYear,
	useDeleteAcademicYear,
	useSetCurrentAcademicYear,
} from "@/hooks/useAcademicYears";
import {
	useTerms,
	Term,
	CreateTermInput,
	UpdateTermInput,
	useCreateTerm,
	useUpdateTerm,
	useDeleteTerm,
} from "@/hooks/useTerms";
import { AcademicYearsTable } from "@/components/setup/academic-years-table";
import { AcademicYearForm } from "@/components/setup/academic-year-form";
import { TermsTable } from "@/components/setup/terms-table";
import { TermForm } from "@/components/setup/term-form";

export default function SetupPage() {
	const { t } = useTranslation();
	const router = useRouter();
	const searchParams = useSearchParams();
	const { currentSchool, isLoading: isDashboardLoading } = useDashboard();
	const schoolId = currentSchool?.idStr || currentSchool?.id || null;

	const validTabs = ["academic-years", "terms"] as const;
	type TabValue = (typeof validTabs)[number];
	const tabParam = searchParams.get("tab") as TabValue | null;
	const activeTab: TabValue = tabParam && validTabs.includes(tabParam) ? tabParam : "academic-years";

	const setActiveTab = useCallback((tab: string) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("tab", tab);
		router.replace(`?${params.toString()}`, { scroll: false });
	}, [searchParams, router]);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const [selectedYear, setSelectedYear] = useState<AcademicYear | null>(null);
	const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const {
		academicYears,
		loading: isYearsLoading,
		error: yearsError,
		refetch: refreshYears,
	} = useAcademicYears(schoolId as string);

	const {
		terms,
		loading: isTermsLoading,
		error: termsError,
		refetch: refreshTerms,
	} = useTerms(schoolId as string);

	const { createAcademicYear } = useCreateAcademicYear();
	const { updateAcademicYear } = useUpdateAcademicYear();
	const { deleteAcademicYear } = useDeleteAcademicYear();
	const { setCurrentAcademicYear } = useSetCurrentAcademicYear();

	const { createTerm } = useCreateTerm();
	const { updateTerm } = useUpdateTerm();
	const { deleteTerm } = useDeleteTerm();

	const handleAddNew = () => {
		setSelectedYear(null);
		setSelectedTerm(null);
		setIsAddModalOpen(true);
	};

	const handleEditYear = (item: AcademicYear) => {
		setSelectedYear(item);
		setIsEditModalOpen(true);
	};
	const handleEditTerm = (item: Term) => {
		setSelectedTerm(item);
		setIsEditModalOpen(true);
	};
	const handleDeleteYear = (item: AcademicYear) => {
		setSelectedYear(item);
		setIsDeleteDialogOpen(true);
	};
	const handleDeleteTerm = (item: Term) => {
		setSelectedTerm(item);
		setIsDeleteDialogOpen(true);
	};

	const handleSetCurrentYear = async (id: string) => {
		try {
			await setCurrentAcademicYear(id);
			refreshYears();
		} catch (err) {
			console.error("Failed to set current year", err);
		}
	};

	const onConfirmDelete = async () => {
		if (!schoolId) return;
		setIsSubmitting(true);
		try {
			if (activeTab === "academic-years" && selectedYear) {
				await deleteAcademicYear(selectedYear.idStr);
				refreshYears();
			} else if (activeTab === "terms" && selectedTerm) {
				await deleteTerm(selectedTerm.idStr);
				refreshTerms();
			}
			setIsDeleteDialogOpen(false);
		} catch (err) {
			console.error("Delete failed", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const onYearFormSuccess = async (values: any) => {
		if (!schoolId) return;
		try {
			const formattedValues = {
				...values,
				startDate: new Date(values.startDate).toISOString(),
				endDate: new Date(values.endDate).toISOString(),
			};
			if (selectedYear) {
				await updateAcademicYear(selectedYear.idStr, formattedValues as UpdateAcademicYearInput);
			} else {
				await createAcademicYear({ ...formattedValues, schoolId } as CreateAcademicYearInput);
			}
			refreshYears();
			setIsAddModalOpen(false);
			setIsEditModalOpen(false);
		} catch (err) {
			console.error("Save failed", err);
		}
	};

	const onTermFormSuccess = async (values: any) => {
		if (!schoolId) return;
		try {
			const formattedValues = {
				...values,
				startDate: new Date(values.startDate).toISOString(),
				endDate: new Date(values.endDate).toISOString(),
			};
			if (selectedTerm) {
				await updateTerm(selectedTerm.idStr, formattedValues as UpdateTermInput);
			} else {
				await createTerm({ ...formattedValues, schoolId } as CreateTermInput);
			}
			refreshTerms();
			setIsAddModalOpen(false);
			setIsEditModalOpen(false);
		} catch (err) {
			console.error("Save failed", err);
		}
	};

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
					<p className="text-sm text-muted-foreground">{t("no_school_selected")}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6 pb-10">
			<PageHeader
				title={t("school_setup")}
				subtitle={t("configure_foundation")}
				icon={Settings2}
			>
				<Button onClick={handleAddNew} size="sm" className="gap-2">
					<Plus className="h-4 w-4" />
					{activeTab === "academic-years"
						? t("add_academic_year")
						: t("add_term")}
				</Button>
			</PageHeader>

			<Tabs
				value={activeTab}
				onValueChange={(v) => setActiveTab(v as any)}
			>
				<TabsList>
					<TabsTrigger value="academic-years">
						{t("academic_years")}
					</TabsTrigger>
					<TabsTrigger value="terms">
						{t("terms")}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="academic-years">
					{yearsError ? (
						<div className="min-h-[40vh] flex items-center justify-center">
							<div className="text-center space-y-3">
								<p className="text-sm text-destructive">{yearsError}</p>
								<Button variant="outline" size="sm" onClick={refreshYears}>{t("retry")}</Button>
							</div>
						</div>
					) : (
						<AcademicYearsTable
							items={academicYears}
							isLoading={isYearsLoading}
							onEdit={handleEditYear}
							onDelete={handleDeleteYear}
							onSetCurrent={handleSetCurrentYear}
						/>
					)}
				</TabsContent>

				<TabsContent value="terms">
					{termsError ? (
						<div className="min-h-[40vh] flex items-center justify-center">
							<div className="text-center space-y-3">
								<p className="text-sm text-destructive">{termsError}</p>
								<Button variant="outline" size="sm" onClick={refreshTerms}>{t("retry")}</Button>
							</div>
						</div>
					) : (
						<TermsTable
							items={terms}
							academicYears={academicYears}
							isLoading={isTermsLoading}
							onEdit={handleEditTerm}
							onDelete={handleDeleteTerm}
						/>
					)}
				</TabsContent>
			</Tabs>

			{/* Forms Modal */}
			<Dialog
				open={isAddModalOpen || isEditModalOpen}
				onOpenChange={(open) => {
					if (!open) {
						setIsAddModalOpen(false);
						setIsEditModalOpen(false);
					}
				}}
			>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							{isEditModalOpen ? t("edit") : t("add_new")}{" "}
							{activeTab === "academic-years"
								? t("academic_year")
								: t("term")}
						</DialogTitle>
						<DialogDescription>{t("fill_form_details")}</DialogDescription>
					</DialogHeader>
					{activeTab === "academic-years" ? (
						<AcademicYearForm
							initialData={selectedYear}
							onSuccess={onYearFormSuccess}
							onCancel={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
						/>
					) : (
						<TermForm
							initialData={selectedTerm}
							academicYears={academicYears}
							onSuccess={onTermFormSuccess}
							onCancel={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
						/>
					)}
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation */}
			<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>{t("confirm_delete")}</DialogTitle>
						<DialogDescription>{t("delete_item_warning")}</DialogDescription>
					</DialogHeader>
					<DialogFooter className="gap-2">
						<Button variant="ghost" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
							{t("cancel")}
						</Button>
						<Button variant="destructive" onClick={onConfirmDelete} disabled={isSubmitting}>
							{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
							{t("delete")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
