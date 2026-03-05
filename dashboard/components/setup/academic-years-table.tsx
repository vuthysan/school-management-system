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
	CheckCircle2,
	Calendar,
} from "lucide-react";
import { AcademicYear } from "@/hooks/useAcademicYears";
import { cn } from "@/lib/utils";

interface AcademicYearsTableProps {
	items: AcademicYear[];
	isLoading: boolean;
	onEdit: (item: AcademicYear) => void;
	onDelete: (item: AcademicYear) => void;
	onSetCurrent: (id: string) => void;
}

export function AcademicYearsTable({
	items,
	isLoading,
	onEdit,
	onDelete,
	onSetCurrent,
}: AcademicYearsTableProps) {
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
					<div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
						<Calendar className="w-3 h-3 text-blue-600 dark:text-blue-400" strokeWidth={2} />
					</div>
					<h2 className="text-sm font-semibold text-foreground">
						{t("academic_years")}
					</h2>
					<span className="text-xs text-muted-foreground/60 tabular-nums">
						{items.length}
					</span>
				</div>

				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent border-b border-black/6 dark:border-white/6">
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("name")}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("dates")}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("status")}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("current")}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground text-right">{t("actions")}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<AnimatePresence mode="popLayout">
							{isLoading ? (
								Array.from({ length: 3 }).map((_, i) => (
									<TableRow key={i} className="border-b border-black/6 dark:border-white/6">
										{[1, 2, 3, 4, 5].map((col) => (
											<TableCell key={col} className="py-3">
												<Skeleton className="h-5 w-full rounded-md" />
											</TableCell>
										))}
									</TableRow>
								))
							) : items.length === 0 ? (
								<TableRow>
									<TableCell className="h-60 text-center" colSpan={5}>
										<div className="flex flex-col items-center justify-center gap-3">
											<div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center">
												<Calendar className="h-5 w-5 text-muted-foreground" />
											</div>
											<p className="text-sm font-medium text-foreground">{t("no_academic_years")}</p>
											<p className="text-xs text-muted-foreground">{t("start_by_adding_academic_year")}</p>
										</div>
									</TableCell>
								</TableRow>
							) : (
								items.map((item, index) => (
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
												<p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
													{item.name}
												</p>
												{item.label && (
													<p className="text-xs text-muted-foreground/60 mt-0.5">{item.label}</p>
												)}
											</div>
										</TableCell>
										<TableCell className="py-3">
											<span className="text-sm text-muted-foreground">
												{new Date(item.startDateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
												{" - "}
												{new Date(item.endDateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
											</span>
										</TableCell>
										<TableCell className="py-3">
											<div className="flex items-center gap-1.5">
												<div className={cn(
													"w-1.5 h-1.5 rounded-full",
													item.status === "Active" ? "bg-emerald-500" : item.status === "Planning" ? "bg-amber-500" : "bg-muted-foreground/30"
												)} />
												<span className={cn(
													"text-xs font-medium",
													item.status === "Active" ? "text-emerald-600 dark:text-emerald-400" : item.status === "Planning" ? "text-amber-600 dark:text-amber-400" : "text-muted-foreground"
												)}>
													{t(item.status)}
												</span>
											</div>
										</TableCell>
										<TableCell className="py-3">
											{item.isCurrent ? (
												<Badge variant="secondary" className="bg-primary/8 text-primary border-none text-xs font-medium gap-1">
													<CheckCircle2 className="h-3 w-3" />
													{t("current")}
												</Badge>
											) : (
												<Button
													variant="ghost"
													size="sm"
													className="opacity-0 group-hover:opacity-100 h-7 text-xs"
													onClick={() => onSetCurrent(item.idStr)}
												>
													{t("set_as_current")}
												</Button>
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
													{!item.isCurrent && (
														<DropdownMenuItem onClick={() => onSetCurrent(item.idStr)}>
															<CheckCircle2 className="mr-2 h-3.5 w-3.5" /> {t("set_as_current")}
														</DropdownMenuItem>
													)}
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
								))
							)}
						</AnimatePresence>
					</TableBody>
				</Table>
			</div>
		</motion.div>
	);
}
