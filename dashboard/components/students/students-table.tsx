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
	Copy,
	MoreHorizontal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

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
}

export const StudentsTable: React.FC<StudentsTableProps> = ({
	schoolId,
	onStudentsChange,
}) => {
	const { t } = useLanguage();
	const { students, isLoading, error, refresh, deleteStudent, createStudent } =
		useStudents(schoolId);

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

		// Apply filters
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

	// Sort students
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
				// Don't copy studentId - let the backend generate a new one
				nationalId: undefined, // Don't copy national ID
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
							email: undefined, // Don't copy email
							phone: undefined, // Don't copy phone
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
		<div className="flex flex-col gap-6">
			{/* Toolbar with motion */}
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<div className="flex flex-col md:flex-row gap-4">
					<div className="relative flex-1 group">
						<Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
						<Input
							className="pl-10 h-11 rounded-lg transition-all"
							placeholder={t("search_placeholder")}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<div className="flex flex-wrap gap-3">
						<Select
							value={filters.gradeLevel}
							onValueChange={(value) =>
								setFilters((prev) => ({ ...prev, gradeLevel: value }))
							}
						>
							<SelectTrigger className="w-[160px] h-11 rounded-lg ">
								<div className="flex items-center gap-2">
									<Filter className="h-3.5 w-3.5 text-muted-foreground" />
									<SelectValue placeholder={t("grade_level")} />
								</div>
							</SelectTrigger>
							<SelectContent className="rounded-xl shadow-xl">
								{GRADE_LEVELS.map((grade) => (
									<SelectItem
										key={grade.key}
										value={grade.key}
										className="rounded-lg"
									>
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
							<SelectTrigger className="w-[160px] h-11 rounded-lg ">
								<div className="flex items-center gap-2">
									<Filter className="h-3.5 w-3.5 text-muted-foreground" />
									<SelectValue placeholder={t("gender")} />
								</div>
							</SelectTrigger>
							<SelectContent className="rounded-xl shadow-xl">
								{GENDERS.map((gender) => (
									<SelectItem
										key={gender.key}
										value={gender.key}
										className="rounded-lg"
									>
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
								className="h-11 px-4 rounded-lg hover:bg-destructive/5 text-destructive font-medium"
							>
								{t("clear")}
							</Button>
						)}
					</div>
				</div>

				{hasActiveFilters && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className="flex items-center gap-2 text-sm text-muted-foreground"
					>
						<div className="w-1.5 h-1.5 rounded-full bg-primary" />
						{t("showing_results")
							.replace("{count}", sortedStudents.length.toString())
							.replace("{total}", students.length.toString())}
					</motion.div>
				)}
			</motion.div>

			{/* Premium Table */}
			<div className="rounded-lg border-none shadow-sm overflow-hidden bg-card">
				<Table>
					<TableHeader>
						<TableRow>
							{columns.map((column) => (
								<TableHead
									key={column.key}
									className={cn(
										"uppercase tracking-widest px-4",
										column.key === "actions" && "text-right"
									)}
								>
									{column.label}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						<AnimatePresence mode="popLayout">
							{paginatedStudents.length === 0 ? (
								<motion.tr
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
								>
									<TableCell
										className="h-64 text-center text-muted-foreground font-medium"
										colSpan={columns.length}
									>
										<div className="flex flex-col items-center gap-3">
											<div className="p-4 bg-secondary/20 rounded-full">
												<Search className="h-6 w-6 opacity-20" />
											</div>
											{hasActiveFilters ? t("no_results") : t("no_students")}
										</div>
									</TableCell>
								</motion.tr>
							) : (
								paginatedStudents.map((student, index) => (
									<motion.tr
										key={student.id}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.3, delay: index * 0.05 }}
										className="group transition-all hover:bg-secondary/10 cursor-pointer"
									>
										<TableCell className="px-6 py-4">
											<div className="flex items-center gap-4">
												<div className="relative">
													<Avatar className="h-10 w-10 border-2 border-background shadow-sm transition-transform group-hover:scale-110">
														<AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/20 text-primary  text-xs">
															{student.firstNameKm.charAt(0)}
															{student.lastNameKm.charAt(0)}
														</AvatarFallback>
													</Avatar>
													<div
														className={cn(
															"absolute -right-0.5 -bottom-0.5 w-3 h-3 rounded-full border-2 border-background",
															student.status === "active"
																? "bg-emerald-500"
																: "bg-muted-foreground"
														)}
													/>
												</div>
												<div className="flex flex-col">
													<span className=" text-foreground group-hover:text-primary transition-colors">
														{student.fullName ||
															`${student.firstNameKm} ${student.lastNameKm}`}
													</span>
													<span className="text-[11px] text-muted-foreground/80 font-medium tracking-wide">
														ID: {student.studentId}
													</span>
												</div>
											</div>
										</TableCell>
										<TableCell className="px-6 text-sm text-foreground/70 font-medium">
											{student.contact?.email || "-"}
										</TableCell>
										<TableCell className="px-6 text-sm text-foreground/70 font-medium">
											{student.contact?.phone || "-"}
										</TableCell>
										<TableCell className="px-6">
											<Badge
												variant="secondary"
												className="bg-primary/5 text-primary border-none rounded-lg px-2.5 py-0.5  text-[11px]"
											>
												{t("grade")} {student.gradeLevel}
											</Badge>
										</TableCell>
										<TableCell className="px-6 text-sm text-foreground/70 font-medium capitalize">
											{t(student.gender?.toLowerCase() || "other")}
										</TableCell>
										<TableCell className="px-6">
											<Badge
												variant="secondary"
												className={cn(
													"rounded-lg px-2.5 py-0.5  text-[11px] border-none",
													student.status === "active"
														? "bg-emerald-500/10 text-emerald-600"
														: "bg-muted text-muted-foreground"
												)}
											>
												{t(student.status?.toLowerCase() || "active")}
											</Badge>
										</TableCell>
										<TableCell className="px-6 text-right">
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														variant="ghost"
														className="h-8 w-8 p-0 hover:bg-muted rounded-full"
													>
														<span className="sr-only">Open menu</span>
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent
													align="end"
													className="w-[160px] rounded-lg"
												>
													<DropdownMenuItem
														onClick={() => handleViewStudent(student)}
														className="text-blue-500 focus:text-blue-600 focus:bg-blue-50"
													>
														<Eye className="mr-2 h-4 w-4" />
														<span>{t("view_details")}</span>
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleEditStudent(student)}
														className="text-emerald-500 focus:text-emerald-600 focus:bg-emerald-50"
													>
														<Pencil className="mr-2 h-4 w-4" />
														<span>{t("edit")}</span>
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleCloneStudent(student)}
														className="text-amber-500 focus:text-amber-600 focus:bg-amber-50"
													>
														<Copy className="mr-2 h-4 w-4" />
														<span>{t("clone")}</span>
													</DropdownMenuItem>
													<DropdownMenuItem
														onClick={() => handleDeleteStudent(student)}
														className="text-destructive focus:text-destructive focus:bg-destructive/10"
													>
														<Trash2 className="mr-2 h-4 w-4" />
														<span>{t("delete")}</span>
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

			{/* Footer with Pagination and Rows Selection */}
			<div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4 py-2">
				<div className="flex flex-col gap-1 items-center sm:items-start order-2 sm:order-1">
					<span className="text-xs  text-muted-foreground/60 uppercase tracking-widest">
						{t("total_count").replace(
							"{count}",
							sortedStudents.length.toString()
						)}
					</span>
					<div className="flex items-center gap-2 mt-1">
						<span className="text-xs font-medium text-muted-foreground/60">
							{t("rows_per_page")}
						</span>
						<Select
							value={rowsPerPage.toString()}
							onValueChange={(value) => {
								setRowsPerPage(parseInt(value));
								setPage(1);
							}}
						>
							<SelectTrigger className="w-[70px] h-8 rounded-lg text-xs ">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="rounded-xl shadow-xl min-w-[70px]">
								{ROWS_PER_PAGE_OPTIONS.map((option) => (
									<SelectItem
										key={option}
										value={option.toString()}
										className="rounded-lg text-xs"
									>
										{option}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{totalPages > 1 && (
					<div className="flex items-center gap-2 order-1 sm:order-2">
						<Button
							disabled={page === 1}
							size="icon"
							variant="outline"
							className="h-10 w-10 rounded-xl  hover:bg-primary/5 hover:text-primary transition-all disabled:opacity-30"
							onClick={() => setPage(Math.max(1, page - 1))}
						>
							<ChevronLeft className="h-5 w-5" />
						</Button>

						<div className="flex items-center gap-1.5 mx-2">
							{Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
								let pageNum = page;
								if (page <= 3) pageNum = i + 1;
								else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
								else pageNum = page - 2 + i;

								if (pageNum > 0 && pageNum <= totalPages) {
									return (
										<Button
											key={pageNum}
											variant={page === pageNum ? "default" : "ghost"}
											className={cn(
												"h-10 w-10 rounded-xl transition-all  text-sm",
												page === pageNum
													? "shadow-md shadow-primary/5 scale-110"
													: "hover:bg-primary/5 hover:text-primary text-muted-foreground"
											)}
											onClick={() => setPage(pageNum)}
										>
											{pageNum}
										</Button>
									);
								}
								return null;
							})}
						</div>

						<Button
							disabled={page === totalPages}
							size="icon"
							variant="outline"
							className="h-10 w-10 rounded-xl  hover:bg-primary/5 hover:text-primary transition-all disabled:opacity-30"
							onClick={() => setPage(Math.min(totalPages, page + 1))}
						>
							<ChevronRight className="h-5 w-5" />
						</Button>
					</div>
				)}
			</div>

			{/* (Modals remain same) */}
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
				<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl">
					<DialogHeader>
						<DialogTitle className="text-2xl font-black tracking-tight">
							{t("edit_student")}
						</DialogTitle>
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

			{/* Clone Student Modal */}
			<Dialog open={isCloneModalOpen} onOpenChange={setIsCloneModalOpen}>
				<DialogContent className="max-w-md rounded-xl shadow-xl">
					<DialogHeader>
						<DialogTitle className="text-2xl font-black tracking-tight">
							{t("clone_student")}
						</DialogTitle>
					</DialogHeader>
					<p className="text-muted-foreground font-medium">
						{t("clone_student_confirm", {
							name:
								selectedStudent?.fullName ||
								`${selectedStudent?.firstNameKm} ${selectedStudent?.lastNameKm}`,
						})}
					</p>
					<div className="flex justify-end gap-3 mt-6">
						<Button
							variant="outline"
							className="rounded-lg px-6 h-11 "
							onClick={() => {
								setIsCloneModalOpen(false);
								setSelectedStudent(null);
							}}
						>
							{t("cancel")}
						</Button>
						<Button
							disabled={isCloning}
							onClick={confirmClone}
							className="rounded-lg px-6 h-11  shadow-sm"
						>
							{isCloning && <span className="mr-2 animate-spin">⏳</span>}
							{t("clone")}
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};
