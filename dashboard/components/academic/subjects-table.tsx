"use client";

import React, { useMemo, useCallback } from "react";
import {
	ChevronLeft,
	ChevronRight,
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	Filter,
	BookOpen,
	MoreHorizontal,
	Pencil,
	Trash2,
} from "lucide-react";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchInput } from "@/components/shared/search-input";
import { Subject, Status, SubjectSortInput } from "@/types/academic";
import { cn } from "@/lib/utils";

interface SubjectsTableProps {
	subjects: Subject[];
	isLoading?: boolean;
	total?: number;
	page?: number;
	pageSize?: number;
	totalPages?: number;
	search?: string;
	statusFilter?: Status | "";
	categoryFilter?: string;
	sort?: SubjectSortInput;
	onSearchChange?: (search: string) => void;
	onStatusFilterChange?: (status: Status | "") => void;
	onCategoryFilterChange?: (category: string) => void;
	onSortChange?: (sort: SubjectSortInput) => void;
	onPageChange?: (page: number) => void;
	onEdit: (sub: Subject) => void;
	onDelete: (sub: Subject) => void;
}

export const SubjectsTable: React.FC<SubjectsTableProps> = ({
	subjects,
	isLoading = false,
	total = 0,
	page = 1,
	pageSize = 10,
	totalPages = 1,
	search = "",
	statusFilter = "",
	categoryFilter = "",
	sort = {},
	onSearchChange,
	onStatusFilterChange,
	onCategoryFilterChange,
	onSortChange,
	onPageChange,
	onEdit,
	onDelete,
}) => {
	const { t } = useTranslation();

	const categories = useMemo(() => {
		const cats = new Set(
			subjects.map((sub) => sub.subjectCategory).filter(Boolean)
		);
		return Array.from(cats).sort() as string[];
	}, [subjects]);

	const handleSort = (field: SubjectSortInput["sortBy"]) => {
		if (!onSortChange) return;
		const newOrder =
			sort.sortBy === field && sort.sortOrder === "asc" ? "desc" : "asc";
		onSortChange({ sortBy: field, sortOrder: newOrder });
	};

	const SortIcon = ({ field }: { field: SubjectSortInput["sortBy"] }) => {
		if (sort.sortBy !== field) {
			return <ArrowUpDown className="ml-1 h-3 w-3 opacity-50" />;
		}
		return sort.sortOrder === "asc" ? (
			<ArrowUp className="ml-1 h-3 w-3" />
		) : (
			<ArrowDown className="ml-1 h-3 w-3" />
		);
	};

	const hasActiveFilters = search || statusFilter || categoryFilter;

	const handleClearFilters = useCallback(() => {
		onSearchChange?.("");
		onStatusFilterChange?.("");
		onCategoryFilterChange?.("");
	}, [onSearchChange, onStatusFilterChange, onCategoryFilterChange]);

	const columns = [
		{ key: "subjectName", label: t("subject_name"), sortable: true },
		{ key: "subjectCode", label: t("subject_code"), sortable: true },
		{ key: "subjectCategory", label: t("subject_category"), sortable: false },
		{ key: "hoursPerWeek", label: t("hours_per_week"), sortable: true },
		{ key: "coefficient", label: t("coefficient"), sortable: false },
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
						<div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center">
							<BookOpen className="w-3 h-3 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
						</div>
						<h2 className="text-sm font-semibold text-foreground">
							{t("subjects")}
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
						{categories.length > 0 && (
							<Select
								value={categoryFilter || "__all__"}
								onValueChange={(value) =>
									onCategoryFilterChange?.(value === "__all__" ? "" : value)
								}
							>
								<SelectTrigger className="w-[140px] h-9 text-xs">
									<div className="flex items-center gap-1.5">
										<Filter className="h-3 w-3 text-muted-foreground" />
										<SelectValue placeholder={t("all_categories")} />
									</div>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="__all__">{t("all_categories")}</SelectItem>
									{categories.map((cat) => (
										<SelectItem key={cat} value={cat}>
											{cat}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						)}
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
										handleSort(column.key as SubjectSortInput["sortBy"])
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
											<SortIcon field={column.key as SubjectSortInput["sortBy"]} />
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
							) : subjects.length === 0 ? (
								<TableRow>
									<TableCell className="h-60 text-center" colSpan={columns.length}>
										<div className="flex flex-col items-center justify-center gap-3">
											<div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center">
												<BookOpen className="h-5 w-5 text-muted-foreground" />
											</div>
											<p className="text-sm font-medium text-foreground">
												{hasActiveFilters ? t("no_results") : t("no_subjects")}
											</p>
										</div>
									</TableCell>
								</TableRow>
							) : (
								subjects.map((sub, index) => (
									<motion.tr
										key={sub.id}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										exit={{ opacity: 0 }}
										transition={{ delay: index * 0.03 }}
										className="group hover:bg-muted/30 transition-colors border-b border-black/6 dark:border-white/6"
									>
										<TableCell className="py-3 px-4">
											<div className="min-w-0">
												<p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
													{sub.subjectName}
												</p>
												{sub.description && (
													<p className="text-xs text-muted-foreground/60 truncate mt-0.5">
														{sub.description}
													</p>
												)}
											</div>
										</TableCell>
										<TableCell className="px-4">
											<Badge
												variant="secondary"
												className="rounded-lg bg-muted/50 text-muted-foreground border-none font-medium px-2 py-0.5"
											>
												{sub.subjectCode}
											</Badge>
										</TableCell>
										<TableCell className="px-4">
											<span className="text-sm text-foreground/70">
												{sub.subjectCategory || "-"}
											</span>
										</TableCell>
										<TableCell className="px-4">
											<Badge
												variant="outline"
												className="rounded-lg border-primary/20 bg-primary/5 text-primary font-medium px-2.5 py-0.5"
											>
												{sub.hoursPerWeek} {t("hrs_week")}
											</Badge>
										</TableCell>
										<TableCell className="px-4">
											<span className="text-sm font-medium text-foreground/70">
												x{sub.coefficient}
											</span>
										</TableCell>
										<TableCell className="px-4">
											<div className="flex items-center gap-1.5">
												<div
													className={cn(
														"w-1.5 h-1.5 rounded-full",
														sub.status === "Active"
															? "bg-emerald-500"
															: "bg-muted-foreground/30"
													)}
												/>
												<span
													className={cn(
														"text-xs font-medium",
														sub.status === "Active"
															? "text-emerald-600 dark:text-emerald-400"
															: "text-muted-foreground"
													)}
												>
													{t(sub.status.toLowerCase())}
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
													<DropdownMenuItem onClick={() => onEdit(sub)}>
														<Pencil className="mr-2 h-3.5 w-3.5" />
														{t("edit")}
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => onDelete(sub)}
														className="text-destructive focus:text-destructive focus:bg-destructive/10"
													>
														<Trash2 className="mr-2 h-3.5 w-3.5" />
														{t("delete")}
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
							{total} {t("total_subjects")}
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
