"use client";

import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
	title: string;
	subtitle?: string;
	icon?: LucideIcon;
	children?: React.ReactNode;
	className?: string;
}

export function PageHeader({
	title,
	subtitle,
	icon: Icon,
	children,
	className,
}: PageHeaderProps) {
	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.6, ease: "easeOut" }}
			className={cn("w-full mb-8 relative z-10", className)}
		>
			<div className="glass-panel p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden group">
				{/* Subtle Shimmer Effect on Load/Hover */}
				<div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out pointer-events-none" />

				<div className="flex items-center gap-6 relative z-10">
					{Icon && (
						<div className="relative shrink-0">
							<div className="absolute -inset-2 bg-primary/20 blur-xl rounded-full opacity-50 group-hover:opacity-75 transition-opacity duration-500" />
							<div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20 text-white group-hover:scale-105 transition-transform duration-300">
								<Icon className="w-8 h-8" strokeWidth={2} />
							</div>
						</div>
					)}
					<div className="space-y-1">
						<h1 className="text-3xl md:text-4xl font-black tracking-tight text-foreground/90">
							{title}
						</h1>
						{subtitle && (
							<p className="text-base text-muted-foreground/80 font-medium max-w-2xl">
								{subtitle}
							</p>
						)}
					</div>
				</div>

				<div className="flex items-center gap-3 relative z-10">{children}</div>
			</div>
		</motion.div>
	);
}
