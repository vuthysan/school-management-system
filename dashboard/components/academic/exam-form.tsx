"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	ExamSchedule,
	ExamScheduleFormData,
	Class,
	Subject,
} from "@/types/academic";
import { Loader2 } from "lucide-react";

const examSchema = z.object({
	name: z.string().min(2, "Name is required"),
	subjectId: z.string().min(1, "Subject is required"),
	classId: z.string().min(1, "Class is required"),
	examDate: z.string().min(1, "Date is required"),
	startTime: z.string().min(1, "Start time is required"),
	endTime: z.string().min(1, "End time is required"),
	room: z.string().optional(),
	examinerId: z.string().optional(),
	maxScore: z.number().min(0),
});

interface ExamFormProps {
	initialData?: ExamSchedule | null;
	classes: Class[];
	subjects: Subject[];
	schoolId: string;
	academicYearId: string;
	onSubmit: (data: ExamScheduleFormData) => Promise<void>;
	onCancel: () => void;
}

export const ExamForm: React.FC<ExamFormProps> = ({
	initialData,
	classes,
	subjects,
	schoolId,
	academicYearId,
	onSubmit,
	onCancel,
}) => {
	const { t } = useTranslation();
	const form = useForm<z.infer<typeof examSchema>>({
		resolver: zodResolver(examSchema),
		defaultValues: initialData
			? {
					name: initialData.name,
					subjectId: initialData.subjectId,
					classId: initialData.classId,
					examDate: initialData.examDate,
					startTime: initialData.startTime,
					endTime: initialData.endTime,
					room: initialData.room || "",
					examinerId: initialData.examinerId || "",
					maxScore: initialData.maxScore,
				}
			: {
					name: "",
					subjectId: "",
					classId: "",
					examDate: new Date().toISOString().split("T")[0],
					startTime: "09:00",
					endTime: "11:00",
					room: "",
					examinerId: "",
					maxScore: 100,
				},
	});

	const { isSubmitting } = form.formState;

	const handleSubmit = async (values: z.infer<typeof examSchema>) => {
		await onSubmit({
			...values,
			schoolId,
			academicYearId,
		} as ExamScheduleFormData);
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className="space-y-4 p-4"
			>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("exam_name") || "Exam Name"}</FormLabel>
								<FormControl>
									<Input placeholder="e.g. Midterm" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="maxScore"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("max_score") || "Max Score"}</FormLabel>
								<FormControl>
									<Input
										type="number"
										{...field}
										onChange={(e) => field.onChange(parseFloat(e.target.value))}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="classId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("class") || "Class"}</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder={t("select_class")} />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{classes.map((cls) => (
											<SelectItem key={cls.id} value={cls.id}>
												{cls.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="subjectId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("subject") || "Subject"}</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder={t("select_subject")} />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{subjects.map((sub) => (
											<SelectItem key={sub.id} value={sub.id}>
												{sub.subjectName}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="examDate"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("exam_date") || "Date"}</FormLabel>
								<FormControl>
									<Input type="date" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="grid grid-cols-2 gap-2">
						<FormField
							control={form.control}
							name="startTime"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("start_time") || "Start"}</FormLabel>
									<FormControl>
										<Input type="time" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="endTime"
							render={({ field }) => (
								<FormItem>
									<FormLabel>{t("end_time") || "End"}</FormLabel>
									<FormControl>
										<Input type="time" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>

					<FormField
						control={form.control}
						name="room"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("room") || "Room"}</FormLabel>
								<FormControl>
									<Input placeholder="e.g. Hall A" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name="examinerId"
						render={({ field }) => (
							<FormItem>
								<FormLabel>{t("examiner") || "Examiner"}</FormLabel>
								<FormControl>
									<Input placeholder="Examiner ID" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<div className="flex justify-end gap-2 pt-4">
					<Button type="button" variant="outline" onClick={onCancel}>
						{t("cancel")}
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						) : null}
						{initialData ? t("update") : t("create")}
					</Button>
				</div>
			</form>
		</Form>
	);
};
