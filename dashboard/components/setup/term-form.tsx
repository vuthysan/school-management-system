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
import { Term } from "@/hooks/useTerms";
import { AcademicYear } from "@/hooks/useAcademicYears";

const termSchema = z.object({
	name: z.string().min(1, "name_required"),
	termNumber: z.coerce.number().min(1, "term_number_min"),
	termType: z.string(),
	startDate: z.string().min(1, "start_date_required"),
	endDate: z.string().min(1, "end_date_required"),
	isCurrent: z.boolean(),
	description: z.string().optional(),
	academicYearId: z.string().min(1, "academic_year_required"),
});

type TermFormValues = z.infer<typeof termSchema>;

interface TermFormProps {
	initialData?: Term | null;
	academicYears: AcademicYear[];
	onSuccess: (data: TermFormValues) => Promise<void>;
	onCancel: () => void;
}

export function TermForm({
	initialData,
	academicYears,
	onSuccess,
	onCancel,
}: TermFormProps) {
	const { t } = useTranslation();

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<TermFormValues>({
		resolver: zodResolver(termSchema) as any,
		defaultValues: {
			name: initialData?.name || "",
			termNumber: initialData?.termNumber || 1,
			termType: initialData?.termType || "Semester",
			startDate: initialData?.startDateStr?.split("T")[0] || "",
			endDate: initialData?.endDateStr?.split("T")[0] || "",
			isCurrent: !!initialData?.isCurrent,
			description: initialData?.description || "",
			academicYearId:
				initialData?.academicYearIdStr ||
				academicYears.find((y) => y.isCurrent)?.idStr ||
				"",
		},
	});

	const onSubmit = async (values: any) => {
		try {
			await onSuccess(values as TermFormValues);
		} catch (error) {
			console.error("Form submission error:", error);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Controller
					control={control}
					name="academicYearId"
					render={({ field }) => (
						<div className="space-y-2">
							<Label>{t("academic_year")} *</Label>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<SelectTrigger
									className={errors.academicYearId ? "border-destructive" : ""}
								>
									<SelectValue
										placeholder={
											t("select_academic_year") || "Select academic year"
										}
									/>
								</SelectTrigger>
								<SelectContent>
									{academicYears.map((year) => (
										<SelectItem key={year.idStr} value={year.idStr}>
											{year.name} {year.isCurrent ? `(${t("current")})` : ""}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{errors.academicYearId && (
								<p className="text-sm text-destructive">
									{t(errors.academicYearId.message as string)}
								</p>
							)}
						</div>
					)}
				/>
				<Controller
					control={control}
					name="name"
					render={({ field }) => (
						<div className="space-y-2">
							<Label htmlFor="name">{t("term_name")} *</Label>
							<Input
								{...field}
								id="name"
								placeholder={t("term_name_placeholder") || "e.g., Semester 1"}
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
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Controller
					control={control}
					name="termNumber"
					render={({ field }) => (
						<div className="space-y-2">
							<Label htmlFor="termNumber">{t("term_number")} *</Label>
							<Input
								{...field}
								id="termNumber"
								type="number"
								className={errors.termNumber ? "border-destructive" : ""}
							/>
							{errors.termNumber && (
								<p className="text-sm text-destructive">
									{t(errors.termNumber.message as string)}
								</p>
							)}
						</div>
					)}
				/>
				<Controller
					control={control}
					name="termType"
					render={({ field }) => (
						<div className="space-y-2">
							<Label>{t("term_type")}</Label>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<SelectTrigger>
									<SelectValue
										placeholder={t("select_type") || "Select type"}
									/>
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Semester">{t("Semester")}</SelectItem>
									<SelectItem value="Trimester">{t("Trimester")}</SelectItem>
									<SelectItem value="Quarter">{t("Quarter")}</SelectItem>
									<SelectItem value="Custom">{t("Custom")}</SelectItem>
								</SelectContent>
							</Select>
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
									{t(errors.startDate?.message as string)}
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

			<Controller
				control={control}
				name="isCurrent"
				render={({ field }) => (
					<div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
						<div className="space-y-0.5">
							<Label>{t("current_term")}</Label>
							<p className="text-xs text-muted-foreground">
								{t("active_term_desc")}
							</p>
						</div>
						<Switch checked={field.value} onCheckedChange={field.onChange} />
					</div>
				)}
			/>

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
