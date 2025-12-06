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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Search, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Subject } from "@/types/academic";

interface SubjectsTableProps {
  subjects: Subject[];
  onEdit: (sub: Subject) => void;
  onDelete: (sub: Subject) => void;
}

export const SubjectsTable: React.FC<SubjectsTableProps> = ({ subjects, onEdit, onDelete }) => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const columns = [
    { key: "name", label: t("subject_name").toUpperCase() },
    { key: "code", label: t("subject_code").toUpperCase() },
    { key: "department", label: t("department").toUpperCase() },
    { key: "credits", label: t("credits").toUpperCase() },
    { key: "status", label: t("status").toUpperCase() },
    { key: "actions", label: t("actions").toUpperCase() },
  ];

  const filteredSubjects = useMemo(() => {
    return subjects.filter((sub) =>
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.code.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [subjects, searchQuery]);

  const paginatedSubjects = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredSubjects.slice(start, start + rowsPerPage);
  }, [filteredSubjects, page]);

  const totalPages = Math.ceil(filteredSubjects.length / rowsPerPage);

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
            {paginatedSubjects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t("no_results")}
                </TableCell>
              </TableRow>
            ) : (
              paginatedSubjects.map((sub) => (
                <TableRow key={sub.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <p className="font-semibold text-sm capitalize">{sub.name}</p>
                      <p className="text-xs text-muted-foreground capitalize">{sub.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{sub.code}</Badge>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm capitalize">{sub.department}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{sub.credits}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={sub.status === "active" ? "default" : "secondary"} className="capitalize">
                      {sub.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
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
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive"
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
