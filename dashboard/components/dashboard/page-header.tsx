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
	gradient?: string;
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
			initial={{ opacity: 0, y: -8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
			className={cn("w-full", className)}
		>
			<div className="relative liquid-glass-card px-6 py-4">
				{/* Decorative element */}
				<div className="absolute top-0 right-0 w-48 h-48 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/4 blur-2xl" />

				<div className="relative flex flex-col md:flex-row md:items-center justify-between gap-3">
					<div className="flex items-center gap-4">
						{Icon && (
							<div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center text-primary shrink-0">
								<Icon className="w-5 h-5" strokeWidth={1.8} />
							</div>
						)}
						<div>
							<h1 className="text-lg font-semibold text-foreground tracking-tight leading-tight">
								{title}
							</h1>
							{subtitle && (
								<p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
									{subtitle}
								</p>
							)}
						</div>
					</div>

					<div className="flex items-center gap-3 shrink-0">
						{children}
					</div>
				</div>
			</div>
		</motion.div>
	);
}
