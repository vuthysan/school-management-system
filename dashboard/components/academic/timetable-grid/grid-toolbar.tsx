"use client";

import { useState } from "react";
import { CalendarDays, Copy, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import type { DayOfWeek, ClassSchedule } from "@/types/academic";
import { DAY_COLORS } from "./utils";

interface GridToolbarProps {
	className: string;
	totalPeriods: number;
	days: DayOfWeek[];
	schedule: ClassSchedule[];
	onCopyDay: (fromDay: DayOfWeek, toDay: DayOfWeek) => void;
}

export function GridToolbar({
	className,
	totalPeriods,
	days,
	schedule,
	onCopyDay,
}: GridToolbarProps) {
	const { t } = useLanguage();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [copyFrom, setCopyFrom] = useState<DayOfWeek | "">("");
	const [copyTo, setCopyTo] = useState<DayOfWeek[]>([]);

	const daysWithPeriods = days.filter((d) => {
		const s = schedule.find((s) => s.day === d);
		return s && s.periods.length > 0;
	});

	const getPeriodCount = (day: DayOfWeek) =>
		schedule.find((s) => s.day === day)?.periods.length ?? 0;

	const handleOpenDialog = () => {
		setCopyFrom("");
		setCopyTo([]);
		setDialogOpen(true);
	};

	const toggleCopyTo = (day: DayOfWeek) => {
		setCopyTo((prev) =>
			prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
		);
	};

	const handleCopy = () => {
		if (!copyFrom || copyTo.length === 0) return;
		copyTo.forEach((toDay) => onCopyDay(copyFrom as DayOfWeek, toDay));
		setDialogOpen(false);
	};

	return (
		<>
			{/* Class identity */}
			<div className="flex items-center gap-2.5 min-w-0">
				<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
					<CalendarDays className="h-4 w-4 text-primary" />
				</div>
				<div className="min-w-0">
					<p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 leading-none mb-0.5">
						{t("timetable") || "Timetable"}
					</p>
					<h2 className="text-sm font-bold leading-tight truncate text-foreground">
						{className}
					</h2>
				</div>
			</div>

			{/* Divider */}
			<div className="h-6 w-px bg-border/60 shrink-0" />

			{/* Stats chips */}
			<div className="flex items-center gap-1.5">
				<div className="flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1">
					<Clock className="h-3 w-3 text-muted-foreground/60" />
					<span className="text-[11px] font-semibold tabular-nums text-muted-foreground">
						{totalPeriods}
					</span>
					<span className="text-[11px] text-muted-foreground/60">
						{t("periods") || "periods"}
					</span>
				</div>
				{daysWithPeriods.length > 0 && (
					<div className="flex items-center gap-1 rounded-md bg-muted/60 px-2 py-1">
						<span className="text-[11px] font-semibold tabular-nums text-muted-foreground">
							{daysWithPeriods.length}
						</span>
						<span className="text-[11px] text-muted-foreground/60">
							{daysWithPeriods.length === 1 ? (t("day") || "day") : (t("days") || "days")}
						</span>
					</div>
				)}
			</div>

			{/* Copy Day button */}
			{daysWithPeriods.length > 0 && (
				<Button
					type="button"
					variant="outline"
					size="sm"
					className="gap-1.5 h-8 text-xs shrink-0"
					onClick={handleOpenDialog}
				>
					<Copy className="h-3.5 w-3.5" />
					{t("copy_day") || "Copy Day"}
				</Button>
			)}

			{/* Copy Day Dialog */}
			<Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
				<DialogContent className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2 text-sm">
							<Copy className="h-4 w-4 text-muted-foreground" />
							{t("copy_day_schedule") || "Copy Day Schedule"}
						</DialogTitle>
					</DialogHeader>

					<div className="space-y-5 py-1">
						{/* Step 1 — Copy From */}
						<div className="space-y-2">
							<p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
								{t("copy_from") || "Copy from"}
							</p>
							<div className="flex flex-wrap gap-1.5">
								{days.map((day) => {
									const count = getPeriodCount(day);
									const hasData = count > 0;
									const isSelected = copyFrom === day;
									const colors = DAY_COLORS[day] || DAY_COLORS.Monday;
									return (
										<button
											key={day}
											type="button"
											disabled={!hasData}
											onClick={() => {
												setCopyFrom(day);
												setCopyTo((prev) => prev.filter((d) => d !== day));
											}}
											className={cn(
												"flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
												isSelected
													? cn(colors.badge, "border-transparent text-white")
													: hasData
													? "border-border hover:border-primary/40 hover:bg-muted/50 text-foreground"
													: "border-border/30 text-muted-foreground/30 cursor-not-allowed"
											)}
										>
											{(t(day.toLowerCase()) || day).slice(0, 3).toUpperCase()}
											{hasData && (
												<span
													className={cn(
														"text-[9px] font-bold",
														isSelected ? "text-white/70" : "text-muted-foreground"
													)}
												>
													·{count}
												</span>
											)}
										</button>
									);
								})}
							</div>
							{!copyFrom && (
								<p className="text-[10px] text-muted-foreground/50 italic">
									{t("select_source_day_hint") || "Select a day with periods"}
								</p>
							)}
						</div>

						{/* Step 2 — Copy To */}
						{copyFrom && (
							<div className="space-y-2">
								<p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
									{t("copy_to") || "Copy to"}
								</p>
								<div className="flex flex-wrap gap-1.5">
									{days
										.filter((d) => d !== copyFrom)
										.map((day) => {
											const isSelected = copyTo.includes(day);
											return (
												<button
													key={day}
													type="button"
													onClick={() => toggleCopyTo(day)}
													className={cn(
														"px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all",
														isSelected
															? "bg-primary/10 border-primary text-primary"
															: "border-border hover:border-muted-foreground/40 hover:bg-muted/50 text-foreground"
													)}
												>
													{(t(day.toLowerCase()) || day).slice(0, 3).toUpperCase()}
												</button>
											);
										})}
								</div>
								{copyTo.length === 0 && (
									<p className="text-[10px] text-muted-foreground/50 italic">
										{t("select_dest_days_hint") || "Select one or more destination days"}
									</p>
								)}
							</div>
						)}
					</div>

					<DialogFooter>
						<Button variant="outline" size="sm" onClick={() => setDialogOpen(false)}>
							{t("cancel") || "Cancel"}
						</Button>
						<Button
							size="sm"
							disabled={!copyFrom || copyTo.length === 0}
							onClick={handleCopy}
							className="gap-1.5"
						>
							<Copy className="h-3.5 w-3.5" />
							{copyTo.length > 0
								? `${t("copy_to") || "Copy to"} ${copyTo.length} ${copyTo.length === 1 ? (t("day") || "day") : (t("days") || "days")}`
								: (t("copy") || "Copy")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
