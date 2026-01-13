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
				"glass-card border-black/5 premium-shadow overflow-hidden smooth-transition hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/5",
				className
			)}
		>
			{title && (
				<CardHeader className="pb-2">
					<CardTitle className="font-bold uppercase tracking-widest text-xs text-foreground/80">
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
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5, delay }}
		>
			{content}
		</motion.div>
	);
}
