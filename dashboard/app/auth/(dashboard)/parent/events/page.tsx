"use client";

import { CalendarDays, Clock, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const demoEvents = [
	{ id: "1", title: "Parent-Teacher Conference", date: "2026-03-15", time: "09:00 - 12:00", location: "Main Hall", type: "Meeting" },
	{ id: "2", title: "Mid-term Examination", date: "2026-03-20", time: "08:00 - 11:00", location: "Classrooms", type: "Exam" },
	{ id: "3", title: "School Sports Day", date: "2026-04-05", time: "07:30 - 15:00", location: "Sports Field", type: "Event" },
	{ id: "4", title: "Khmer New Year Celebration", date: "2026-04-14", time: "08:00 - 12:00", location: "School Campus", type: "Holiday" },
	{ id: "5", title: "Final Examination", date: "2026-06-15", time: "08:00 - 11:00", location: "Classrooms", type: "Exam" },
];

const typeColors: Record<string, string> = {
	Meeting: "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
	Exam: "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
	Event: "bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",
	Holiday: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
};

export default function ParentEventsPage() {
	const { t } = useTranslation();

	return (
		<div className="space-y-6 pb-10">
			<PageHeader
				title={t("school_events")}
				subtitle={t("upcoming_events_exams")}
				icon={CalendarDays}
			/>

			<div className="space-y-3">
				{demoEvents.map((event, idx) => (
					<motion.div
						key={event.id}
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: idx * 0.05 }}
					>
						<div className="liquid-glass-card rounded-2xl p-4 flex items-start gap-4">
							{/* Date badge */}
							<div className="w-14 h-14 rounded-xl bg-primary/8 flex flex-col items-center justify-center shrink-0">
								<span className="text-lg font-bold text-primary leading-none">
									{new Date(event.date).getDate()}
								</span>
								<span className="text-[10px] text-primary/70 font-medium uppercase">
									{new Date(event.date).toLocaleString("en", { month: "short" })}
								</span>
							</div>

							<div className="flex-1 min-w-0">
								<div className="flex items-center gap-2 mb-1">
									<h3 className="text-sm font-semibold text-foreground">{event.title}</h3>
									<Badge variant="secondary" className={cn("border-none text-xs", typeColors[event.type])}>
										{event.type}
									</Badge>
								</div>
								<div className="flex items-center gap-4 text-xs text-muted-foreground">
									<span className="flex items-center gap-1">
										<Clock className="h-3 w-3" />
										{event.time}
									</span>
									<span className="flex items-center gap-1">
										<MapPin className="h-3 w-3" />
										{event.location}
									</span>
								</div>
							</div>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
}
