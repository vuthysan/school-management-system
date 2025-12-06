"use client";

import React, { useMemo, useState } from "react";
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
import { Search, Edit, Trash2, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Class } from "@/types/academic";

interface ClassesTableProps {
  classes: Class[];
  onEdit: (cls: Class) => void;
  onDelete: (cls: Class) => void;
}

export const ClassesTable: React.FC<ClassesTableProps> = ({ classes, onEdit, onDelete }) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const columns = [
    { key: "name", label: t("class_name").toUpperCase() },
    { key: "section", label: t("section").toUpperCase() },
    { key: "teacher", label: t("teacher").toUpperCase() },
    { key: "room", label: t("room").toUpperCase() },
    { key: "stats", label: t("enrolled").toUpperCase() },
    { key: "status", label: t("status").toUpperCase() },
    { key: "actions", label: t("actions").toUpperCase() },
  ];

  const filteredClasses = useMemo(() => {
    return classes.filter((cls) =>
      cls.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cls.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [classes, searchQuery]);

  const paginatedClasses = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredClasses.slice(start, start + rowsPerPage);
  }, [filteredClasses, page]);

  const totalPages = Math.ceil(filteredClasses.length / rowsPerPage);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between gap-3 items-end">
        <div className="relative w-full sm:max-w-[44%]">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder={t("search_placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.key === "actions" ? "text-center" : ""}>
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedClasses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t("no_results")}
                </TableCell>
              </TableRow>
            ) : (
              paginatedClasses.map((cls) => (
                <TableRow key={cls.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <p className="font-semibold text-sm capitalize">{cls.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{cls.gradeLevel}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm capitalize">{cls.section}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm capitalize">{cls.teacherName}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm capitalize">{cls.room}</p>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <p className="text-sm">
                        {cls.enrolledCount} / {cls.capacity}
                      </p>
                      <div className="w-full bg-muted rounded-full h-1.5 mt-1">
                        <div 
                          className="bg-primary h-1.5 rounded-full" 
                          style={{ width: `${(cls.enrolledCount / cls.capacity) * 100}%` }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={cls.status === "active" ? "default" : "secondary"} className="capitalize">
                      {cls.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t("view_details")}</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
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
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
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
      
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
