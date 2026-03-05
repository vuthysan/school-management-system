"use client";

import { Calendar, Clock, MapPin, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const demoSchedule: Record<string, { time: string; subject: string; teacher: string; room: string }[]> = {
	Monday: [
		{ time: "07:30 - 08:20", subject: "Mathematics", teacher: "Mr. Sokha", room: "Room 101" },
		{ time: "08:30 - 09:20", subject: "Khmer Literature", teacher: "Ms. Channa", room: "Room 101" },
		{ time: "09:30 - 10:20", subject: "English", teacher: "Mr. David", room: "Room 203" },
		{ time: "10:30 - 11:20", subject: "Science", teacher: "Ms. Sreymom", room: "Room 305" },
	],
	Tuesday: [
		{ time: "07:30 - 08:20", subject: "English", teacher: "Mr. David", room: "Room 203" },
		{ time: "08:30 - 09:20", subject: "History", teacher: "Mr. Vichea", room: "Room 102" },
		{ time: "09:30 - 10:20", subject: "Mathematics", teacher: "Mr. Sokha", room: "Room 101" },
		{ time: "10:30 - 11:20", subject: "Physical Education", teacher: "Mr. Bunna", room: "Sports Field" },
	],
	Wednesday: [
		{ time: "07:30 - 08:20", subject: "Science", teacher: "Ms. Sreymom", room: "Room 305" },
		{ time: "08:30 - 09:20", subject: "Mathematics", teacher: "Mr. Sokha", room: "Room 101" },
		{ time: "09:30 - 10:20", subject: "Khmer Literature", teacher: "Ms. Channa", room: "Room 101" },
		{ time: "10:30 - 11:20", subject: "Art", teacher: "Ms. Dara", room: "Art Room" },
	],
	Thursday: [
		{ time: "07:30 - 08:20", subject: "English", teacher: "Mr. David", room: "Room 203" },
		{ time: "08:30 - 09:20", subject: "Science", teacher: "Ms. Sreymom", room: "Room 305" },
		{ time: "09:30 - 10:20", subject: "History", teacher: "Mr. Vichea", room: "Room 102" },
		{ time: "10:30 - 11:20", subject: "Mathematics", teacher: "Mr. Sokha", room: "Room 101" },
	],
	Friday: [
		{ time: "07:30 - 08:20", subject: "Khmer Literature", teacher: "Ms. Channa", room: "Room 101" },
		{ time: "08:30 - 09:20", subject: "English", teacher: "Mr. David", room: "Room 203" },
		{ time: "09:30 - 10:20", subject: "Science", teacher: "Ms. Sreymom", room: "Room 305" },
		{ time: "10:30 - 11:20", subject: "Music", teacher: "Mr. Samnang", room: "Music Room" },
	],
};

const subjectColors: Record<string, string> = {
	Mathematics: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
	"Khmer Literature": "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",
	English: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
	Science: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
	History: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
	"Physical Education": "bg-teal-50 text-teal-700 dark:bg-teal-950/40 dark:text-teal-400",
	Art: "bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400",
	Music: "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400",
};

export default function StudentSchedulePage() {
	const { t } = useTranslation();
	const today = new Date().toLocaleDateString("en", { weekday: "long" });

	return (
		<div className="space-y-6 pb-10">
			<PageHeader
				title={t("student_schedule")}
				subtitle={t("view_class_schedule")}
				icon={Calendar}
			/>

			<div className="space-y-4">
				{days.map((day, dayIdx) => (
					<motion.div
						key={day}
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: dayIdx * 0.05 }}
					>
						<div className="liquid-glass-card rounded-2xl overflow-hidden">
							<div className={cn(
								"px-4 py-2.5 flex items-center gap-2",
								day === today ? "bg-primary/8" : "bg-muted/30"
							)}>
								<Calendar className={cn("h-4 w-4", day === today ? "text-primary" : "text-muted-foreground")} />
								<h3 className={cn(
									"text-sm font-semibold",
									day === today ? "text-primary" : "text-foreground"
								)}>
									{day}
									{day === today && (
										<Badge variant="secondary" className="ml-2 bg-primary/10 text-primary text-[10px]">
											{t("today") || "Today"}
										</Badge>
									)}
								</h3>
							</div>
							<div className="divide-y divide-black/4 dark:divide-white/4">
								{demoSchedule[day].map((slot, idx) => (
									<div key={idx} className="px-4 py-3 flex items-center gap-4">
										<div className="text-xs text-muted-foreground w-24 shrink-0 flex items-center gap-1.5">
											<Clock className="h-3 w-3" />
											{slot.time}
										</div>
										<div className="flex-1 min-w-0">
											<div className="flex items-center gap-2">
												<Badge variant="secondary" className={cn("border-none text-xs", subjectColors[slot.subject] || "")}>
													{slot.subject}
												</Badge>
											</div>
											<div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
												<span>{slot.teacher}</span>
												<span className="flex items-center gap-1">
													<MapPin className="h-3 w-3" />
													{slot.room}
												</span>
											</div>
										</div>
									</div>
								))}
							</div>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
}
