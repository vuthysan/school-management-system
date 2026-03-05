"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	Plus,
	GraduationCap,
	AlertCircle,
	ChevronDown,
	BookOpen,
	Pencil,
	Trash2,
	Clock,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { GradeLevelsTable } from "@/components/academic/grade-levels-table";
import { GradeLevelForm } from "@/components/academic/grade-level-form";
import { ClassForm } from "@/components/academic/class-form";
import { useDashboard } from "@/hooks/useDashboard";
import { useGradeLevels } from "@/hooks/useGradeLevels";
import { useClasses } from "@/hooks/useClasses";
import {
	GradeLevel,
	Class,
	Status,
	GradeLevelFilterInput,
	GradeLevelSortInput,
	ClassFilterInput,
} from "@/types/academic";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}

export default function GradeLevelsPage() {
	const { t } = useTranslation();
	const router = useRouter();
	const { currentSchool, isLoading: isDashboardLoading } = useDashboard();
	const schoolId = currentSchool?.idStr || currentSchool?.id || null;

	// Grade level modal states
	const [isAddGradeLevelOpen, setIsAddGradeLevelOpen] = useState(false);
	const [isEditGradeLevelOpen, setIsEditGradeLevelOpen] = useState(false);
	const [deleteGradeLevelOpen, setDeleteGradeLevelOpen] = useState(false);
	const [selectedGradeLevel, setSelectedGradeLevel] =
		useState<GradeLevel | null>(null);

	// Class modal states
	const [isAddClassOpen, setIsAddClassOpen] = useState(false);
	const [isEditClassOpen, setIsEditClassOpen] = useState(false);
	const [deleteClassOpen, setDeleteClassOpen] = useState(false);
	const [selectedClass, setSelectedClass] = useState<Class | null>(null);
	const [addClassGradeLevel, setAddClassGradeLevel] = useState<string>("");

	const [isSubmitting, setIsSubmitting] = useState(false);

	// Expanded grade level (shows classes)
	const [expandedGradeId, setExpandedGradeId] = useState<string | null>(null);

	// Grade levels state
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState<Status | "">("");
	const [sort, setSort] = useState<GradeLevelSortInput>({
		sortBy: "order",
		sortOrder: "asc",
	});

	const debouncedSearch = useDebounce(search, 300);

	const filter = useMemo<GradeLevelFilterInput | undefined>(() => {
		const f: GradeLevelFilterInput = {};
		if (debouncedSearch) f.search = debouncedSearch;
		if (statusFilter) f.status = statusFilter;
		return Object.keys(f).length > 0 ? f : undefined;
	}, [debouncedSearch, statusFilter]);

	const {
		gradeLevels,
		total,
		totalPages,
		isLoading,
		error,
		createGradeLevel,
		updateGradeLevel,
		deleteGradeLevel,
		refresh,
	} = useGradeLevels({
		schoolId,
		page,
		pageSize: PAGE_SIZE,
		filter,
		sort,
	});

	// Classes for expanded grade level - filter by code since class form stores grade level code
	const classFilter = useMemo<ClassFilterInput | undefined>(() => {
		if (!expandedGradeId) return undefined;
		const expanded = gradeLevels.find((gl) => gl.id === expandedGradeId);
		if (!expanded) return undefined;
		return { gradeLevel: expanded.code };
	}, [expandedGradeId, gradeLevels]);

	const {
		classes,
		isLoading: isClassesLoading,
		createClass,
		updateClass,
		deleteClass: deleteClassFn,
	} = useClasses({
		schoolId: expandedGradeId ? schoolId : null,
		page: 1,
		pageSize: 100,
		filter: classFilter,
	});

	useEffect(() => {
		setPage(1);
	}, [debouncedSearch, statusFilter]);

	// Grade Level Handlers
	const handleAddGradeLevel = () => {
		setSelectedGradeLevel(null);
		setIsAddGradeLevelOpen(true);
	};

	const handleEditGradeLevel = (gl: GradeLevel) => {
		setSelectedGradeLevel(gl);
		setIsEditGradeLevelOpen(true);
	};

	const handleDeleteGradeLevel = (gl: GradeLevel) => {
		setSelectedGradeLevel(gl);
		setDeleteGradeLevelOpen(true);
	};

	const confirmDeleteGradeLevel = async () => {
		if (!selectedGradeLevel) return;
		setIsSubmitting(true);
		try {
			await deleteGradeLevel(selectedGradeLevel.id);
		} catch (error) {
			console.error(
				t("error"),
				error instanceof Error ? error.message : t("delete_failed")
			);
		} finally {
			setIsSubmitting(false);
			setDeleteGradeLevelOpen(false);
			setSelectedGradeLevel(null);
		}
	};

	const handleGradeLevelFormSuccess = async (data: any) => {
		if (!schoolId) return;
		setIsSubmitting(true);
		try {
			if (isEditGradeLevelOpen && selectedGradeLevel) {
				await updateGradeLevel(selectedGradeLevel.id, data);
			} else {
				await createGradeLevel({ ...data, schoolId });
			}
			setIsAddGradeLevelOpen(false);
			setIsEditGradeLevelOpen(false);
		} catch (error) {
			console.error(
				t("error"),
				error instanceof Error ? error.message : t("save_failed")
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Toggle expand
	const toggleExpand = (glId: string) => {
		setExpandedGradeId((prev) => (prev === glId ? null : glId));
	};

	// Class Handlers
	const handleAddClass = (gradeLevelName: string) => {
		setAddClassGradeLevel(gradeLevelName);
		setSelectedClass(null);
		setIsAddClassOpen(true);
	};

	const handleEditClass = (cls: Class) => {
		setSelectedClass(cls);
		setIsEditClassOpen(true);
	};

	const handleDeleteClass = (cls: Class) => {
		setSelectedClass(cls);
		setDeleteClassOpen(true);
	};

	const handleEditTimetable = (cls: Class) => {
		router.push(`/auth/admin/timetable/${cls.id}`);
	};

	const confirmDeleteClass = async () => {
		if (!selectedClass) return;
		setIsSubmitting(true);
		try {
			await deleteClassFn(selectedClass.id);
		} catch (error) {
			console.error(
				t("error"),
				error instanceof Error ? error.message : t("delete_failed")
			);
		} finally {
			setIsSubmitting(false);
			setDeleteClassOpen(false);
			setSelectedClass(null);
		}
	};

	const handleClassFormSuccess = async (data: any) => {
		if (!schoolId) return;
		setIsSubmitting(true);
		try {
			if (isEditClassOpen && selectedClass) {
				const updateData = {
					name: data.name,
					section: data.section,
					homeroomTeacherId: data.homeroomTeacherId,
					roomNumber: data.roomNumber,
					capacity: data.capacity,
					status: data.status,
					academicYearId: data.academicYearId,
				};
				await updateClass(selectedClass.id, updateData);
			} else {
				// eslint-disable-next-line @typescript-eslint/no-unused-vars
				const { status, ...createData } = data;
				await createClass({ ...createData, schoolId });
			}
			setIsAddClassOpen(false);
			setIsEditClassOpen(false);
		} catch (error) {
			console.error(
				t("error"),
				error instanceof Error ? error.message : t("save_failed")
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	// Render
	if (isDashboardLoading) {
		return (
			<div className="min-h-[60vh] flex items-center justify-center">
				<div className="text-center space-y-3">
					<div className="h-8 w-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin mx-auto" />
					<p className="text-sm text-muted-foreground">
						{t("loading") || "Loading..."}
					</p>
				</div>
			</div>
		);
	}

	if (!schoolId) {
		return (
			<div className="min-h-[60vh] flex items-center justify-center">
				<div className="text-center space-y-3">
					<div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center mx-auto">
						<AlertCircle className="h-5 w-5 text-amber-500" />
					</div>
					<p className="text-sm text-muted-foreground">
						{t("no_school_selected")}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6 pb-10">
			<PageHeader
				title={t("grade_levels")}
				subtitle={t("manage_grade_levels")}
				icon={GraduationCap}
			>
				<Button onClick={handleAddGradeLevel} size="sm" className="gap-2">
					<Plus className="h-4 w-4" />
					{t("add_grade_level")}
				</Button>
			</PageHeader>

			{error ? (
				<div className="min-h-[40vh] flex items-center justify-center">
					<div className="text-center space-y-3">
						<p className="text-sm text-destructive">{error}</p>
						<Button variant="outline" size="sm" onClick={() => refresh()}>
							{t("retry")}
						</Button>
					</div>
				</div>
			) : (
				<div className="space-y-3">
					{isLoading ? (
						Array.from({ length: 3 }).map((_, i) => (
							<div
								key={i}
								className="liquid-glass-card rounded-2xl p-4 animate-pulse"
							>
								<div className="h-5 w-48 bg-muted/50 rounded-md" />
							</div>
						))
					) : gradeLevels.length === 0 ? (
						<div className="min-h-[40vh] flex items-center justify-center">
							<div className="flex flex-col items-center gap-3">
								<div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center">
									<GraduationCap className="h-5 w-5 text-muted-foreground" />
								</div>
								<p className="text-sm font-medium text-foreground">
									{t("no_grade_levels")}
								</p>
							</div>
						</div>
					) : (
						gradeLevels.map((gl) => {
							const isExpanded = expandedGradeId === gl.id;
							const gradeLevelClasses = isExpanded ? classes : [];

							return (
								<motion.div
									key={gl.id}
									initial={{ opacity: 0, y: 8 }}
									animate={{ opacity: 1, y: 0 }}
									className="liquid-glass-card rounded-2xl overflow-hidden"
								>
									{/* Grade Level Header */}
									<div
										className={cn(
											"flex items-center justify-between px-4 py-3 cursor-pointer transition-colors",
											isExpanded
												? "bg-primary/5 dark:bg-primary/10"
												: "hover:bg-muted/30"
										)}
										onClick={() => toggleExpand(gl.id)}
									>
										<div className="flex items-center gap-3">
											<div
												className={cn(
													"w-8 h-8 rounded-lg flex items-center justify-center",
													isExpanded
														? "bg-primary/10 dark:bg-primary/20"
														: "bg-violet-50 dark:bg-violet-950/40"
												)}
											>
												<GraduationCap
													className={cn(
														"w-4 h-4",
														isExpanded
															? "text-primary"
															: "text-violet-600 dark:text-violet-400"
													)}
													strokeWidth={2}
												/>
											</div>
											<div>
												<div className="flex items-center gap-2">
													<h3 className="text-sm font-semibold text-foreground">
														{gl.name}
													</h3>
													<Badge
														variant="outline"
														className="rounded-lg border-primary/20 bg-primary/5 text-primary font-medium px-2 py-0 text-[10px]"
													>
														{gl.code}
													</Badge>
													<div className="flex items-center gap-1.5">
														<div
															className={cn(
																"w-1.5 h-1.5 rounded-full",
																gl.status === "Active"
																	? "bg-emerald-500"
																	: "bg-muted-foreground/30"
															)}
														/>
														<span
															className={cn(
																"text-[10px] font-medium",
																gl.status === "Active"
																	? "text-emerald-600 dark:text-emerald-400"
																	: "text-muted-foreground"
															)}
														>
															{t(gl.status.toLowerCase())}
														</span>
													</div>
												</div>
												{gl.description && (
													<p className="text-xs text-muted-foreground/70 mt-0.5">
														{gl.description}
													</p>
												)}
											</div>
										</div>
										<div className="flex items-center gap-1">
											<Button
												variant="ghost"
												size="icon"
												className="h-7 w-7 text-muted-foreground hover:text-foreground"
												onClick={(e) => {
													e.stopPropagation();
													handleEditGradeLevel(gl);
												}}
												title={t("edit_grade_level")}
											>
												<Pencil className="h-3.5 w-3.5" />
											</Button>
											<Button
												variant="ghost"
												size="icon"
												className="h-7 w-7 text-muted-foreground hover:text-destructive"
												onClick={(e) => {
													e.stopPropagation();
													handleDeleteGradeLevel(gl);
												}}
												title={t("delete_record")}
											>
												<Trash2 className="h-3.5 w-3.5" />
											</Button>
											<ChevronDown
												className={cn(
													"h-4 w-4 text-muted-foreground transition-transform duration-200",
													isExpanded && "rotate-180"
												)}
											/>
										</div>
									</div>

									{/* Expanded Classes Section */}
									<AnimatePresence>
										{isExpanded && (
											<motion.div
												initial={{ height: 0, opacity: 0 }}
												animate={{ height: "auto", opacity: 1 }}
												exit={{ height: 0, opacity: 0 }}
												transition={{ duration: 0.2 }}
												className="overflow-hidden"
											>
												<div className="border-t border-black/6 dark:border-white/6">
													{/* Classes header */}
													<div className="flex items-center justify-between px-4 py-2.5 bg-muted/20">
														<div className="flex items-center gap-2">
															<BookOpen className="h-3.5 w-3.5 text-muted-foreground" />
															<span className="text-xs font-medium text-muted-foreground">
																{t("classes")}
															</span>
															<span className="text-[10px] text-muted-foreground/60 tabular-nums">
																{gradeLevelClasses.length}
															</span>
														</div>
														<Button
															variant="outline"
															size="sm"
															className="h-7 text-xs gap-1.5"
															onClick={(e) => {
																e.stopPropagation();
																handleAddClass(gl.name);
															}}
														>
															<Plus className="h-3 w-3" />
															{t("add_class")}
														</Button>
													</div>

													{/* Classes list */}
													{isClassesLoading ? (
														<div className="px-4 py-6 flex justify-center">
															<div className="h-5 w-5 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
														</div>
													) : gradeLevelClasses.length === 0 ? (
														<div className="px-4 py-6 text-center">
															<p className="text-xs text-muted-foreground">
																{t("no_classes")}
															</p>
														</div>
													) : (
														<div className="divide-y divide-black/4 dark:divide-white/4">
															{gradeLevelClasses.map((cls) => (
																<div
																	key={cls.id}
																	className="flex items-center justify-between px-4 py-2.5 hover:bg-muted/20 transition-colors group"
																>
																	<div className="flex items-center gap-3">
																		<div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
																			<BookOpen className="w-3 h-3 text-blue-600 dark:text-blue-400" />
																		</div>
																		<div>
																			<div className="flex items-center gap-2">
																				<span className="text-sm font-medium text-foreground">
																					{cls.name}
																				</span>
																				{cls.section && (
																					<span className="text-xs text-muted-foreground">
																						{cls.section}
																					</span>
																				)}
																			</div>
																			<div className="flex items-center gap-3 mt-0.5">
																				{cls.roomNumber && (
																					<span className="text-[10px] text-muted-foreground/60">
																						{t("room")}: {cls.roomNumber}
																					</span>
																				)}
																				<span className="text-[10px] text-muted-foreground/60">
																					{cls.currentEnrollment}/{cls.capacity} {t("enrolled")}
																				</span>
																				<div className="flex items-center gap-1">
																					<div
																						className={cn(
																							"w-1.5 h-1.5 rounded-full",
																							cls.status === "Active"
																								? "bg-emerald-500"
																								: "bg-muted-foreground/30"
																						)}
																					/>
																					<span
																						className={cn(
																							"text-[10px] font-medium",
																							cls.status === "Active"
																								? "text-emerald-600 dark:text-emerald-400"
																								: "text-muted-foreground"
																						)}
																					>
																						{t(cls.status.toLowerCase())}
																					</span>
																				</div>
																			</div>
																		</div>
																	</div>
																	<div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
																		<Button
																			variant="ghost"
																			size="icon"
																			className="h-7 w-7 text-muted-foreground hover:text-foreground"
																			onClick={() => handleEditClass(cls)}
																			title={t("edit_class")}
																		>
																			<Pencil className="h-3 w-3" />
																		</Button>
																		<Button
																			variant="ghost"
																			size="icon"
																			className="h-7 w-7 text-muted-foreground hover:text-foreground"
																			onClick={() => handleEditTimetable(cls)}
																			title={t("edit_timetable") || "Timetable"}
																		>
																			<Clock className="h-3 w-3" />
																		</Button>
																		<Button
																			variant="ghost"
																			size="icon"
																			className="h-7 w-7 text-muted-foreground hover:text-destructive"
																			onClick={() => handleDeleteClass(cls)}
																			title={t("delete_record")}
																		>
																			<Trash2 className="h-3 w-3" />
																		</Button>
																	</div>
																</div>
															))}
														</div>
													)}
												</div>
											</motion.div>
										)}
									</AnimatePresence>
								</motion.div>
							);
						})
					)}
				</div>
			)}

			{/* Add/Edit Grade Level Modal */}
			<Dialog
				open={isAddGradeLevelOpen || isEditGradeLevelOpen}
				onOpenChange={() => {
					setIsAddGradeLevelOpen(false);
					setIsEditGradeLevelOpen(false);
				}}
			>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							{isEditGradeLevelOpen
								? t("edit_grade_level")
								: t("add_grade_level")}
						</DialogTitle>
					</DialogHeader>
					<GradeLevelForm
						initialData={selectedGradeLevel}
						onCancel={() => {
							setIsAddGradeLevelOpen(false);
							setIsEditGradeLevelOpen(false);
						}}
						onSuccess={handleGradeLevelFormSuccess}
					/>
				</DialogContent>
			</Dialog>

			{/* Add/Edit Class Modal */}
			<Dialog
				open={isAddClassOpen || isEditClassOpen}
				onOpenChange={() => {
					setIsAddClassOpen(false);
					setIsEditClassOpen(false);
				}}
			>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							{isEditClassOpen ? t("edit_class") : t("add_class")}
						</DialogTitle>
					</DialogHeader>
					<ClassForm
						initialData={
							isAddClassOpen
								? ({ gradeLevel: addClassGradeLevel } as any)
								: selectedClass
						}
						onCancel={() => {
							setIsAddClassOpen(false);
							setIsEditClassOpen(false);
						}}
						onSuccess={handleClassFormSuccess}
					/>
				</DialogContent>
			</Dialog>

			{/* Delete Grade Level Confirmation */}
			<DeleteConfirmDialog
				open={deleteGradeLevelOpen}
				onOpenChange={setDeleteGradeLevelOpen}
				title={t("confirm_delete") || "Confirm Delete"}
				description={t("delete_grade_level_confirmation", {
					name: selectedGradeLevel?.name,
				})}
				onConfirm={confirmDeleteGradeLevel}
				isLoading={isSubmitting}
				cancelLabel={t("cancel") || "Cancel"}
				confirmLabel={t("delete") || "Delete"}
			/>

			{/* Delete Class Confirmation */}
			<DeleteConfirmDialog
				open={deleteClassOpen}
				onOpenChange={setDeleteClassOpen}
				title={t("confirm_delete") || "Confirm Delete"}
				description={t("delete_class_confirmation", {
					name: selectedClass?.name,
				})}
				onConfirm={confirmDeleteClass}
				isLoading={isSubmitting}
				cancelLabel={t("cancel") || "Cancel"}
				confirmLabel={t("delete") || "Delete"}
			/>
		</div>
	);
}
