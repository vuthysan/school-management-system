import { useMemo } from "react";
import { parseISO, format, isSameDay } from "date-fns";
import { motion } from "framer-motion";
import {
	CalendarDays,
	MapPin,
	Pencil,
	Trash2,
	MoreHorizontal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/hooks/useCalendarEvents";
import { EVENT_TYPE_COLORS } from "./event-type-colors";
import { useLanguage } from "@/contexts/language-context";

interface CalendarListViewProps {
	events: CalendarEvent[];
	isLoading: boolean;
	onEdit: (event: CalendarEvent) => void;
	onDelete: (event: CalendarEvent) => void;
}

interface EventGroup {
	dateKey: string;
	dateLabel: string;
	events: CalendarEvent[];
}

export function CalendarListView({
	events,
	isLoading,
	onEdit,
	onDelete,
}: CalendarListViewProps) {
	const { t } = useLanguage();

	const grouped = useMemo(() => {
		const sorted = [...events].sort(
			(a, b) =>
				new Date(a.startDateStr).getTime() -
				new Date(b.startDateStr).getTime()
		);

		const groups: EventGroup[] = [];
		let currentGroup: EventGroup | null = null;

		for (const event of sorted) {
			const date = parseISO(event.startDateStr);
			const dateKey = format(date, "yyyy-MM-dd");
			const dateLabel = format(date, "EEEE, MMMM d, yyyy");

			if (!currentGroup || currentGroup.dateKey !== dateKey) {
				currentGroup = { dateKey, dateLabel, events: [] };
				groups.push(currentGroup);
			}
			currentGroup.events.push(event);
		}
		return groups;
	}, [events]);

	if (isLoading) {
		return (
			<div className="liquid-glass-card rounded-2xl p-6 space-y-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="animate-pulse space-y-2">
						<div className="h-4 w-40 rounded bg-muted" />
						<div className="h-14 w-full rounded-lg bg-muted" />
					</div>
				))}
			</div>
		);
	}

	if (grouped.length === 0) {
		return (
			<div className="liquid-glass-card rounded-2xl py-16 flex flex-col items-center text-center">
				<div className="p-3 rounded-full bg-muted/50 mb-3">
					<CalendarDays className="h-6 w-6 text-muted-foreground" />
				</div>
				<p className="text-sm font-medium mb-1">
					{t("no_events_this_month") || "No Events This Month"}
				</p>
				<p className="text-xs text-muted-foreground max-w-[280px]">
					{t("no_events_this_month_desc") ||
						"Add events or seed Cambodian holidays to get started."}
				</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{grouped.map((group) => (
				<div key={group.dateKey}>
					<h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 sticky top-0 bg-background/80 backdrop-blur-sm py-1 z-10">
						{group.dateLabel}
					</h3>
					<div className="space-y-2">
						{group.events.map((event, idx) => {
							const colors =
								EVENT_TYPE_COLORS[event.eventType] ||
								EVENT_TYPE_COLORS.Other;
							const start = parseISO(event.startDateStr);
							const end = parseISO(event.endDateStr);
							const sameDay = isSameDay(start, end);

							return (
								<motion.div
									key={event.idStr}
									initial={{ opacity: 0, y: 4 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: idx * 0.03 }}
									className="liquid-glass-card rounded-xl p-3 flex items-center gap-3 group"
								>
									<div
										className={cn(
											"w-1 h-10 rounded-full shrink-0",
											colors.dot
										)}
									/>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-0.5">
											<span className="text-sm font-medium truncate">
												{event.title}
											</span>
											<Badge
												variant="secondary"
												className={cn(
													"text-[10px] px-1.5 py-0 shrink-0",
													colors.bg,
													colors.text
												)}
											>
												{event.eventType}
											</Badge>
											{event.isSchoolClosed && (
												<Badge
													variant="destructive"
													className="text-[10px] px-1.5 py-0 shrink-0"
												>
													{t("school_closed") ||
														"School Closed"}
												</Badge>
											)}
										</div>
										<div className="flex items-center gap-3 text-xs text-muted-foreground">
											<span>
												{event.isAllDay
													? sameDay
														? format(start, "MMM d")
														: `${format(start, "MMM d")} - ${format(end, "MMM d")}`
													: sameDay
														? `${format(start, "h:mm a")} - ${format(end, "h:mm a")}`
														: `${format(start, "MMM d, h:mm a")} - ${format(end, "MMM d, h:mm a")}`}
											</span>
											{event.location && (
												<span className="flex items-center gap-1">
													<MapPin className="h-3 w-3" />
													{event.location}
												</span>
											)}
										</div>
									</div>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
											>
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem
												onClick={() => onEdit(event)}
											>
												<Pencil className="h-3.5 w-3.5 mr-2" />
												{t("edit") || "Edit"}
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => onDelete(event)}
												className="text-destructive"
											>
												<Trash2 className="h-3.5 w-3.5 mr-2" />
												{t("delete") || "Delete"}
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</motion.div>
							);
						})}
					</div>
				</div>
			))}
		</div>
	);
}
