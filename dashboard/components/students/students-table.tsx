"use client";

import React, { useMemo, useState, useCallback } from "react";
import {
  Search,
  Eye,
  Trash2,
  Filter,
  Pencil,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { ViewStudentModal } from "./view-student-modal";
import { DeleteStudentModal } from "./delete-student-modal";
import { StudentForm } from "./student-form";

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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Student, StudentFilters, SortDescriptor } from "@/types/student";
import { useLanguage } from "@/contexts/language-context";

// Mock data for demonstration
const MOCK_STUDENTS: Student[] = [
  {
    id: "1",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    dateOfBirth: "2005-03-15",
    gender: "male",
    phone: "+1234567890",
    address: "123 Main St, City, State",
    gradeLevel: "10",
    guardianName: "Jane Doe",
    guardianPhone: "+1234567891",
    enrollmentDate: "2023-09-01",
    status: "active",
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Smith",
    email: "sarah.smith@example.com",
    dateOfBirth: "2006-07-22",
    gender: "female",
    phone: "+1234567892",
    address: "456 Oak Ave, City, State",
    gradeLevel: "11",
    guardianName: "Michael Smith",
    guardianPhone: "+1234567893",
    enrollmentDate: "2023-09-01",
    status: "active",
  },
  {
    id: "3",
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael.j@example.com",
    dateOfBirth: "2004-11-08",
    gender: "male",
    phone: "+1234567894",
    address: "789 Pine Rd, City, State",
    gradeLevel: "12",
    guardianName: "Lisa Johnson",
    guardianPhone: "+1234567895",
    enrollmentDate: "2023-09-01",
    status: "active",
  },
  {
    id: "4",
    firstName: "Emily",
    lastName: "Williams",
    email: "emily.w@example.com",
    dateOfBirth: "2005-05-30",
    gender: "female",
    phone: "+1234567896",
    address: "321 Elm St, City, State",
    gradeLevel: "10",
    guardianName: "Robert Williams",
    guardianPhone: "+1234567897",
    enrollmentDate: "2023-09-01",
    status: "active",
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Brown",
    email: "david.brown@example.com",
    dateOfBirth: "2006-01-12",
    gender: "male",
    phone: "+1234567898",
    address: "654 Maple Dr, City, State",
    gradeLevel: "11",
    guardianName: "Susan Brown",
    guardianPhone: "+1234567899",
    enrollmentDate: "2023-09-01",
    status: "active",
  },
  {
    id: "6",
    firstName: "Jessica",
    lastName: "Davis",
    email: "jessica.d@example.com",
    dateOfBirth: "2004-09-25",
    gender: "female",
    phone: "+1234567800",
    address: "987 Cedar Ln, City, State",
    gradeLevel: "12",
    guardianName: "Thomas Davis",
    guardianPhone: "+1234567801",
    enrollmentDate: "2023-09-01",
    status: "active",
  },
  {
    id: "7",
    firstName: "Christopher",
    lastName: "Miller",
    email: "chris.m@example.com",
    dateOfBirth: "2005-12-03",
    gender: "male",
    phone: "+1234567802",
    address: "147 Birch St, City, State",
    gradeLevel: "10",
    guardianName: "Patricia Miller",
    guardianPhone: "+1234567803",
    enrollmentDate: "2023-09-01",
    status: "active",
  },
  {
    id: "8",
    firstName: "Amanda",
    lastName: "Wilson",
    email: "amanda.w@example.com",
    dateOfBirth: "2006-04-18",
    gender: "female",
    phone: "+1234567804",
    address: "258 Spruce Ave, City, State",
    gradeLevel: "11",
    guardianName: "James Wilson",
    guardianPhone: "+1234567805",
    enrollmentDate: "2023-09-01",
    status: "active",
  },
];

const GRADE_LEVELS = [
  { key: "10", label: "Grade 10" },
  { key: "11", label: "Grade 11" },
  { key: "12", label: "Grade 12" },
];

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

interface StudentsTableProps {
  onStudentsChange?: (students: Student[]) => void;
}

export const StudentsTable: React.FC<StudentsTableProps> = ({
  onStudentsChange,
}) => {
  const { t } = useLanguage();

  // Dynamic arrays that use translations
  const GENDERS = [
    { key: "male", label: t("male") },
    { key: "female", label: t("female") },
    { key: "other", label: t("other") },
  ];

  const columns = [
    { key: "name", label: t("name").toUpperCase(), sortable: true },
    { key: "email", label: t("email").toUpperCase(), sortable: true },
    { key: "phone", label: t("phone").toUpperCase(), sortable: false },
    { key: "gradeLevel", label: t("grade").toUpperCase(), sortable: true },
    { key: "gender", label: t("gender").toUpperCase(), sortable: true },
    { key: "status", label: t("status").toUpperCase(), sortable: true },
    { key: "actions", label: t("actions").toUpperCase(), sortable: false },
  ];

  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<StudentFilters>({
    gradeLevel: "",
    gender: "",
  });
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
    column: "name",
    direction: "ascending",
  });
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Notify parent when students change
  React.useEffect(() => {
    if (onStudentsChange) {
      onStudentsChange(students);
    }
  }, [students, onStudentsChange]);

  // Filter and search students
  const filteredStudents = useMemo(() => {
    let filtered = [...students];

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();

      filtered = filtered.filter(
        (student) =>
          student.firstName.toLowerCase().includes(query) ||
          student.lastName.toLowerCase().includes(query) ||
          student.email.toLowerCase().includes(query) ||
          student.phone.includes(query),
      );
    }

    // Apply filters
    if (filters.gradeLevel) {
      filtered = filtered.filter(
        (student) => student.gradeLevel === filters.gradeLevel,
      );
    }

    if (filters.gender) {
      filtered = filtered.filter(
        (student) => student.gender === filters.gender,
      );
    }

    return filtered;
  }, [students, searchQuery, filters]);

  // Sort students
  const sortedStudents = useMemo(() => {
    const sorted = [...filteredStudents];

    sorted.sort((a, b) => {
      let first: string | number = "";
      let second: string | number = "";

      switch (sortDescriptor.column) {
        case "name":
          first = `${a.firstName} ${a.lastName}`;
          second = `${b.firstName} ${b.lastName}`;
          break;
        case "email":
          first = a.email;
          second = b.email;
          break;
        case "gradeLevel":
          first = parseInt(a.gradeLevel);
          second = parseInt(b.gradeLevel);
          break;
        case "gender":
          first = a.gender;
          second = b.gender;
          break;
        case "status":
          first = a.status || "";
          second = b.status || "";
          break;
        default:
          first = "";
          second = "";
      }

      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });

    return sorted;
  }, [filteredStudents, sortDescriptor]);

  // Paginate students
  const paginatedStudents = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedStudents.slice(start, end);
  }, [sortedStudents, page, rowsPerPage]);

  const totalPages = Math.ceil(sortedStudents.length / rowsPerPage);

  const handleViewStudent = useCallback((student: Student) => {
    setSelectedStudent(student);
    setIsViewModalOpen(true);
  }, []);

  const handleEditStudent = useCallback((student: Student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  }, []);

  const handleDeleteStudent = useCallback((student: Student) => {
    setSelectedStudent(student);
    setIsDeleteModalOpen(true);
  }, []);

  const handleEditSuccess = useCallback((updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)),
    );
    setIsEditModalOpen(false);
    setSelectedStudent(null);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!selectedStudent) return;

    setIsDeleting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setStudents((prev) => prev.filter((s) => s.id !== selectedStudent.id));
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    setSelectedStudent(null);
  }, [selectedStudent]);

  const handleClearFilters = useCallback(() => {
    setFilters({ gradeLevel: "", gender: "" });
    setSearchQuery("");
  }, []);

  const hasActiveFilters = searchQuery || filters.gradeLevel || filters.gender;

  return (
    <div className="flex flex-col gap-4">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="pl-8"
              placeholder={t("search_placeholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <Select
              value={filters.gradeLevel}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, gradeLevel: value }))
              }
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t("grade_level")} />
              </SelectTrigger>
              <SelectContent>
                {GRADE_LEVELS.map((grade) => (
                  <SelectItem key={grade.key} value={grade.key}>
                    {grade.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={filters.gender}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, gender: value }))
              }
            >
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t("gender")} />
              </SelectTrigger>
              <SelectContent>
                {GENDERS.map((gender) => (
                  <SelectItem key={gender.key} value={gender.key}>
                    {gender.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {t("showing_results")
                .replace("{count}", sortedStudents.length.toString())
                .replace("{total}", students.length.toString())}
            </span>
            <Button size="sm" variant="outline" onClick={handleClearFilters}>
              {t("clear_filters")}
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStudents.length === 0 ? (
              <TableRow>
                <TableCell
                  className="h-24 text-center"
                  colSpan={columns.length}
                >
                  {hasActiveFilters ? t("no_results") : t("no_students")}
                </TableCell>
              </TableRow>
            ) : (
              paginatedStudents.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {student.firstName.charAt(0)}
                          {student.lastName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {student.email}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {student.phone}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {t("grade")} {student.gradeLevel}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground capitalize">
                    {t(student.gender)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        student.status === "active" ? "default" : "secondary"
                      }
                    >
                      {t(student.status || "active")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className="h-8 w-8"
                            size="icon"
                            variant="ghost"
                            onClick={() => handleViewStudent(student)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t("view_details")}</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className="h-8 w-8 text-primary"
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEditStudent(student)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{t("edit_record")}</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className="h-8 w-8 text-destructive"
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDeleteStudent(student)}
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

      {/* Rows per page selector */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {t("total_count").replace(
            "{count}",
            sortedStudents.length.toString(),
          )}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {t("rows_per_page")}
          </span>
          <Select
            value={rowsPerPage.toString()}
            onValueChange={(value) => {
              setRowsPerPage(parseInt(value));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ROWS_PER_PAGE_OPTIONS.map((option) => (
                <SelectItem key={option} value={option.toString()}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Modals */}
      <ViewStudentModal
        isOpen={isViewModalOpen}
        student={selectedStudent}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedStudent(null);
        }}
      />

      {/* Edit Student Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("edit_student")}</DialogTitle>
          </DialogHeader>
          <StudentForm
            mode="edit"
            student={selectedStudent}
            onSuccess={handleEditSuccess}
          />
        </DialogContent>
      </Dialog>

      <DeleteStudentModal
        isDeleting={isDeleting}
        isOpen={isDeleteModalOpen}
        student={selectedStudent}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedStudent(null);
        }}
        onConfirm={confirmDelete}
      />
    </div>
  );
};
