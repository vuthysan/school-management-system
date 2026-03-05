"use client";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import type { DayOfWeek } from "@/types/academic";
import { DAY_COLORS } from "./utils";

interface GridHeaderProps {
	days: DayOfWeek[];
	periodCounts: Record<string, number>;
}

export function GridHeader({ days, periodCounts }: GridHeaderProps) {
	const { t } = useLanguage();

	return (
		<div
			className="grid gap-px bg-border"
			style={{ gridTemplateColumns: `repeat(${days.length}, minmax(0, 1fr))` }}
		>
			{days.map((day) => {
				const color = DAY_COLORS[day] || DAY_COLORS.Monday;
				const count = periodCounts[day] || 0;
				const dayLabel = t(day.toLowerCase()) || day;

				return (
					<div
						key={day}
						className={cn(
							"flex flex-col items-center justify-center py-3 px-1 gap-1.5",
							color.header
						)}
					>
						<span className="text-[11px] font-bold text-foreground uppercase tracking-wider">
							{dayLabel.slice(0, 3)}
						</span>
						<span
							className={cn(
								"inline-flex items-center justify-center rounded-full h-5 min-w-5 px-1.5 text-[10px] font-semibold tabular-nums transition-colors",
								count > 0
									? cn(color.bg, color.text)
									: "text-muted-foreground/30"
							)}
						>
							{count}
						</span>
					</div>
				);
			})}
		</div>
	);
}
