"use client";

import { useState } from "react";
import { Plus } from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { title } from "@/components/primitives";
import { useLanguage } from "@/contexts/language-context";
import { AcademicStats } from "@/components/academic/academic-stats";
import { ClassesTable } from "@/components/academic/classes-table";
import { SubjectsTable } from "@/components/academic/subjects-table";
import { ClassForm } from "@/components/academic/class-form";
import { SubjectForm } from "@/components/academic/subject-form";
import { Class, Subject } from "@/types/academic";

// Mock Data
const MOCK_CLASSES: Class[] = [
  {
    id: "1",
    name: "Grade 10-A",
    gradeLevel: "10",
    section: "A",
    teacherId: "t1",
    teacherName: "John Doe",
    room: "101",
    capacity: 30,
    enrolledCount: 28,
    status: "active",
    academicYear: "2024-2025",
  },
  {
    id: "2",
    name: "Grade 10-B",
    gradeLevel: "10",
    section: "B",
    teacherId: "t2",
    teacherName: "Jane Smith",
    room: "102",
    capacity: 30,
    enrolledCount: 25,
    status: "active",
    academicYear: "2024-2025",
  },
  {
    id: "3",
    name: "Grade 11-A",
    gradeLevel: "11",
    section: "A",
    teacherId: "t3",
    teacherName: "Robert Johnson",
    room: "201",
    capacity: 35,
    enrolledCount: 32,
    status: "active",
    academicYear: "2024-2025",
  },
];

const MOCK_SUBJECTS: Subject[] = [
  {
    id: "1",
    name: "Mathematics",
    code: "MATH101",
    description: "Fundamental mathematics concepts",
    credits: 4,
    department: "Mathematics",
    status: "active",
  },
  {
    id: "2",
    name: "Physics",
    code: "SCI201",
    description: "Introduction to Physics",
    credits: 3,
    department: "Science",
    status: "active",
  },
  {
    id: "3",
    name: "English Literature",
    code: "ENG101",
    description: "Classic and modern literature",
    credits: 3,
    department: "English",
    status: "active",
  },
  {
    id: "4",
    name: "History",
    code: "HIS101",
    description: "World History",
    credits: 3,
    department: "Social Studies",
    status: "active",
  },
];

export default function AcademicPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"classes" | "subjects">("classes");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);

  // State for data
  const [classes, setClasses] = useState<Class[]>(MOCK_CLASSES);
  const [subjects, setSubjects] = useState<Subject[]>(MOCK_SUBJECTS);

  const handleAdd = () => {
    setSelectedClass(null);
    setSelectedSubject(null);
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

  const handleDeleteClass = (cls: Class) => {
    if (confirm("Are you sure you want to delete this class?")) {
      setClasses(classes.filter((c) => c.id !== cls.id));
    }
  };

  const handleDeleteSubject = (sub: Subject) => {
    if (confirm("Are you sure you want to delete this subject?")) {
      setSubjects(subjects.filter((s) => s.id !== sub.id));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h1 className={title()}>{t("academic_management")}</h1>
          <p className="mt-2 text-muted-foreground">{t("manage_academic")}</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="w-4 h-4 mr-2" />
          {activeTab === "classes" ? t("add_class") : t("add_subject")}
        </Button>
      </div>

      <AcademicStats classes={classes} subjects={subjects} />

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
        </TabsList>
        <TabsContent className="mt-4" value="classes">
          <ClassesTable
            classes={classes}
            onDelete={handleDeleteClass}
            onEdit={handleEditClass}
          />
        </TabsContent>
        <TabsContent className="mt-4" value="subjects">
          <SubjectsTable
            subjects={subjects}
            onDelete={handleDeleteSubject}
            onEdit={handleEditSubject}
          />
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
                : isEditModalOpen
                  ? t("edit_subject")
                  : t("add_subject")}
            </DialogTitle>
          </DialogHeader>
          {activeTab === "classes" ? (
            <ClassForm
              initialData={selectedClass}
              onCancel={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
              }}
              onSuccess={(data) => {
                // Handle create/update logic here
                console.log("Class Data:", data);
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
              }}
            />
          ) : (
            <SubjectForm
              initialData={selectedSubject}
              onCancel={() => {
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
              }}
              onSuccess={(data) => {
                // Handle create/update logic here
                console.log("Subject Data:", data);
                setIsAddModalOpen(false);
                setIsEditModalOpen(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
