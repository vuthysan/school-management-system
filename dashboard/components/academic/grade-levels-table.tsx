"use client";

import React from "react";
import {
	Search,
	Edit,
	Trash2,
	ArrowUpDown,
	ArrowUp,
	ArrowDown,
	Filter,
} from "lucide-react";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";
import { GradeLevel, Status, GradeLevelSortInput } from "@/types/academic";

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

	const columns = [
		{ key: "name", label: t("grade_level_name"), sortable: true },
		{ key: "code", label: t("grade_level_code"), sortable: true },
		{ key: "order", label: t("grade_level_order"), sortable: true },
		{ key: "description", label: t("description"), sortable: false },
		{ key: "status", label: t("status"), sortable: false },
		{ key: "actions", label: t("actions"), sortable: false },
	];

	return (
		<div className="flex flex-col gap-4">
			{/* Search and Filters */}
			<div className="flex flex-wrap gap-3 items-center justify-between">
				<div className="relative w-full sm:max-w-xs">
					<Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
					<Input
						className="pl-8"
						placeholder={t("search_placeholder")}
						value={search}
						onChange={(e) => onSearchChange?.(e.target.value)}
					/>
				</div>
				<div className="flex gap-2 flex-wrap">
					<Select
						value={statusFilter || "__all__"}
						onValueChange={(value) =>
							onStatusFilterChange?.(
								value === "__all__" ? "" : (value as Status)
							)
						}
					>
						<SelectTrigger className="w-[140px]">
							<Filter className="mr-2 h-4 w-4" />
							<SelectValue placeholder={t("all_status")} />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="__all__">{t("all_status")}</SelectItem>
							<SelectItem value="Active">{t("active")}</SelectItem>
							<SelectItem value="Inactive">{t("inactive")}</SelectItem>
							<SelectItem value="Archived">{t("archived")}</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Table */}
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							{columns.map((column) => (
								<TableHead
									key={column.key}
									className={`${column.key === "actions" ? "text-center" : ""} ${column.sortable ? "cursor-pointer select-none hover:bg-muted/50" : ""}`}
									onClick={() =>
										column.sortable &&
										handleSort(column.key as GradeLevelSortInput["sortBy"])
									}
								>
									<div className="flex items-center">
										{column.label}
										{column.sortable && (
											<SortIcon
												field={column.key as GradeLevelSortInput["sortBy"]}
											/>
										)}
									</div>
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							// Loading skeletons
							Array.from({ length: 5 }).map((_, i) => (
								<TableRow key={i}>
									{columns.map((col) => (
										<TableCell key={col.key}>
											<Skeleton className="h-6 w-full" />
										</TableCell>
									))}
								</TableRow>
							))
						) : gradeLevels.length === 0 ? (
							<TableRow>
								<TableCell
									className="h-24 text-center"
									colSpan={columns.length}
								>
									{t("no_grade_levels")}
								</TableCell>
							</TableRow>
						) : (
							gradeLevels.map((level) => (
								<TableRow
									key={level.id}
									className="cursor-pointer hover:bg-muted/50 transition-colors"
								>
									<TableCell>
										<p className="font-semibold text-sm">{level.name}</p>
									</TableCell>
									<TableCell>
										<Badge variant="outline">{level.code}</Badge>
									</TableCell>
									<TableCell>
										<p className="text-sm">{level.order}</p>
									</TableCell>
									<TableCell>
										<p className="text-sm text-muted-foreground truncate max-w-[200px]">
											{level.description || "-"}
										</p>
									</TableCell>
									<TableCell>
										<Badge
											variant={
												level.status === "Active" ? "default" : "secondary"
											}
										>
											{t(level.status.toLowerCase())}
										</Badge>
									</TableCell>
									<TableCell className="text-center">
										<div className="flex items-center justify-center gap-1">
											<Tooltip>
												<TooltipTrigger asChild>
													<Button
														className="h-8 w-8"
														size="icon"
														variant="ghost"
														onClick={() => onEdit(level)}
													>
														<Edit className="h-4 w-4" />
													</Button>
												</TooltipTrigger>
												<TooltipContent>{t("edit_grade_level")}</TooltipContent>
											</Tooltip>
											<Tooltip>
												<TooltipTrigger asChild>
													<Button
														className="h-8 w-8 text-destructive"
														size="icon"
														variant="ghost"
														onClick={() => onDelete(level)}
													>
														<Trash2 className="h-4 w-4" />
													</Button>
												</TooltipTrigger>
												<TooltipContent>
													{t("delete_grade_level")}
												</TooltipContent>
											</Tooltip>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
};
