"use client";

import { useState, useMemo, useEffect } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { title } from "@/components/primitives";
import { AcademicStats } from "@/components/academic/academic-stats";
import { ClassesTable } from "@/components/academic/classes-table";
import { SubjectsTable } from "@/components/academic/subjects-table";
import { ClassForm } from "@/components/academic/class-form";
import { SubjectForm } from "@/components/academic/subject-form";
import { useDashboard } from "@/hooks/useDashboard";
import { useClasses } from "@/hooks/useClasses";
import { useSubjects } from "@/hooks/useSubjects";
import { useGradeLevels } from "@/hooks/useGradeLevels";
import { GradeLevelsTable } from "@/components/academic/grade-levels-table";
import { GradeLevelForm } from "@/components/academic/grade-level-form";
import {
  Class,
  Subject,
  GradeLevel,
  Status,
  ClassFilterInput,
  ClassSortInput,
  SubjectFilterInput,
  SubjectSortInput,
  GradeLevelFilterInput,
  GradeLevelSortInput,
} from "@/types/academic";

const PAGE_SIZE = 10;

// Debounce hook
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

export default function AcademicPage() {
  const { t } = useTranslation();
  const { currentSchool, isLoading: isDashboardLoading } = useDashboard();
  const schoolId = currentSchool?.idStr || currentSchool?.id || null;

  // Tab state
  const [activeTab, setActiveTab] = useState<
    "classes" | "subjects" | "gradeLevels"
  >("classes");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedGradeLevel, setSelectedGradeLevel] =
    useState<GradeLevel | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ============================================================================
  // CLASSES STATE
  // ============================================================================
  const [classPage, setClassPage] = useState(1);
  const [classSearch, setClassSearch] = useState("");
  const [classStatusFilter, setClassStatusFilter] = useState<Status | "">("");
  const [classGradeLevelFilter, setClassGradeLevelFilter] = useState("");
  const [classSort, setClassSort] = useState<ClassSortInput>({
    sortBy: "name",
    sortOrder: "asc",
  });

  const debouncedClassSearch = useDebounce(classSearch, 300);

  const classFilter = useMemo<ClassFilterInput | undefined>(() => {
    const f: ClassFilterInput = {};

    if (debouncedClassSearch) f.search = debouncedClassSearch;
    if (classStatusFilter) f.status = classStatusFilter;
    if (classGradeLevelFilter) f.gradeLevel = classGradeLevelFilter;

    return Object.keys(f).length > 0 ? f : undefined;
  }, [debouncedClassSearch, classStatusFilter, classGradeLevelFilter]);

  const {
    classes,
    total: classTotal,
    totalPages: classTotalPages,
    isLoading: isClassesLoading,
    error: classesError,
    createClass,
    updateClass,
    deleteClass,
    refresh: refreshClasses,
  } = useClasses({
    schoolId,
    page: classPage,
    pageSize: PAGE_SIZE,
    filter: classFilter,
    sort: classSort,
  });

  // Reset page when filter changes
  useEffect(() => {
    setClassPage(1);
  }, [debouncedClassSearch, classStatusFilter, classGradeLevelFilter]);

  // ============================================================================
  // SUBJECTS STATE
  // ============================================================================
  const [subjectPage, setSubjectPage] = useState(1);
  const [subjectSearch, setSubjectSearch] = useState("");
  const [subjectStatusFilter, setSubjectStatusFilter] = useState<Status | "">(
    "",
  );
  const [subjectDepartmentFilter, setSubjectDepartmentFilter] = useState("");
  const [subjectSort, setSubjectSort] = useState<SubjectSortInput>({
    sortBy: "subjectName",
    sortOrder: "asc",
  });

  const debouncedSubjectSearch = useDebounce(subjectSearch, 300);

  const subjectFilter = useMemo<SubjectFilterInput | undefined>(() => {
    const f: SubjectFilterInput = {};

    if (debouncedSubjectSearch) f.search = debouncedSubjectSearch;
    if (subjectStatusFilter) f.status = subjectStatusFilter;
    if (subjectDepartmentFilter) f.department = subjectDepartmentFilter;

    return Object.keys(f).length > 0 ? f : undefined;
  }, [debouncedSubjectSearch, subjectStatusFilter, subjectDepartmentFilter]);

  const {
    subjects,
    total: subjectTotal,
    totalPages: subjectTotalPages,
    isLoading: isSubjectsLoading,
    error: subjectsError,
    createSubject,
    updateSubject,
    deleteSubject,
    refresh: refreshSubjects,
  } = useSubjects({
    schoolId,
    page: subjectPage,
    pageSize: PAGE_SIZE,
    filter: subjectFilter,
    sort: subjectSort,
  });

  // Reset page when filter changes
  useEffect(() => {
    setSubjectPage(1);
  }, [debouncedSubjectSearch, subjectStatusFilter, subjectDepartmentFilter]);

  // ============================================================================
  // GRADE LEVELS STATE
  // ============================================================================
  const [gradeLevelPage, setGradeLevelPage] = useState(1);
  const [gradeLevelSearch, setGradeLevelSearch] = useState("");
  const [gradeLevelStatusFilter, setGradeLevelStatusFilter] = useState<
    Status | ""
  >("");
  const [gradeLevelSort, setGradeLevelSort] = useState<GradeLevelSortInput>({
    sortBy: "order",
    sortOrder: "asc",
  });

  const debouncedGradeLevelSearch = useDebounce(gradeLevelSearch, 300);

  const gradeLevelFilter = useMemo<GradeLevelFilterInput | undefined>(() => {
    const f: GradeLevelFilterInput = {};

    if (debouncedGradeLevelSearch) f.search = debouncedGradeLevelSearch;
    if (gradeLevelStatusFilter) f.status = gradeLevelStatusFilter;

    return Object.keys(f).length > 0 ? f : undefined;
  }, [debouncedGradeLevelSearch, gradeLevelStatusFilter]);

  const {
    gradeLevels,
    total: gradeLevelTotal,
    totalPages: gradeLevelTotalPages,
    isLoading: isGradeLevelsLoading,
    error: gradeLevelsError,
    createGradeLevel,
    updateGradeLevel,
    deleteGradeLevel,
    refresh: refreshGradeLevels,
  } = useGradeLevels({
    schoolId,
    page: activeTab === "gradeLevels" ? gradeLevelPage : undefined, // Only fetch when active
    pageSize: PAGE_SIZE,
    filter: gradeLevelFilter,
    sort: gradeLevelSort,
  });

  // Reset page when filter changes
  useEffect(() => {
    setGradeLevelPage(1);
  }, [debouncedGradeLevelSearch, gradeLevelStatusFilter]);

  // Reset page when filter changes
  useEffect(() => {
    setSubjectPage(1);
  }, [debouncedSubjectSearch, subjectStatusFilter, subjectDepartmentFilter]);

  // ============================================================================
  // HANDLERS
  // ============================================================================
  const handleAdd = () => {
    setSelectedClass(null);
    setSelectedSubject(null);
    setSelectedGradeLevel(null);
    setIsAddModalOpen(true);
  };

  const handleEditClass = (cls: Class) => {
    setSelectedClass(cls);
    setIsEditModalOpen(true);
  };

  const handleEditSubject = (sub: Subject) => {
    setSelectedSubject(sub);
    setIsEditModalOpen(true);
  };

  const handleEditGradeLevel = (gl: GradeLevel) => {
    setSelectedGradeLevel(gl);
    setIsEditModalOpen(true);
  };

  const handleDeleteClass = (cls: Class) => {
    setSelectedClass(cls);
    setDeleteDialogOpen(true);
  };

  const handleDeleteSubject = (sub: Subject) => {
    setSelectedSubject(sub);
    setDeleteDialogOpen(true);
  };

  const handleDeleteGradeLevel = (gl: GradeLevel) => {
    setSelectedGradeLevel(gl);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    setIsSubmitting(true);
    try {
      if (activeTab === "classes" && selectedClass) {
        await deleteClass(selectedClass.id);
        console.log(t("class_deleted_successfully"));
      } else if (activeTab === "subjects" && selectedSubject) {
        await deleteSubject(selectedSubject.id);
        console.log(t("subject_deleted_successfully"));
      } else if (activeTab === "gradeLevels" && selectedGradeLevel) {
        await deleteGradeLevel(selectedGradeLevel.id);
        console.log(t("grade_level_deleted_successfully"));
      }
    } catch (error) {
      console.error(
        t("error"),
        error instanceof Error ? error.message : t("delete_failed"),
      );
    } finally {
      setIsSubmitting(false);
      setDeleteDialogOpen(false);
      setSelectedClass(null);
      setSelectedSubject(null);
      setSelectedGradeLevel(null);
    }
  };

  const handleClassFormSuccess = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (isEditModalOpen && selectedClass) {
        await updateClass(selectedClass.id, data);
        console.log(t("class_updated_successfully"));
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { status, ...createData } = data;

        await createClass({
          ...createData,
          schoolId,
          academicYearId: "default", // TODO: Get from academic year context
        });
        console.log(t("class_created_successfully"));
      }
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(
        t("error"),
        error instanceof Error ? error.message : t("save_failed"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubjectFormSuccess = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (isEditModalOpen && selectedSubject) {
        await updateSubject(selectedSubject.id, data);
        console.log(t("subject_updated_successfully"));
      } else {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { status, ...createData } = data;

        await createSubject({
          ...createData,
          schoolId,
        });
        console.log(t("subject_created_successfully"));
      }
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(
        t("error"),
        error instanceof Error ? error.message : t("save_failed"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGradeLevelFormSuccess = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (isEditModalOpen && selectedGradeLevel) {
        await updateGradeLevel(selectedGradeLevel.id, data);
        console.log(t("grade_level_updated_successfully"));
      } else {
        await createGradeLevel({
          ...data,
          schoolId,
        });
        console.log(t("grade_level_created_successfully"));
      }
      setIsAddModalOpen(false);
      setIsEditModalOpen(false);
    } catch (error) {
      console.error(
        t("error"),
        error instanceof Error ? error.message : t("save_failed"),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  if (isDashboardLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!schoolId) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-2">
        <p className="text-muted-foreground">{t("no_school_selected")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h1 className={title()}>{t("academic_management")}</h1>
          <p className="mt-2 text-muted-foreground">{t("manage_academic")}</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          {activeTab === "classes"
            ? t("add_class")
            : activeTab === "subjects"
              ? t("add_subject")
              : t("add_grade_level")}
        </Button>
      </div>

      {/* Stats */}
      <AcademicStats
        classes={classes}
        subjects={subjects}
        totalClasses={classTotal}
        totalSubjects={subjectTotal}
      />

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "classes" | "subjects")}
      >
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto">
          <TabsTrigger
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
            value="classes"
          >
            {t("classes")}
          </TabsTrigger>
          <TabsTrigger
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
            value="subjects"
          >
            {t("subjects")}
          </TabsTrigger>
          <TabsTrigger
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
            value="gradeLevels"
          >
            {t("grade_levels")}
          </TabsTrigger>
        </TabsList>

        {/* Classes Tab */}
        <TabsContent className="mt-4" value="classes">
          {classesError ? (
            <div className="flex flex-col items-center justify-center h-32 gap-2">
              <p className="text-destructive">{classesError}</p>
              <Button variant="outline" onClick={() => refreshClasses()}>
                {t("retry")}
              </Button>
            </div>
          ) : (
            <ClassesTable
              classes={classes}
              gradeLevelFilter={classGradeLevelFilter}
              isLoading={isClassesLoading}
              page={classPage}
              pageSize={PAGE_SIZE}
              search={classSearch}
              sort={classSort}
              statusFilter={classStatusFilter}
              total={classTotal}
              totalPages={classTotalPages}
              onDelete={handleDeleteClass}
              onEdit={handleEditClass}
              onGradeLevelFilterChange={setClassGradeLevelFilter}
              onPageChange={setClassPage}
              onSearchChange={setClassSearch}
              onSortChange={setClassSort}
              onStatusFilterChange={setClassStatusFilter}
            />
          )}
        </TabsContent>

        {/* Subjects Tab */}
        <TabsContent className="mt-4" value="subjects">
          {subjectsError ? (
            <div className="flex flex-col items-center justify-center h-32 gap-2">
              <p className="text-destructive">{subjectsError}</p>
              <Button variant="outline" onClick={() => refreshSubjects()}>
                {t("retry")}
              </Button>
            </div>
          ) : (
            <SubjectsTable
              departmentFilter={subjectDepartmentFilter}
              isLoading={isSubjectsLoading}
              page={subjectPage}
              pageSize={PAGE_SIZE}
              search={subjectSearch}
              sort={subjectSort}
              statusFilter={subjectStatusFilter}
              subjects={subjects}
              total={subjectTotal}
              totalPages={subjectTotalPages}
              onDelete={handleDeleteSubject}
              onDepartmentFilterChange={setSubjectDepartmentFilter}
              onEdit={handleEditSubject}
              onPageChange={setSubjectPage}
              onSearchChange={setSubjectSearch}
              onSortChange={setSubjectSort}
              onStatusFilterChange={setSubjectStatusFilter}
            />
          )}
        </TabsContent>

        {/* Grade Levels Tab */}
        <TabsContent className="mt-4" value="gradeLevels">
          {gradeLevelsError ? (
            <div className="flex flex-col items-center justify-center h-32 gap-2">
              <p className="text-destructive">{gradeLevelsError}</p>
              <Button variant="outline" onClick={() => refreshGradeLevels()}>
                {t("retry")}
              </Button>
            </div>
          ) : (
            <GradeLevelsTable
              gradeLevels={gradeLevels}
              isLoading={isGradeLevelsLoading}
              page={gradeLevelPage}
              pageSize={PAGE_SIZE}
              search={gradeLevelSearch}
              sort={gradeLevelSort}
              statusFilter={gradeLevelStatusFilter}
              total={gradeLevelTotal}
              totalPages={gradeLevelTotalPages}
              onDelete={handleDeleteGradeLevel}
              onEdit={handleEditGradeLevel}
              onPageChange={setGradeLevelPage}
              onSearchChange={setGradeLevelSearch}
              onSortChange={setGradeLevelSort}
              onStatusFilterChange={setGradeLevelStatusFilter}
            />
          )}
        </TabsContent>
      </Tabs>

      {/* Add/Edit Modal */}
      <Dialog
        open={isAddModalOpen || isEditModalOpen}
        onOpenChange={() => {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {activeTab === "classes"
                ? isEditModalOpen
                  ? t("edit_class")
                  : t("add_class")
                : activeTab === "subjects"
                  ? isEditModalOpen
                    ? t("edit_subject")
                    : t("add_subject")
                  : isEditModalOpen
                    ? t("edit_grade_level")
                    : t("add_grade_level")}
            </DialogTitle>
          </DialogHeader>
          {activeTab === "classes" ? (
            <ClassForm
              initialData={selectedClass}
              onCancel={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
              }}
              onSuccess={handleClassFormSuccess}
            />
          ) : activeTab === "subjects" ? (
            <SubjectForm
              initialData={selectedSubject}
              onCancel={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
              }}
              onSuccess={handleSubjectFormSuccess}
            />
          ) : (
            <GradeLevelForm
              initialData={selectedGradeLevel}
              onCancel={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
              }}
              onSuccess={handleGradeLevelFormSuccess}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("confirm_delete")}</DialogTitle>
            <DialogDescription>
              {activeTab === "classes"
                ? t("delete_class_confirmation", {
                    name: selectedClass?.name,
                  })
                : activeTab === "subjects"
                  ? t("delete_subject_confirmation", {
                      name: selectedSubject?.subjectName,
                    })
                  : t("delete_grade_level_confirmation", {
                      name: selectedGradeLevel?.name,
                    })}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              disabled={isSubmitting}
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button
              disabled={isSubmitting}
              variant="destructive"
              onClick={confirmDelete}
            >
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
