"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { AcademicYear } from "@/hooks/useAcademicYears";

const academicYearSchema = z.object({
	name: z.string().min(1, "name_required"),
	label: z.string().optional(),
	startDate: z.string().min(1, "start_date_required"),
	endDate: z.string().min(1, "end_date_required"),
	isCurrent: z.boolean(),
	status: z.string(),
	description: z.string().optional(),
});

type AcademicYearFormValues = z.infer<typeof academicYearSchema>;

interface AcademicYearFormProps {
	initialData?: AcademicYear | null;
	onSuccess: (data: AcademicYearFormValues) => Promise<void>;
	onCancel: () => void;
}

export function AcademicYearForm({
	initialData,
	onSuccess,
	onCancel,
}: AcademicYearFormProps) {
	const { t } = useTranslation();

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<AcademicYearFormValues>({
		resolver: zodResolver(academicYearSchema) as any,
		defaultValues: {
			name: initialData?.name || "",
			label: initialData?.label || "",
			startDate: initialData?.startDateStr?.split("T")[0] || "",
			endDate: initialData?.endDateStr?.split("T")[0] || "",
			isCurrent: !!initialData?.isCurrent,
			status: initialData?.status || "Planning",
			description: initialData?.description || "",
		},
	});

	const onSubmit = async (values: any) => {
		try {
			await onSuccess(values as AcademicYearFormValues);
		} catch (error) {
			console.error("Form submission error:", error);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Controller
					control={control}
					name="name"
					render={({ field }) => (
						<div className="space-y-2">
							<Label htmlFor="name">{t("academic_year_name")} *</Label>
							<Input
								{...field}
								id="name"
								placeholder={
									t("academic_year_placeholder") || "e.g., 2024-2025"
								}
								className={errors.name ? "border-destructive" : ""}
							/>
							{errors.name && (
								<p className="text-sm text-destructive">
									{t(errors.name.message as string)}
								</p>
							)}
						</div>
					)}
				/>
				<Controller
					control={control}
					name="label"
					render={({ field }) => (
						<div className="space-y-2">
							<Label htmlFor="label">{t("label")}</Label>
							<Input
								{...field}
								id="label"
								placeholder={t("label_placeholder") || "e.g., Year 2024"}
							/>
						</div>
					)}
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Controller
					control={control}
					name="startDate"
					render={({ field }) => (
						<div className="space-y-2">
							<Label htmlFor="startDate">{t("start_date")} *</Label>
							<Input
								{...field}
								id="startDate"
								type="date"
								className={errors.startDate ? "border-destructive" : ""}
							/>
							{errors.startDate && (
								<p className="text-sm text-destructive">
									{t(errors.startDate.message as string)}
								</p>
							)}
						</div>
					)}
				/>
				<Controller
					control={control}
					name="endDate"
					render={({ field }) => (
						<div className="space-y-2">
							<Label htmlFor="endDate">{t("end_date")} *</Label>
							<Input
								{...field}
								id="endDate"
								type="date"
								className={errors.endDate ? "border-destructive" : ""}
							/>
							{errors.endDate && (
								<p className="text-sm text-destructive">
									{t(errors.endDate.message as string)}
								</p>
							)}
						</div>
					)}
				/>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Controller
					control={control}
					name="status"
					render={({ field }) => (
						<div className="space-y-2">
							<Label>{t("status")}</Label>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<SelectTrigger>
									<SelectValue
										placeholder={t("select_status") || "Select status"}
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Planning">{t("Planning")}</SelectItem>
									<SelectItem value="Active">{t("Active")}</SelectItem>
									<SelectItem value="Completed">{t("Completed")}</SelectItem>
									<SelectItem value="Archived">{t("Archived")}</SelectItem>
								</SelectContent>
							</Select>
						</div>
					)}
				/>
				<Controller
					control={control}
					name="isCurrent"
					render={({ field }) => (
						<div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
							<div className="space-y-0.5">
								<Label>{t("current_academic_year")}</Label>
								<p className="text-xs text-muted-foreground">
									{t("active_academic_year_desc")}
								</p>
							</div>
							<Switch checked={field.value} onCheckedChange={field.onChange} />
						</div>
					)}
				/>
			</div>

			<Controller
				control={control}
				name="description"
				render={({ field }) => (
					<div className="space-y-2">
						<Label htmlFor="description">{t("description")}</Label>
						<Textarea
							{...field}
							id="description"
							placeholder={t("enter_description_placeholder")}
							className="resize-none"
						/>
					</div>
				)}
			/>

			<div className="flex justify-end gap-4 h-12">
				<Button
					type="button"
					variant="outline"
					onClick={onCancel}
					disabled={isSubmitting}
					className="w-32"
				>
					{t("cancel")}
				</Button>
				<Button type="submit" disabled={isSubmitting} className="w-32 gap-2">
					{isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
					{initialData ? t("update") : t("create")}
				</Button>
			</div>
		</form>
	);
}
