"use client";

import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
	MoreHorizontal,
	Pencil,
	Trash2,
	Calendar as CalendarIcon,
	MapPin,
} from "lucide-react";
import { CalendarEvent, CalendarEventType } from "@/hooks/useCalendarEvents";
import { cn } from "@/lib/utils";

interface CalendarEventsTableProps {
	items: CalendarEvent[];
	isLoading: boolean;
	onEdit: (item: CalendarEvent) => void;
	onDelete: (item: CalendarEvent) => void;
}

const EVENT_TYPE_COLORS: Record<string, { dot: string; text: string }> = {
	Holiday: { dot: "bg-rose-500", text: "text-rose-600 dark:text-rose-400" },
	Break: { dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
	Exam: { dot: "bg-blue-500", text: "text-blue-600 dark:text-blue-400" },
	Event: { dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
	Meeting: { dot: "bg-violet-500", text: "text-violet-600 dark:text-violet-400" },
	Deadline: { dot: "bg-orange-500", text: "text-orange-600 dark:text-orange-400" },
};

export function CalendarEventsTable({
	items,
	isLoading,
	onEdit,
	onDelete,
}: CalendarEventsTableProps) {
	const { t } = useTranslation();

	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.15, duration: 0.3 }}
		>
			<div className="liquid-glass-card rounded-2xl overflow-hidden">
				{/* Header */}
				<div className="flex items-center gap-3 px-4 py-3 border-b border-black/6 dark:border-white/6">
					<div className="w-6 h-6 rounded-md bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center">
						<CalendarIcon className="w-3 h-3 text-amber-600 dark:text-amber-400" strokeWidth={2} />
					</div>
					<h2 className="text-sm font-semibold text-foreground">{t("calendar_events")}</h2>
					<span className="text-xs text-muted-foreground/60 tabular-nums">{items.length}</span>
				</div>

				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent border-b border-black/6 dark:border-white/6">
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("title")}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("type")}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("dates")}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("location")}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("school_closed")}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground text-right">{t("actions")}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<AnimatePresence mode="popLayout">
							{isLoading ? (
								Array.from({ length: 3 }).map((_, i) => (
									<TableRow key={i} className="border-b border-black/6 dark:border-white/6">
										{[1, 2, 3, 4, 5, 6].map((col) => (
											<TableCell key={col} className="py-3">
												<Skeleton className="h-5 w-full rounded-md" />
											</TableCell>
										))}
									</TableRow>
								))
							) : items.length === 0 ? (
								<TableRow>
									<TableCell className="h-60 text-center" colSpan={6}>
										<div className="flex flex-col items-center justify-center gap-3">
											<div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center">
												<CalendarIcon className="h-5 w-5 text-muted-foreground" />
											</div>
											<p className="text-sm font-medium text-foreground">{t("no_calendar_events")}</p>
											<p className="text-xs text-muted-foreground">{t("start_by_adding_event")}</p>
										</div>
									</TableCell>
								</TableRow>
							) : (
								items.map((item, index) => {
									const typeStyle = EVENT_TYPE_COLORS[item.eventType] || { dot: "bg-muted-foreground/30", text: "text-muted-foreground" };
									return (
										<motion.tr
											key={item.idStr}
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											transition={{ delay: index * 0.03 }}
											className="group hover:bg-muted/30 transition-colors border-b border-black/6 dark:border-white/6"
										>
											<TableCell className="py-3">
												<div className="min-w-0">
													<p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
														{item.title}
													</p>
													{item.description && (
														<p className="text-xs text-muted-foreground/60 truncate mt-0.5">{item.description}</p>
													)}
												</div>
											</TableCell>
											<TableCell className="py-3">
												<div className="flex items-center gap-1.5">
													<div className={cn("w-1.5 h-1.5 rounded-full", typeStyle.dot)} />
													<span className={cn("text-xs font-medium", typeStyle.text)}>
														{t(item.eventType)}
													</span>
												</div>
											</TableCell>
											<TableCell className="py-3">
												<div className="flex flex-col">
													<span className="text-sm text-muted-foreground">
														{new Date(item.startDateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
													</span>
													<span className="text-xs text-muted-foreground/60">
														{new Date(item.startDateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
														{" - "}
														{new Date(item.endDateStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
													</span>
												</div>
											</TableCell>
											<TableCell className="py-3">
												{item.location ? (
													<div className="flex items-center gap-1 text-sm text-muted-foreground">
														<MapPin className="h-3 w-3" />
														<span>{item.location}</span>
													</div>
												) : (
													<span className="text-xs text-muted-foreground/50">-</span>
												)}
											</TableCell>
											<TableCell className="py-3">
												{item.isSchoolClosed ? (
													<div className="flex items-center gap-1.5">
														<div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
														<span className="text-xs font-medium text-rose-600 dark:text-rose-400">{t("closed")}</span>
													</div>
												) : (
													<span className="text-xs text-muted-foreground">{t("open")}</span>
												)}
											</TableCell>
											<TableCell className="py-3 text-right">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-muted">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end" className="w-[150px]">
														<DropdownMenuItem onClick={() => onEdit(item)}>
															<Pencil className="mr-2 h-3.5 w-3.5" /> {t("edit")}
														</DropdownMenuItem>
														<DropdownMenuItem
															className="text-destructive focus:text-destructive focus:bg-destructive/10"
															onClick={() => onDelete(item)}
														>
															<Trash2 className="mr-2 h-3.5 w-3.5" /> {t("delete")}
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</motion.tr>
									);
								})
							)}
						</AnimatePresence>
					</TableBody>
				</Table>
			</div>
		</motion.div>
	);
}
