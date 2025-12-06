"use client";

import React, { useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";

// Mock Data
const HISTORY_DATA = [
  { id: "1", className: "Grade 10-A", date: "2024-03-20", present: 28, absent: 2, late: 0, status: "completed" },
  { id: "2", className: "Grade 10-B", date: "2024-03-20", present: 25, absent: 5, late: 1, status: "completed" },
  { id: "3", className: "Grade 11-A", date: "2024-03-20", present: 32, absent: 0, late: 3, status: "completed" },
  { id: "4", className: "Grade 10-A", date: "2024-03-19", present: 29, absent: 1, late: 0, status: "completed" },
  { id: "5", className: "Grade 10-B", date: "2024-03-19", present: 26, absent: 4, late: 0, status: "completed" },
];

export const AttendanceHistory = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const columns = [
    { key: "className", label: t("class_name").toUpperCase() },
    { key: "date", label: "DATE" },
    { key: "present", label: t("total_present").toUpperCase() },
    { key: "absent", label: t("total_absent").toUpperCase() },
    { key: "late", label: t("total_late").toUpperCase() },
    { key: "status", label: t("status").toUpperCase() },
    { key: "actions", label: t("actions").toUpperCase() },
  ];

  const filteredHistory = React.useMemo(() => {
    return HISTORY_DATA.filter((record) => {
      const matchesSearch = record.className.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesClass = selectedClass ? record.className === selectedClass : true;
      return matchesSearch && matchesClass;
    });
  }, [searchQuery, selectedClass]);

  const paginatedHistory = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    return filteredHistory.slice(start, start + rowsPerPage);
  }, [filteredHistory, page]);

  const totalPages = Math.ceil(filteredHistory.length / rowsPerPage);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row justify-between gap-3 items-end">
        <div className="relative w-full sm:max-w-[44%]">
          <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder={t("search_placeholder")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Select value={selectedClass} onValueChange={setSelectedClass}>
          <SelectTrigger className="w-full sm:max-w-xs">
            <SelectValue placeholder={t("select_class")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Grade 10-A">Grade 10-A</SelectItem>
            <SelectItem value="Grade 10-B">Grade 10-B</SelectItem>
            <SelectItem value="Grade 11-A">Grade 11-A</SelectItem>
          </SelectContent>
        </Select>
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
            {paginatedHistory.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t("no_results")}
                </TableCell>
              </TableRow>
            ) : (
              paginatedHistory.map((record) => (
                <TableRow key={record.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                  <TableCell>
                    <p className="font-semibold text-sm">{record.className}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground">{record.date}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                      {record.present}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-red-500/10 text-red-600">
                      {record.absent}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600">
                      {record.late}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="default">
                      Completed
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                    </Button>
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
