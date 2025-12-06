"use client";

import { useState } from "react";
import { title } from "@/components/primitives";
import { StudentsTable } from "@/components/students/students-table";
import { StudentForm } from "@/components/students/student-form";
import { StudentStats } from "@/components/students/student-stats";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Languages } from "lucide-react";
import { useLanguage } from "@/contexts/language-context";
import { Student } from "@/types/student";

export default function StudentsPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h1 className={title()}>{t("student_management")}</h1>
          <p className="mt-2 text-muted-foreground">
            {t("manage_student_records")}
          </p>
        </div>
        <div className="flex gap-3 items-center">
          {/* Language Selector */}
          <Select value={language} onValueChange={(v) => setLanguage(v as "en" | "km")}>
            <SelectTrigger className="w-[140px]">
              <Languages className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="km">ខ្មែរ</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Add Student Button */}
          <Button onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {t("add_student")}
          </Button>
        </div>
      </div>

      {/* Statistics Section */}
      {students.length > 0 && <StudentStats students={students} />}

      {/* Students Table */}
      <StudentsTable onStudentsChange={setStudents} />

      {/* Add Student Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("add_new_student")}</DialogTitle>
          </DialogHeader>
          <StudentForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}
