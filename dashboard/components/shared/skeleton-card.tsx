import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface SkeletonProps {
	className?: string;
}

export function StatsCardSkeleton({ className }: SkeletonProps) {
	return (
		<div
			className={cn(
				"relative liquid-glass-card rounded-xl px-4 py-3.5 overflow-hidden",
				className
			)}
		>
			<Skeleton className="absolute top-0 left-0 right-0 h-0.5" />

			<div className="flex items-center gap-3.5">
				<Skeleton className="w-9 h-9 rounded-lg shrink-0" />
				<div className="flex-1">
					<Skeleton className="h-5 w-12 mb-1" />
					<Skeleton className="h-3 w-20" />
				</div>
				<Skeleton className="w-14 h-5 rounded-md" />
			</div>
		</div>
	);
}

export function TableSkeleton({
	rows = 5,
	columns = 4,
	className,
}: SkeletonProps & { rows?: number; columns?: number }) {
	return (
		<div className={cn("w-full", className)}>
			{/* Header */}
			<div className="flex gap-4 px-3 py-3 border-b border-black/6 dark:border-white/6">
				{Array.from({ length: columns }).map((_, i) => (
					<Skeleton
						key={`head-${i}`}
						className="h-3"
						style={{ width: `${Math.random() * 40 + 60}px` }}
					/>
				))}
			</div>

			{/* Rows */}
			{Array.from({ length: rows }).map((_, rowIndex) => (
				<div
					key={`row-${rowIndex}`}
					className="flex items-center gap-4 px-3 py-3 border-b border-black/6 dark:border-white/6 last:border-0"
				>
					{Array.from({ length: columns }).map((_, colIndex) => (
						<Skeleton
							key={`cell-${rowIndex}-${colIndex}`}
							className="h-4"
							style={{
								width: `${colIndex === 0 ? 140 : Math.random() * 60 + 50}px`,
							}}
						/>
					))}
				</div>
			))}
		</div>
	);
}

export function PageHeaderSkeleton({ className }: SkeletonProps) {
	return (
		<div
			className={cn(
				"relative overflow-hidden rounded-xl liquid-glass-card px-6 py-5",
				className
			)}
		>
			<div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
				<div className="flex items-center gap-4">
					<Skeleton className="w-11 h-11 rounded-lg shrink-0" />
					<div>
						<Skeleton className="h-3 w-20 mb-2" />
						<Skeleton className="h-6 w-48 mb-1.5" />
						<Skeleton className="h-3 w-64" />
					</div>
				</div>
				<Skeleton className="hidden md:block h-4 w-40" />
			</div>
		</div>
	);
}

export function CardSkeleton({ className }: SkeletonProps) {
	return (
		<div
			className={cn(
				"liquid-glass-card rounded-xl p-6",
				className
			)}
		>
			<Skeleton className="h-5 w-32 mb-4" />
			<div className="space-y-3">
				<Skeleton className="h-4 w-full" />
				<Skeleton className="h-4 w-3/4" />
				<Skeleton className="h-4 w-1/2" />
			</div>
		</div>
	);
}
