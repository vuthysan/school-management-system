"use client";

import React, { useMemo } from "react";
import {
	Search,
	Edit,
	Trash2,
	Eye,
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
	onDelete,
	onView,
}) => {
	const { t } = useTranslation();

	// Extract unique grade levels for filter
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

	const columns = [
		{ key: "name", label: t("class_name"), sortable: true },
		{ key: "code", label: t("code"), sortable: true },
		{ key: "gradeLevel", label: t("grade_level"), sortable: true },
		{ key: "section", label: t("section"), sortable: false },
		{ key: "room", label: t("room"), sortable: false },
		{ key: "enrollment", label: t("enrolled"), sortable: true },
		{ key: "status", label: t("status"), sortable: false },
		{ key: "actions", label: t("actions").toUpperCase(), sortable: false },
	];

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
					<Select
						value={gradeLevelFilter || "__all__"}
						onValueChange={(value) =>
							onGradeLevelFilterChange?.(value === "__all__" ? "" : value)
						}
					>
						<SelectTrigger className="w-[150px] h-11 rounded-lg border-border/50">
							<Filter className="mr-2 h-4 w-4 text-muted-foreground" />
							<SelectValue placeholder={t("all_grades")} />
						</SelectTrigger>
						<SelectContent className="rounded-xl shadow-xl">
							<SelectItem value="__all__" className="rounded-lg">
								{t("all_grades")}
							</SelectItem>
							{gradeLevels.map((level) => (
								<SelectItem key={level} value={level} className="rounded-lg">
									{level}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
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
											<SortIcon
												field={column.key as ClassSortInput["sortBy"]}
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
							) : classes.length === 0 ? (
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
								classes.map((cls, index) => (
									<motion.tr
										key={cls.id}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, scale: 0.95 }}
										transition={{ duration: 0.3, delay: index * 0.05 }}
										className="group transition-all hover:bg-secondary/10 cursor-pointer border-b border-border/50 last:border-0"
									>
										<TableCell className="px-4 py-4">
											<p className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
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
												className="rounded-lg border-primary/20 bg-primary/5 text-primary font-bold px-2.5 py-0.5"
											>
												{cls.gradeLevel}
											</Badge>
										</TableCell>
										<TableCell className="px-4">
											<p className="text-sm font-medium text-foreground/70">
												{cls.section || "-"}
											</p>
										</TableCell>
										<TableCell className="px-4">
											<p className="text-sm font-medium text-foreground/70">
												{cls.roomNumber || "-"}
											</p>
										</TableCell>
										<TableCell className="px-4">
											<div className="flex flex-col min-w-[100px]">
												<div className="flex justify-between items-center mb-1.5">
													<p className="text-[11px] font-bold text-foreground/70">
														{cls.currentEnrollment}{" "}
														<span className="text-muted-foreground/50 font-medium">
															/ {cls.capacity}
														</span>
													</p>
													<span className="text-[10px] font-bold text-primary">
														{Math.round(
															(cls.currentEnrollment / cls.capacity) * 100
														)}
														%
													</span>
												</div>
												<div className="w-full bg-muted/50 rounded-full h-1.5 p-0.5 overflow-hidden border border-border/50">
													<motion.div
														initial={{ width: 0 }}
														animate={{
															width: `${Math.min((cls.currentEnrollment / cls.capacity) * 100, 100)}%`,
														}}
														transition={{ duration: 1, ease: "easeOut" }}
														className={cn(
															"h-full rounded-full shadow-[0_0_10px_rgba(var(--primary),0.3)]",
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
											<Badge
												className={cn(
													"rounded-lg px-2.5 py-0.5 text-[11px] border-none font-bold uppercase",
													cls.status === "Active"
														? "bg-emerald-500/10 text-emerald-600 animate-pulse"
														: "bg-muted text-muted-foreground"
												)}
											>
												{t(cls.status.toLowerCase())}
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
													{onView && (
														<DropdownMenuItem
															onClick={() => onView(cls)}
															className="rounded-lg gap-2 cursor-pointer focus:bg-primary/5 focus:text-primary transition-colors"
														>
															<Eye className="h-4 w-4" />
															<span className="font-medium">
																{t("view_details")}
															</span>
														</DropdownMenuItem>
													)}
													<DropdownMenuItem
														onClick={() => onEdit(cls)}
														className="rounded-lg gap-2 cursor-pointer focus:bg-emerald-500/5 focus:text-emerald-600 transition-colors"
													>
														<Pencil className="h-4 w-4" />
														<span className="font-medium">
															{t("edit_class")}
														</span>
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => onDelete(cls)}
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
