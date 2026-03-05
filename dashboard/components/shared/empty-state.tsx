"use client";

import React from "react";
import { LucideIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
	icon: LucideIcon;
	title: string;
	description?: string;
	actionLabel?: string;
	onAction?: () => void;
	illustration?: React.ReactNode;
	variant?: "default" | "compact" | "inline";
	className?: string;
}

export function EmptyState({
	icon: Icon,
	title,
	description,
	actionLabel,
	onAction,
	illustration,
	variant = "default",
	className,
}: EmptyStateProps) {
	if (variant === "inline") {
		return (
			<div
				className={cn(
					"flex items-center justify-center gap-2 py-8 text-muted-foreground",
					className
				)}
			>
				<Icon className="h-4 w-4" />
				<span className="text-sm">{title}</span>
				{actionLabel && onAction && (
					<Button
						onClick={onAction}
						variant="soft"
						size="sm"
						className="ml-2 gap-1"
					>
						<Plus className="h-3 w-3" />
						{actionLabel}
					</Button>
				)}
			</div>
		);
	}

	if (variant === "compact") {
		return (
			<div
				className={cn(
					"flex items-center gap-4 py-6 px-4",
					className
				)}
			>
				<div className="p-3 rounded-xl bg-muted/50 shrink-0">
					{illustration || (
						<Icon className="h-6 w-6 text-muted-foreground/50" />
					)}
				</div>
				<div className="flex-1 min-w-0">
					<h3 className="text-sm font-semibold text-foreground">
						{title}
					</h3>
					{description && (
						<p className="text-xs text-muted-foreground mt-0.5">
							{description}
						</p>
					)}
				</div>
				{actionLabel && onAction && (
					<Button
						onClick={onAction}
						variant="soft"
						size="sm"
						className="gap-1.5 shrink-0"
					>
						<Plus className="h-3.5 w-3.5" />
						{actionLabel}
					</Button>
				)}
			</div>
		);
	}

	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center py-16 text-center",
				className
			)}
		>
			{illustration ? (
				<div className="mb-4">{illustration}</div>
			) : (
				<div className="p-4 rounded-full bg-muted/50 mb-4">
					<Icon className="h-10 w-10 text-muted-foreground/50" />
				</div>
			)}
			<h3 className="text-lg font-semibold text-foreground">{title}</h3>
			{description && (
				<p className="text-sm text-muted-foreground mt-1 max-w-sm">
					{description}
				</p>
			)}
			{actionLabel && onAction && (
				<Button onClick={onAction} className="mt-4 gap-2">
					<Plus className="h-4 w-4" />
					{actionLabel}
				</Button>
			)}
		</div>
	);
}
