"use client";

import { useAnnouncements } from "@/hooks/useAnnouncements";
import {
	AnnouncementPriority,
	AnnouncementTargetType,
} from "@/types/communication";
import { Badge } from "@/components/ui/badge";
import { Megaphone, ChevronRight, Loader2, Bell } from "lucide-react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface AnnouncementFeedProps {
	schoolId: string | null;
	limit?: number;
}

export function AnnouncementFeed({
	schoolId,
	limit = 3,
}: AnnouncementFeedProps) {
	const { announcements, isLoading } = useAnnouncements(schoolId);

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center py-10 space-y-3">
				<Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
				<p className="text-xs text-muted-foreground">
					Loading announcements...
				</p>
			</div>
		);
	}

	if (!announcements || announcements.length === 0) {
		return (
			<div className="flex items-center gap-3 py-4 px-1">
				<div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
					<Bell className="w-4 h-4 text-muted-foreground" />
				</div>
				<div>
					<h3 className="text-sm font-medium text-foreground">
						No Recent Notices
					</h3>
					<p className="text-xs text-muted-foreground mt-0.5">
						Updates will appear here.
					</p>
				</div>
			</div>
		);
	}

	const recentAnnouncements = announcements.slice(0, limit);

	return (
		<div className="flex flex-col h-full">
			<div className="flex items-center justify-between mb-3">
				<div className="flex items-center gap-2.5">
					<div className="w-7 h-7 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center">
						<Megaphone className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
					</div>
					<h2 className="text-sm font-semibold text-foreground">
						Recent Notices
					</h2>
				</div>
				<Link href="/auth/admin/communication">
					<Button
						variant="ghost"
						size="sm"
						className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1"
					>
						View All
						<ChevronRight className="w-3 h-3" />
					</Button>
				</Link>
			</div>

			<div className="space-y-3 flex-1">
				{recentAnnouncements.map((announcement, idx) => (
					<motion.div
						key={announcement.id}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: idx * 0.1 }}
						className="p-3.5 rounded-lg border border-black/6 dark:border-white/6 hover:bg-muted/30 transition-colors cursor-pointer group"
					>
						<div className="space-y-2">
							<div className="flex items-start justify-between gap-3">
								<div className="flex flex-wrap items-center gap-1.5">
									{announcement.priority === AnnouncementPriority.Urgent && (
										<Badge className="bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400 border-none py-0 px-1.5 h-5 text-xs font-medium shadow-none">
											Urgent
										</Badge>
									)}
									{announcement.priority === AnnouncementPriority.High && (
										<Badge className="bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-400 border-none py-0 px-1.5 h-5 text-xs font-medium shadow-none">
											High
										</Badge>
									)}
									<Badge
										variant="outline"
										className="py-0 px-1.5 h-5 text-xs text-muted-foreground"
									>
										{announcement.targetType}
									</Badge>
								</div>
								<span className="text-xs text-muted-foreground whitespace-nowrap">
									{format(new Date(announcement.createdAt), "MMM dd")}
								</span>
							</div>

							<div>
								<h3 className="text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
									{announcement.title}
								</h3>
								<p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
									{announcement.content}
								</p>
							</div>

							<div className="flex items-center gap-2">
								<div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground">
									{announcement.authorName.substring(0, 2).toUpperCase()}
								</div>
								<span className="text-xs text-muted-foreground">
									{announcement.authorName}
								</span>
							</div>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
}
