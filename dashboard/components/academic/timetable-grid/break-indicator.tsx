"use client";

import { Coffee } from "lucide-react";

interface BreakIndicatorProps {
	startTime: string;
	endTime: string;
	label: string;
}

export function BreakIndicator({ startTime, endTime, label }: BreakIndicatorProps) {
	return (
		<div className="flex items-center gap-2 py-1.5 px-2">
			<div className="flex-1 border-t border-dashed border-muted-foreground/20" />
			<span className="flex items-center gap-1 text-[10px] text-muted-foreground whitespace-nowrap">
				<Coffee className="h-2.5 w-2.5" />
				{label} · {startTime} – {endTime}
			</span>
			<div className="flex-1 border-t border-dashed border-muted-foreground/20" />
		</div>
	);
}
