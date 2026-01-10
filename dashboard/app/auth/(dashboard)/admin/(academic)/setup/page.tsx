"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
	Plus,
	Loader2,
	Calendar,
	Layers,
	Settings2,
	AlertTriangle,
	LayoutGrid,
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
import { Card } from "@/components/ui/card";
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
import {
	useCalendarEvents,
	CalendarEvent,
	CreateCalendarEventInput,
	UpdateCalendarEventInput,
	useCreateCalendarEvent,
	useUpdateCalendarEvent,
	useDeleteCalendarEvent,
} from "@/hooks/useCalendarEvents";
import { AcademicYearsTable } from "@/components/setup/academic-years-table";
import { AcademicYearForm } from "@/components/setup/academic-year-form";
import { TermsTable } from "@/components/setup/terms-table";
import { TermForm } from "@/components/setup/term-form";
import { CalendarEventsTable } from "@/components/setup/calendar-events-table";
import { CalendarEventForm } from "@/components/setup/calendar-event-form";

export default function SetupPage() {
	const { t } = useTranslation();
	const { currentSchool, isLoading: isDashboardLoading } = useDashboard();
	const schoolId = currentSchool?.idStr || currentSchool?.id || null;

	const [activeTab, setActiveTab] = useState<
		"academic-years" | "terms" | "calendar"
	>("academic-years");
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

	const [selectedYear, setSelectedYear] = useState<AcademicYear | null>(null);
	const [selectedTerm, setSelectedTerm] = useState<Term | null>(null);
	const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
		null
	);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Data Hooks
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

	const {
		calendarEvents,
		loading: isCalendarLoading,
		error: calendarError,
		refetch: refreshCalendar,
	} = useCalendarEvents(schoolId as string);

	const { createAcademicYear } = useCreateAcademicYear();
	const { updateAcademicYear } = useUpdateAcademicYear();
	const { deleteAcademicYear } = useDeleteAcademicYear();
	const { setCurrentAcademicYear } = useSetCurrentAcademicYear();

	const { createTerm } = useCreateTerm();
	const { updateTerm } = useUpdateTerm();
	const { deleteTerm } = useDeleteTerm();

	const { createCalendarEvent } = useCreateCalendarEvent();
	const { updateCalendarEvent } = useUpdateCalendarEvent();
	const { deleteCalendarEvent } = useDeleteCalendarEvent();

	// Handlers
	const handleAddNew = () => {
		setSelectedYear(null);
		setSelectedTerm(null);
		setSelectedEvent(null);
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

	const handleEditEvent = (item: CalendarEvent) => {
		setSelectedEvent(item);
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

	const handleDeleteEvent = (item: CalendarEvent) => {
		setSelectedEvent(item);
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
			} else if (activeTab === "calendar" && selectedEvent) {
				await deleteCalendarEvent(selectedEvent.idStr);
				refreshCalendar();
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
				await updateAcademicYear(
					selectedYear.idStr,
					formattedValues as UpdateAcademicYearInput
				);
			} else {
				await createAcademicYear({
					...formattedValues,
					schoolId,
				} as CreateAcademicYearInput);
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
				await updateTerm(
					selectedTerm.idStr,
					formattedValues as UpdateTermInput
				);
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

	const onEventFormSuccess = async (values: any) => {
		if (!schoolId) return;
		try {
			const formattedValues = {
				...values,
				startDate: new Date(values.startDate).toISOString(),
				endDate: new Date(values.endDate).toISOString(),
			};

			if (selectedEvent) {
				await updateCalendarEvent(
					selectedEvent.idStr,
					formattedValues as UpdateCalendarEventInput
				);
			} else {
				await createCalendarEvent({
					...formattedValues,
					schoolId,
				} as CreateCalendarEventInput);
			}
			refreshCalendar();
			setIsAddModalOpen(false);
			setIsEditModalOpen(false);
		} catch (err) {
			console.error("Event save failed", err);
		}
	};

	if (isDashboardLoading) {
		return (
			<div className="flex items-center justify-center h-full min-h-[400px]">
				<Loader2 className="h-10 w-10 animate-spin text-primary/40" />
			</div>
		);
	}

	if (!schoolId) {
		return (
			<Card className="m-6 p-12 flex flex-col items-center justify-center text-center gap-4 bg-muted/20 border-dashed">
				<AlertTriangle className="h-12 w-12 text-amber-500/50" />
				<h2 className="text-xl font-bold">{t("no_school_selected")}</h2>
				<p className="text-muted-foreground">{t("please_select_school")}</p>
			</Card>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className="p-6 space-y-8 max-w-7xl mx-auto"
		>
			{/* Header */}
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<div className="p-3 rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
						<Settings2 className="h-8 w-8" />
					</div>
					<div>
						<h1 className="text-3xl font-extrabold tracking-tight">
							{t("school_setup")}
						</h1>
						<p className="text-muted-foreground font-medium">
							{t("configure_foundation")}
						</p>
					</div>
				</div>

				<Button
					onClick={handleAddNew}
					className="h-12 px-6 rounded-xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] gap-2"
				>
					<Plus className="h-5 w-5" />
					{activeTab === "academic-years"
						? t("add_academic_year")
						: activeTab === "terms"
							? t("add_term")
							: t("add_event")}
				</Button>
			</div>

			{/* Main Tabs */}
			<Tabs
				value={activeTab}
				onValueChange={(v) => setActiveTab(v as any)}
				className="space-y-6"
			>
				<TabsList className="bg-muted/50 p-1.5 h-auto rounded-2xl border w-fit">
					<TabsTrigger
						value="academic-years"
						className="rounded-xl px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2"
					>
						<Calendar className="h-4 w-4" />
						{t("academic_years")}
					</TabsTrigger>
					<TabsTrigger
						value="terms"
						className="rounded-xl px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2"
					>
						<Layers className="h-4 w-4" />
						{t("terms")}
					</TabsTrigger>
					<TabsTrigger
						value="calendar"
						className="rounded-xl px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2"
					>
						<LayoutGrid className="h-4 w-4" />
						{t("calendar_events")}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="academic-years" className="space-y-4 outline-none">
					{yearsError && (
						<div className="p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 flex items-center justify-between">
							<span>{yearsError}</span>
							<Button size="sm" variant="outline" onClick={refreshYears}>
								{t("retry")}
							</Button>
						</div>
					)}
					<AcademicYearsTable
						items={academicYears}
						isLoading={isYearsLoading}
						onEdit={handleEditYear}
						onDelete={handleDeleteYear}
						onSetCurrent={handleSetCurrentYear}
					/>
				</TabsContent>

				<TabsContent value="terms" className="space-y-4 outline-none">
					{termsError && (
						<div className="p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 flex items-center justify-between">
							<span>{termsError}</span>
							<Button size="sm" variant="outline" onClick={refreshTerms}>
								{t("retry")}
							</Button>
						</div>
					)}
					<TermsTable
						items={terms}
						academicYears={academicYears}
						isLoading={isTermsLoading}
						onEdit={handleEditTerm}
						onDelete={handleDeleteTerm}
					/>
				</TabsContent>

				<TabsContent value="calendar" className="space-y-4 outline-none">
					{calendarError && (
						<div className="p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 flex items-center justify-between">
							<span>{calendarError}</span>
							<Button size="sm" variant="outline" onClick={refreshCalendar}>
								{t("retry")}
							</Button>
						</div>
					)}
					<CalendarEventsTable
						items={calendarEvents}
						isLoading={isCalendarLoading}
						onEdit={handleEditEvent}
						onDelete={handleDeleteEvent}
					/>
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
				<DialogContent className="sm:max-w-[600px] rounded-2xl p-0 overflow-hidden outline-none">
					<div className="p-6 bg-muted/30 border-b">
						<DialogHeader>
							<DialogTitle className="text-2xl font-bold">
								{isEditModalOpen ? t("edit") : t("add_new")}{" "}
								{activeTab === "academic-years"
									? t("academic_year")
									: activeTab === "terms"
										? t("term")
										: t("event")}
							</DialogTitle>
							<DialogDescription>{t("fill_form_details")}</DialogDescription>
						</DialogHeader>
					</div>
					<div className="p-6">
						{activeTab === "academic-years" ? (
							<AcademicYearForm
								initialData={selectedYear}
								onSuccess={onYearFormSuccess}
								onCancel={() => {
									setIsAddModalOpen(false);
									setIsEditModalOpen(false);
								}}
							/>
						) : activeTab === "terms" ? (
							<TermForm
								initialData={selectedTerm}
								academicYears={academicYears}
								onSuccess={onTermFormSuccess}
								onCancel={() => {
									setIsAddModalOpen(false);
									setIsEditModalOpen(false);
								}}
							/>
						) : (
							<CalendarEventForm
								initialData={selectedEvent}
								onSuccess={onEventFormSuccess}
								onCancel={() => {
									setIsAddModalOpen(false);
									setIsEditModalOpen(false);
								}}
							/>
						)}
					</div>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation */}
			<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<DialogContent className="rounded-2xl">
					<DialogHeader>
						<DialogTitle>{t("confirm_delete")}</DialogTitle>
						<DialogDescription>{t("delete_item_warning")}</DialogDescription>
					</DialogHeader>
					<DialogFooter className="gap-2">
						<Button
							variant="outline"
							onClick={() => setIsDeleteDialogOpen(false)}
							disabled={isSubmitting}
						>
							{t("cancel")}
						</Button>
						<Button
							variant="destructive"
							onClick={onConfirmDelete}
							disabled={isSubmitting}
						>
							{isSubmitting && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							{t("delete")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</motion.div>
	);
}
