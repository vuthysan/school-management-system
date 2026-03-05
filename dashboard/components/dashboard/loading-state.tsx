"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
	StatsCardSkeleton,
	PageHeaderSkeleton,
	CardSkeleton,
} from "@/components/shared/skeleton-card";

interface LoadingStateProps {
	message?: string;
	variant?: "page" | "section" | "inline";
	className?: string;
}

export function LoadingState({
	message = "Loading...",
	variant = "inline",
	className,
}: LoadingStateProps) {
	if (variant === "page") {
		return (
			<div className={cn("space-y-6 pb-10 animate-in", className)}>
				{/* Page Header Skeleton */}
				<PageHeaderSkeleton />

				{/* Stats Grid Skeleton */}
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<StatsCardSkeleton key={i} />
					))}
				</div>

				{/* Quick Actions Skeleton */}
				<div>
					<Skeleton className="h-4 w-28 mb-3" />
					<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
						{Array.from({ length: 6 }).map((_, i) => (
							<div
								key={i}
								className="liquid-glass-card rounded-2xl p-4 flex flex-col items-center gap-3"
							>
								<Skeleton className="w-10 h-10 rounded-xl" />
								<div className="flex flex-col items-center gap-1.5">
									<Skeleton className="h-3 w-16" />
									<Skeleton className="h-2.5 w-20" />
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Content Grid Skeleton */}
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
					<CardSkeleton className="lg:col-span-2" />
					<div className="space-y-4">
						<CardSkeleton />
						<CardSkeleton />
					</div>
				</div>
			</div>
		);
	}

	if (variant === "section") {
		return (
			<div
				className={cn(
					"liquid-glass-card rounded-xl p-6",
					className
				)}
			>
				<div className="space-y-4">
					<Skeleton className="h-5 w-40" />
					<div className="space-y-3">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-5/6" />
						<Skeleton className="h-4 w-2/3" />
					</div>
				</div>
			</div>
		);
	}

	// Inline spinner (original behavior)
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center min-h-75 space-y-3",
				className
			)}
		>
			<div className="h-7 w-7 rounded-full border-2 border-primary/15 border-t-primary animate-spin" />
			<p className="text-xs text-muted-foreground">{message}</p>
		</div>
	);
}
