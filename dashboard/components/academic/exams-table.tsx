"use client";

import React from "react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
	MoreHorizontal,
	Pencil,
	Trash2,
	Calendar,
	Clock,
	MapPin,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { ExamSchedule, Class, Subject } from "@/types/academic";
import { Badge } from "@/components/ui/badge";

interface ExamsTableProps {
	exams: ExamSchedule[];
	classes: Class[];
	subjects: Subject[];
	isLoading?: boolean;
	onEdit: (exam: ExamSchedule) => void;
	onDelete: (exam: ExamSchedule) => void;
}

export const ExamsTable: React.FC<ExamsTableProps> = ({
	exams,
	classes,
	subjects,
	isLoading = false,
	onEdit,
	onDelete,
}) => {
	const { t } = useTranslation();

	const getClassName = (id: string) =>
		classes.find((c) => c.id === id)?.name || id;
	const getSubjectName = (id: string) =>
		subjects.find((s) => s.id === id)?.subjectName || id;

	if (isLoading) {
		return (
			<div className="p-8 text-center text-muted-foreground">
				{t("loading")}...
			</div>
		);
	}

	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>{t("exam_name") || "Exam"}</TableHead>
						<TableHead>{t("class") || "Class"}</TableHead>
						<TableHead>{t("subject") || "Subject"}</TableHead>
						<TableHead>{t("date_time") || "Date & Time"}</TableHead>
						<TableHead>{t("room") || "Room"}</TableHead>
						<TableHead className="w-[80px]">{t("actions")}</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{exams.length === 0 ? (
						<TableRow>
							<TableCell colSpan={6} className="h-24 text-center">
								{t("no_exams_found") || "No exams found"}
							</TableCell>
						</TableRow>
					) : (
						exams.map((exam) => (
							<TableRow key={exam.id}>
								<TableCell className="font-medium">{exam.name}</TableCell>
								<TableCell>{getClassName(exam.classId)}</TableCell>
								<TableCell>{getSubjectName(exam.subjectId)}</TableCell>
								<TableCell>
									<div className="flex flex-col gap-1">
										<div className="flex items-center gap-1 text-xs">
											<Calendar className="h-3 w-3" />
											{exam.examDate}
										</div>
										<div className="flex items-center gap-1 text-xs text-muted-foreground">
											<Clock className="h-3 w-3" />
											{exam.startTime} - {exam.endTime}
										</div>
									</div>
								</TableCell>
								<TableCell>
									{exam.room ? (
										<div className="flex items-center gap-1 text-xs">
											<MapPin className="h-3 w-3" />
											{exam.room}
										</div>
									) : (
										"-"
									)}
								</TableCell>
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" className="h-8 w-8 p-0">
												<MoreHorizontal className="h-4 w-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem onClick={() => onEdit(exam)}>
												<Pencil className="mr-2 h-4 w-4" />
												{t("edit")}
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => onDelete(exam)}
												className="text-destructive"
											>
												<Trash2 className="mr-2 h-4 w-4" />
												{t("delete")}
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
};
