"use client";

import React, { useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/language-context";
import {
	Student,
	StudentFormData,
	CreateStudentInput,
	UpdateStudentInput,
	DateOfBirth,
} from "@/types/student";
import { useStudents } from "@/hooks/useStudents";
import { useGradeLevels } from "@/hooks/useGradeLevels";
import { useClasses } from "@/hooks/useClasses";

interface StudentFormProps {
	schoolId: string | null;
	student?: Student | null;
	mode?: "create" | "edit";
	onSuccess?: (student: Student) => void;
}

export const StudentForm: React.FC<StudentFormProps> = ({
	schoolId,
	student = null,
	mode = "create",
	onSuccess,
}) => {
	const { t } = useLanguage();
	const { createStudent, updateStudent } = useStudents(schoolId);
	const { gradeLevels } = useGradeLevels({ schoolId });
	const { classes } = useClasses({ schoolId, page: 1, pageSize: 100 });

	// Helper to parse date string to DateOfBirth object
	const parseDOB = (dateStr: string): DateOfBirth => {
		const date = new Date(dateStr);
		return {
			day: date.getDate(),
			month: date.getMonth() + 1,
			year: date.getFullYear(),
		};
	};

	// Helper to format DateOfBirth object to string for input
	const formatDOB = (dob?: DateOfBirth): string => {
		if (!dob) return "";
		const month = dob.month.toString().padStart(2, "0");
		const day = dob.day.toString().padStart(2, "0");
		return `${dob.year}-${month}-${day}`;
	};

	// Define the validation schema with translated messages
	const guardianSchema = z.object({
		name: z.string().min(1, t("required_field")),
		phone: z.string().min(1, t("required_field")),
		relationship: z.string().optional(),
	});

	const studentSchema = z.object({
		studentId: z.string().optional(),
		nationalId: z.string().optional(),
		firstNameKm: z.string().min(1, t("required_field")),
		lastNameKm: z.string().min(1, t("required_field")),
		firstNameEn: z.string().optional(),
		lastNameEn: z.string().optional(),
		email: z.string().email(t("invalid_email")).or(z.literal("")).optional(),
		dob: z.string().min(1, t("required_field")),
		gender: z.enum(["male", "female", "other"], {
			message: t("select_option"),
		}),
		nationality: z.string().optional(),
		religion: z.string().optional(),
		phone: z.string().optional(),
		address: z.string().min(1, t("required_field")),
		gradeLevel: z.string().min(1, t("required_field")),
		currentClassId: z.string().optional(),
		guardians: z.array(guardianSchema).min(1, t("required_field")),
	});

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
	} = useForm<StudentFormData>({
		resolver: zodResolver(studentSchema),
		defaultValues: {
			studentId: student?.studentId || "",
			nationalId: student?.nationalId || "",
			firstNameKm: student?.firstNameKm || "",
			lastNameKm: student?.lastNameKm || "",
			firstNameEn: student?.firstNameEn || "",
			lastNameEn: student?.lastNameEn || "",
			email: student?.contact?.email || "",
			dob: formatDOB(student?.dateOfBirth),
			gender: (student?.gender.toLowerCase() as any) || "male",
			nationality: student?.nationality || "Cambodian",
			religion: student?.religion || "",
			phone: student?.contact?.phone || "",
			address: student?.contact?.address?.province || "",
			gradeLevel: student?.gradeLevel || "",
			currentClassId: (student as any)?.currentClassId || "",
			guardians: student?.guardians?.map((g) => ({
				name: g.name,
				phone: g.phone,
				relationship: g.relationship || "",
			})) || [{ name: "", phone: "", relationship: "" }],
		},
	});

	// Setup useFieldArray for guardians
	const { fields, append, remove } = useFieldArray({
		control,
		name: "guardians",
	});

	// Update form when student prop changes
	useEffect(() => {
		if (student) {
			reset({
				studentId: student.studentId,
				nationalId: student.nationalId || "",
				firstNameKm: student.firstNameKm,
				lastNameKm: student.lastNameKm,
				firstNameEn: student.firstNameEn || "",
				lastNameEn: student.lastNameEn || "",
				email: student.contact?.email || "",
				dob: formatDOB(student.dateOfBirth),
				gender: (student.gender.toLowerCase() as any) || "male",
				nationality: student.nationality || "Cambodian",
				religion: student.religion || "",
				phone: student.contact?.phone || "",
				address: student.contact?.address?.province || "",
				gradeLevel: student.gradeLevel,
				currentClassId: (student as any)?.currentClassId || "",
				guardians: student.guardians?.map((g) => ({
					name: g.name,
					phone: g.phone,
					relationship: g.relationship || "",
				})) || [{ name: "", phone: "", relationship: "" }],
			});
		}
	}, [student, reset]);

	const onSubmit = async (data: StudentFormData) => {
		try {
			if (mode === "create") {
				if (!schoolId) throw new Error("School ID is required");

				const input: CreateStudentInput = {
					schoolId,
					studentId: data.studentId?.trim() || undefined,
					nationalId: data.nationalId?.trim() || undefined,
					firstNameKm: data.firstNameKm,
					lastNameKm: data.lastNameKm,
					firstNameEn: data.firstNameEn || undefined,
					lastNameEn: data.lastNameEn || undefined,
					dateOfBirth: parseDOB(data.dob),
					gender: data.gender.toUpperCase() as any,
					nationality: data.nationality || undefined,
					religion: data.religion || undefined,
					gradeLevel: data.gradeLevel,
					currentClassId: data.currentClassId || undefined,
					contact: {
						email: data.email || undefined,
						phone: data.phone || undefined,
						address: {
							province: data.address,
						},
					},
					guardians: data.guardians.map((g, index) => ({
						name: g.name,
						relationship: g.relationship || "GUARDIAN",
						phone: g.phone,
						isEmergencyContact: index === 0,
						canPickup: true,
					})),
				};

				const result = await createStudent(input);
				if (onSuccess) onSuccess(result);
				toast.success(t("student_registered"));
				reset();
			} else if (mode === "edit" && student) {
				const input: UpdateStudentInput = {
					firstNameKm: data.firstNameKm,
					lastNameKm: data.lastNameKm,
					firstNameEn: data.firstNameEn || undefined,
					lastNameEn: data.lastNameEn || undefined,
					nationalId: data.nationalId || undefined,
					dateOfBirth: parseDOB(data.dob),
					gender: data.gender.toUpperCase() as any,
					nationality: data.nationality || undefined,
					religion: data.religion || undefined,
					gradeLevel: data.gradeLevel,
					currentClassId: data.currentClassId || undefined,
					contact: {
						email: data.email || undefined,
						phone: data.phone || undefined,
						address: {
							province: data.address,
						},
					},
					guardians: data.guardians.map((g, index) => ({
						name: g.name,
						relationship: g.relationship || "GUARDIAN",
						phone: g.phone,
						isEmergencyContact: index === 0,
						canPickup: true,
					})),
				};
				// Status and others could be added here if needed

				const result = await updateStudent(student.id, input);
				if (onSuccess) onSuccess(result);
				toast.success(t("student_updated"));
			}
		} catch (err) {
			console.error("Form submission error:", err);
			toast.error(err instanceof Error ? err.message : "Submission failed");
		}
	};

	return (
		<div className="w-full">
			<form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
				{/* Personal Information */}
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<div className="w-1 h-6 bg-primary rounded-full" />
						<h3 className="text-lg font-semibold">{t("personal_info")}</h3>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Controller
							control={control}
							name="studentId"
							render={({ field }) => (
								<div className="space-y-2">
									<Label htmlFor="studentId">{t("student_id")}</Label>
									<Input
										{...field}
										id="studentId"
										placeholder={t("auto_generate_id")}
									/>
									<p className="text-xs text-muted-foreground">
										{t("leave_blank_to_autogenerate")}
									</p>
								</div>
							)}
						/>
						<Controller
							control={control}
							name="nationalId"
							render={({ field }) => (
								<div className="space-y-2">
									<Label htmlFor="nationalId">{t("national_id")}</Label>
									<Input
										{...field}
										id="nationalId"
										placeholder={t("enter_national_id")}
									/>
								</div>
							)}
						/>
						<Controller
							control={control}
							name="firstNameKm"
							render={({ field }) => (
								<div className="space-y-2">
									<Label htmlFor="firstNameKm">
										{t("first_name_km")}{" "}
										<span className="text-destructive">*</span>
									</Label>
									<Input
										{...field}
										className={errors.firstNameKm ? "border-destructive" : ""}
										id="firstNameKm"
										placeholder={t("enter_first_name")}
									/>
									{errors.firstNameKm && (
										<p className="text-sm text-destructive">
											{errors.firstNameKm.message}
										</p>
									)}
								</div>
							)}
						/>
						<Controller
							control={control}
							name="lastNameKm"
							render={({ field }) => (
								<div className="space-y-2">
									<Label htmlFor="lastNameKm">
										{t("last_name_km")}{" "}
										<span className="text-destructive">*</span>
									</Label>
									<Input
										{...field}
										className={errors.lastNameKm ? "border-destructive" : ""}
										id="lastNameKm"
										placeholder={t("enter_last_name")}
									/>
									{errors.lastNameKm && (
										<p className="text-sm text-destructive">
											{errors.lastNameKm.message}
										</p>
									)}
								</div>
							)}
						/>
						<Controller
							control={control}
							name="firstNameEn"
							render={({ field }) => (
								<div className="space-y-2">
									<Label htmlFor="firstNameEn">{t("first_name")}</Label>
									<Input
										{...field}
										id="firstNameEn"
										placeholder={t("enter_first_name")}
									/>
								</div>
							)}
						/>
						<Controller
							control={control}
							name="lastNameEn"
							render={({ field }) => (
								<div className="space-y-2">
									<Label htmlFor="lastNameEn">{t("last_name")}</Label>
									<Input
										{...field}
										id="lastNameEn"
										placeholder={t("enter_last_name")}
									/>
								</div>
							)}
						/>
						<Controller
							control={control}
							name="email"
							render={({ field }) => (
								<div className="space-y-2">
									<Label htmlFor="email">{t("email")}</Label>
									<Input
										{...field}
										className={errors.email ? "border-destructive" : ""}
										id="email"
										placeholder={t("enter_email")}
										type="email"
									/>
									{errors.email && (
										<p className="text-sm text-destructive">
											{errors.email.message}
										</p>
									)}
								</div>
							)}
						/>
						<Controller
							control={control}
							name="dob"
							render={({ field }) => (
								<div className="space-y-2">
									<Label htmlFor="dob">
										{t("dob")} <span className="text-destructive">*</span>
									</Label>
									<Input
										{...field}
										className={errors.dob ? "border-destructive" : ""}
										id="dob"
										type="date"
									/>
									{errors.dob && (
										<p className="text-sm text-destructive">
											{errors.dob.message}
										</p>
									)}
								</div>
							)}
						/>
						<Controller
							control={control}
							name="gender"
							render={({ field }) => (
								<div className="space-y-2">
									<Label>
										{t("gender")} <span className="text-destructive">*</span>
									</Label>
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger
											className={errors.gender ? "border-destructive" : ""}
										>
											<SelectValue placeholder={t("select_gender")} />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="male">{t("male")}</SelectItem>
											<SelectItem value="female">{t("female")}</SelectItem>
											<SelectItem value="other">{t("other")}</SelectItem>
										</SelectContent>
									</Select>
									{errors.gender && (
										<p className="text-sm text-destructive">
											{errors.gender.message}
										</p>
									)}
								</div>
							)}
						/>
						<Controller
							control={control}
							name="phone"
							render={({ field }) => (
								<div className="space-y-2">
									<Label htmlFor="phone">{t("phone")}</Label>
									<Input
										{...field}
										className={errors.phone ? "border-destructive" : ""}
										id="phone"
										placeholder={t("enter_phone")}
									/>
									{errors.phone && (
										<p className="text-sm text-destructive">
											{errors.phone.message}
										</p>
									)}
								</div>
							)}
						/>
						<Controller
							control={control}
							name="nationality"
							render={({ field }) => (
								<div className="space-y-2">
									<Label htmlFor="nationality">{t("nationality")}</Label>
									<Input
										{...field}
										id="nationality"
										placeholder={t("enter_nationality")}
									/>
								</div>
							)}
						/>
						<Controller
							control={control}
							name="religion"
							render={({ field }) => (
								<div className="space-y-2">
									<Label htmlFor="religion">{t("religion")}</Label>
									<Input
										{...field}
										id="religion"
										placeholder={t("enter_religion")}
									/>
								</div>
							)}
						/>
					</div>
				</div>

				<Separator />

				{/* Academic & Address */}
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<div className="w-1 h-6 bg-secondary rounded-full" />
						<h3 className="text-lg font-semibold">{t("academic_contact")}</h3>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<Controller
							control={control}
							name="gradeLevel"
							render={({ field }) => (
								<div className="space-y-2">
									<Label>
										{t("grade_level")}{" "}
										<span className="text-destructive">*</span>
									</Label>
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger
											className={errors.gradeLevel ? "border-destructive" : ""}
										>
											<SelectValue placeholder={t("select_grade")} />
										</SelectTrigger>
										<SelectContent>
											{gradeLevels.map((grade) => (
												<SelectItem key={grade.id} value={grade.name}>
													{grade.name}
												</SelectItem>
											))}
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
							name="currentClassId"
							render={({ field }) => (
								<div className="space-y-2">
									<Label>{t("class")}</Label>
									<Select
										value={field.value || ""}
										onValueChange={field.onChange}
									>
										<SelectTrigger>
											<SelectValue placeholder={t("select_class")} />
										</SelectTrigger>
										<SelectContent>
											{classes.map((cls) => (
												<SelectItem key={cls.id} value={cls.id}>
													{cls.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<p className="text-xs text-muted-foreground">
										{t("optional")}
									</p>
								</div>
							)}
						/>
						<Controller
							control={control}
							name="address"
							render={({ field }) => (
								<div className="space-y-2">
									<Label htmlFor="address">
										{t("address")} <span className="text-destructive">*</span>
									</Label>
									<Input
										{...field}
										className={errors.address ? "border-destructive" : ""}
										id="address"
										placeholder={t("enter_address")}
									/>
									{errors.address && (
										<p className="text-sm text-destructive">
											{errors.address.message}
										</p>
									)}
								</div>
							)}
						/>
					</div>
				</div>

				<Separator />

				{/* Guardian Information */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<div className="w-1 h-6 bg-green-500 rounded-full" />
							<h3 className="text-lg font-semibold">{t("guardian_info")}</h3>
						</div>
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => append({ name: "", phone: "", relationship: "" })}
						>
							<Plus className="h-4 w-4 mr-1" />
							{t("add_guardian")}
						</Button>
					</div>

					{fields.map((field, index) => (
						<div
							key={field.id}
							className="p-4 border rounded-lg space-y-4 relative"
						>
							{fields.length > 1 && (
								<Button
									type="button"
									variant="ghost"
									size="icon"
									className="absolute top-2 right-2 h-8 w-8 text-destructive hover:text-destructive"
									onClick={() => remove(index)}
								>
									<Trash2 className="h-4 w-4" />
								</Button>
							)}

							<div className="flex items-center gap-2 mb-2">
								<span className="text-sm font-medium text-muted-foreground">
									{t("guardian")} {index + 1}
									{index === 0 && (
										<span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
											{t("emergency_contact")}
										</span>
									)}
								</span>
							</div>

							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								<Controller
									control={control}
									name={`guardians.${index}.name`}
									render={({ field }) => (
										<div className="space-y-2">
											<Label htmlFor={`guardian-name-${index}`}>
												{t("guardian_name")}{" "}
												<span className="text-destructive">*</span>
											</Label>
											<Input
												{...field}
												className={
													errors.guardians?.[index]?.name
														? "border-destructive"
														: ""
												}
												id={`guardian-name-${index}`}
												placeholder={t("enter_guardian_name")}
											/>
											{errors.guardians?.[index]?.name && (
												<p className="text-sm text-destructive">
													{errors.guardians[index]?.name?.message}
												</p>
											)}
										</div>
									)}
								/>
								<Controller
									control={control}
									name={`guardians.${index}.phone`}
									render={({ field }) => (
										<div className="space-y-2">
											<Label htmlFor={`guardian-phone-${index}`}>
												{t("guardian_phone")}{" "}
												<span className="text-destructive">*</span>
											</Label>
											<Input
												{...field}
												className={
													errors.guardians?.[index]?.phone
														? "border-destructive"
														: ""
												}
												id={`guardian-phone-${index}`}
												placeholder={t("enter_guardian_phone")}
											/>
											{errors.guardians?.[index]?.phone && (
												<p className="text-sm text-destructive">
													{errors.guardians[index]?.phone?.message}
												</p>
											)}
										</div>
									)}
								/>
								<Controller
									control={control}
									name={`guardians.${index}.relationship`}
									render={({ field }) => (
										<div className="space-y-2">
											<Label htmlFor={`guardian-relationship-${index}`}>
												{t("relationship")}
											</Label>
											<Select
												value={field.value}
												onValueChange={field.onChange}
											>
												<SelectTrigger>
													<SelectValue placeholder={t("select_relationship")} />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="FATHER">{t("father")}</SelectItem>
													<SelectItem value="MOTHER">{t("mother")}</SelectItem>
													<SelectItem value="GUARDIAN">
														{t("guardian")}
													</SelectItem>
													<SelectItem value="GRANDPARENT">
														{t("grandparent")}
													</SelectItem>
													<SelectItem value="SIBLING">
														{t("sibling")}
													</SelectItem>
													<SelectItem value="OTHER">{t("other")}</SelectItem>
												</SelectContent>
											</Select>
										</div>
									)}
								/>
							</div>
						</div>
					))}

					{errors.guardians && !Array.isArray(errors.guardians) && (
						<p className="text-sm text-destructive">
							{errors.guardians.message}
						</p>
					)}
				</div>

				<Separator />

				{/* Action Buttons */}
				<div className="flex justify-end gap-3 mt-4">
					<Button
						size="lg"
						type="button"
						variant="outline"
						onClick={() => reset()}
					>
						{t("reset")}
					</Button>
					<Button disabled={isSubmitting} size="lg" type="submit">
						{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
						{mode === "edit" ? t("save_changes") : t("register_student")}
					</Button>
				</div>
			</form>
		</div>
	);
};
