"use client";

import { useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { addMonths, subMonths, parse, format, startOfMonth } from "date-fns";

export type CalendarView = "month" | "list";

export function useCalendarViewState() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const view: CalendarView =
		searchParams.get("view") === "list" ? "list" : "month";

	const activeMonth = useMemo(() => {
		const monthParam = searchParams.get("month");
		if (monthParam) {
			try {
				const parsed = parse(monthParam, "yyyy-MM", new Date());
				if (!isNaN(parsed.getTime())) return startOfMonth(parsed);
			} catch {}
		}
		return startOfMonth(new Date());
	}, [searchParams]);

	const updateParams = useCallback(
		(updates: Record<string, string>) => {
			const params = new URLSearchParams(searchParams.toString());
			for (const [key, value] of Object.entries(updates)) {
				params.set(key, value);
			}
			router.replace(`?${params.toString()}`, { scroll: false });
		},
		[searchParams, router]
	);

	const setView = useCallback(
		(v: CalendarView) => updateParams({ view: v }),
		[updateParams]
	);

	const setActiveMonth = useCallback(
		(d: Date) => updateParams({ month: format(d, "yyyy-MM") }),
		[updateParams]
	);

	const goToPrevMonth = useCallback(
		() => setActiveMonth(subMonths(activeMonth, 1)),
		[activeMonth, setActiveMonth]
	);

	const goToNextMonth = useCallback(
		() => setActiveMonth(addMonths(activeMonth, 1)),
		[activeMonth, setActiveMonth]
	);

	const goToToday = useCallback(() => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete("month");
		router.replace(`?${params.toString()}`, { scroll: false });
	}, [searchParams, router]);

	return {
		view,
		activeMonth,
		setView,
		setActiveMonth,
		goToPrevMonth,
		goToNextMonth,
		goToToday,
	};
}
