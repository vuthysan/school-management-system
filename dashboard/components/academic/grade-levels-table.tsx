"use client";

import React, { useCallback } from "react";
import {
	Trash2,
	ChevronLeft,
	ChevronRight,
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	Filter,
	GraduationCap,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { motion, AnimatePresence } from "framer-motion";
import { MoreHorizontal, Pencil } from "lucide-react";

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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchInput } from "@/components/shared/search-input";
import { GradeLevel, Status, GradeLevelSortInput } from "@/types/academic";
import { cn } from "@/lib/utils";

interface GradeLevelsTableProps {
	gradeLevels: GradeLevel[];
	isLoading?: boolean;
	total?: number;
	page?: number;
	pageSize?: number;
	totalPages?: number;
	search?: string;
	statusFilter?: Status | "";
	sort?: GradeLevelSortInput;
	onSearchChange?: (search: string) => void;
	onStatusFilterChange?: (status: Status | "") => void;
	onSortChange?: (sort: GradeLevelSortInput) => void;
	onPageChange?: (page: number) => void;
	onEdit: (gradeLevel: GradeLevel) => void;
	onDelete: (gradeLevel: GradeLevel) => void;
}

export const GradeLevelsTable: React.FC<GradeLevelsTableProps> = ({
	gradeLevels,
	isLoading = false,
	total = 0,
	page = 1,
	pageSize = 10,
	totalPages = 1,
	search = "",
	statusFilter = "",
	sort = {},
	onSearchChange,
	onStatusFilterChange,
	onSortChange,
	onPageChange,
	onEdit,
	onDelete,
}) => {
	const { t } = useTranslation();

	const handleSort = (field: GradeLevelSortInput["sortBy"]) => {
		if (!onSortChange) return;
		const newOrder =
			sort.sortBy === field && sort.sortOrder === "asc" ? "desc" : "asc";
		onSortChange({ sortBy: field, sortOrder: newOrder });
	};

	const SortIcon = ({ field }: { field: GradeLevelSortInput["sortBy"] }) => {
		if (sort.sortBy !== field) {
			return <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />;
		}
		return sort.sortOrder === "asc" ? (
			<ArrowUp className="ml-1 h-3 w-3" />
		) : (
			<ArrowDown className="ml-1 h-3 w-3" />
		);
	};

	const hasActiveFilters = search || statusFilter;

	const handleClearFilters = useCallback(() => {
		onSearchChange?.("");
		onStatusFilterChange?.("");
	}, [onSearchChange, onStatusFilterChange]);

	const columns = [
		{ key: "name", label: t("grade_level_name"), sortable: true },
		{ key: "code", label: t("grade_level_code"), sortable: true },
		{ key: "order", label: t("grade_level_order"), sortable: true },
		{ key: "description", label: t("description"), sortable: false },
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
						<div className="w-6 h-6 rounded-md bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center">
							<GraduationCap className="w-3 h-3 text-violet-600 dark:text-violet-400" strokeWidth={2} />
						</div>
						<h2 className="text-sm font-semibold text-foreground">
							{t("grade_levels")}
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
										handleSort(column.key as GradeLevelSortInput["sortBy"])
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
											<SortIcon field={column.key as GradeLevelSortInput["sortBy"]} />
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
							) : gradeLevels.length === 0 ? (
								<TableRow>
									<TableCell className="h-60 text-center" colSpan={columns.length}>
										<div className="flex flex-col items-center justify-center gap-3">
											<div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center">
												<GraduationCap className="h-5 w-5 text-muted-foreground" />
											</div>
											<p className="text-sm font-medium text-foreground">
												{hasActiveFilters ? t("no_results") : t("no_grade_levels")}
											</p>
										</div>
									</TableCell>
								</TableRow>
							) : (
								gradeLevels.map((level, index) => (
									<motion.tr
										key={level.id}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ delay: index * 0.03 }}
										className="group hover:bg-muted/30 transition-colors border-b border-black/6 dark:border-white/6"
									>
										<TableCell className="py-3 px-4">
											<p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
												{level.name}
											</p>
										</TableCell>
										<TableCell className="px-4">
											<Badge
												variant="outline"
												className="rounded-lg border-primary/20 bg-primary/5 text-primary font-medium px-2.5 py-0.5"
											>
												{level.code}
											</Badge>
										</TableCell>
										<TableCell className="px-4">
											<span className="text-sm font-medium text-foreground/70">
												{level.order}
											</span>
										</TableCell>
										<TableCell className="px-4">
											<span className="text-sm text-muted-foreground/80 truncate max-w-[200px] block">
												{level.description || "-"}
											</span>
										</TableCell>
										<TableCell className="px-4">
											<div className="flex items-center gap-1.5">
												<div
													className={cn(
														"w-1.5 h-1.5 rounded-full",
														level.status === "Active"
															? "bg-emerald-500"
															: "bg-muted-foreground/30"
													)}
												/>
												<span
													className={cn(
														"text-xs font-medium",
														level.status === "Active"
															? "text-emerald-600 dark:text-emerald-400"
															: "text-muted-foreground"
													)}
												>
													{t(level.status.toLowerCase())}
												</span>
											</div>
										</TableCell>
										<TableCell className="px-6 text-right">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														size="sm"
														className="h-7 w-7 p-0 hover:bg-muted"
													>
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align="end" className="w-[150px]">
													<DropdownMenuItem onClick={() => onEdit(level)}>
														<Pencil className="mr-2 h-3.5 w-3.5" />
														{t("edit_grade_level")}
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => onDelete(level)}
														className="text-destructive focus:text-destructive focus:bg-destructive/10"
													>
														<Trash2 className="mr-2 h-3.5 w-3.5" />
														{t("delete_record")}
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

				{/* Pagination */}
				{totalPages > 0 && (
					<div className="flex items-center justify-between px-4 py-3 border-t border-black/6 dark:border-white/6">
						<span className="text-xs text-muted-foreground">
							{total} {t("grade_levels")}
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
