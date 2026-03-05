import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/hooks/useCalendarEvents";
import { CalendarEventChip } from "./calendar-event-chip";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface CalendarDayCellProps {
	date: Date;
	dayNumber: number;
	isCurrentMonth: boolean;
	isToday: boolean;
	events: CalendarEvent[];
	onDayClick: (date: Date) => void;
	onEventClick: (event: CalendarEvent) => void;
}

const MAX_VISIBLE = 3;

export function CalendarDayCell({
	date,
	dayNumber,
	isCurrentMonth,
	isToday,
	events,
	onDayClick,
	onEventClick,
}: CalendarDayCellProps) {
	const hasSchoolClosed = events.some((e) => e.isSchoolClosed);
	const visibleEvents = events.slice(0, MAX_VISIBLE);
	const overflowCount = events.length - MAX_VISIBLE;

	return (
		<div
			onClick={() => onDayClick(date)}
			className={cn(
				"min-h-[100px] p-1.5 border-b border-r cursor-pointer transition-colors",
				"hover:bg-muted/40",
				!isCurrentMonth && "bg-muted/20",
				hasSchoolClosed && isCurrentMonth && "bg-rose-50/40 dark:bg-rose-950/10"
			)}
		>
			<div className="flex items-center justify-end mb-1">
				<span
					className={cn(
						"text-xs font-medium h-6 w-6 flex items-center justify-center rounded-full",
						isToday && "bg-primary text-primary-foreground",
						!isCurrentMonth && "text-muted-foreground/40",
						isCurrentMonth && !isToday && "text-foreground"
					)}
				>
					{dayNumber}
				</span>
			</div>
			<div className="space-y-0.5">
				{visibleEvents.map((event) => (
					<CalendarEventChip
						key={event.idStr}
						event={event}
						onClick={onEventClick}
					/>
				))}
				{overflowCount > 0 && (
					<Popover>
						<PopoverTrigger asChild>
							<button
								type="button"
								onClick={(e) => e.stopPropagation()}
								className="w-full text-left text-[11px] text-muted-foreground hover:text-foreground px-1.5 py-0.5 cursor-pointer"
							>
								+{overflowCount} more
							</button>
						</PopoverTrigger>
						<PopoverContent
							className="w-56 p-2 space-y-1"
							align="start"
							onClick={(e) => e.stopPropagation()}
						>
							{events.map((event) => (
								<CalendarEventChip
									key={event.idStr}
									event={event}
									onClick={onEventClick}
								/>
							))}
						</PopoverContent>
					</Popover>
				)}
			</div>
		</div>
	);
}
