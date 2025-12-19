"use client";

import { useState } from "react";
import { Plus, GraduationCap, Sparkles, Users } from "lucide-react";

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
import { Card } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { useStudents } from "@/hooks/useStudents";
import { useDashboard } from "@/hooks/useDashboard";

import { motion } from "framer-motion";

export default function StudentsPage() {
	const [isAddModalOpen, setIsAddModalOpen] = useState(false);
	const { currentSchool } = useDashboard();
	const schoolId = currentSchool?.idStr || currentSchool?.id || null;
	const { students, isLoading, refresh } = useStudents(schoolId);
	const { t } = useLanguage();

	const handleAddSuccess = () => {
		setIsAddModalOpen(false);
		refresh();
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="space-y-4 pb-10"
		>
			{/* Header Section */}
			<Card className="p-4">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 relative">
					<div className="flex items-center gap-5">
						<div className="relative group">
							<div className="absolute -inset-1 bg-primary/20 blur opacity-0 group-hover:opacity-100 transition duration-500 rounded-lg" />
							<div className="relative p-4 bg-primary rounded-lg shadow-lg shadow-primary/20 text-primary-foreground">
								<GraduationCap className="w-8 h-8" />
							</div>
						</div>
						<div className="space-y-1">
							<h1 className="text-3xl font-black tracking-tight text-foreground/90">
								{t("student_management")}
							</h1>
							<p className="text-sm text-muted-foreground/80 font-medium">
								{t("manage_student_records")}
							</p>
						</div>
					</div>

					<Button
						onClick={() => setIsAddModalOpen(true)}
						className="rounded-lg px-6 h-12 bg-primary hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 text-sm gap-2"
					>
						<Plus className="w-5 h-5" />
						{t("add_student")}
					</Button>
				</div>
			</Card>

			{/* Statistics Section */}
			{students.length > 0 && <StudentStats students={students} />}

			{/* StudentsTable handles its own container */}
			<div className="relative">
				<div className="absolute -bottom-40 -right-20 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
				<StudentsTable schoolId={schoolId} />
			</div>

			{/* Add Student Modal */}
			<Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
				<DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-3">
							<div className="p-2 bg-primary/10 rounded-lg">
								<GraduationCap className="w-5 h-5 text-primary" />
							</div>
							{t("add_new_student")}
						</DialogTitle>
					</DialogHeader>
					<StudentForm schoolId={schoolId} onSuccess={handleAddSuccess} />
				</DialogContent>
			</Dialog>
		</motion.div>
	);
}
