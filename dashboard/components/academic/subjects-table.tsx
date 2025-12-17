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

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Subject, Status, SubjectSortInput } from "@/types/academic";

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
      subjects.map((sub) => sub.department).filter(Boolean),
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
          {departments.length > 0 && (
            <Select
              value={departmentFilter || "__all__"}
              onValueChange={(value) =>
                onDepartmentFilterChange?.(value === "__all__" ? "" : value)
              }
            >
              <SelectTrigger className="w-[160px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder={t("all_departments")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__all__">{t("all_departments")}</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
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
                    handleSort(column.key as SubjectSortInput["sortBy"])
                  }
                >
                  <div className="flex items-center">
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
            ) : subjects.length === 0 ? (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  {t("no_results")}
                </TableCell>
              </TableRow>
            ) : (
              subjects.map((sub) => (
                <TableRow
                  key={sub.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <p className="font-semibold text-sm">{sub.subjectName}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">
                        {sub.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{sub.subjectCode}</Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{sub.department || "-"}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{sub.credits}</p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        sub.status === "Active" ? "default" : "secondary"
                      }
                    >
                      {t(sub.status.toLowerCase())}
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
                            onClick={() => onEdit(sub)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t("edit_subject")}</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className="h-8 w-8 text-destructive"
                            size="icon"
                            variant="ghost"
                            onClick={() => onDelete(sub)}
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
