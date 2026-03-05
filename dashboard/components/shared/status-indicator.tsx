"use client";

import { cn } from "@/lib/utils";

type Status = "active" | "inactive" | "pending" | "archived";

interface StatusIndicatorProps {
	status: Status;
	label?: string;
	size?: "sm" | "md";
	className?: string;
}

const statusConfig: Record<
	Status,
	{ dot: string; text: string; label: string; pulse: boolean }
> = {
	active: {
		dot: "bg-emerald-500",
		text: "text-emerald-700 dark:text-emerald-400",
		label: "Active",
		pulse: true,
	},
	inactive: {
		dot: "bg-gray-400 dark:bg-gray-500",
		text: "text-gray-600 dark:text-gray-400",
		label: "Inactive",
		pulse: false,
	},
	pending: {
		dot: "bg-amber-500",
		text: "text-amber-700 dark:text-amber-400",
		label: "Pending",
		pulse: true,
	},
	archived: {
		dot: "bg-slate-400 dark:bg-slate-500",
		text: "text-slate-600 dark:text-slate-400",
		label: "Archived",
		pulse: false,
	},
};

export function StatusIndicator({
	status,
	label,
	size = "md",
	className,
}: StatusIndicatorProps) {
	const config = statusConfig[status];
	const displayLabel = label ?? config.label;

	return (
		<span
			className={cn(
				"inline-flex items-center gap-1.5",
				size === "sm" ? "text-xs" : "text-sm",
				className
			)}
		>
			<span className="relative flex shrink-0">
				{config.pulse && (
					<span
						className={cn(
							"absolute inline-flex h-full w-full rounded-full opacity-75",
							config.dot
						)}
						style={{ animation: "pulse-dot 2s ease-in-out infinite" }}
					/>
				)}
				<span
					className={cn(
						"relative inline-flex rounded-full",
						size === "sm" ? "h-1.5 w-1.5" : "h-2 w-2",
						config.dot
					)}
				/>
			</span>
			<span className={cn("font-medium", config.text)}>
				{displayLabel}
			</span>
		</span>
	);
}
