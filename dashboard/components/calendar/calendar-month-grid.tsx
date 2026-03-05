import { useMemo } from "react";
import {
	startOfMonth,
	endOfMonth,
	startOfWeek,
	endOfWeek,
	eachDayOfInterval,
	isSameMonth,
	isToday,
	isSameDay,
	parseISO,
	getDate,
	format,
} from "date-fns";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/hooks/useCalendarEvents";
import { CalendarDayCell } from "./calendar-day-cell";

interface CalendarMonthGridProps {
	activeMonth: Date;
	events: CalendarEvent[];
	isLoading: boolean;
	onDayClick: (date: Date) => void;
	onEventClick: (event: CalendarEvent) => void;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function getEventsForDay(events: CalendarEvent[], day: Date): CalendarEvent[] {
	return events.filter((event) => {
		const start = parseISO(event.startDateStr);
		const end = parseISO(event.endDateStr);
		// Compare date parts only (ignore time)
		const dayStart = new Date(day.getFullYear(), day.getMonth(), day.getDate());
		const eventStart = new Date(
			start.getFullYear(),
			start.getMonth(),
			start.getDate()
		);
		const eventEnd = new Date(
			end.getFullYear(),
			end.getMonth(),
			end.getDate()
		);
		return dayStart >= eventStart && dayStart <= eventEnd;
	});
}

export function CalendarMonthGrid({
	activeMonth,
	events,
	isLoading,
	onDayClick,
	onEventClick,
}: CalendarMonthGridProps) {
	const days = useMemo(() => {
		const monthStart = startOfMonth(activeMonth);
		const monthEnd = endOfMonth(activeMonth);
		const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
		const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
		return eachDayOfInterval({ start: gridStart, end: gridEnd });
	}, [activeMonth]);

	if (isLoading) {
		return (
			<div className="liquid-glass-card rounded-2xl overflow-hidden">
				<div className="grid grid-cols-7">
					{WEEKDAYS.map((day) => (
						<div
							key={day}
							className="py-2.5 text-center text-xs font-medium text-muted-foreground border-b"
						>
							{day}
						</div>
					))}
				</div>
				<div className="grid grid-cols-7">
					{Array.from({ length: 35 }).map((_, i) => (
						<div
							key={i}
							className="min-h-[100px] p-2 border-b border-r animate-pulse"
						>
							<div className="h-4 w-4 rounded-full bg-muted ml-auto mb-2" />
							<div className="h-3 w-3/4 rounded bg-muted mb-1" />
							<div className="h-3 w-1/2 rounded bg-muted" />
						</div>
					))}
				</div>
			</div>
		);
	}

	return (
		<div className="liquid-glass-card rounded-2xl overflow-hidden">
			{/* Weekday headers */}
			<div className="grid grid-cols-7">
				{WEEKDAYS.map((day) => (
					<div
						key={day}
						className="py-2.5 text-center text-xs font-medium text-muted-foreground border-b"
					>
						{day}
					</div>
				))}
			</div>

			{/* Day cells */}
			<div className="grid grid-cols-7">
				{days.map((day) => (
					<CalendarDayCell
						key={day.toISOString()}
						date={day}
						dayNumber={getDate(day)}
						isCurrentMonth={isSameMonth(day, activeMonth)}
						isToday={isToday(day)}
						events={getEventsForDay(events, day)}
						onDayClick={onDayClick}
						onEventClick={onEventClick}
					/>
				))}
			</div>
		</div>
	);
}
