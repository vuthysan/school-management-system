"use client";

import { useState, useMemo } from "react";
import {
	Plus,
	Trash2,
	Clock,
	Save,
	Loader2,
	CalendarClock,
	Copy,
	ChevronDown,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
	useForm,
	useFieldArray,
	Controller,
	Control,
	UseFormWatch,
	UseFormSetValue,
} from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import {
	Class,
	ClassSchedule,
	SchedulePeriod,
	DayOfWeek,
} from "@/types/academic";
import { Subject } from "@/types/academic";
import { useSubjects } from "@/hooks/useSubjects";
import { useStaff, Staff } from "@/hooks/useStaff";
import { useRooms, Room } from "@/hooks/useRooms";

interface TimetableEditorProps {
	classData: Class;
	onSave: (schedule: ClassSchedule[]) => Promise<void>;
	onCancel: () => void;
}

type ScheduleFormData = { schedule: ClassSchedule[] };

interface DayPeriodsEditorProps {
	control: Control<ScheduleFormData>;
	watch: UseFormWatch<ScheduleFormData>;
	setValue: UseFormSetValue<ScheduleFormData>;
	dayIndex: number;
	activeDay: DayOfWeek;
	allDays: DayOfWeek[];
	subjects: Subject[];
	teachers: Staff[];
	rooms: Room[];
	roomNumber?: string;
}

const DAYS: DayOfWeek[] = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

const DAY_COLORS: Record<
	string,
	{ dot: string; ring: string; badge: string; bg: string }
> = {
	Monday: {
		dot: "bg-blue-500",
		ring: "ring-blue-500/40",
		badge: "bg-blue-500",
		bg: "bg-blue-500/10",
	},
	Tuesday: {
		dot: "bg-purple-500",
		ring: "ring-purple-500/40",
		badge: "bg-purple-500",
		bg: "bg-purple-500/10",
	},
	Wednesday: {
		dot: "bg-green-500",
		ring: "ring-green-500/40",
		badge: "bg-green-500",
		bg: "bg-green-500/10",
	},
	Thursday: {
		dot: "bg-orange-500",
		ring: "ring-orange-500/40",
		badge: "bg-orange-500",
		bg: "bg-orange-500/10",
	},
	Friday: {
		dot: "bg-pink-500",
		ring: "ring-pink-500/40",
		badge: "bg-pink-500",
		bg: "bg-pink-500/10",
	},
	Saturday: {
		dot: "bg-cyan-500",
		ring: "ring-cyan-500/40",
		badge: "bg-cyan-500",
		bg: "bg-cyan-500/10",
	},
	Sunday: {
		dot: "bg-gray-500",
		ring: "ring-gray-500/40",
		badge: "bg-gray-500",
		bg: "bg-gray-500/10",
	},
};

function addMinutes(time: string, minutes: number): string {
	const [h, m] = time.split(":").map(Number);
	const total = h * 60 + m + minutes;
	const newH = Math.floor(total / 60) % 24;
	const newM = total % 60;
	return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

// Extracted sub-component — remounts on day change via key={activeDay}
function DayPeriodsEditor({
	control,
	watch,
	setValue,
	dayIndex,
	activeDay,
	allDays,
	subjects,
	teachers,
	rooms,
	roomNumber,
}: DayPeriodsEditorProps) {
	const { t } = useLanguage();
	const { fields, append, remove } = useFieldArray({
		control,
		name: `schedule.${dayIndex}.periods` as const,
	});

	const watchedSchedule = watch("schedule");
	const periodCounts = useMemo(() => {
		const counts: Record<string, number> = {};
		watchedSchedule?.forEach((s) => {
			counts[s.day] = s.periods?.length || 0;
		});
		return counts;
	}, [watchedSchedule]);

	const daysWithPeriods = allDays.filter(
		(d) => d !== activeDay && (periodCounts[d] || 0) > 0,
	);
	const otherDays = allDays.filter((d) => d !== activeDay);
	const dayColor = DAY_COLORS[activeDay] || DAY_COLORS.Monday;

	const addPeriod = () => {
		const lastPeriod = fields[fields.length - 1] as unknown as SchedulePeriod;
		const nextNumber = fields.length + 1;
		const startTime = lastPeriod?.endTime || "08:00";
		const endTime = addMinutes(startTime, 45);

		append({
			periodNumber: nextNumber,
			subjectId: "",
			teacherId: "",
			startTime,
			endTime,
			room: roomNumber || "",
		});
	};

	const copyDayTo = (targetDay: DayOfWeek) => {
		const sourceIndex = allDays.indexOf(activeDay);
		const targetIndex = allDays.indexOf(targetDay);
		if (sourceIndex === -1 || targetIndex === -1) return;
		const sourcePeriods = watchedSchedule[sourceIndex]?.periods || [];
		setValue(`schedule.${targetIndex}.periods`, [...sourcePeriods]);
	};

	const copyDayFrom = (sourceDay: DayOfWeek) => {
		const sourceIndex = allDays.indexOf(sourceDay);
		const targetIndex = allDays.indexOf(activeDay);
		if (sourceIndex === -1 || targetIndex === -1) return;
		const sourcePeriods = watchedSchedule[sourceIndex]?.periods || [];
		setValue(`schedule.${targetIndex}.periods`, [...sourcePeriods]);
	};

	return (
		<>
			{/* Day Toolbar */}
			<div className="px-6 pb-3 flex items-center justify-between">
				<h3 className="font-semibold text-sm">
					{t(activeDay.toLowerCase()) || activeDay}{" "}
					{t("schedule") || "Schedule"}
				</h3>
				<div className="flex items-center gap-2">
					{fields.length > 0 && otherDays.length > 0 && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="gap-1.5 h-8 text-xs"
								>
									<Copy className="h-3.5 w-3.5" />
									{t("copy_to") || "Copy to..."}
									<ChevronDown className="h-3 w-3" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{otherDays.map((day) => (
									<DropdownMenuItem key={day} onClick={() => copyDayTo(day)}>
										{t(day.toLowerCase()) || day}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					)}
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={addPeriod}
						className="gap-1.5 h-8 text-xs"
					>
						<Plus className="h-3.5 w-3.5" />
						{t("add_period") || "Add Period"}
					</Button>
				</div>
			</div>

			{/* Scrollable Period List */}
			<div className="flex-1 overflow-y-auto px-6 pb-4 space-y-3">
				<AnimatePresence mode="popLayout" initial={false}>
					{fields.length === 0 ? (
						<motion.div
							key="empty"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="py-10 flex flex-col items-center text-center"
						>
							<div className="p-3 rounded-full bg-muted/50 mb-3">
								<CalendarClock className="h-6 w-6 text-muted-foreground" />
							</div>
							<p className="text-sm font-medium mb-1">
								{t("no_periods_for_day") ||
									`No periods for ${t(activeDay.toLowerCase()) || activeDay}`}
							</p>
							<p className="text-xs text-muted-foreground mb-4 max-w-[280px]">
								{t("add_first_period_or_copy") ||
									"Add a period to start building this day's schedule, or copy from another day."}
							</p>
							<div className="flex items-center gap-2">
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={addPeriod}
									className="gap-1.5"
								>
									<Plus className="h-3.5 w-3.5" />
									{t("add_period") || "Add Period"}
								</Button>
								{daysWithPeriods.length > 0 && (
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												type="button"
												variant="outline"
												size="sm"
												className="gap-1.5"
											>
												<Copy className="h-3.5 w-3.5" />
												{t("copy_from") || "Copy from..."}
												<ChevronDown className="h-3 w-3" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="center">
											{daysWithPeriods.map((day) => (
												<DropdownMenuItem
													key={day}
													onClick={() => copyDayFrom(day)}
												>
													{t(day.toLowerCase()) || day} ({periodCounts[day]}{" "}
													{t("periods") || "periods"})
												</DropdownMenuItem>
											))}
										</DropdownMenuContent>
									</DropdownMenu>
								)}
							</div>
						</motion.div>
					) : (
						fields.map((field, pIdx) => (
							<motion.div
								key={field.id}
								initial={{ opacity: 0, y: 8 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -8 }}
								transition={{ duration: 0.2 }}
								className="liquid-glass-card p-4 group relative"
							>
								{/* Period badge + delete */}
								<div className="flex items-center justify-between mb-3">
									<span
										className={cn(
											"inline-flex items-center justify-center h-6 w-6 rounded-md text-xs font-bold text-white",
											dayColor.badge,
										)}
									>
										{pIdx + 1}
									</span>
									<Button
										type="button"
										variant="ghost"
										size="icon"
										className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
										onClick={() => remove(pIdx)}
									>
										<Trash2 className="h-3.5 w-3.5" />
									</Button>
								</div>

								{/* Row 1: Subject + Teacher */}
								<div className="grid grid-cols-2 gap-3 mb-3">
									<div className="space-y-1.5">
										<Label className="text-[11px] uppercase text-muted-foreground font-medium">
											{t("subject") || "Subject"}
										</Label>
										<Controller
											control={control}
											name={`schedule.${dayIndex}.periods.${pIdx}.subjectId`}
											render={({ field: f }) => (
												<Select value={f.value} onValueChange={f.onChange}>
													<SelectTrigger className="h-9">
														<SelectValue
															placeholder={
																t("select_subject") || "Select Subject"
															}
														/>
													</SelectTrigger>
													<SelectContent>
														{subjects.map((s) => (
															<SelectItem key={s.id} value={s.id}>
																{s.subjectName}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											)}
										/>
									</div>
									<div className="space-y-1.5">
										<Label className="text-[11px] uppercase text-muted-foreground font-medium">
											{t("teacher") || "Teacher"}
										</Label>
										<Controller
											control={control}
											name={`schedule.${dayIndex}.periods.${pIdx}.teacherId`}
											render={({ field: f }) => (
												<Select value={f.value} onValueChange={f.onChange}>
													<SelectTrigger className="h-9">
														<SelectValue
															placeholder={
																t("select_teacher") || "Select Teacher"
															}
														/>
													</SelectTrigger>
													<SelectContent>
														{teachers.map((teacher) => (
															<SelectItem key={teacher.id} value={teacher.id}>
																{teacher.firstName} {teacher.lastName}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											)}
										/>
									</div>
								</div>

								{/* Row 2: Start time + End time + Room */}
								<div className="grid grid-cols-3 gap-3">
									<div className="space-y-1.5">
										<Label className="text-[11px] uppercase text-muted-foreground font-medium">
											{t("start_time") || "Start"}
										</Label>
										<Controller
											control={control}
											name={`schedule.${dayIndex}.periods.${pIdx}.startTime`}
											render={({ field: f }) => (
												<Input type="time" {...f} className="h-9" />
											)}
										/>
									</div>
									<div className="space-y-1.5">
										<Label className="text-[11px] uppercase text-muted-foreground font-medium">
											{t("end_time") || "End"}
										</Label>
										<Controller
											control={control}
											name={`schedule.${dayIndex}.periods.${pIdx}.endTime`}
											render={({ field: f }) => (
												<Input type="time" {...f} className="h-9" />
											)}
										/>
									</div>
									<div className="space-y-1.5">
										<Label className="text-[11px] uppercase text-muted-foreground font-medium">
											{t("room") || "Room"}
										</Label>
										<Controller
											control={control}
											name={`schedule.${dayIndex}.periods.${pIdx}.room`}
											render={({ field: f }) => (
												<Select value={f.value} onValueChange={f.onChange}>
													<SelectTrigger className="h-9">
														<SelectValue
															placeholder={t("select_room") || "Select Room"}
														/>
													</SelectTrigger>
													<SelectContent>
														{rooms.map((room) => (
															<SelectItem key={room.id} value={room.name}>
																{room.name}
																{room.building ? ` - ${room.building}` : ""}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											)}
										/>
									</div>
								</div>
							</motion.div>
						))
					)}
				</AnimatePresence>
			</div>
		</>
	);
}

export function TimetableEditor({
	classData,
	onSave,
	onCancel,
}: TimetableEditorProps) {
	const { t } = useLanguage();
	const [activeDay, setActiveDay] = useState<DayOfWeek>("Monday");
	const [isSaving, setIsSaving] = useState(false);

	const { subjects, isLoading: isLoadingSubjects } = useSubjects({
		schoolId: classData.schoolId,
		pageSize: 100,
	});
	const { staffList: teachers, loading: isLoadingTeachers } = useStaff(
		classData.schoolId,
	);
	const { rooms, isLoading: isLoadingRooms } = useRooms(classData.schoolId);

	const allDays: DayOfWeek[] = [...DAYS];
	const hasSunday = classData.schedule?.some(
		(s) => s.day === "Sunday" && s.periods && s.periods.length > 0,
	);
	if (hasSunday) {
		allDays.push("Sunday");
	}

	const { control, handleSubmit, watch, setValue } = useForm<ScheduleFormData>({
		defaultValues: {
			schedule: allDays.map((day) => {
				const existingDay = classData.schedule?.find((s) => s.day === day);
				return {
					day,
					periods: existingDay?.periods || [],
				};
			}),
		},
	});

	const watchedSchedule = watch("schedule");

	const periodCounts = useMemo(() => {
		const counts: Record<string, number> = {};
		watchedSchedule?.forEach((s) => {
			counts[s.day] = s.periods?.length || 0;
		});
		return counts;
	}, [watchedSchedule]);

	const totalPeriods = useMemo(() => {
		return Object.values(periodCounts).reduce((a, b) => a + b, 0);
	}, [periodCounts]);

	const dayIndex = allDays.indexOf(activeDay);

	const onSubmit = async (data: ScheduleFormData) => {
		setIsSaving(true);
		try {
			await onSave(data.schedule);
		} catch (error) {
			console.error("Failed to save schedule:", error);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="flex flex-col max-h-[85vh]">
			{/* Header */}
			<div className="px-6 pt-6 pb-4">
				<div className="flex items-center gap-3">
					<div className="p-2 rounded-lg bg-primary/10">
						<CalendarClock className="h-5 w-5 text-primary" />
					</div>
					<div className="flex-1">
						<h2 className="text-lg font-semibold">
							{t("edit_timetable") || "Edit Timetable"}
						</h2>
						<p className="text-sm text-muted-foreground">{classData.name}</p>
					</div>
					<Badge variant="secondary" className="text-xs">
						{totalPeriods} {t("periods") || "periods"}
					</Badge>
				</div>
			</div>

			{/* Mini Weekly Overview */}
			<div className="px-6 pb-4">
				<div className="flex gap-1.5">
					{allDays.map((day) => {
						const count = periodCounts[day] || 0;
						const colors = DAY_COLORS[day] || DAY_COLORS.Monday;
						const isActive = day === activeDay;

						return (
							<button
								key={day}
								type="button"
								onClick={() => setActiveDay(day)}
								className={cn(
									"flex-1 flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-lg transition-all cursor-pointer",
									isActive
										? `${colors.bg} ring-2 ${colors.ring}`
										: "hover:bg-muted/50",
								)}
							>
								<span
									className={cn(
										"text-xs font-medium",
										isActive ? "text-foreground" : "text-muted-foreground",
									)}
								>
									{(t(day.toLowerCase()) || day).slice(0, 3)}
								</span>
								<div className="flex gap-0.5">
									{count > 0 ? (
										Array.from({
											length: Math.min(count, 5),
										}).map((_, i) => (
											<div
												key={i}
												className={cn("h-1.5 w-1.5 rounded-full", colors.dot)}
											/>
										))
									) : (
										<div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/20" />
									)}
								</div>
								{count > 5 && (
									<span className="text-[10px] text-muted-foreground">
										+{count - 5}
									</span>
								)}
							</button>
						);
					})}
				</div>
			</div>

			{/* Day-specific editor — key forces remount on day change */}
			<DayPeriodsEditor
				key={activeDay}
				control={control}
				watch={watch}
				setValue={setValue}
				dayIndex={dayIndex}
				activeDay={activeDay}
				allDays={allDays}
				subjects={subjects}
				teachers={teachers}
				rooms={rooms}
				roomNumber={classData.roomNumber}
			/>

			{/* Footer */}
			<div className="px-6 py-4 border-t flex justify-end gap-3 bg-muted/5">
				<Button variant="outline" onClick={onCancel} disabled={isSaving}>
					{t("cancel") || "Cancel"}
				</Button>
				<Button
					onClick={handleSubmit(onSubmit)}
					disabled={isSaving}
					className="gap-2"
				>
					{isSaving ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<Save className="h-4 w-4" />
					)}
					{t("save_schedule") || "Save Schedule"}
				</Button>
			</div>
		</div>
	);
}
