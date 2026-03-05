"use client";

import { useState } from "react";
import { Control, UseFormWatch, UseFormSetValue } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import type { DayOfWeek, ClassSchedule, Subject } from "@/types/academic";
import type { Staff } from "@/hooks/useStaff";
import type { Room } from "@/hooks/useRooms";
import type { SubjectColorEntry } from "./types";
import { DAY_COLORS } from "./utils";
import { GridColumn } from "./grid-column";

type ScheduleFormData = { schedule: ClassSchedule[] };

interface MobileStackedViewProps {
	days: DayOfWeek[];
	periodCounts: Record<string, number>;
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

export function MobileStackedView({
	days,
	periodCounts,
	control,
	watch,
	setValue,
	subjects,
	teachers,
	rooms,
	subjectColorMap,
	breakThreshold,
	defaultRoom,
}: MobileStackedViewProps) {
	const { t } = useLanguage();
	const [activeDay, setActiveDay] = useState<DayOfWeek>("Monday");
	const dayIndex = days.indexOf(activeDay);

	return (
		<div className="flex flex-col flex-1 min-h-0">
			{/* Day Tabs */}
			<div className="px-4 pb-3">
				<div className="flex gap-1.5 overflow-x-auto">
					{days.map((day) => {
						const count = periodCounts[day] || 0;
						const colors = DAY_COLORS[day] || DAY_COLORS.Monday;
						const isActive = day === activeDay;
						return (
							<button
								key={day}
								type="button"
								onClick={() => setActiveDay(day)}
								className={cn(
									"flex-shrink-0 flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all cursor-pointer",
									isActive
										? `${colors.bg} ring-2 ${colors.ring}`
										: "hover:bg-muted/50"
								)}
							>
								<span
									className={cn(
										"text-xs font-medium",
										isActive
											? "text-foreground"
											: "text-muted-foreground"
									)}
								>
									{(t(day.toLowerCase()) || day).slice(0, 3)}
								</span>
								<div className="flex gap-0.5">
									{count > 0 ? (
										Array.from({ length: Math.min(count, 4) }).map(
											(_, i) => (
												<div
													key={i}
													className={cn(
														"h-1.5 w-1.5 rounded-full",
														colors.dot
													)}
												/>
											)
										)
									) : (
										<div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/20" />
									)}
								</div>
							</button>
						);
					})}
				</div>
			</div>

			{/* Active Day Column */}
			<div className="flex-1 overflow-y-auto px-2">
				{dayIndex >= 0 && (
					<GridColumn
						key={activeDay}
						day={activeDay}
						dayIndex={dayIndex}
						control={control}
						watch={watch}
						setValue={setValue}
						subjects={subjects}
						teachers={teachers}
						rooms={rooms}
						subjectColorMap={subjectColorMap}
						breakThreshold={breakThreshold}
						defaultRoom={defaultRoom}
					/>
				)}
			</div>
		</div>
	);
}
