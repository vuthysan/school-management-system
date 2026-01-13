"use client";

import { useState } from "react";
import { GraduationCap, Loader2, ArrowUp, AlertCircle } from "lucide-react";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useStudentPromotion } from "@/hooks/usePromotion";
import { useClasses } from "@/hooks/useClasses";
import { useDashboard } from "@/hooks/useDashboard";

interface PromotionDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	selectedStudents: { id: string; name: string; currentGrade: string }[];
	onSuccess: () => void;
}

const GRADE_LEVELS = [
	"Grade 1",
	"Grade 2",
	"Grade 3",
	"Grade 4",
	"Grade 5",
	"Grade 6",
	"Grade 7",
	"Grade 8",
	"Grade 9",
	"Grade 10",
	"Grade 11",
	"Grade 12",
	"Graduated",
];

export function PromotionDialog({
	open,
	onOpenChange,
	selectedStudents,
	onSuccess,
}: PromotionDialogProps) {
	const { currentSchool } = useDashboard();
	const schoolId = currentSchool?.idStr || currentSchool?.id || null;
	const { classes } = useClasses({ schoolId, pageSize: 100 });
	const { promoteStudents } = useStudentPromotion();

	const [newGrade, setNewGrade] = useState("");
	const [newClassId, setNewClassId] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState<{
		success: boolean;
		promotedCount: number;
		failedCount: number;
	} | null>(null);

	const isGraduation = newGrade === "Graduated";

	// Filter classes by the selected grade
	const availableClasses = classes.filter(
		(c) => (c.gradeLevel || "").toLowerCase() === newGrade.toLowerCase()
	);

	const handlePromote = async () => {
		if (!newGrade || selectedStudents.length === 0) return;

		setIsLoading(true);
		setResult(null);

		try {
			const studentIds = selectedStudents.map((s) => s.id);
			const res = await promoteStudents(
				studentIds,
				newGrade,
				isGraduation ? undefined : newClassId || undefined
			);
			setResult(res);

			if (res.success) {
				setTimeout(() => {
					onOpenChange(false);
					onSuccess();
				}, 1500);
			}
		} catch (err) {
			console.error("Promotion failed:", err);
			setResult({
				success: false,
				promotedCount: 0,
				failedCount: selectedStudents.length,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		setNewGrade("");
		setNewClassId("");
		setResult(null);
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<GraduationCap className="h-5 w-5" />
						Promote Students
					</DialogTitle>
					<DialogDescription>
						Promote {selectedStudents.length} selected student
						{selectedStudents.length > 1 ? "s" : ""} to a new grade level.
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					{/* Selected Students Summary */}
					<div className="p-3 bg-muted/50 rounded-lg">
						<p className="text-sm font-medium">
							{selectedStudents.length} student
							{selectedStudents.length > 1 ? "s" : ""} selected
						</p>
						{selectedStudents.length <= 3 && (
							<p className="text-xs text-muted-foreground mt-1">
								{selectedStudents.map((s) => s.name).join(", ")}
							</p>
						)}
					</div>

					{/* New Grade Selection */}
					<div className="space-y-2">
						<Label>Promote to Grade *</Label>
						<Select value={newGrade} onValueChange={setNewGrade}>
							<SelectTrigger>
								<SelectValue placeholder="Select new grade level" />
							</SelectTrigger>
							<SelectContent>
								{GRADE_LEVELS.map((grade) => (
									<SelectItem key={grade} value={grade}>
										{grade}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Class Assignment (not for graduation) */}
					{newGrade && !isGraduation && (
						<div className="space-y-2">
							<Label>Assign to Class (Optional)</Label>
							<Select value={newClassId} onValueChange={setNewClassId}>
								<SelectTrigger>
									<SelectValue placeholder="Select class (optional)" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="">No class assignment</SelectItem>
									{availableClasses.map((cls) => (
										<SelectItem key={cls.id} value={cls.id}>
											{cls.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					)}

					{/* Graduation Warning */}
					{isGraduation && (
						<div className="flex items-start gap-2 p-3 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-lg">
							<AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
							<div className="text-sm">
								<p className="font-medium">Graduation</p>
								<p className="mt-1">
									These students will be marked as graduated and removed from
									their current classes.
								</p>
							</div>
						</div>
					)}

					{/* Result Message */}
					{result && (
						<div
							className={`p-3 rounded-lg ${
								result.success
									? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
									: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
							}`}
						>
							{result.success ? (
								<p>✓ Successfully promoted {result.promotedCount} students!</p>
							) : (
								<p>
									⚠ Promoted {result.promotedCount}, Failed{" "}
									{result.failedCount}
								</p>
							)}
						</div>
					)}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={handleClose}>
						Cancel
					</Button>
					<Button
						onClick={handlePromote}
						disabled={isLoading || !newGrade || selectedStudents.length === 0}
					>
						{isLoading ? (
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
						) : (
							<ArrowUp className="h-4 w-4 mr-2" />
						)}
						{isGraduation ? "Graduate" : "Promote"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
