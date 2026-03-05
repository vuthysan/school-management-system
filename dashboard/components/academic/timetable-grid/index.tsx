"use client";

import { useMemo, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/language-context";
import type { Class, ClassSchedule, DayOfWeek } from "@/types/academic";
import { useSubjects } from "@/hooks/useSubjects";
import { useStaff } from "@/hooks/useStaff";
import { useRooms } from "@/hooks/useRooms";
import { DAYS, buildSubjectColorMap } from "./utils";
import { GridHeader } from "./grid-header";
import { GridColumn } from "./grid-column";
import { GridToolbar } from "./grid-toolbar";
import { MobileStackedView } from "./mobile-stacked-view";

interface TimetableGridEditorProps {
	classData: Class;
	onSave: (schedule: ClassSchedule[]) => Promise<void>;
	onBack: () => void;
}

type ScheduleFormData = { schedule: ClassSchedule[] };

const BREAK_THRESHOLD = 10; // minutes

export function TimetableGridEditor({
	classData,
	onSave,
	onBack,
}: TimetableGridEditorProps) {
	const { t } = useLanguage();
	const [isSaving, setIsSaving] = useState(false);

	// Load supporting data
	const { subjects, isLoading: isLoadingSubjects } = useSubjects({
		schoolId: classData.schoolId,
		pageSize: 100,
	});
	const { staffList: teachers, loading: isLoadingTeachers } = useStaff(
		classData.schoolId,
	);
	const { rooms, isLoading: isLoadingRooms } = useRooms(classData.schoolId);

	// Days setup
	const allDays: DayOfWeek[] = useMemo(() => {
		const days = [...DAYS];
		const hasSunday = classData.schedule?.some(
			(s) => s.day === "Sunday" && s.periods && s.periods.length > 0,
		);
		if (hasSunday) days.push("Sunday");
		return days;
	}, [classData.schedule]);

	// Subject color map
	const subjectColorMap = useMemo(
		() => buildSubjectColorMap(subjects),
		[subjects],
	);

	// Form setup
	const { control, watch, setValue } = useForm<ScheduleFormData>({
		defaultValues: {
			schedule: allDays.map((day) => {
				const existingDay = classData.schedule?.find((s) => s.day === day);
				return {
					day,
					periods: existingDay?.periods || [],
				};
			}),
		},
	});

	const watchedSchedule = watch("schedule");

	const periodCounts = useMemo(() => {
		const counts: Record<string, number> = {};
		watchedSchedule?.forEach((s) => {
			counts[s.day] = s.periods?.length || 0;
		});
		return counts;
	}, [watchedSchedule]);

	const totalPeriods = useMemo(
		() => Object.values(periodCounts).reduce((a, b) => a + b, 0),
		[periodCounts],
	);

	// Copy day handler
	const handleCopyDay = (fromDay: DayOfWeek, toDay: DayOfWeek) => {
		const fromIdx = allDays.indexOf(fromDay);
		const toIdx = allDays.indexOf(toDay);
		if (fromIdx === -1 || toIdx === -1) return;
		const sourcePeriods = watchedSchedule[fromIdx]?.periods || [];
		setValue(`schedule.${toIdx}.periods`, [...sourcePeriods]);
	};

	// Save and navigate back
	const handleSave = useCallback(async () => {
		setIsSaving(true);
		try {
			await onSave(watchedSchedule);
			toast.success(t("schedule_saved") || "Schedule saved successfully");
			onBack();
		} catch {
			toast.error(t("save_failed") || "Failed to save. Please try again.");
			setIsSaving(false);
		}
	}, [onSave, watchedSchedule, onBack, t]);

	const isLoading = isLoadingSubjects || isLoadingTeachers || isLoadingRooms;

	if (isLoading) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-10 w-full" />
				<div className="grid grid-cols-6 gap-2">
					{Array.from({ length: 6 }).map((_, i) => (
						<Skeleton key={i} className="h-40" />
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-[calc(100vh-4rem)]">
			{/* Top bar */}
			<div className="flex items-center gap-2 mb-4 bg-card border border-border/60 rounded-xl px-3 py-2 shadow-sm">
				{/* Back button */}
				<Button
					variant="ghost"
					size="icon"
					className="h-8 w-8 shrink-0 text-muted-foreground hover:text-foreground"
					onClick={onBack}
					disabled={isSaving}
				>
					<ArrowLeft className="h-4 w-4" />
				</Button>

				{/* Divider */}
				<div className="h-6 w-px bg-border/60 shrink-0" />

				{/* Toolbar: class identity + stats + copy */}
				<div className="flex items-center gap-2.5 flex-1 min-w-0">
					<GridToolbar
						className={classData.name}
						totalPeriods={totalPeriods}
						days={allDays}
						schedule={watchedSchedule}
						onCopyDay={handleCopyDay}
					/>
				</div>

				{/* Divider */}
				<div className="h-6 w-px bg-border/60 shrink-0" />

				{/* Save */}
				<Button
					size="sm"
					onClick={handleSave}
					disabled={isSaving}
					className="gap-2 shrink-0"
				>
					{isSaving ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<Save className="h-4 w-4" />
					)}
					{t("save_schedule") || "Save Schedule"}
				</Button>
			</div>

			{/* Desktop Grid */}
			<div className="hidden md:flex flex-col flex-1 min-h-0">
				<div className="rounded-xl border overflow-hidden flex flex-col flex-1 min-h-0">
					<GridHeader days={allDays} periodCounts={periodCounts} />
					<div
						className="flex-1 overflow-y-auto grid gap-px bg-border"
						style={{
							gridTemplateColumns: `repeat(${allDays.length}, minmax(0, 1fr))`,
						}}
					>
						{allDays.map((day, idx) => (
							<div key={day} className="bg-card min-h-50">
								<GridColumn
									day={day}
									dayIndex={idx}
									control={control}
									watch={watch}
									setValue={setValue}
									subjects={subjects}
									teachers={teachers}
									rooms={rooms}
									subjectColorMap={subjectColorMap}
									breakThreshold={BREAK_THRESHOLD}
									defaultRoom={classData.roomNumber}
								/>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Mobile View */}
			<div className="md:hidden flex-1 min-h-0 overflow-y-auto">
				<MobileStackedView
					days={allDays}
					periodCounts={periodCounts}
					control={control}
					watch={watch}
					setValue={setValue}
					subjects={subjects}
					teachers={teachers}
					rooms={rooms}
					subjectColorMap={subjectColorMap}
					breakThreshold={BREAK_THRESHOLD}
					defaultRoom={classData.roomNumber}
				/>
			</div>
		</div>
	);
}
