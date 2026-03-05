"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
	ChevronLeft,
	ChevronRight,
	CalendarDays,
	List,
	Plus,
	Search,
	Sparkles,
	Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import type { CalendarEventType } from "@/hooks/useCalendarEvents";
import type { CalendarView } from "@/hooks/useCalendarViewState";
import { EVENT_TYPE_COLORS } from "./event-type-colors";

const ALL_EVENT_TYPES: CalendarEventType[] = [
	"Holiday",
	"Break",
	"Exam",
	"Event",
	"Meeting",
	"Deadline",
	"Other",
];

interface CalendarToolbarProps {
	view: CalendarView;
	activeMonth: Date;
	selectedTypes: CalendarEventType[];
	searchQuery: string;
	onViewChange: (view: CalendarView) => void;
	onPrevMonth: () => void;
	onNextMonth: () => void;
	onToday: () => void;
	onTypeFilterChange: (types: CalendarEventType[]) => void;
	onSearchChange: (query: string) => void;
	onAddEvent: () => void;
	onSeedHolidays: (year: number) => void;
	isSeedingHolidays: boolean;
}

export function CalendarToolbar({
	view,
	activeMonth,
	selectedTypes,
	searchQuery,
	onViewChange,
	onPrevMonth,
	onNextMonth,
	onToday,
	onTypeFilterChange,
	onSearchChange,
	onAddEvent,
	onSeedHolidays,
	isSeedingHolidays,
}: CalendarToolbarProps) {
	const { t } = useLanguage();
	const [seedYear, setSeedYear] = useState(activeMonth.getFullYear());
	const [seedOpen, setSeedOpen] = useState(false);

	const toggleType = (type: CalendarEventType) => {
		if (selectedTypes.includes(type)) {
			onTypeFilterChange(selectedTypes.filter((t) => t !== type));
		} else {
			onTypeFilterChange([...selectedTypes, type]);
		}
	};

	return (
		<div className="space-y-3">
			{/* Row 1: Navigation + View Toggle + Add */}
			<div className="flex items-center justify-between gap-3 flex-wrap">
				<div className="flex items-center gap-2">
					<h2 className="text-xl font-bold">
						{format(activeMonth, "MMMM yyyy")}
					</h2>
					<div className="flex items-center gap-1">
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8"
							onClick={onPrevMonth}
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							size="sm"
							className="h-8 text-xs"
							onClick={onToday}
						>
							{t("today") || "Today"}
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="h-8 w-8"
							onClick={onNextMonth}
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>

				<div className="flex items-center gap-2">
					{/* View toggle */}
					<div className="flex items-center rounded-lg border p-0.5">
						<Button
							variant={view === "month" ? "default" : "ghost"}
							size="sm"
							className="h-7 gap-1.5 text-xs"
							onClick={() => onViewChange("month")}
						>
							<CalendarDays className="h-3.5 w-3.5" />
							{t("month_view") || "Month"}
						</Button>
						<Button
							variant={view === "list" ? "default" : "ghost"}
							size="sm"
							className="h-7 gap-1.5 text-xs"
							onClick={() => onViewChange("list")}
						>
							<List className="h-3.5 w-3.5" />
							{t("list_view") || "List"}
						</Button>
					</div>

					{/* Seed holidays */}
					<Popover open={seedOpen} onOpenChange={setSeedOpen}>
						<PopoverTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								className="h-8 gap-1.5 text-xs"
								disabled={isSeedingHolidays}
							>
								{isSeedingHolidays ? (
									<Loader2 className="h-3.5 w-3.5 animate-spin" />
								) : (
									<Sparkles className="h-3.5 w-3.5" />
								)}
								{t("seed_holidays") || "Seed Holidays"}
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-56 p-3" align="end">
							<p className="text-xs font-medium mb-2">
								{t("holidays_for_year") ||
									"Cambodian holidays for year:"}
							</p>
							<div className="flex items-center gap-2">
								<Input
									type="number"
									value={seedYear}
									onChange={(e) =>
										setSeedYear(parseInt(e.target.value) || new Date().getFullYear())
									}
									className="h-8 text-sm"
									min={2020}
									max={2030}
								/>
								<Button
									size="sm"
									className="h-8 shrink-0"
									disabled={isSeedingHolidays}
									onClick={() => {
										onSeedHolidays(seedYear);
										setSeedOpen(false);
									}}
								>
									{isSeedingHolidays ? (
										<Loader2 className="h-3.5 w-3.5 animate-spin" />
									) : (
										t("confirm") || "Confirm"
									)}
								</Button>
							</div>
						</PopoverContent>
					</Popover>

					{/* Add event */}
					<Button
						size="sm"
						className="h-8 gap-1.5 text-xs"
						onClick={onAddEvent}
					>
						<Plus className="h-3.5 w-3.5" />
						{t("add_event") || "New Event"}
					</Button>
				</div>
			</div>

			{/* Row 2: Search + Type Filters */}
			<div className="flex items-center gap-3 flex-wrap">
				<div className="relative w-64">
					<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
					<Input
						value={searchQuery}
						onChange={(e) => onSearchChange(e.target.value)}
						placeholder={t("search_events") || "Search events..."}
						className="h-8 pl-8 text-xs"
					/>
				</div>
				<div className="flex items-center gap-1.5 flex-wrap">
					{ALL_EVENT_TYPES.map((type) => {
						const colors = EVENT_TYPE_COLORS[type];
						const isActive = selectedTypes.includes(type);
						return (
							<button
								key={type}
								type="button"
								onClick={() => toggleType(type)}
								className={cn(
									"inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer border",
									isActive
										? `${colors.bg} ${colors.text} ${colors.border}`
										: "border-transparent text-muted-foreground hover:bg-muted/50"
								)}
							>
								<span
									className={cn(
										"h-2 w-2 rounded-full",
										colors.dot
									)}
								/>
								{type}
							</button>
						);
					})}
					{selectedTypes.length > 0 && (
						<button
							type="button"
							onClick={() => onTypeFilterChange([])}
							className="text-[11px] text-muted-foreground hover:text-foreground px-1.5 cursor-pointer"
						>
							{t("clear") || "Clear"}
						</button>
					)}
				</div>
			</div>
		</div>
	);
}
