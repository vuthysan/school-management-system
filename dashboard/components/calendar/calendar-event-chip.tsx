import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/hooks/useCalendarEvents";
import { EVENT_TYPE_COLORS } from "./event-type-colors";

interface CalendarEventChipProps {
	event: CalendarEvent;
	onClick: (event: CalendarEvent) => void;
}

export function CalendarEventChip({ event, onClick }: CalendarEventChipProps) {
	const colors = EVENT_TYPE_COLORS[event.eventType] || EVENT_TYPE_COLORS.Other;

	return (
		<button
			type="button"
			onClick={(e) => {
				e.stopPropagation();
				onClick(event);
			}}
			className={cn(
				"w-full text-left text-[11px] leading-tight px-1.5 py-0.5 rounded truncate border-l-2 cursor-pointer",
				"hover:opacity-80 transition-opacity",
				colors.bg,
				colors.border,
				colors.text
			)}
			title={event.title}
		>
			{event.isSchoolClosed && (
				<span className="inline-block w-1.5 h-1.5 rounded-full bg-rose-500 mr-1 align-middle" />
			)}
			{event.title}
		</button>
	);
}
