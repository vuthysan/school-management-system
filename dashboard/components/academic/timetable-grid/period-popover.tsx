"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import type { SchedulePeriod, Subject } from "@/types/academic";
import type { Staff } from "@/hooks/useStaff";
import type { Room } from "@/hooks/useRooms";
import { calcDuration, formatDuration } from "./utils";

interface PeriodEditFormProps {
	period: SchedulePeriod;
	subjects: Subject[];
	teachers: Staff[];
	rooms: Room[];
	showErrors?: boolean;
	onUpdate: (field: keyof SchedulePeriod, value: string | number) => void;
}

export function PeriodEditForm({
	period,
	subjects,
	teachers,
	rooms,
	showErrors = false,
	onUpdate,
}: PeriodEditFormProps) {
	const { t } = useLanguage();
	const duration = calcDuration(period.startTime, period.endTime);

	const subjectError = showErrors && !period.subjectId;
	const teacherError = showErrors && !period.teacherId;

	return (
		<div className="space-y-3">
			{/* Subject */}
			<div className="space-y-1.5">
				<Label className="text-[11px] uppercase text-muted-foreground font-medium flex items-center gap-1">
					{t("subject") || "Subject"}
					<span className="text-destructive">*</span>
				</Label>
				<Select
					value={period.subjectId}
					onValueChange={(v) => onUpdate("subjectId", v)}
				>
					<SelectTrigger
						className={cn(
							"h-8 text-xs",
							subjectError && "border-destructive focus:ring-destructive/30"
						)}
					>
						<SelectValue placeholder={t("select_subject") || "Select subject"} />
					</SelectTrigger>
					<SelectContent>
						{subjects.map((s) => (
							<SelectItem key={s.id} value={s.id}>
								{s.subjectName}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{subjectError && (
					<p className="text-[11px] text-destructive flex items-center gap-1">
						{t("subject_required") || "Subject is required"}
					</p>
				)}
			</div>

			{/* Teacher */}
			<div className="space-y-1.5">
				<Label className="text-[11px] uppercase text-muted-foreground font-medium flex items-center gap-1">
					{t("teacher") || "Teacher"}
					<span className="text-destructive">*</span>
				</Label>
				<Select
					value={period.teacherId}
					onValueChange={(v) => onUpdate("teacherId", v)}
				>
					<SelectTrigger
						className={cn(
							"h-8 text-xs",
							teacherError && "border-destructive focus:ring-destructive/30"
						)}
					>
						<SelectValue placeholder={t("select_teacher") || "Select teacher"} />
					</SelectTrigger>
					<SelectContent>
						{teachers.map((teacher) => (
							<SelectItem key={teacher.id} value={teacher.id}>
								{teacher.firstName} {teacher.lastName}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				{teacherError && (
					<p className="text-[11px] text-destructive flex items-center gap-1">
						{t("teacher_required") || "Teacher is required"}
					</p>
				)}
			</div>

			{/* Time */}
			<div className="space-y-1.5">
				<div className="flex items-center justify-between">
					<Label className="text-[11px] uppercase text-muted-foreground font-medium">
						{t("time") || "Time"}
					</Label>
					{duration > 0 && (
						<span className="text-[10px] text-muted-foreground/60 tabular-nums">
							{formatDuration(duration)}
						</span>
					)}
				</div>
				<div className="grid grid-cols-2 gap-2">
					<div className="space-y-1">
						<Label className="text-[10px] text-muted-foreground/70">
							{t("start_time") || "Start"}
						</Label>
						<Input
							type="time"
							value={period.startTime}
							onChange={(e) => onUpdate("startTime", e.target.value)}
							className="h-8 text-xs"
						/>
					</div>
					<div className="space-y-1">
						<Label className="text-[10px] text-muted-foreground/70">
							{t("end_time") || "End"}
						</Label>
						<Input
							type="time"
							value={period.endTime}
							onChange={(e) => onUpdate("endTime", e.target.value)}
							className="h-8 text-xs"
						/>
					</div>
				</div>
			</div>

			{/* Room */}
			<div className="space-y-1.5">
				<Label className="text-[11px] uppercase text-muted-foreground font-medium">
					{t("room") || "Room"}
				</Label>
				<Select
					value={period.room || ""}
					onValueChange={(v) => onUpdate("room", v)}
				>
					<SelectTrigger className="h-8 text-xs">
						<SelectValue placeholder={t("select_room") || "Select room"} />
					</SelectTrigger>
					<SelectContent>
						{rooms.map((room) => (
							<SelectItem key={room.id} value={room.name}>
								{room.name}
								{room.building ? ` – ${room.building}` : ""}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
