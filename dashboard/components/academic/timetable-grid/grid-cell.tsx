"use client";

import { useState, useEffect } from "react";
import { Trash2, User2, MapPin } from "lucide-react";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import type { SchedulePeriod, Subject } from "@/types/academic";
import type { Staff } from "@/hooks/useStaff";
import type { Room } from "@/hooks/useRooms";
import type { SubjectColorEntry } from "./types";
import { formatTimeRange, calcDuration, formatDuration } from "./utils";
import { PeriodEditForm } from "./period-popover";

interface GridCellProps {
	period: SchedulePeriod & { _origIdx: number; _id: string };
	periodNumber: number;
	subjectName: string;
	teacherName: string;
	roomName: string;
	subjectColor: SubjectColorEntry;
	autoOpen?: boolean;
	breakLabel?: string | null;
	onDelete: () => void;
	onUpdate: (field: keyof SchedulePeriod, value: string | number) => void;
	subjects: Subject[];
	teachers: Staff[];
	rooms: Room[];
}

export function GridCell({
	period,
	periodNumber,
	subjectName,
	teacherName,
	roomName,
	subjectColor,
	autoOpen,
	breakLabel,
	onDelete,
	onUpdate,
	subjects,
	teachers,
	rooms,
}: GridCellProps) {
	const { t } = useLanguage();
	const [isOpen, setIsOpen] = useState(false);
	const [showErrors, setShowErrors] = useState(false);
	const duration = calcDuration(period.startTime, period.endTime);

	useEffect(() => {
		if (autoOpen) {
			const timer = setTimeout(() => setIsOpen(true), 50);
			return () => clearTimeout(timer);
		}
	}, [autoOpen]);

	const handleDialogOpenChange = (open: boolean) => {
		setIsOpen(open);
		if (!open) setShowErrors(false);
	};

	const handleDone = () => {
		if (!period.subjectId || !period.teacherId) {
			setShowErrors(true);
			return;
		}
		setIsOpen(false);
	};

	return (
		<div>
			{/* Break/lunch divider above cell */}
			{breakLabel && (
				<div className="flex items-center gap-1.5 py-1.5 px-1">
					<div className="flex-1 border-t border-dashed border-muted-foreground/20" />
					<span className="text-[9px] text-muted-foreground/50 font-semibold uppercase tracking-widest whitespace-nowrap">
						{breakLabel}
					</span>
					<div className="flex-1 border-t border-dashed border-muted-foreground/20" />
				</div>
			)}

			<Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
				<DialogTrigger asChild>
					<div
						className={cn(
							"group relative rounded-lg border border-border/60 border-l-[3px] px-2.5 py-2.5 cursor-pointer bg-card shadow-sm",
							"transition-all duration-150",
							subjectColor.border,
							isOpen
								? "ring-2 ring-primary/25 shadow-md"
								: "hover:shadow-md hover:-translate-y-px"
						)}
					>
						{/* Row 1: Period badge + time range + duration + delete */}
						<div className="flex items-center gap-1 mb-1.5">
							<span
								className={cn(
									"inline-flex h-4 w-4 items-center justify-center rounded-sm text-[9px] font-bold shrink-0",
									subjectColor.bg,
									subjectColor.text
								)}
							>
								{periodNumber}
							</span>
							<span className="text-[10px] text-muted-foreground font-medium tabular-nums flex-1 min-w-0 truncate">
								{formatTimeRange(period.startTime, period.endTime)}
							</span>
							{duration > 0 && (
								<span className="text-[9px] text-muted-foreground/50 tabular-nums shrink-0">
									{formatDuration(duration)}
								</span>
							)}
							<button
								type="button"
								className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-destructive/10 hover:text-destructive text-muted-foreground/40 ml-0.5 shrink-0"
								onClick={(e) => {
									e.stopPropagation();
									onDelete();
								}}
							>
								<Trash2 className="h-3 w-3" />
							</button>
						</div>

						{/* Row 2: Subject name */}
						<p className={cn("text-xs font-bold leading-snug truncate mb-1.5", subjectColor.text)}>
							{subjectName || (
								<span className="font-normal text-muted-foreground/40 italic text-[10px]">
									{t("select_subject") || "No subject"}
								</span>
							)}
						</p>

						{/* Row 3: Teacher + Room */}
						<div className="space-y-0.5">
							{teacherName ? (
								<div className="flex items-center gap-1 min-w-0">
									<User2 className="h-2.5 w-2.5 text-muted-foreground/50 shrink-0" />
									<span className="text-[10px] text-muted-foreground truncate">{teacherName}</span>
								</div>
							) : null}
							{roomName ? (
								<div className="flex items-center gap-1 min-w-0">
									<MapPin className="h-2.5 w-2.5 text-muted-foreground/50 shrink-0" />
									<span className="text-[10px] text-muted-foreground truncate">{roomName}</span>
								</div>
							) : null}
							{!teacherName && !roomName && (
								<span className="text-[10px] text-muted-foreground/30 italic">
									{t("click_to_configure") || "Click to configure"}
								</span>
							)}
						</div>
					</div>
				</DialogTrigger>

				<DialogContent className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle className="text-sm flex items-center gap-2">
							<span
								className={cn(
									"inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold shrink-0",
									subjectColor.bg,
									subjectColor.text
								)}
							>
								{periodNumber}
							</span>
							{t("edit_period") || "Edit Period"}
							<span className="ml-auto text-xs text-muted-foreground font-normal tabular-nums">
								{formatTimeRange(period.startTime, period.endTime)}
							</span>
						</DialogTitle>
					</DialogHeader>
					<PeriodEditForm
						period={period}
						subjects={subjects}
						teachers={teachers}
						rooms={rooms}
						onUpdate={onUpdate}
						showErrors={showErrors}
					/>
					<DialogFooter>
						<Button size="sm" onClick={handleDone}>
							{t("done") || "Done"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
