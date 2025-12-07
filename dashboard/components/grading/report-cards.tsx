"use client";

import React, { useState } from "react";
import { Search, Download, Eye, ChevronLeft, ChevronRight } from "lucide-react";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

// Mock Data
const REPORTS = [
  {
    id: "1",
    name: "Alice Johnson",
    className: "Grade 10-A",
    gpa: 3.8,
    credits: 24,
    status: "passed",
  },
  {
    id: "2",
    name: "Bob Smith",
    className: "Grade 10-A",
    gpa: 3.2,
    credits: 24,
    status: "passed",
  },
  {
    id: "3",
    name: "Charlie Brown",
    className: "Grade 10-A",
    gpa: 2.5,
    credits: 24,
    status: "passed",
  },
  {
    id: "4",
    name: "Diana Prince",
    className: "Grade 10-B",
    gpa: 4.0,
    credits: 24,
    status: "passed",
  },
  {
    id: "5",
    name: "Evan Wright",
    className: "Grade 10-B",
    gpa: 1.8,
    credits: 20,
    status: "failed",
  },
];

export const ReportCards = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const columns = [
    { key: "name", label: t("name").toUpperCase() },
    { key: "className", label: t("class_name").toUpperCase() },
    { key: "gpa", label: t("gpa").toUpperCase() },
    { key: "credits", label: t("credits").toUpperCase() },
    { key: "status", label: t("status").toUpperCase() },
    { key: "actions", label: t("actions").toUpperCase() },
  ];

  const filteredReports = React.useMemo(() => {
    return REPORTS.filter((report) => {
      const matchesSearch = report.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesClass = selectedClass
        ? report.className === selectedClass
        : true;

      return matchesSearch && matchesClass;
    });
  }, [searchQuery, selectedClass]);

  const paginatedReports = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;

    return filteredReports.slice(start, start + rowsPerPage);
  }, [filteredReports, page]);

  const totalPages = Math.ceil(filteredReports.length / rowsPerPage);

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
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={column.key === "actions" ? "text-center" : ""}
                >
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedReports.length === 0 ? (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  {t("no_results")}
                </TableCell>
              </TableRow>
            ) : (
              paginatedReports.map((report) => (
                <TableRow
                  key={report.id}
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <TableCell>
                    <p className="font-semibold text-sm">{report.name}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground">
                      {report.className}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p
                      className={cn(
                        "font-semibold text-sm",
                        report.gpa >= 3.5
                          ? "text-green-600"
                          : report.gpa >= 2.0
                            ? "text-primary"
                            : "text-red-600",
                      )}
                    >
                      {report.gpa.toFixed(2)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm">{report.credits}</p>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className="capitalize"
                      variant={
                        report.status === "passed" ? "default" : "destructive"
                      }
                    >
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Button className="h-8 w-8" size="icon" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        className="h-8 w-8 text-primary"
                        size="icon"
                        variant="ghost"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
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
            disabled={page === 1}
            size="icon"
            variant="outline"
            onClick={() => setPage(Math.max(1, page - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            disabled={page === totalPages}
            size="icon"
            variant="outline"
            onClick={() => setPage(Math.min(totalPages, page + 1))}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
