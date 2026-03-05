"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
	title?: string;
	children: React.ReactNode;
	className?: string;
	contentClassName?: string;
	animate?: boolean;
	delay?: number;
}

export function DashboardCard({
	title,
	children,
	className,
	contentClassName,
	animate = true,
	delay = 0,
}: DashboardCardProps) {
	const content = (
		<Card
			className={cn(
				"liquid-glass-card overflow-hidden hover:border-foreground/10 transition-all duration-200 border-0",
				className
			)}
		>
			{title && (
				<CardHeader className="pb-2">
					<CardTitle className="text-sm font-semibold text-foreground">
						{title}
					</CardTitle>
				</CardHeader>
			)}
			<CardContent className={cn("p-6", contentClassName)}>
				{children}
			</CardContent>
		</Card>
	);

	if (!animate) return content;

	return (
		<motion.div
			initial={{ opacity: 0, y: 12 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3, delay }}
		>
			{content}
		</motion.div>
	);
}
