"use client";

import { useMemo } from "react";
import { Clock, MapPin, User, BookOpen } from "lucide-react";
import { motion } from "framer-motion";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { ClassSchedule, SchedulePeriod, DayOfWeek } from "@/types/academic";

interface TimetableViewProps {
	schedule: ClassSchedule[];
	className?: string;
	subjects?: Map<string, string>; // subjectId -> subjectName
	teachers?: Map<string, string>; // teacherId -> teacherName
}

const DAYS: DayOfWeek[] = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
];

const DAY_COLORS: Record<DayOfWeek, string> = {
	Monday: "from-blue-500/10 to-blue-500/5 border-blue-500/20",
	Tuesday: "from-purple-500/10 to-purple-500/5 border-purple-500/20",
	Wednesday: "from-green-500/10 to-green-500/5 border-green-500/20",
	Thursday: "from-orange-500/10 to-orange-500/5 border-orange-500/20",
	Friday: "from-pink-500/10 to-pink-500/5 border-pink-500/20",
	Saturday: "from-cyan-500/10 to-cyan-500/5 border-cyan-500/20",
	Sunday: "from-gray-500/10 to-gray-500/5 border-gray-500/20",
};

const DAY_BADGE_COLORS: Record<DayOfWeek, string> = {
	Monday: "bg-blue-500",
	Tuesday: "bg-purple-500",
	Wednesday: "bg-green-500",
	Thursday: "bg-orange-500",
	Friday: "bg-pink-500",
	Saturday: "bg-cyan-500",
	Sunday: "bg-gray-500",
};

export function TimetableView({
	schedule,
	className,
	subjects,
	teachers,
}: TimetableViewProps) {
	const { t } = useLanguage();

	// Create a map of day -> periods for easy lookup
	const scheduleMap = useMemo(() => {
		const map = new Map<DayOfWeek, SchedulePeriod[]>();
		schedule.forEach((daySchedule) => {
			map.set(daySchedule.day, daySchedule.periods || []);
		});
		return map;
	}, [schedule]);

	// Determine which days have classes
	const activeDays = useMemo(() => {
		return DAYS.filter((day) => {
			const periods = scheduleMap.get(day);
			return periods && periods.length > 0;
		});
	}, [scheduleMap]);

	// Get all unique time slots for the grid
	const timeSlots = useMemo(() => {
		const slots = new Set<string>();
		schedule.forEach((daySchedule) => {
			daySchedule.periods?.forEach((period) => {
				slots.add(`${period.startTime}-${period.endTime}`);
			});
		});
		return Array.from(slots).sort();
	}, [schedule]);

	const getSubjectName = (subjectId: string) => {
		if (subjects?.has(subjectId)) {
			return subjects.get(subjectId)!;
		}
		return t("subject") || "Subject";
	};

	const getTeacherName = (teacherId: string) => {
		if (teachers?.has(teacherId)) {
			return teachers.get(teacherId)!;
		}
		return "";
	};

	if (schedule.length === 0 || activeDays.length === 0) {
		return (
			<Card className={className}>
				<CardContent className="py-12">
					<div className="flex flex-col items-center justify-center text-center">
						<div className="p-4 rounded-full bg-muted/50 mb-4">
							<Clock className="h-8 w-8 text-muted-foreground" />
						</div>
						<h3 className="text-lg font-semibold mb-1">
							{t("no_schedule") || "No Schedule Set"}
						</h3>
						<p className="text-sm text-muted-foreground max-w-sm">
							{t("no_schedule_desc") ||
								"This class doesn't have a schedule yet. Add periods to create a weekly timetable."}
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className={className}>
			<CardHeader className="pb-4">
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<Clock className="h-5 w-5 text-primary" />
						{t("weekly_schedule") || "Weekly Schedule"}
					</CardTitle>
					<Badge variant="secondary">
						{activeDays.length} {t("days") || "days"}
					</Badge>
				</div>
			</CardHeader>
			<CardContent>
				{/* Desktop: Grid View */}
				<div className="hidden md:grid md:grid-cols-5 lg:grid-cols-6 gap-4">
					{activeDays.slice(0, 6).map((day, dayIndex) => {
						const periods = scheduleMap.get(day) || [];
						const sortedPeriods = [...periods].sort(
							(a, b) => a.periodNumber - b.periodNumber
						);

						return (
							<motion.div
								key={day}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: dayIndex * 0.1 }}
								className="space-y-2"
							>
								{/* Day Header */}
								<div
									className={`text-center p-2 rounded-lg bg-gradient-to-b ${DAY_COLORS[day]} border`}
								>
									<span
										className={`inline-block px-2 py-0.5 rounded text-xs font-bold text-white ${DAY_BADGE_COLORS[day]}`}
									>
										{t(day.toLowerCase()) || day}
									</span>
								</div>

								{/* Periods */}
								<div className="space-y-2">
									{sortedPeriods.map((period, periodIndex) => (
										<motion.div
											key={`${day}-${period.periodNumber}`}
											initial={{ opacity: 0, scale: 0.95 }}
											animate={{ opacity: 1, scale: 1 }}
											transition={{
												delay: dayIndex * 0.1 + periodIndex * 0.05,
											}}
											className={`p-3 rounded-lg border bg-gradient-to-b ${DAY_COLORS[day]} hover:shadow-md transition-all`}
										>
											{/* Time */}
											<div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
												<Clock className="h-3 w-3" />
												<span>
													{period.startTime} - {period.endTime}
												</span>
											</div>

											{/* Subject */}
											<div className="flex items-center gap-1 font-medium text-sm mb-1">
												<BookOpen className="h-3 w-3 text-primary" />
												<span className="truncate">
													{getSubjectName(period.subjectId)}
												</span>
											</div>

											{/* Teacher */}
											{getTeacherName(period.teacherId) && (
												<div className="flex items-center gap-1 text-xs text-muted-foreground">
													<User className="h-3 w-3" />
													<span className="truncate">
														{getTeacherName(period.teacherId)}
													</span>
												</div>
											)}

											{/* Room */}
											{period.room && (
												<div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
													<MapPin className="h-3 w-3" />
													<span>{period.room}</span>
												</div>
											)}
										</motion.div>
									))}
								</div>
							</motion.div>
						);
					})}
				</div>

				{/* Mobile: Stacked View */}
				<div className="md:hidden space-y-4">
					{activeDays.map((day, dayIndex) => {
						const periods = scheduleMap.get(day) || [];
						const sortedPeriods = [...periods].sort(
							(a, b) => a.periodNumber - b.periodNumber
						);

						return (
							<motion.div
								key={day}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: dayIndex * 0.1 }}
							>
								{/* Day Header */}
								<div
									className={`flex items-center gap-2 p-3 rounded-t-lg bg-gradient-to-r ${DAY_COLORS[day]} border border-b-0`}
								>
									<span
										className={`px-2 py-0.5 rounded text-xs font-bold text-white ${DAY_BADGE_COLORS[day]}`}
									>
										{t(day.toLowerCase()) || day}
									</span>
									<span className="text-xs text-muted-foreground">
										{sortedPeriods.length} {t("periods") || "periods"}
									</span>
								</div>

								{/* Periods List */}
								<div className="border border-t-0 rounded-b-lg divide-y">
									{sortedPeriods.map((period) => (
										<div
											key={`${day}-${period.periodNumber}`}
											className="p-3 flex items-center gap-3"
										>
											{/* Period Number */}
											<div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
												<span className="text-sm font-bold text-primary">
													P{period.periodNumber}
												</span>
											</div>

											{/* Details */}
											<div className="flex-1 min-w-0">
												<div className="font-medium text-sm truncate">
													{getSubjectName(period.subjectId)}
												</div>
												<div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
													<span className="flex items-center gap-1">
														<Clock className="h-3 w-3" />
														{period.startTime} - {period.endTime}
													</span>
													{period.room && (
														<span className="flex items-center gap-1">
															<MapPin className="h-3 w-3" />
															{period.room}
														</span>
													)}
												</div>
											</div>
										</div>
									))}
								</div>
							</motion.div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
