import type { CalendarEventType } from "@/hooks/useCalendarEvents";

export const EVENT_TYPE_COLORS: Record<
	CalendarEventType,
	{ dot: string; text: string; bg: string; border: string }
> = {
	Holiday: {
		dot: "bg-rose-500",
		text: "text-rose-700 dark:text-rose-400",
		bg: "bg-rose-500/10",
		border: "border-rose-500",
	},
	Break: {
		dot: "bg-amber-500",
		text: "text-amber-700 dark:text-amber-400",
		bg: "bg-amber-500/10",
		border: "border-amber-500",
	},
	Exam: {
		dot: "bg-blue-500",
		text: "text-blue-700 dark:text-blue-400",
		bg: "bg-blue-500/10",
		border: "border-blue-500",
	},
	Event: {
		dot: "bg-emerald-500",
		text: "text-emerald-700 dark:text-emerald-400",
		bg: "bg-emerald-500/10",
		border: "border-emerald-500",
	},
	Meeting: {
		dot: "bg-violet-500",
		text: "text-violet-700 dark:text-violet-400",
		bg: "bg-violet-500/10",
		border: "border-violet-500",
	},
	Deadline: {
		dot: "bg-orange-500",
		text: "text-orange-700 dark:text-orange-400",
		bg: "bg-orange-500/10",
		border: "border-orange-500",
	},
	Other: {
		dot: "bg-gray-500",
		text: "text-gray-700 dark:text-gray-400",
		bg: "bg-gray-500/10",
		border: "border-gray-500",
	},
};
