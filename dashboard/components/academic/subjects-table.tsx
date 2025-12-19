"use client";

import React, { useMemo } from "react";
import {
	Search,
	Edit,
	Trash2,
	ChevronLeft,
	ChevronRight,
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	Filter,
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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
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
	departmentFilter?: string;
	sort?: SubjectSortInput;
	onSearchChange?: (search: string) => void;
	onStatusFilterChange?: (status: Status | "") => void;
	onDepartmentFilterChange?: (department: string) => void;
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
	departmentFilter = "",
	sort = {},
	onSearchChange,
	onStatusFilterChange,
	onDepartmentFilterChange,
	onSortChange,
	onPageChange,
	onEdit,
	onDelete,
}) => {
	const { t } = useTranslation();

	// Extract unique departments for filter
	const departments = useMemo(() => {
		const depts = new Set(
			subjects.map((sub) => sub.department).filter(Boolean)
		);

		return Array.from(depts).sort() as string[];
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

	const columns = [
		{ key: "subjectName", label: t("subject_name"), sortable: true },
		{ key: "subjectCode", label: t("subject_code"), sortable: true },
		{ key: "department", label: t("department"), sortable: false },
		{ key: "credits", label: t("credits"), sortable: true },
		{ key: "status", label: t("status"), sortable: false },
		{ key: "actions", label: t("actions"), sortable: false },
	];

	// Table Container
	return (
		<div className="flex flex-col gap-6">
			{/* Search and Filters */}
			<div className="flex flex-wrap gap-4 items-center justify-between">
				<div className="relative w-full sm:max-w-xs group">
					<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
					<Input
						className="pl-9 h-11 rounded-lg border-border/50 focus:bg-background transition-all"
						placeholder={t("search_placeholder")}
						value={search}
						onChange={(e) => onSearchChange?.(e.target.value)}
					/>
				</div>
				<div className="flex gap-3 flex-wrap">
					<Select
						value={statusFilter || "__all__"}
						onValueChange={(value) =>
							onStatusFilterChange?.(
								value === "__all__" ? "" : (value as Status)
							)
						}
					>
						<SelectTrigger className="w-[150px] h-11 rounded-lg border-border/50">
							<Filter className="mr-2 h-4 w-4 text-muted-foreground" />
							<SelectValue placeholder={t("all_status")} />
						</SelectTrigger>
						<SelectContent className="rounded-xl shadow-xl">
							<SelectItem value="__all__" className="rounded-lg">
								{t("all_status")}
							</SelectItem>
							<SelectItem value="Active" className="rounded-lg">
								{t("active")}
							</SelectItem>
							<SelectItem value="Inactive" className="rounded-lg">
								{t("inactive")}
							</SelectItem>
							<SelectItem value="Archived" className="rounded-lg">
								{t("archived")}
							</SelectItem>
						</SelectContent>
					</Select>
					{departments.length > 0 && (
						<Select
							value={departmentFilter || "__all__"}
							onValueChange={(value) =>
								onDepartmentFilterChange?.(value === "__all__" ? "" : value)
							}
						>
							<SelectTrigger className="w-[160px] h-11 rounded-lg border-border/50">
								<Filter className="mr-2 h-4 w-4 text-muted-foreground" />
								<SelectValue placeholder={t("all_departments")} />
							</SelectTrigger>
							<SelectContent className="rounded-xl shadow-xl">
								<SelectItem value="__all__" className="rounded-lg">
									{t("all_departments")}
								</SelectItem>
								{departments.map((dept) => (
									<SelectItem key={dept} value={dept} className="rounded-lg">
										{dept}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					)}
				</div>
			</div>

			{/* Table Container */}
			<div className="rounded-2xl border border-border/50 shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm overflow-hidden">
				<Table>
					<TableHeader className="bg-muted/30 border-b border-border/50">
						<TableRow className="hover:bg-transparent border-none">
							{columns.map((column) => (
								<TableHead
									key={column.key}
									className={cn(
										"h-12 uppercase tracking-widest text-[11px] font-bold text-muted-foreground/70",
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
											<SortIcon
												field={column.key as SubjectSortInput["sortBy"]}
											/>
										)}
									</div>
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						<AnimatePresence mode="popLayout">
							{isLoading ? (
								// Loading skeletons
								Array.from({ length: 5 }).map((_, i) => (
									<TableRow key={i} className="border-b border-border/50">
										{columns.map((col) => (
											<TableCell key={col.key} className="py-4">
												<Skeleton className="h-6 w-full rounded-md" />
											</TableCell>
										))}
									</TableRow>
								))
							) : subjects.length === 0 ? (
								<TableRow>
									<TableCell
										className="h-64 text-center text-muted-foreground font-medium"
										colSpan={columns.length}
									>
										<div className="flex flex-col items-center gap-3">
											<div className="p-4 bg-secondary/20 rounded-full">
												<Search className="h-6 w-6 opacity-20" />
											</div>
											{t("no_results")}
										</div>
									</TableCell>
								</TableRow>
							) : (
								subjects.map((sub, index) => (
									<motion.tr
										key={sub.id}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, scale: 0.95 }}
										transition={{ duration: 0.3, delay: index * 0.05 }}
										className="group transition-all hover:bg-secondary/10 cursor-pointer border-b border-border/50 last:border-0"
									>
										<TableCell className="px-4 py-4">
											<div className="flex flex-col">
												<p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
													{sub.subjectName}
												</p>
												{sub.description && (
													<p className="text-[11px] text-muted-foreground/80 font-medium line-clamp-1">
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
											<p className="text-sm font-medium text-foreground/70">
												{sub.department || "-"}
											</p>
										</TableCell>
										<TableCell className="px-4">
											<Badge
												variant="outline"
												className="rounded-lg border-primary/20 bg-primary/5 text-primary font-bold px-2.5 py-0.5"
											>
												{sub.credits} {t("credits")}
											</Badge>
										</TableCell>
										<TableCell className="px-4">
											<Badge
												className={cn(
													"rounded-lg px-2.5 py-0.5 text-[11px] border-none font-bold uppercase",
													sub.status === "Active"
														? "bg-emerald-500/10 text-emerald-600 animate-pulse"
														: "bg-muted text-muted-foreground"
												)}
											>
												{t(sub.status.toLowerCase())}
											</Badge>
										</TableCell>
										<TableCell className="px-6 text-right">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														className="h-8 w-8 p-0 hover:bg-muted rounded-full transition-colors"
													>
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align="end"
													className="w-[180px] rounded-xl shadow-xl border-border/50 p-1.5"
												>
													<DropdownMenuItem
														onClick={() => onEdit(sub)}
														className="rounded-lg gap-2 cursor-pointer focus:bg-emerald-500/5 focus:text-emerald-600 transition-colors"
													>
														<Pencil className="h-4 w-4" />
														<span className="font-medium">
															{t("edit_subject")}
														</span>
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => onDelete(sub)}
														className="rounded-lg gap-2 cursor-pointer focus:bg-destructive/5 focus:text-destructive transition-colors"
													>
														<Trash2 className="h-4 w-4" />
														<span className="font-medium">
															{t("delete_record")}
														</span>
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

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-between px-2">
					<p className="text-sm text-muted-foreground">
						{t("showing_results", {
							start: (page - 1) * pageSize + 1,
							end: Math.min(page * pageSize, total),
							total,
						})}
					</p>
					<div className="flex items-center gap-2">
						<Button
							disabled={page === 1}
							size="icon"
							variant="outline"
							onClick={() => onPageChange?.(page - 1)}
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<span className="text-sm text-muted-foreground">
							{t("page_of", { page, totalPages })}
						</span>
						<Button
							disabled={page === totalPages}
							size="icon"
							variant="outline"
							onClick={() => onPageChange?.(page + 1)}
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				</div>
			)}
		</div>
	);
};
