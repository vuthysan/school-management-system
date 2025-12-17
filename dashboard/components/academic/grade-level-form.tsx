"use client";

import { useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/language-context";
import { GradeLevel, GradeLevelFormData } from "@/types/academic";

const gradeLevelSchema = z.object({
	name: z.string().min(1, "Name is required"),
	code: z.string().min(1, "Code is required"),
	order: z.preprocess(
		(val) => Number(val),
		z.number().min(0, "Order must be a positive number")
	),
	description: z.string().optional(),
	status: z.enum(["Active", "Inactive", "Archived"]).optional(),
});

interface GradeLevelFormProps {
	initialData?: GradeLevel | null;
	onSuccess?: (data: GradeLevelFormData) => void;
	onCancel?: () => void;
}

export const GradeLevelForm: React.FC<GradeLevelFormProps> = ({
	initialData,
	onSuccess,
	onCancel,
}) => {
	const { t } = useLanguage();

	const {
		control,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<GradeLevelFormData>({
		resolver: zodResolver(gradeLevelSchema) as any,
		defaultValues: {
			name: "",
			code: "",
			order: 0,
			description: "",
			status: "Active",
		},
	});

	useEffect(() => {
		if (initialData) {
			reset({
				name: initialData.name,
				code: initialData.code,
				order: initialData.order,
				description: initialData.description || "",
				status: initialData.status,
			});
		}
	}, [initialData, reset]);

	const onSubmit = async (data: GradeLevelFormData) => {
		if (onSuccess) onSuccess(data);
	};

	return (
		<form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
			<div className="grid grid-cols-1 gap-4">
				<Controller
					control={control}
					name="name"
					render={({ field }) => (
						<div className="space-y-2">
							<Label htmlFor="name">{t("grade_level_name")}</Label>
							<Input
								{...field}
								className={errors.name ? "border-destructive" : ""}
								id="name"
								placeholder="e.g. Grade 1"
							/>
							{errors.name && (
								<p className="text-sm text-destructive">
									{errors.name.message}
								</p>
							)}
						</div>
					)}
				/>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Controller
						control={control}
						name="code"
						render={({ field }) => (
							<div className="space-y-2">
								<Label htmlFor="code">{t("grade_level_code")}</Label>
								<Input
									{...field}
									className={errors.code ? "border-destructive" : ""}
									id="code"
									placeholder="e.g. G1"
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
						name="order"
						render={({ field }) => (
							<div className="space-y-2">
								<Label htmlFor="order">{t("grade_level_order")}</Label>
								<Input
									{...field}
									className={errors.order ? "border-destructive" : ""}
									id="order"
									type="number"
									placeholder="e.g. 1"
								/>
								{errors.order && (
									<p className="text-sm text-destructive">
										{errors.order.message}
									</p>
								)}
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
								className={errors.description ? "border-destructive" : ""}
								id="description"
								placeholder={t("description_placeholder")}
							/>
							{errors.description && (
								<p className="text-sm text-destructive">
									{errors.description.message}
								</p>
							)}
						</div>
					)}
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
									<SelectValue placeholder={t("select_status")} />
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
					{t("cancel")}
				</Button>
				<Button disabled={isSubmitting} type="submit">
					{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					{initialData ? t("save_changes") : t("add_grade_level")}
				</Button>
			</div>
		</form>
	);
};
