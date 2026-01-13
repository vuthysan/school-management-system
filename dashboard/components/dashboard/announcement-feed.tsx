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
import { cn } from "@/lib/utils";

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
			<div className="glass-card p-6 flex flex-col items-center justify-center min-h-[300px] space-y-4 rounded-2xl">
				<Loader2 className="w-8 h-8 animate-spin text-primary/40" />
				<p className="text-xs font-black uppercase tracking-widest text-muted-foreground animate-pulse">
					Loading announcements...
				</p>
			</div>
		);
	}

	if (!announcements || announcements.length === 0) {
		return (
			<div className="glass-card p-8 border-dashed border-white/20 flex flex-col items-center justify-center text-center space-y-4 bg-white/5 rounded-2xl">
				<div className="p-4 bg-white/5 rounded-full shadow-inner">
					<Bell className="w-8 h-8 text-muted-foreground/30" />
				</div>
				<div className="space-y-1">
					<h3 className="text-sm font-bold uppercase tracking-wider">
						No Recent Notices
					</h3>
					<p className="text-xs text-muted-foreground max-w-[200px] mx-auto">
						Everything is quiet. Important updates will appear here.
					</p>
				</div>
			</div>
		);
	}

	const recentAnnouncements = announcements.slice(0, limit);

	return (
		<div className="glass-card overflow-hidden h-full flex flex-col rounded-2xl">
			<div className="p-6 border-b border-white/10 bg-gradient-to-r from-white/5 to-transparent flex items-center justify-between">
				<div className="flex items-center gap-4">
					<div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-lg shadow-primary/10">
						<Megaphone className="w-5 h-5" />
					</div>
					<div>
						<h2 className="text-sm font-black uppercase tracking-widest text-foreground">
							Recent Notices
						</h2>
						<p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider opacity-70">
							Latest Updates & Alerts
						</p>
					</div>
				</div>
				<Link href="/auth/admin/communication">
					<Button
						variant="ghost"
						size="sm"
						className="h-8 text-[10px] font-black uppercase tracking-wider gap-1 hover:bg-primary/20 hover:text-primary transition-all rounded-xl"
					>
						View All
						<ChevronRight className="w-3 h-3" />
					</Button>
				</Link>
			</div>

			<div className="divide-y divide-white/5 flex-1 overflow-y-auto custom-scrollbar">
				{recentAnnouncements.map((announcement, idx) => (
					<motion.div
						key={announcement.id}
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: idx * 0.15, ease: "easeOut" }}
						className="p-6 hover:bg-white/5 dark:hover:bg-white/5 transition-all cursor-pointer group relative overflow-hidden"
					>
						<div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
						<div className="space-y-3">
							<div className="flex items-start justify-between gap-4">
								<div className="flex flex-wrap items-center gap-2">
									{announcement.priority === AnnouncementPriority.Urgent && (
										<Badge className="bg-red-500/10 text-red-500 border-none py-0.5 px-2 h-5 text-[9px] font-black uppercase tracking-wider shadow-none">
											Urgent
										</Badge>
									)}
									{announcement.priority === AnnouncementPriority.High && (
										<Badge className="bg-orange-500/10 text-orange-500 border-none py-0.5 px-2 h-5 text-[9px] font-black uppercase tracking-wider shadow-none">
											High
										</Badge>
									)}
									<Badge
										variant="outline"
										className="py-0.5 px-2 h-5 text-[9px] font-bold text-muted-foreground uppercase border-white/10 bg-white/5 tracking-wider"
									>
										{announcement.targetType}
									</Badge>
								</div>
								<span className="text-[10px] font-bold text-muted-foreground/40 whitespace-nowrap bg-white/5 px-2 py-1 rounded-lg">
									{format(new Date(announcement.createdAt), "MMM dd, HH:mm")}
								</span>
							</div>

							<div className="space-y-2">
								<h3 className="text-base font-bold text-foreground/90 group-hover:text-primary transition-colors line-clamp-1">
									{announcement.title}
								</h3>
								<p className="text-xs text-muted-foreground/80 line-clamp-2 leading-relaxed font-medium">
									{announcement.content}
								</p>
							</div>

							<div className="flex items-center gap-2 pt-3 mt-1">
								<div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-[9px] font-black text-white shadow-md">
									{announcement.authorName.substring(0, 2).toUpperCase()}
								</div>
								<span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest">
									Posted by{" "}
									<span className="text-foreground/80">
										{announcement.authorName}
									</span>
								</span>
							</div>
						</div>
					</motion.div>
				))}
			</div>
		</div>
	);
}
