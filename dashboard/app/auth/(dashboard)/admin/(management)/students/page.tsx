"use client";

import { useState, useCallback } from "react";
import { Plus, GraduationCap, Sparkles, Users } from "lucide-react";

import { StudentsTable } from "@/components/students/students-table";
import { PageHeader } from "@/components/dashboard/page-header";
import { StudentForm } from "@/components/students/student-form";
import { PromotionDialog } from "@/components/students/promotion-dialog";
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
	const [isPromotionModalOpen, setIsPromotionModalOpen] = useState(false);
	const [selectedStudentsForPromotion, setSelectedStudentsForPromotion] =
		useState<{ id: string; name: string; currentGrade: string }[]>([]);
	const { currentSchool } = useDashboard();
	const schoolId = currentSchool?.idStr || currentSchool?.id || null;
	const { students, isLoading, refresh } = useStudents(schoolId);
	const { t } = useLanguage();

	const handleAddSuccess = useCallback(() => {
		setIsAddModalOpen(false);
		refresh();
	}, [refresh]);

	const handleSelectionChange = useCallback((selected: any[]) => {
		setSelectedStudentsForPromotion(
			selected.map((s) => ({
				id: s.id,
				name: s.fullName || `${s.firstNameKm} ${s.lastNameKm}`,
				currentGrade: s.gradeLevel,
			}))
		);
	}, []);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="space-y-4 pb-10"
		>
			{/* Header Section */}
			<PageHeader
				title={t("student_management")}
				subtitle={t("manage_student_records")}
				icon={GraduationCap}
			>
				<div className="flex gap-2">
					<Button
						onClick={() => setIsPromotionModalOpen(true)}
						variant="outline"
						className="rounded-lg px-6 h-12 gap-2"
					>
						<GraduationCap className="w-5 h-5" />
						{t("promote")}
					</Button>
					<Button
						onClick={() => setIsAddModalOpen(true)}
						className="rounded-lg px-6 h-12 bg-primary hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 text-sm gap-2"
					>
						<Plus className="w-5 h-5" />
						{t("add_student")}
					</Button>
				</div>
			</PageHeader>

			{/* Statistics Section */}
			{students.length > 0 && <StudentStats students={students} />}

			{/* StudentsTable handles its own container */}
			<div className="relative">
				<div className="absolute -bottom-40 -right-20 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
				<StudentsTable
					schoolId={schoolId}
					onSelectionChange={handleSelectionChange}
				/>
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

			{/* Promotion Modal */}
			<PromotionDialog
				open={isPromotionModalOpen}
				onOpenChange={setIsPromotionModalOpen}
				selectedStudents={selectedStudentsForPromotion}
				onSuccess={refresh}
			/>
		</motion.div>
	);
}
