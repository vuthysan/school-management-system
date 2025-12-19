"use client";

import React from "react";
import { Loader2 } from "lucide-react";

import { useLanguage } from "@/contexts/language-context";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Student } from "@/types/student";

interface DeleteStudentModalProps {
	isOpen: boolean;
	onClose: () => void;
	onConfirm: () => void;
	student: Student | null;
	isDeleting?: boolean;
}

export const DeleteStudentModal: React.FC<DeleteStudentModalProps> = ({
	isOpen,
	onClose,
	onConfirm,
	student,
	isDeleting = false,
}) => {
	const { t } = useLanguage();

	if (!student) return null;

	return (
		<Dialog open={isOpen} onOpenChange={onClose}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle>{t("delete_student")}</DialogTitle>
					<DialogDescription>
						{t("delete_student_confirm", {
							name:
								student.fullName ||
								`${student.firstNameKm} ${student.lastNameKm}`,
						})}
					</DialogDescription>
				</DialogHeader>

				<p className="text-muted-foreground text-sm">
					{t("delete_action_permanent")}
				</p>

				<DialogFooter>
					<Button variant="outline" onClick={onClose}>
						{t("cancel")}
					</Button>
					<Button
						disabled={isDeleting}
						variant="destructive"
						onClick={onConfirm}
						className="bg-destructive text-white hover:bg-destructive/90"
					>
						{isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{t("delete")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};
