"use client";

import { useMemo, useState, useCallback } from "react";
import { useFieldArray, Control, UseFormSetValue, UseFormWatch } from "react-hook-form";
import { CalendarClock } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import type { SchedulePeriod, DayOfWeek, Subject, ClassSchedule } from "@/types/academic";
import type { Staff } from "@/hooks/useStaff";
import type { Room } from "@/hooks/useRooms";
import type { SubjectColorEntry } from "./types";
import { addMinutes, timeToMinutes, getSubjectColor } from "./utils";
import { GridCell } from "./grid-cell";
import { AddPeriodCell } from "./add-period-cell";

type ScheduleFormData = { schedule: ClassSchedule[] };

type SortedPeriod = SchedulePeriod & { _origIdx: number; _id: string };

interface GridColumnProps {
	day: DayOfWeek;
	dayIndex: number;
	control: Control<ScheduleFormData>;
	watch: UseFormWatch<ScheduleFormData>;
	setValue: UseFormSetValue<ScheduleFormData>;
	subjects: Subject[];
	teachers: Staff[];
	rooms: Room[];
	subjectColorMap: Map<string, SubjectColorEntry>;
	breakThreshold: number;
	defaultRoom?: string;
}

export function GridColumn({
	day,
	dayIndex,
	control,
	watch,
	setValue,
	subjects,
	teachers,
	rooms,
	subjectColorMap,
	breakThreshold,
	defaultRoom,
}: GridColumnProps) {
	const { t } = useLanguage();
	const { fields, append, remove, update } = useFieldArray({
		control,
		name: `schedule.${dayIndex}.periods` as const,
	});

	const periods = watch(`schedule.${dayIndex}.periods`) || [];

	// Track the most recently added period for auto-open
	const [justAddedIdx, setJustAddedIdx] = useState<number | null>(null);

	// Build sorted periods from form data (use stable keys based on day+index, not fields[i].id which changes on update())
	const sortedPeriods = useMemo<SortedPeriod[]>(() => {
		return [...periods]
			.map((p, i) => ({ ...p, _origIdx: i, _id: `${dayIndex}-${i}` }))
			.sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
	}, [periods, dayIndex]);

	// Build name lookup maps
	const subjectMap = useMemo(() => {
		const m = new Map<string, string>();
		subjects.forEach((s) => m.set(s.id, s.subjectName));
		return m;
	}, [subjects]);

	const teacherMap = useMemo(() => {
		const m = new Map<string, string>();
		teachers.forEach((t) => m.set(t.id, `${t.firstName} ${t.lastName}`));
		return m;
	}, [teachers]);

	const handleAddPeriod = useCallback(() => {
		const lastPeriod = periods[periods.length - 1];
		const startTime = lastPeriod?.endTime || "08:00";
		const endTime = addMinutes(startTime, 45);

		const newIdx = periods.length;
		append({
			periodNumber: newIdx + 1,
			subjectId: "",
			teacherId: "",
			startTime,
			endTime,
			room: defaultRoom || "",
		});

		setJustAddedIdx(newIdx);
	}, [periods, append, defaultRoom]);

	const handleUpdate = (periodIndex: number, field: keyof SchedulePeriod, value: string | number) => {
		const currentPeriod = periods[periodIndex];
		if (!currentPeriod) return;
		update(periodIndex, { ...currentPeriod, [field]: value });
	};

	const handleDelete = (periodIndex: number) => {
		remove(periodIndex);
		setJustAddedIdx(null);
	};

	// Empty state
	if (sortedPeriods.length === 0) {
		return (
			<div className="flex flex-col gap-1.5 p-1.5 min-h-0">
				<div className="flex-1 flex flex-col items-center justify-center py-8 text-center gap-2">
					<div className="h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center">
						<CalendarClock className="h-4 w-4 text-muted-foreground/40" />
					</div>
					<p className="text-[10px] text-muted-foreground/50 font-medium">
						{t("no_periods") || "No periods"}
					</p>
				</div>
				<AddPeriodCell onClick={handleAddPeriod} />
			</div>
		);
	}

	return (
		<div className="flex flex-col gap-1.5 p-1.5 min-h-0">
			<div className="flex flex-col gap-1.5">
				{sortedPeriods.map((period, idx) => {
					const pIdx = period._origIdx;

					// Break detection: gap from previous period
					let breakLabel: string | null = null;
					if (idx > 0) {
						const prev = sortedPeriods[idx - 1];
						const gap = timeToMinutes(period.startTime) - timeToMinutes(prev.endTime);
						if (gap >= breakThreshold) {
							breakLabel = gap >= 30 ? (t("lunch") || "Lunch") : (t("break") || "Break");
						}
					}

					return (
						<GridCell
							key={period._id}
							period={period}
							periodNumber={idx + 1}
							subjectName={subjectMap.get(period.subjectId) || ""}
							teacherName={teacherMap.get(period.teacherId) || ""}
							roomName={period.room || ""}
							subjectColor={getSubjectColor(period.subjectId, subjectColorMap)}
							autoOpen={justAddedIdx === pIdx}
							breakLabel={breakLabel}
							onDelete={() => handleDelete(pIdx)}
							onUpdate={(field, value) => handleUpdate(pIdx, field, value)}
							subjects={subjects}
							teachers={teachers}
							rooms={rooms}
						/>
					);
				})}
			</div>
			<AddPeriodCell onClick={handleAddPeriod} />
		</div>
	);
}
