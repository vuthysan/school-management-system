"use client";

import React, { useMemo, useCallback } from "react";
import {
	Search,
	Trash2,
	Eye,
	ChevronLeft,
	ChevronRight,
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	Filter,
	Clock,
	School,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { motion, AnimatePresence } from "framer-motion";
import { Pencil } from "lucide-react";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchInput } from "@/components/shared/search-input";
import { Class, Status, ClassSortInput } from "@/types/academic";
import { cn } from "@/lib/utils";

interface ClassesTableProps {
	classes: Class[];
	isLoading?: boolean;
	total?: number;
	page?: number;
	pageSize?: number;
	totalPages?: number;
	search?: string;
	statusFilter?: Status | "";
	gradeLevelFilter?: string;
	sort?: ClassSortInput;
	onSearchChange?: (search: string) => void;
	onStatusFilterChange?: (status: Status | "") => void;
	onGradeLevelFilterChange?: (gradeLevel: string) => void;
	onSortChange?: (sort: ClassSortInput) => void;
	onPageChange?: (page: number) => void;
	onEdit: (cls: Class) => void;
	onEditTimetable?: (cls: Class) => void;
	onDelete: (cls: Class) => void;
	onView?: (cls: Class) => void;
}

export const ClassesTable: React.FC<ClassesTableProps> = ({
	classes,
	isLoading = false,
	total = 0,
	page = 1,
	pageSize = 10,
	totalPages = 1,
	search = "",
	statusFilter = "",
	gradeLevelFilter = "",
	sort = {},
	onSearchChange,
	onStatusFilterChange,
	onGradeLevelFilterChange,
	onSortChange,
	onPageChange,
	onEdit,
	onEditTimetable,
	onDelete,
	onView,
}) => {
	const { t } = useTranslation();

	const gradeLevels = useMemo(() => {
		const levels = new Set(classes.map((cls) => cls.gradeLevel));
		return Array.from(levels).sort();
	}, [classes]);

	const handleSort = (field: ClassSortInput["sortBy"]) => {
		if (!onSortChange) return;
		const newOrder =
			sort.sortBy === field && sort.sortOrder === "asc" ? "desc" : "asc";
		onSortChange({ sortBy: field, sortOrder: newOrder });
	};

	const SortIcon = ({ field }: { field: ClassSortInput["sortBy"] }) => {
		if (sort.sortBy !== field) {
			return <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />;
		}
		return sort.sortOrder === "asc" ? (
			<ArrowUp className="ml-1 h-3 w-3" />
		) : (
			<ArrowDown className="ml-1 h-3 w-3" />
		);
	};

	const hasActiveFilters = search || statusFilter || gradeLevelFilter;

	const handleClearFilters = useCallback(() => {
		onSearchChange?.("");
		onStatusFilterChange?.("");
		onGradeLevelFilterChange?.("");
	}, [onSearchChange, onStatusFilterChange, onGradeLevelFilterChange]);

	const columns = [
		{ key: "name", label: t("class_name"), sortable: true },
		{ key: "code", label: t("code"), sortable: true },
		{ key: "gradeLevel", label: t("grade_level"), sortable: true },
		{ key: "section", label: t("section"), sortable: false },
		{ key: "room", label: t("room"), sortable: false },
		{ key: "enrollment", label: t("enrolled"), sortable: true },
		{ key: "status", label: t("status"), sortable: false },
		{ key: "actions", label: t("actions"), sortable: false },
	];

	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.15, duration: 0.3 }}
		>
			<div className="liquid-glass-card rounded-2xl overflow-hidden">
				{/* Card header with search + filters */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 border-b border-black/6 dark:border-white/6">
					<div className="flex items-center gap-3">
						<div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
							<School className="w-3 h-3 text-blue-600 dark:text-blue-400" strokeWidth={2} />
						</div>
						<h2 className="text-sm font-semibold text-foreground">
							{t("classes")}
						</h2>
						<span className="text-xs text-muted-foreground/60 tabular-nums">
							{total}
						</span>
					</div>
					<div className="flex items-center gap-2 w-full sm:w-auto">
						<Select
							value={statusFilter || "__all__"}
							onValueChange={(value) =>
								onStatusFilterChange?.(value === "__all__" ? "" : (value as Status))
							}
						>
							<SelectTrigger className="w-[140px] h-9 text-xs">
								<div className="flex items-center gap-1.5">
									<Filter className="h-3 w-3 text-muted-foreground" />
									<SelectValue placeholder={t("all_status")} />
								</div>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="__all__">{t("all_status")}</SelectItem>
								<SelectItem value="Active">{t("active")}</SelectItem>
								<SelectItem value="Inactive">{t("inactive")}</SelectItem>
								<SelectItem value="Archived">{t("archived")}</SelectItem>
							</SelectContent>
						</Select>
						<Select
							value={gradeLevelFilter || "__all__"}
							onValueChange={(value) =>
								onGradeLevelFilterChange?.(value === "__all__" ? "" : value)
							}
						>
							<SelectTrigger className="w-[140px] h-9 text-xs">
								<div className="flex items-center gap-1.5">
									<Filter className="h-3 w-3 text-muted-foreground" />
									<SelectValue placeholder={t("all_grades")} />
								</div>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="__all__">{t("all_grades")}</SelectItem>
								{gradeLevels.map((level) => (
									<SelectItem key={level} value={level}>
										{level}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{hasActiveFilters && (
							<Button
								size="sm"
								variant="ghost"
								onClick={handleClearFilters}
								className="h-9 text-xs text-muted-foreground"
							>
								{t("clear")}
							</Button>
						)}
						<SearchInput
							placeholder={t("search_placeholder") || "Search..."}
							value={search}
							onChange={(value) => onSearchChange?.(value)}
							className="w-full sm:w-56"
						/>
					</div>
				</div>

				{/* Table */}
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent border-b border-black/6 dark:border-white/6">
							{columns.map((column) => (
								<TableHead
									key={column.key}
									className={cn(
										"h-10 text-xs font-medium text-muted-foreground",
										column.key === "actions" ? "text-right px-6" : "px-4",
										column.sortable &&
											"cursor-pointer select-none hover:text-primary transition-colors"
									)}
									onClick={() =>
										column.sortable &&
										handleSort(column.key as ClassSortInput["sortBy"])
									}
								>
									<div
										className={cn(
											"flex items-center",
											column.key === "actions" && "justify-end"
										)}
									>
										{column.label}
										{column.sortable && (
											<SortIcon field={column.key as ClassSortInput["sortBy"]} />
										)}
									</div>
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						<AnimatePresence mode="popLayout">
							{isLoading ? (
								Array.from({ length: 5 }).map((_, i) => (
									<TableRow key={i} className="border-b border-black/6 dark:border-white/6">
										{columns.map((col) => (
											<TableCell key={col.key} className="py-3">
												<Skeleton className="h-5 w-full rounded-md" />
											</TableCell>
										))}
									</TableRow>
								))
							) : classes.length === 0 ? (
								<TableRow>
									<TableCell className="h-60 text-center" colSpan={columns.length}>
										<div className="flex flex-col items-center justify-center gap-3">
											<div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center">
												<School className="h-5 w-5 text-muted-foreground" />
											</div>
											<p className="text-sm font-medium text-foreground">
												{hasActiveFilters ? t("no_results") : t("no_classes")}
											</p>
										</div>
									</TableCell>
								</TableRow>
							) : (
								classes.map((cls, index) => (
									<motion.tr
										key={cls.id}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ delay: index * 0.03 }}
										className="group hover:bg-muted/30 transition-colors border-b border-black/6 dark:border-white/6"
									>
										<TableCell className="py-3 px-4">
											<p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
												{cls.name}
											</p>
										</TableCell>
										<TableCell className="px-4">
											<Badge
												variant="secondary"
												className="rounded-lg bg-muted/50 text-muted-foreground border-none font-medium px-2 py-0.5"
											>
												{cls.code}
											</Badge>
										</TableCell>
										<TableCell className="px-4">
											<Badge
												variant="outline"
												className="rounded-lg border-primary/20 bg-primary/5 text-primary font-medium px-2.5 py-0.5"
											>
												{cls.gradeLevel}
											</Badge>
										</TableCell>
										<TableCell className="px-4">
											<span className="text-sm text-foreground/70">
												{cls.section || "-"}
											</span>
										</TableCell>
										<TableCell className="px-4">
											<span className="text-sm text-foreground/70">
												{cls.roomNumber || "-"}
											</span>
										</TableCell>
										<TableCell className="px-4">
											<div className="flex flex-col min-w-[100px]">
												<div className="flex justify-between items-center mb-1.5">
													<span className="text-xs font-medium text-foreground/70">
														{cls.currentEnrollment}{" "}
														<span className="text-muted-foreground/50">
															/ {cls.capacity}
														</span>
													</span>
													<span className="text-xs font-medium text-primary">
														{Math.round(
															(cls.currentEnrollment / cls.capacity) * 100
														)}%
													</span>
												</div>
												<div className="w-full bg-muted/50 rounded-full h-1.5 overflow-hidden">
													<motion.div
														initial={{ width: 0 }}
														animate={{
															width: `${Math.min((cls.currentEnrollment / cls.capacity) * 100, 100)}%`,
														}}
														transition={{ duration: 1, ease: "easeOut" }}
														className={cn(
															"h-full rounded-full",
															cls.currentEnrollment / cls.capacity > 0.9
																? "bg-rose-500"
																: cls.currentEnrollment / cls.capacity > 0.7
																	? "bg-amber-500"
																	: "bg-primary"
														)}
													/>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-4">
											<div className="flex items-center gap-1.5">
												<div
													className={cn(
														"w-1.5 h-1.5 rounded-full",
														cls.status === "Active"
															? "bg-emerald-500"
															: "bg-muted-foreground/30"
													)}
												/>
												<span
													className={cn(
														"text-xs font-medium",
														cls.status === "Active"
															? "text-emerald-600 dark:text-emerald-400"
															: "text-muted-foreground"
													)}
												>
													{t(cls.status.toLowerCase())}
												</span>
											</div>
										</TableCell>
										<TableCell className="px-6 text-right">
											<div className="flex items-center justify-end gap-1">
												{onView && (
													<Button
														variant="ghost"
														size="icon"
														className="h-7 w-7 text-muted-foreground hover:text-foreground"
														onClick={() => onView(cls)}
														title={t("view_details")}
													>
														<Eye className="h-3.5 w-3.5" />
													</Button>
												)}
												<Button
													variant="ghost"
													size="icon"
													className="h-7 w-7 text-muted-foreground hover:text-foreground"
													onClick={() => onEdit(cls)}
													title={t("edit_class")}
												>
													<Pencil className="h-3.5 w-3.5" />
												</Button>
												{onEditTimetable && (
													<Button
														variant="ghost"
														size="icon"
														className="h-7 w-7 text-muted-foreground hover:text-foreground"
														onClick={() => onEditTimetable(cls)}
														title={t("edit_timetable") || "Edit Timetable"}
													>
														<Clock className="h-3.5 w-3.5" />
													</Button>
												)}
												<Button
													variant="ghost"
													size="icon"
													className="h-7 w-7 text-muted-foreground hover:text-destructive"
													onClick={() => onDelete(cls)}
													title={t("delete_record")}
												>
													<Trash2 className="h-3.5 w-3.5" />
												</Button>
											</div>
										</TableCell>
									</motion.tr>
								))
							)}
						</AnimatePresence>
					</TableBody>
				</Table>

				{/* Pagination */}
				{totalPages > 0 && (
					<div className="flex items-center justify-between px-4 py-3 border-t border-black/6 dark:border-white/6">
						<span className="text-xs text-muted-foreground">
							{total} {t("total_classes")}
						</span>
						{totalPages > 1 && (
							<div className="flex items-center gap-1">
								<Button
									disabled={page === 1}
									size="sm"
									variant="ghost"
									className="h-7 w-7 p-0"
									onClick={() => onPageChange?.(Math.max(1, page - 1))}
								>
									<ChevronLeft className="h-4 w-4" />
								</Button>
								<span className="text-xs text-muted-foreground px-2 tabular-nums">
									{page} / {totalPages}
								</span>
								<Button
									disabled={page === totalPages}
									size="sm"
									variant="ghost"
									className="h-7 w-7 p-0"
									onClick={() => onPageChange?.(Math.min(totalPages, page + 1))}
								>
									<ChevronRight className="h-4 w-4" />
								</Button>
							</div>
						)}
					</div>
				)}
			</div>
		</motion.div>
	);
};
