"use client";

import React, { useMemo, useState, useCallback } from "react";
import {
	Eye,
	Trash2,
	Filter,
	Pencil,
	ChevronLeft,
	ChevronRight,
	Copy,
	MoreHorizontal,
	FileText,
	GraduationCap,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { ViewStudentModal } from "./view-student-modal";
import { DeleteStudentModal } from "./delete-student-modal";
import { StudentForm } from "./student-form";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchInput } from "@/components/shared/search-input";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Student, StudentFilters, SortDescriptor } from "@/types/student";
import { useLanguage } from "@/contexts/language-context";
import { useStudents } from "@/hooks/useStudents";
import { cn } from "@/lib/utils";

const GRADE_LEVELS = [
	{ key: "10", label: "Grade 10" },
	{ key: "11", label: "Grade 11" },
	{ key: "12", label: "Grade 12" },
];

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

interface StudentsTableProps {
	schoolId: string | null;
	onStudentsChange?: (students: Student[]) => void;
	onSelectionChange?: (selectedStudents: Student[]) => void;
}

export const StudentsTable: React.FC<StudentsTableProps> = ({
	schoolId,
	onStudentsChange,
	onSelectionChange,
}) => {
	const { t } = useLanguage();
	const { students, isLoading, error, refresh, deleteStudent, createStudent } =
		useStudents(schoolId);

	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
	const lastSelectedIds = React.useRef<string[]>([]);

	React.useEffect(() => {
		if (onSelectionChange) {
			const selectedIdsArray = Array.from(selectedIds).sort();
			if (
				JSON.stringify(lastSelectedIds.current) !==
				JSON.stringify(selectedIdsArray)
			) {
				const selectedStudents = students.filter((s) => selectedIds.has(s.id));
				onSelectionChange(selectedStudents);
				lastSelectedIds.current = selectedIdsArray;
			}
		}
	}, [selectedIds, students, onSelectionChange]);

	const GENDERS = [
		{ key: "male", label: t("male") },
		{ key: "female", label: t("female") },
		{ key: "other", label: t("other") },
	];

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
	const [isCloneModalOpen, setIsCloneModalOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);
	const [isCloning, setIsCloning] = useState(false);

	React.useEffect(() => {
		if (onStudentsChange) {
			onStudentsChange(students);
		}
	}, [students, onStudentsChange]);

	// Filter and search
	const filteredStudents = useMemo(() => {
		let filtered = [...students];

		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(student) =>
					student.firstNameKm.toLowerCase().includes(query) ||
					student.lastNameKm.toLowerCase().includes(query) ||
					(student.firstNameEn &&
						student.firstNameEn.toLowerCase().includes(query)) ||
					(student.lastNameEn &&
						student.lastNameEn.toLowerCase().includes(query)) ||
					(student.fullName &&
						student.fullName.toLowerCase().includes(query)) ||
					student.contact?.email?.toLowerCase().includes(query) ||
					student.contact?.phone?.includes(query)
			);
		}

		if (filters.gradeLevel) {
			filtered = filtered.filter(
				(student) => student.gradeLevel === filters.gradeLevel
			);
		}

		if (filters.gender) {
			filtered = filtered.filter(
				(student) => student.gender === filters.gender
			);
		}

		return filtered;
	}, [students, searchQuery, filters]);

	// Sort
	const sortedStudents = useMemo(() => {
		const sorted = [...filteredStudents];

		sorted.sort((a, b) => {
			let first: string | number = "";
			let second: string | number = "";

			switch (sortDescriptor.column) {
				case "name":
					first = a.fullName || `${a.firstNameKm} ${a.lastNameKm}`;
					second = b.fullName || `${b.firstNameKm} ${b.lastNameKm}`;
					break;
				case "email":
					first = a.contact?.email || "";
					second = b.contact?.email || "";
					break;
				case "gradeLevel":
					first = parseInt(a.gradeLevel || "0");
					second = parseInt(b.gradeLevel || "0");
					break;
				case "gender":
					first = a.gender || "";
					second = b.gender || "";
					break;
				case "status":
					first = a.status || "";
					second = b.status || "";
					break;
				default:
					first = "";
					second = "";
			}

			const cmp =
				(first as any) < (second as any)
					? -1
					: (first as any) > (second as any)
						? 1
						: 0;

			return sortDescriptor.direction === "descending" ? -cmp : cmp;
		});

		return sorted;
	}, [filteredStudents, sortDescriptor]);

	// Paginate
	const paginatedStudents = useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		return sortedStudents.slice(start, start + rowsPerPage);
	}, [sortedStudents, page, rowsPerPage]);

	const totalPages = Math.ceil(sortedStudents.length / rowsPerPage);

	const handleToggleSelectAll = useCallback(() => {
		if (
			selectedIds.size === paginatedStudents.length &&
			paginatedStudents.length > 0
		) {
			setSelectedIds(new Set());
		} else {
			setSelectedIds(new Set(paginatedStudents.map((s) => s.id)));
		}
	}, [selectedIds.size, paginatedStudents]);

	const handleToggleSelect = useCallback((id: string) => {
		setSelectedIds((prev) => {
			const next = new Set(prev);
			if (next.has(id)) next.delete(id);
			else next.add(id);
			return next;
		});
	}, []);

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

	const handleEditSuccess = useCallback(() => {
		refresh();
		setIsEditModalOpen(false);
		setSelectedStudent(null);
	}, [refresh]);

	const confirmDelete = useCallback(async () => {
		if (!selectedStudent) return;
		setIsDeleting(true);
		try {
			await deleteStudent(selectedStudent.id);
			setIsDeleteModalOpen(false);
			setSelectedStudent(null);
		} catch (err) {
			console.error("Failed to delete student:", err);
		} finally {
			setIsDeleting(false);
		}
	}, [selectedStudent, deleteStudent]);

	const handleClearFilters = useCallback(() => {
		setFilters({ gradeLevel: "", gender: "" });
		setSearchQuery("");
	}, []);

	const handleCloneStudent = useCallback((student: Student) => {
		setSelectedStudent(student);
		setIsCloneModalOpen(true);
	}, []);

	const confirmClone = useCallback(async () => {
		if (!selectedStudent || !schoolId) return;
		setIsCloning(true);
		try {
			const cloneInput = {
				schoolId,
				nationalId: undefined,
				firstNameKm: selectedStudent.firstNameKm,
				lastNameKm: selectedStudent.lastNameKm,
				firstNameEn: selectedStudent.firstNameEn || undefined,
				lastNameEn: selectedStudent.lastNameEn || undefined,
				dateOfBirth: selectedStudent.dateOfBirth,
				gender: selectedStudent.gender,
				nationality: selectedStudent.nationality || undefined,
				religion: selectedStudent.religion || undefined,
				gradeLevel: selectedStudent.gradeLevel,
				contact: selectedStudent.contact
					? {
							email: undefined,
							phone: undefined,
							address: selectedStudent.contact.address,
						}
					: undefined,
				guardians: selectedStudent.guardians?.map((g, index) => ({
					name: g.name,
					relationship: g.relationship || "GUARDIAN",
					phone: g.phone,
					isEmergencyContact: g.isEmergencyContact ?? index === 0,
					canPickup: g.canPickup ?? true,
				})),
			};

			await createStudent(cloneInput as any);
			toast.success(t("student_cloned"));
			setIsCloneModalOpen(false);
			setSelectedStudent(null);
		} catch (err) {
			console.error("Failed to clone student:", err);
			toast.error(err instanceof Error ? err.message : "Clone failed");
		} finally {
			setIsCloning(false);
		}
	}, [selectedStudent, schoolId, createStudent, t]);

	const hasActiveFilters = searchQuery || filters.gradeLevel || filters.gender;

	return (
		<>
			<motion.div
				initial={{ opacity: 0, y: 8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.15, duration: 0.3 }}
			>
				<div className="liquid-glass-card rounded-2xl overflow-hidden">
					{/* Card header — search + filters */}
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 border-b border-black/6 dark:border-white/6">
						<div className="flex items-center gap-3">
							<div className="w-6 h-6 rounded-md bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center">
								<GraduationCap className="w-3 h-3 text-violet-600 dark:text-violet-400" strokeWidth={2} />
							</div>
							<h2 className="text-sm font-semibold text-foreground">
								{t("all_students") || "All Students"}
							</h2>
							<span className="text-xs text-muted-foreground/60 tabular-nums">
								{sortedStudents.length}
							</span>
						</div>
						<div className="flex items-center gap-2 w-full sm:w-auto">
							<Select
								value={filters.gradeLevel}
								onValueChange={(value) =>
									setFilters((prev) => ({ ...prev, gradeLevel: value }))
								}
							>
								<SelectTrigger className="w-[130px] h-9 text-xs">
									<div className="flex items-center gap-1.5">
										<Filter className="h-3 w-3 text-muted-foreground" />
										<SelectValue placeholder={t("grade_level")} />
									</div>
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
								<SelectTrigger className="w-[110px] h-9 text-xs">
									<div className="flex items-center gap-1.5">
										<Filter className="h-3 w-3 text-muted-foreground" />
										<SelectValue placeholder={t("gender")} />
									</div>
								</SelectTrigger>
								<SelectContent>
									{GENDERS.map((gender) => (
										<SelectItem key={gender.key} value={gender.key}>
											{gender.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{hasActiveFilters && (
								<Button
									size="sm"
									variant="ghost"
									onClick={handleClearFilters}
									className="h-9 text-xs text-muted-foreground"
								>
									{t("clear")}
								</Button>
							)}
							<SearchInput
								placeholder={t("search_placeholder") || "Search..."}
								value={searchQuery}
								onChange={setSearchQuery}
								className="w-full sm:w-56"
							/>
						</div>
					</div>

					{/* Table */}
					<Table>
						<TableHeader>
							<TableRow className="hover:bg-transparent border-b border-black/6 dark:border-white/6">
								<TableHead className="w-10 h-10">
									<Checkbox
										checked={
											paginatedStudents.length > 0 &&
											selectedIds.size === paginatedStudents.length
										}
										onCheckedChange={handleToggleSelectAll}
									/>
								</TableHead>
								<TableHead className="w-75 h-10 text-xs font-medium text-muted-foreground">
									{t("name")}
								</TableHead>
								<TableHead className="h-10 text-xs font-medium text-muted-foreground">
									{t("email")}
								</TableHead>
								<TableHead className="h-10 text-xs font-medium text-muted-foreground">
									{t("phone")}
								</TableHead>
								<TableHead className="h-10 text-xs font-medium text-muted-foreground">
									{t("grade")}
								</TableHead>
								<TableHead className="h-10 text-xs font-medium text-muted-foreground">
									{t("gender")}
								</TableHead>
								<TableHead className="h-10 text-xs font-medium text-muted-foreground">
									{t("status")}
								</TableHead>
								<TableHead className="text-right h-10 text-xs font-medium text-muted-foreground">
									{t("actions")}
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							<AnimatePresence mode="popLayout">
								{paginatedStudents.length === 0 ? (
									<TableRow>
										<TableCell className="h-60 text-center" colSpan={8}>
											<div className="flex flex-col items-center justify-center gap-3">
												<div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center">
													<GraduationCap className="h-5 w-5 text-muted-foreground" />
												</div>
												<p className="text-sm font-medium text-foreground">
													{hasActiveFilters ? t("no_results") : t("no_students")}
												</p>
											</div>
										</TableCell>
									</TableRow>
								) : (
									paginatedStudents.map((student, index) => (
										<motion.tr
											key={student.id}
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											transition={{ delay: index * 0.03 }}
											className="group hover:bg-muted/30 transition-colors border-b border-black/6 dark:border-white/6"
										>
											<TableCell className="py-3 px-4">
												<Checkbox
													checked={selectedIds.has(student.id)}
													onCheckedChange={() =>
														handleToggleSelect(student.id)
													}
													onClick={(e) => e.stopPropagation()}
												/>
											</TableCell>
											<TableCell className="py-3">
												<div className="flex items-center gap-3">
													<Avatar className="h-9 w-9 border border-black/6 dark:border-white/6">
														<AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
															{student.firstNameKm.charAt(0)}
															{student.lastNameKm.charAt(0)}
														</AvatarFallback>
													</Avatar>
													<div className="min-w-0">
														<p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
															{student.fullName ||
																`${student.firstNameKm} ${student.lastNameKm}`}
														</p>
														<p className="text-xs text-muted-foreground/60 truncate mt-0.5">
															ID: {student.studentId}
														</p>
													</div>
												</div>
											</TableCell>
											<TableCell className="text-sm text-foreground/70">
												{student.contact?.email || "-"}
											</TableCell>
											<TableCell className="text-sm text-foreground/70">
												{student.contact?.phone || "-"}
											</TableCell>
											<TableCell>
												<Badge
													variant="secondary"
													className="bg-primary/8 text-primary border-none text-xs font-medium"
												>
													{t("grade")} {student.gradeLevel}
												</Badge>
											</TableCell>
											<TableCell className="text-sm text-foreground/70 capitalize">
												{t(student.gender?.toLowerCase() || "other")}
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-1.5">
													<div
														className={cn(
															"w-1.5 h-1.5 rounded-full",
															student.status === "active"
																? "bg-emerald-500"
																: "bg-muted-foreground/30"
														)}
													/>
													<span
														className={cn(
															"text-xs font-medium",
															student.status === "active"
																? "text-emerald-600 dark:text-emerald-400"
																: "text-muted-foreground"
														)}
													>
														{t(student.status?.toLowerCase() || "active")}
													</span>
												</div>
											</TableCell>
											<TableCell className="text-right">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant="ghost"
															size="sm"
															className="h-7 w-7 p-0 hover:bg-muted"
														>
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent
														align="end"
														className="w-[160px]"
													>
														<DropdownMenuItem
															onClick={() => handleViewStudent(student)}
														>
															<Eye className="mr-2 h-3.5 w-3.5" />
															{t("view_details")}
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => handleEditStudent(student)}
														>
															<Pencil className="mr-2 h-3.5 w-3.5" />
															{t("edit")}
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => handleCloneStudent(student)}
														>
															<Copy className="mr-2 h-3.5 w-3.5" />
															{t("clone")}
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => handleDeleteStudent(student)}
															className="text-destructive focus:text-destructive focus:bg-destructive/10"
														>
															<Trash2 className="mr-2 h-3.5 w-3.5" />
															{t("delete")}
														</DropdownMenuItem>
														<DropdownMenuItem asChild>
															<Link
																href={`/auth/admin/analytics?studentId=${student.id}`}
															>
																<FileText className="mr-2 h-3.5 w-3.5" />
																{t("view_report")}
															</Link>
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

					{/* Pagination footer */}
					{totalPages > 0 && (
						<div className="flex items-center justify-between px-4 py-3 border-t border-black/6 dark:border-white/6">
							<div className="flex items-center gap-2">
								<span className="text-xs text-muted-foreground">
									{sortedStudents.length} {t("total_students_stat") || "students"}
								</span>
								<Select
									value={rowsPerPage.toString()}
									onValueChange={(value) => {
										setRowsPerPage(parseInt(value));
										setPage(1);
									}}
								>
									<SelectTrigger className="w-[65px] h-7 text-xs">
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{ROWS_PER_PAGE_OPTIONS.map((option) => (
											<SelectItem
												key={option}
												value={option.toString()}
											>
												{option}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>

							{totalPages > 1 && (
								<div className="flex items-center gap-1">
									<Button
										disabled={page === 1}
										size="sm"
										variant="ghost"
										className="h-7 w-7 p-0"
										onClick={() => setPage(Math.max(1, page - 1))}
									>
										<ChevronLeft className="h-4 w-4" />
									</Button>
									<span className="text-xs text-muted-foreground px-2 tabular-nums">
										{page} / {totalPages}
									</span>
									<Button
										disabled={page === totalPages}
										size="sm"
										variant="ghost"
										className="h-7 w-7 p-0"
										onClick={() => setPage(Math.min(totalPages, page + 1))}
									>
										<ChevronRight className="h-4 w-4" />
									</Button>
								</div>
							)}
						</div>
					)}
				</div>
			</motion.div>

			{/* Modals */}
			<ViewStudentModal
				isOpen={isViewModalOpen}
				student={selectedStudent}
				onClose={() => {
					setIsViewModalOpen(false);
					setSelectedStudent(null);
				}}
			/>

			<Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
				<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>{t("edit_student")}</DialogTitle>
					</DialogHeader>
					<StudentForm
						schoolId={schoolId}
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

			<Dialog open={isCloneModalOpen} onOpenChange={setIsCloneModalOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>{t("clone_student")}</DialogTitle>
					</DialogHeader>
					<p className="text-sm text-muted-foreground">
						{t("clone_student_confirm", {
							name:
								selectedStudent?.fullName ||
								`${selectedStudent?.firstNameKm} ${selectedStudent?.lastNameKm}`,
						})}
					</p>
					<div className="flex justify-end gap-2 pt-4 border-t border-black/6 dark:border-white/6">
						<Button
							variant="ghost"
							onClick={() => {
								setIsCloneModalOpen(false);
								setSelectedStudent(null);
							}}
						>
							{t("cancel")}
						</Button>
						<Button disabled={isCloning} onClick={confirmClone}>
							{isCloning && (
								<span className="mr-2 h-4 w-4 rounded-full border-2 border-primary-foreground/20 border-t-primary-foreground animate-spin inline-block" />
							)}
							{t("clone")}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
};
