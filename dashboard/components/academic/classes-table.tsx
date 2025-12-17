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
import { Class, Status, ClassSortInput } from "@/types/academic";

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
                value === "__all__" ? "" : (value as Status),
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
          <Select
            value={gradeLevelFilter || "__all__"}
            onValueChange={(value) =>
              onGradeLevelFilterChange?.(value === "__all__" ? "" : value)
            }
          >
            <SelectTrigger className="w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder={t("all_grades")} />
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
                    handleSort(column.key as ClassSortInput["sortBy"])
                  }
                >
                  <div className="flex items-center">
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
            ) : classes.length === 0 ? (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  {t("no_results")}
                </TableCell>
              </TableRow>
            ) : (
              classes.map((cls) => (
                <TableRow
                  key={cls.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <TableCell>
                    <p className="font-semibold text-sm">{cls.name}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground">{cls.code}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{cls.gradeLevel}</Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{cls.section || "-"}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{cls.roomNumber || "-"}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <p className="text-sm">
                        {cls.currentEnrollment} / {cls.capacity}
                      </p>
                      <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                        <div
                          className={`h-1.5 rounded-full ${
                            cls.currentEnrollment / cls.capacity > 0.9
                              ? "bg-destructive"
                              : cls.currentEnrollment / cls.capacity > 0.7
                                ? "bg-yellow-500"
                                : "bg-primary"
                          }`}
                          style={{
                            width: `${Math.min((cls.currentEnrollment / cls.capacity) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        cls.status === "Active" ? "default" : "secondary"
                      }
                    >
                      {t(cls.status.toLowerCase())}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      {onView && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              className="h-8 w-8"
                              size="icon"
                              variant="ghost"
                              onClick={() => onView(cls)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{t("view_details")}</TooltipContent>
                        </Tooltip>
                      )}
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className="h-8 w-8"
                            size="icon"
                            variant="ghost"
                            onClick={() => onEdit(cls)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t("edit_class")}</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className="h-8 w-8 text-destructive"
                            size="icon"
                            variant="ghost"
                            onClick={() => onDelete(cls)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t("delete_record")}</TooltipContent>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
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
