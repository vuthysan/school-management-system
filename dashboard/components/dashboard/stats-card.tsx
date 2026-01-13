"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
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
	const variants = {
		blue: {
			icon: "bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-lg shadow-blue-500/30",
			text: "from-blue-400 to-blue-600",
			trend: "text-blue-500",
		},
		green: {
			icon: "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30",
			text: "from-emerald-400 to-emerald-600",
			trend: "text-emerald-500",
		},
		emerald: {
			icon: "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30",
			text: "from-emerald-400 to-emerald-600",
			trend: "text-emerald-500",
		},
		purple: {
			icon: "bg-gradient-to-br from-violet-400 to-violet-600 text-white shadow-lg shadow-violet-500/30",
			text: "from-violet-400 to-violet-600",
			trend: "text-violet-500",
		},
		violet: {
			icon: "bg-gradient-to-br from-violet-400 to-violet-600 text-white shadow-lg shadow-violet-500/30",
			text: "from-violet-400 to-violet-600",
			trend: "text-violet-500",
		},
		orange: {
			icon: "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/30",
			text: "from-amber-400 to-amber-600",
			trend: "text-amber-500",
		},
		amber: {
			icon: "bg-gradient-to-br from-amber-400 to-amber-600 text-white shadow-lg shadow-amber-500/30",
			text: "from-amber-400 to-amber-600",
			trend: "text-amber-500",
		},
		rose: {
			icon: "bg-gradient-to-br from-rose-400 to-rose-600 text-white shadow-lg shadow-rose-500/30",
			text: "from-rose-400 to-rose-600",
			trend: "text-rose-500",
		},
	};

	const style = variants[color as keyof typeof variants] || variants.blue;

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay }}
			className={`relative overflow-hidden ${className} rounded-3xl`}
		>
			<div className="glass-card h-[160px] relative overflow-hidden group p-6 flex flex-col justify-between">
				{/* Background Glow */}
				<div
					className={cn(
						"absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[60px] opacity-20 transition-opacity duration-500 group-hover:opacity-40",
						`bg-${color}-500`
					)}
				/>

				<div className="flex justify-between items-start relative z-10">
					<div>
						<h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80 mb-1">
							{title}
						</h3>
						<div className="flex items-baseline gap-2">
							<span className="text-4xl font-black tracking-tighter text-foreground">
								{value}
							</span>
						</div>
					</div>
					<div
						className={cn(
							"p-3 rounded-2xl transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6",
							style.icon
						)}
					>
						<Icon className="h-6 w-6" strokeWidth={2.5} />
					</div>
				</div>

				<div className="relative z-10 flex items-end justify-between mt-auto">
					<div className="space-y-1">
						{trend && (
							<div
								className={cn(
									"flex items-center gap-1.5 text-xs font-black uppercase tracking-tight py-1 px-2 rounded-full bg-white/10 dark:bg-black/10 backdrop-blur-sm w-fit",
									trend.isPositive ? "text-emerald-500" : "text-rose-500"
								)}
							>
								<span>
									{trend.isPositive ? "+" : "-"}
									{Math.abs(trend.value)}%
								</span>
								<span className="text-muted-foreground/60 font-medium normal-case tracking-normal">
									vs last month
								</span>
							</div>
						)}
						{subtitle && (
							<p className="text-xs font-medium text-muted-foreground/60 pl-1">
								{subtitle}
							</p>
						)}
					</div>
				</div>
			</div>
		</motion.div>
	);
}
