"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsCardProps {
	title: string;
	value: string | number;
	subtitle?: string;
	icon: LucideIcon;
	color?:
		| "blue"
		| "green"
		| "purple"
		| "orange"
		| "emerald"
		| "amber"
		| "violet"
		| "rose";
	trend?: {
		value: number;
		isPositive: boolean;
	};
	delay?: number;
	className?: string;
}

const colorStyles = {
	blue: {
		icon: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400",
		accent: "bg-blue-500",
		border: "border-blue-200 dark:border-blue-800/50",
	},
	green: {
		icon: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400",
		accent: "bg-emerald-500",
		border: "border-emerald-200 dark:border-emerald-800/50",
	},
	emerald: {
		icon: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400",
		accent: "bg-emerald-500",
		border: "border-emerald-200 dark:border-emerald-800/50",
	},
	purple: {
		icon: "bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400",
		accent: "bg-violet-500",
		border: "border-violet-200 dark:border-violet-800/50",
	},
	violet: {
		icon: "bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400",
		accent: "bg-violet-500",
		border: "border-violet-200 dark:border-violet-800/50",
	},
	orange: {
		icon: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400",
		accent: "bg-amber-500",
		border: "border-amber-200 dark:border-amber-800/50",
	},
	amber: {
		icon: "bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400",
		accent: "bg-amber-500",
		border: "border-amber-200 dark:border-amber-800/50",
	},
	rose: {
		icon: "bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400",
		accent: "bg-rose-500",
		border: "border-rose-200 dark:border-rose-800/50",
	},
};

export function StatsCard({
	title,
	value,
	subtitle,
	icon: Icon,
	color = "blue",
	trend,
	delay = 0,
	className,
}: StatsCardProps) {
	const style = colorStyles[color] || colorStyles.blue;

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
			className={className}
		>
			<div
				className={cn(
					"relative liquid-glass-card px-4 py-3.5 group",
					style.border,
				)}
			>
				{/* Subtle top accent line */}
				<div
					className={cn("absolute top-0 left-0 right-0 h-[1]", style.accent)}
				/>

				<div className="flex items-center gap-3.5">
					<div
						className={cn(
							"w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105",
							style.icon,
						)}
					>
						<Icon className="h-4 w-4" strokeWidth={1.8} />
					</div>

					<div className="flex-1 min-w-0">
						<span className="text-xl font-semibold text-foreground tracking-tight tabular-nums leading-none">
							{value}
						</span>
						<p className="text-xs text-muted-foreground mt-0.5 font-medium truncate">
							{title}
						</p>
						<p className="text-xs text-muted-foreground/60 truncate min-h-4">
							{subtitle || "\u00A0"}
						</p>
					</div>

					{trend && (
						<div
							className={cn(
								"flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-xs font-medium shrink-0",
								trend.isPositive
									? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
									: "bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400",
							)}
						>
							{trend.isPositive ? (
								<TrendingUp className="w-3 h-3" />
							) : (
								<TrendingDown className="w-3 h-3" />
							)}
							{trend.isPositive ? "+" : "-"}
							{Math.abs(trend.value)}%
						</div>
					)}
				</div>
			</div>
		</motion.div>
	);
}
