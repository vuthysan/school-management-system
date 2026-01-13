"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
	message?: string;
	className?: string;
}

export function LoadingState({
	message = "Loading...",
	className,
}: LoadingStateProps) {
	return (
		<div
			className={cn(
				"flex flex-col items-center justify-center min-h-[300px] space-y-6",
				className
			)}
		>
			<div className="relative h-16 w-16">
				<div className="absolute inset-0 rounded-full border-4 border-primary/20" />
				<div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
				<div className="absolute inset-4 rounded-full bg-primary/20 blur-md animate-pulse" />
			</div>
			<p className="font-black uppercase tracking-[0.3em] text-[10px] text-primary/80 animate-pulse">
				{message}
			</p>
		</div>
	);
}
