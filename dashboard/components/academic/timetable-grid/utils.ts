import type { DayOfWeek, Subject } from "@/types/academic";
import type { SubjectColorEntry } from "./types";

// ============================================================================
// DAY COLORS (reused from existing timetable-editor)
// ============================================================================

export const DAYS: DayOfWeek[] = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
];

export const DAY_COLORS: Record<
	string,
	{ dot: string; ring: string; badge: string; bg: string; header: string; text: string }
> = {
	Monday: {
		dot: "bg-blue-500",
		ring: "ring-blue-500/40",
		badge: "bg-blue-500",
		bg: "bg-blue-500/10",
		header: "bg-blue-50 dark:bg-blue-950/30",
		text: "text-blue-700 dark:text-blue-300",
	},
	Tuesday: {
		dot: "bg-purple-500",
		ring: "ring-purple-500/40",
		badge: "bg-purple-500",
		bg: "bg-purple-500/10",
		header: "bg-purple-50 dark:bg-purple-950/30",
		text: "text-purple-700 dark:text-purple-300",
	},
	Wednesday: {
		dot: "bg-green-500",
		ring: "ring-green-500/40",
		badge: "bg-green-500",
		bg: "bg-green-500/10",
		header: "bg-green-50 dark:bg-green-950/30",
		text: "text-green-700 dark:text-green-300",
	},
	Thursday: {
		dot: "bg-orange-500",
		ring: "ring-orange-500/40",
		badge: "bg-orange-500",
		bg: "bg-orange-500/10",
		header: "bg-orange-50 dark:bg-orange-950/30",
		text: "text-orange-700 dark:text-orange-300",
	},
	Friday: {
		dot: "bg-pink-500",
		ring: "ring-pink-500/40",
		badge: "bg-pink-500",
		bg: "bg-pink-500/10",
		header: "bg-pink-50 dark:bg-pink-950/30",
		text: "text-pink-700 dark:text-pink-300",
	},
	Saturday: {
		dot: "bg-cyan-500",
		ring: "ring-cyan-500/40",
		badge: "bg-cyan-500",
		bg: "bg-cyan-500/10",
		header: "bg-cyan-50 dark:bg-cyan-950/30",
		text: "text-cyan-700 dark:text-cyan-300",
	},
	Sunday: {
		dot: "bg-gray-500",
		ring: "ring-gray-500/40",
		badge: "bg-gray-500",
		bg: "bg-gray-500/10",
		header: "bg-gray-50 dark:bg-gray-950/30",
		text: "text-gray-700 dark:text-gray-300",
	},
};

// ============================================================================
// SUBJECT COLORS
// ============================================================================

export const SUBJECT_COLORS: SubjectColorEntry[] = [
	{ bg: "bg-blue-50 dark:bg-blue-950/30", border: "border-l-blue-500", text: "text-blue-700 dark:text-blue-300", dot: "bg-blue-500" },
	{ bg: "bg-purple-50 dark:bg-purple-950/30", border: "border-l-purple-500", text: "text-purple-700 dark:text-purple-300", dot: "bg-purple-500" },
	{ bg: "bg-green-50 dark:bg-green-950/30", border: "border-l-green-500", text: "text-green-700 dark:text-green-300", dot: "bg-green-500" },
	{ bg: "bg-orange-50 dark:bg-orange-950/30", border: "border-l-orange-500", text: "text-orange-700 dark:text-orange-300", dot: "bg-orange-500" },
	{ bg: "bg-pink-50 dark:bg-pink-950/30", border: "border-l-pink-500", text: "text-pink-700 dark:text-pink-300", dot: "bg-pink-500" },
	{ bg: "bg-cyan-50 dark:bg-cyan-950/30", border: "border-l-cyan-500", text: "text-cyan-700 dark:text-cyan-300", dot: "bg-cyan-500" },
	{ bg: "bg-amber-50 dark:bg-amber-950/30", border: "border-l-amber-500", text: "text-amber-700 dark:text-amber-300", dot: "bg-amber-500" },
	{ bg: "bg-red-50 dark:bg-red-950/30", border: "border-l-red-500", text: "text-red-700 dark:text-red-300", dot: "bg-red-500" },
	{ bg: "bg-indigo-50 dark:bg-indigo-950/30", border: "border-l-indigo-500", text: "text-indigo-700 dark:text-indigo-300", dot: "bg-indigo-500" },
	{ bg: "bg-teal-50 dark:bg-teal-950/30", border: "border-l-teal-500", text: "text-teal-700 dark:text-teal-300", dot: "bg-teal-500" },
];

const DEFAULT_COLOR: SubjectColorEntry = {
	bg: "bg-gray-50 dark:bg-gray-950/30",
	border: "border-l-gray-400",
	text: "text-gray-700 dark:text-gray-300",
	dot: "bg-gray-400",
};

export function buildSubjectColorMap(
	subjects: Subject[]
): Map<string, SubjectColorEntry> {
	const map = new Map<string, SubjectColorEntry>();
	const sorted = [...subjects].sort((a, b) => a.id.localeCompare(b.id));
	sorted.forEach((s, i) => {
		map.set(s.id, SUBJECT_COLORS[i % SUBJECT_COLORS.length]);
	});
	return map;
}

export function getSubjectColor(
	subjectId: string,
	colorMap: Map<string, SubjectColorEntry>
): SubjectColorEntry {
	return colorMap.get(subjectId) || DEFAULT_COLOR;
}

// ============================================================================
// TIME HELPERS
// ============================================================================

export function addMinutes(time: string, minutes: number): string {
	const [h, m] = time.split(":").map(Number);
	const total = h * 60 + m + minutes;
	const newH = Math.floor(total / 60) % 24;
	const newM = total % 60;
	return `${String(newH).padStart(2, "0")}:${String(newM).padStart(2, "0")}`;
}

export function timeToMinutes(time: string): number {
	const [h, m] = time.split(":").map(Number);
	return h * 60 + m;
}

export function formatTimeRange(start: string, end: string): string {
	return `${start} – ${end}`;
}

export function calcDuration(start: string, end: string): number {
	return Math.max(0, timeToMinutes(end) - timeToMinutes(start));
}

export function formatDuration(minutes: number): string {
	if (minutes <= 0) return "";
	if (minutes >= 60) {
		const h = Math.floor(minutes / 60);
		const m = minutes % 60;
		return m > 0 ? `${h}h ${m}m` : `${h}h`;
	}
	return `${minutes}m`;
}
