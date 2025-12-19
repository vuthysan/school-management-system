"use client";

import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/language-context";
import { Class, ClassFormData } from "@/types/academic";
import { useGradeLevels } from "@/hooks/useGradeLevels";
import { useDashboard } from "@/hooks/useDashboard";

const classSchema = z.object({
	name: z.string().min(1, "Class name is required"),
	code: z.string().min(1, "Class code is required"),
	gradeLevel: z.string().min(1, "Grade level is required"),
	section: z.string().min(1, "Section is required"),
	homeroomTeacherId: z.string().min(1, "Teacher name is required"),
	roomNumber: z.string().min(1, "Room is required"),
	capacity: z.preprocess(
		(val) => Number(val),
		z.number().min(1, "Capacity must be at least 1")
	),
	status: z.enum(["Active", "Inactive", "Archived"]),
	academicYearId: z.string().min(1, "Academic year is required"),
});

interface ClassFormProps {
	initialData?: Class | null;
	onSuccess?: (data: ClassFormData) => void;
	onCancel?: () => void;
}

export const ClassForm: React.FC<ClassFormProps> = ({
	initialData,
	onSuccess,
	onCancel,
}) => {
	const { t } = useLanguage();
	const { currentSchool } = useDashboard();

	// Memoize options to prevent infinite re-renders
	const gradeLevelOptions = useMemo(
		() => ({
			schoolId: currentSchool?.idStr || null,
		}),
		[currentSchool?.idStr]
	);

	const { gradeLevels, isLoading: isLoadingGradeLevels } =
		useGradeLevels(gradeLevelOptions);

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<ClassFormData>({
		resolver: zodResolver(classSchema) as any,
		defaultValues: {
			name: "",
			code: "",
			gradeLevel: "",
			section: "",
			homeroomTeacherId: "",
			roomNumber: "",
			capacity: 30,
			status: "Active",
			academicYearId: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
		},
	});

	useEffect(() => {
		if (initialData) {
			console.log(
				"ClassForm edit - initialData.gradeLevel:",
				initialData.gradeLevel
			);
			console.log(
				"ClassForm edit - gradeLevels:",
				gradeLevels.map((l) => ({ id: l.id, name: l.name, code: l.code }))
			);

			// Convert legacy academicYearId values to proper format
			let academicYear = initialData.academicYearId;
			const currentYear = new Date().getFullYear();
			if (
				!academicYear ||
				academicYear === "default" ||
				!academicYear.includes("-")
			) {
				academicYear = `${currentYear}-${currentYear + 1}`;
			}

			reset({
				name: initialData.name,
				code: initialData.code,
				gradeLevel: initialData.gradeLevel,
				section: initialData.section,
				homeroomTeacherId: initialData.homeroomTeacherId,
				roomNumber: initialData.roomNumber,
				capacity: initialData.capacity,
				status: initialData.status,
				academicYearId: academicYear,
			});
		}
	}, [initialData, reset, gradeLevels]);

	const onSubmit = async (data: ClassFormData) => {
		// Simulate API call
		await new Promise((resolve) => setTimeout(resolve, 1000));
		if (onSuccess) onSuccess(data);
	};

	return (
		<form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Controller
					control={control}
					name="name"
					render={({ field }) => (
						<div className="space-y-2">
							<Label htmlFor="name">
								{t("class_name")} <span className="text-destructive">*</span>
							</Label>
							<Input
								{...field}
								className={errors.name ? "border-destructive" : ""}
								id="name"
								placeholder="e.g. Grade 10-A"
							/>
							{errors.name && (
								<p className="text-sm text-destructive">
									{errors.name.message}
								</p>
							)}
						</div>
					)}
				/>
				<Controller
					control={control}
					name="code"
					render={({ field }) => (
						<div className="space-y-2">
							<Label htmlFor="code">
								{t("class_code")} <span className="text-destructive">*</span>
							</Label>
							<Input
								{...field}
								className={errors.code ? "border-destructive" : ""}
								id="code"
								placeholder="e.g. G10A-2024"
							/>
							{errors.code && (
								<p className="text-sm text-destructive">
									{errors.code.message}
								</p>
							)}
						</div>
					)}
				/>
				<Controller
					control={control}
					name="gradeLevel"
					render={({ field }) => (
						<div className="space-y-2">
							<Label>
								{t("grade_level")} <span className="text-destructive">*</span>
							</Label>
							<Select value={field.value || ""} onValueChange={field.onChange}>
								<SelectTrigger
									className={errors.gradeLevel ? "border-destructive" : ""}
								>
									<SelectValue placeholder={t("select_grade")} />
								</SelectTrigger>
								<SelectContent>
									{isLoadingGradeLevels ? (
										<SelectItem disabled value="loading">
											{t("loading")}
										</SelectItem>
									) : gradeLevels.length > 0 ? (
										gradeLevels.map((level) => (
											<SelectItem key={level.id} value={level.code}>
												{level.name}
											</SelectItem>
										))
									) : (
										<SelectItem disabled value="no_data">
											{t("no_grade_levels")}
										</SelectItem>
									)}
								</SelectContent>
							</Select>
							{errors.gradeLevel && (
								<p className="text-sm text-destructive">
									{errors.gradeLevel.message}
								</p>
							)}
						</div>
					)}
				/>
				<Controller
					control={control}
					name="section"
					render={({ field }) => (
						<div className="space-y-2">
							<Label htmlFor="section">
								{t("section")} <span className="text-destructive">*</span>
							</Label>
							<Input
								{...field}
								className={errors.section ? "border-destructive" : ""}
								id="section"
								placeholder="e.g. A, B, C"
							/>
							{errors.section && (
								<p className="text-sm text-destructive">
									{errors.section.message}
								</p>
							)}
						</div>
					)}
				/>
				<Controller
					control={control}
					name="homeroomTeacherId"
					render={({ field }) => (
						<div className="space-y-2">
							<Label htmlFor="homeroomTeacherId">
								{t("teacher")} <span className="text-destructive">*</span>
							</Label>
							<Input
								{...field}
								className={errors.homeroomTeacherId ? "border-destructive" : ""}
								id="homeroomTeacherId"
								placeholder="Teacher Name"
								value={field.value || ""}
								onChange={field.onChange}
							/>
							{errors.homeroomTeacherId && (
								<p className="text-sm text-destructive">
									{errors.homeroomTeacherId.message}
								</p>
							)}
						</div>
					)}
				/>
				<Controller
					control={control}
					name="roomNumber"
					render={({ field }) => (
						<div className="space-y-2">
							<Label htmlFor="roomNumber">
								{t("room")} <span className="text-destructive">*</span>
							</Label>
							<Input
								{...field}
								className={errors.roomNumber ? "border-destructive" : ""}
								id="roomNumber"
								placeholder="e.g. 101"
								value={field.value || ""}
								onChange={field.onChange}
							/>
							{errors.roomNumber && (
								<p className="text-sm text-destructive">
									{errors.roomNumber.message}
								</p>
							)}
						</div>
					)}
				/>
				<Controller
					control={control}
					name="capacity"
					render={({ field }) => (
						<div className="space-y-2">
							<Label htmlFor="capacity">
								{t("capacity")} <span className="text-destructive">*</span>
							</Label>
							<Input
								{...field}
								className={errors.capacity ? "border-destructive" : ""}
								id="capacity"
								placeholder="30"
								type="number"
							/>
							{errors.capacity && (
								<p className="text-sm text-destructive">
									{errors.capacity.message}
								</p>
							)}
						</div>
					)}
				/>
				<Controller
					control={control}
					name="academicYearId"
					render={({ field }) => {
						// Generate academic year options (current year -2 to +2)
						const currentYear = new Date().getFullYear();
						const yearOptions = [];
						for (let i = currentYear - 2; i <= currentYear + 2; i++) {
							yearOptions.push(`${i}-${i + 1}`);
						}
						return (
							<div className="space-y-2">
								<Label>
									{t("academic_year")}{" "}
									<span className="text-destructive">*</span>
								</Label>
								<Select
									value={field.value || ""}
									onValueChange={field.onChange}
								>
									<SelectTrigger
										className={
											errors.academicYearId ? "border-destructive" : ""
										}
									>
										<SelectValue placeholder={t("select_academic_year")} />
									</SelectTrigger>
									<SelectContent>
										{yearOptions.map((year) => (
											<SelectItem key={year} value={year}>
												{year}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								{errors.academicYearId && (
									<p className="text-sm text-destructive">
										{errors.academicYearId.message}
									</p>
								)}
							</div>
						);
					}}
				/>
				<Controller
					control={control}
					name="status"
					render={({ field }) => (
						<div className="space-y-2">
							<Label>{t("status")}</Label>
							<Select value={field.value} onValueChange={field.onChange}>
								<SelectTrigger
									className={errors.status ? "border-destructive" : ""}
								>
									<SelectValue placeholder="Select status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="Active">{t("active")}</SelectItem>
									<SelectItem value="Inactive">{t("inactive")}</SelectItem>
									<SelectItem value="Archived">{t("archived")}</SelectItem>
								</SelectContent>
							</Select>
							{errors.status && (
								<p className="text-sm text-destructive">
									{errors.status.message}
								</p>
							)}
						</div>
					)}
				/>
			</div>

			<div className="flex justify-end gap-2 mt-4">
				<Button type="button" variant="outline" onClick={onCancel}>
					Cancel
				</Button>
				<Button disabled={isSubmitting} type="submit">
					{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					{initialData ? t("save_changes") : "Create Class"}
				</Button>
			</div>
		</form>
	);
};
