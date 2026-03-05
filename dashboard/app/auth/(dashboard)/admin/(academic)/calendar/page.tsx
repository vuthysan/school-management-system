"use client";

import { useState, useMemo } from "react";
import {
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	format,
} from "date-fns";
import { CalendarDays } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
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
	useCalendarEventsInRange,
	useCreateCalendarEvent,
	useUpdateCalendarEvent,
	useDeleteCalendarEvent,
	useSeedCambodianHolidays,
	CalendarEvent,
	CalendarEventType,
	CreateCalendarEventInput,
	UpdateCalendarEventInput,
} from "@/hooks/useCalendarEvents";
import { useCalendarViewState } from "@/hooks/useCalendarViewState";
import { CalendarToolbar } from "@/components/calendar/calendar-toolbar";
import { CalendarMonthGrid } from "@/components/calendar/calendar-month-grid";
import { CalendarListView } from "@/components/calendar/calendar-list-view";
import { CalendarEventForm } from "@/components/setup/calendar-event-form";

export default function CalendarPage() {
	const { t } = useTranslation();
	const { currentSchool, isLoading: isDashboardLoading } = useDashboard();
	const schoolId = currentSchool?.idStr || currentSchool?.id || null;

	const {
		view,
		activeMonth,
		setView,
		goToPrevMonth,
		goToNextMonth,
		goToToday,
	} = useCalendarViewState();

	// Compute date range for the visible grid (padded to full weeks)
	const rangeStart = useMemo(() => {
		const monthStart = startOfMonth(activeMonth);
		return startOfWeek(monthStart, { weekStartsOn: 1 }).toISOString();
	}, [activeMonth]);

	const rangeEnd = useMemo(() => {
		const monthEnd = endOfMonth(activeMonth);
		return endOfWeek(monthEnd, { weekStartsOn: 1 }).toISOString();
	}, [activeMonth]);

	const {
		calendarEvents,
		loading: isEventsLoading,
		refetch,
	} = useCalendarEventsInRange(schoolId, rangeStart, rangeEnd);

	const { createCalendarEvent } = useCreateCalendarEvent();
	const { updateCalendarEvent } = useUpdateCalendarEvent();
	const { deleteCalendarEvent } = useDeleteCalendarEvent();
	const { seedHolidays, loading: isSeedingHolidays } =
		useSeedCambodianHolidays();

	// Local UI state
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedTypes, setSelectedTypes] = useState<CalendarEventType[]>([]);
	const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
		null
	);
	const [clickedDate, setClickedDate] = useState<Date | null>(null);
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Client-side filtering
	const filteredEvents = useMemo(() => {
		return calendarEvents.filter((e) => {
			if (
				selectedTypes.length > 0 &&
				!selectedTypes.includes(e.eventType)
			) {
				return false;
			}
			if (searchQuery) {
				const q = searchQuery.toLowerCase();
				return (
					e.title.toLowerCase().includes(q) ||
					e.description?.toLowerCase().includes(q)
				);
			}
			return true;
		});
	}, [calendarEvents, selectedTypes, searchQuery]);

	// Handlers
	const handleDayClick = (date: Date) => {
		setClickedDate(date);
		setSelectedEvent(null);
		setIsAddModalOpen(true);
	};

	const handleEventClick = (event: CalendarEvent) => {
		setSelectedEvent(event);
		setIsEditModalOpen(true);
	};

	const handleAddSuccess = async (values: any) => {
		if (!schoolId) return;
		try {
			const formattedValues = {
				...values,
				startDate: new Date(values.startDate).toISOString(),
				endDate: new Date(values.endDate).toISOString(),
			};
			await createCalendarEvent({
				...formattedValues,
				schoolId,
			} as CreateCalendarEventInput);
			refetch();
			setIsAddModalOpen(false);
			setClickedDate(null);
		} catch (err) {
			console.error("Failed to create event:", err);
		}
	};

	const handleEditSuccess = async (values: any) => {
		if (!selectedEvent) return;
		try {
			const formattedValues = {
				...values,
				startDate: new Date(values.startDate).toISOString(),
				endDate: new Date(values.endDate).toISOString(),
			};
			await updateCalendarEvent(
				selectedEvent.idStr,
				formattedValues as UpdateCalendarEventInput
			);
			refetch();
			setIsEditModalOpen(false);
			setSelectedEvent(null);
		} catch (err) {
			console.error("Failed to update event:", err);
		}
	};

	const handleDeleteEvent = (event: CalendarEvent) => {
		setSelectedEvent(event);
		setIsDeleteDialogOpen(true);
	};

	const onConfirmDelete = async () => {
		if (!selectedEvent) return;
		setIsSubmitting(true);
		try {
			await deleteCalendarEvent(selectedEvent.idStr);
			refetch();
			setIsDeleteDialogOpen(false);
			setSelectedEvent(null);
		} catch (err) {
			console.error("Failed to delete event:", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleSeedHolidays = async (year: number) => {
		if (!schoolId) return;
		try {
			await seedHolidays(schoolId, year);
			refetch();
		} catch (err) {
			console.error("Failed to seed holidays:", err);
		}
	};

	const closeModals = () => {
		setIsAddModalOpen(false);
		setIsEditModalOpen(false);
		setSelectedEvent(null);
		setClickedDate(null);
	};

	// Build initialData for add modal with pre-filled date
	const addInitialData = useMemo(() => {
		if (!clickedDate) return null;
		return {
			idStr: "",
			title: "",
			eventType: "Event" as CalendarEventType,
			startDateStr: clickedDate.toISOString(),
			endDateStr: clickedDate.toISOString(),
			isAllDay: true,
			isRecurring: false,
			recurrencePattern: "None" as const,
			isSchoolClosed: false,
		} as CalendarEvent;
	}, [clickedDate]);

	if (isDashboardLoading) {
		return (
			<div className="min-h-[60vh] flex items-center justify-center">
				<div className="text-center space-y-3">
					<div className="h-8 w-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin mx-auto" />
					<p className="text-sm text-muted-foreground">
						{t("loading") || "Loading..."}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-5 pb-10">
			<PageHeader
				title={t("school_calendar") || "School Calendar"}
				subtitle={
					t("calendar_subtitle") ||
					"View and manage all school events, holidays, and important dates."
				}
				icon={CalendarDays}
			/>

			<CalendarToolbar
				view={view}
				activeMonth={activeMonth}
				selectedTypes={selectedTypes}
				searchQuery={searchQuery}
				onViewChange={setView}
				onPrevMonth={goToPrevMonth}
				onNextMonth={goToNextMonth}
				onToday={goToToday}
				onTypeFilterChange={setSelectedTypes}
				onSearchChange={setSearchQuery}
				onAddEvent={() => {
					setClickedDate(null);
					setSelectedEvent(null);
					setIsAddModalOpen(true);
				}}
				onSeedHolidays={handleSeedHolidays}
				isSeedingHolidays={isSeedingHolidays}
			/>

			<AnimatePresence mode="wait">
				{view === "month" ? (
					<motion.div
						key="month"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.15 }}
					>
						<CalendarMonthGrid
							activeMonth={activeMonth}
							events={filteredEvents}
							isLoading={isEventsLoading}
							onDayClick={handleDayClick}
							onEventClick={handleEventClick}
						/>
					</motion.div>
				) : (
					<motion.div
						key="list"
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.15 }}
					>
						<CalendarListView
							events={filteredEvents}
							isLoading={isEventsLoading}
							onEdit={handleEventClick}
							onDelete={handleDeleteEvent}
						/>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Add/Edit Event Dialog */}
			<Dialog
				open={isAddModalOpen || isEditModalOpen}
				onOpenChange={(open) => {
					if (!open) closeModals();
				}}
			>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							{isEditModalOpen
								? t("edit_event") || "Edit Event"
								: t("add_event") || "Add Event"}
						</DialogTitle>
						<DialogDescription>
							{t("fill_form_details") || "Fill in the details below."}
						</DialogDescription>
					</DialogHeader>
					<CalendarEventForm
						initialData={
							isEditModalOpen ? selectedEvent : addInitialData
						}
						onSuccess={
							isEditModalOpen ? handleEditSuccess : handleAddSuccess
						}
						onCancel={closeModals}
					/>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation */}
			<Dialog
				open={isDeleteDialogOpen}
				onOpenChange={setIsDeleteDialogOpen}
			>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>
							{t("confirm_delete") || "Confirm Delete"}
						</DialogTitle>
						<DialogDescription>
							{t("delete_item_warning") ||
								"This action cannot be undone."}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="gap-2">
						<Button
							variant="ghost"
							onClick={() => setIsDeleteDialogOpen(false)}
							disabled={isSubmitting}
						>
							{t("cancel") || "Cancel"}
						</Button>
						<Button
							variant="destructive"
							onClick={onConfirmDelete}
							disabled={isSubmitting}
						>
							{isSubmitting && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							{t("delete") || "Delete"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
