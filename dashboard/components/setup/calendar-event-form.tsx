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
import {
	CalendarEvent,
	CalendarEventType,
	RecurrencePattern,
} from "@/hooks/useCalendarEvents";

const calendarEventSchema = z.object({
	title: z.string().min(1, "title_required"),
	description: z.string().optional(),
	eventType: z.string().default("Event"),
	startDate: z.string().min(1, "start_date_required"),
	endDate: z.string().min(1, "end_date_required"),
	isAllDay: z.boolean().default(false),
	isRecurring: z.boolean().default(false),
	recurrencePattern: z.string().default("None"),
	color: z.string().optional(),
	location: z.string().optional(),
	isSchoolClosed: z.boolean().default(false),
});

type CalendarEventFormValues = z.infer<typeof calendarEventSchema>;

interface CalendarEventFormProps {
	initialData?: CalendarEvent | null;
	onSuccess: (data: CalendarEventFormValues) => Promise<void>;
	onCancel: () => void;
}

export function CalendarEventForm({
	initialData,
	onSuccess,
	onCancel,
}: CalendarEventFormProps) {
	const { t } = useTranslation();

	const {
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<CalendarEventFormValues>({
		resolver: zodResolver(calendarEventSchema) as any,
		defaultValues: {
			title: initialData?.title || "",
			description: initialData?.description || "",
			eventType: initialData?.eventType || "Event",
			startDate: initialData?.startDateStr
				? new Date(initialData.startDateStr).toISOString().slice(0, 16)
				: "",
			endDate: initialData?.endDateStr
				? new Date(initialData.endDateStr).toISOString().slice(0, 16)
				: "",
			isAllDay: !!initialData?.isAllDay,
			isRecurring: !!initialData?.isRecurring,
			recurrencePattern: initialData?.recurrencePattern || "None",
			color: initialData?.color || "#3b82f6",
			location: initialData?.location || "",
			isSchoolClosed: !!initialData?.isSchoolClosed,
		},
	});

	const onSubmit = async (values: any) => {
		try {
			await onSuccess(values as CalendarEventFormValues);
		} catch (error) {
			console.error("Form submission error:", error);
		}
	};

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			<div className="space-y-4">
				<Controller
					control={control}
					name="title"
					render={({ field }) => (
						<div className="space-y-2">
							<Label htmlFor="title">{t("event_title")} *</Label>
							<Input
								{...field}
								id="title"
								placeholder={
									t("event_placeholder") || "e.g., Annual Sports Day"
								}
								className={errors.title ? "border-destructive" : ""}
							/>
							{errors.title && (
								<p className="text-sm text-destructive">
									{t(errors.title.message as string)}
								</p>
							)}
						</div>
					)}
				/>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<Controller
						control={control}
						name="eventType"
						render={({ field }) => (
							<div className="space-y-2">
								<Label>{t("event_type")}</Label>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<SelectTrigger>
										<SelectValue
											placeholder={t("select_type") || "Select type"}
										/>
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="Event">{t("Event")}</SelectItem>
										<SelectItem value="Holiday">{t("Holiday")}</SelectItem>
										<SelectItem value="Break">{t("Break")}</SelectItem>
										<SelectItem value="Exam">{t("Exam")}</SelectItem>
										<SelectItem value="Meeting">{t("Meeting")}</SelectItem>
										<SelectItem value="Deadline">{t("Deadline")}</SelectItem>
										<SelectItem value="Other">{t("Other")}</SelectItem>
									</SelectContent>
								</Select>
							</div>
						)}
					/>
					<Controller
						control={control}
						name="color"
						render={({ field }) => (
							<div className="space-y-2">
								<Label htmlFor="color">{t("display_color")}</Label>
								<div className="flex gap-2">
									<Input
										{...field}
										id="color"
										type="color"
										className="w-12 h-10 p-1 cursor-pointer"
									/>
									<Input
										{...field}
										placeholder={t("hex_placeholder") || "#hex"}
										className="flex-1"
									/>
								</div>
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
								<Label htmlFor="startDate">{t("start_date_time")} *</Label>
								<Input
									{...field}
									id="startDate"
									type="datetime-local"
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
								<Label htmlFor="endDate">{t("end_date_time")} *</Label>
								<Input
									{...field}
									id="endDate"
									type="datetime-local"
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
					<div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-muted/5">
						<div className="space-y-0.5">
							<Label>{t("all_day_event")}</Label>
							<p className="text-xs text-muted-foreground">
								{t("all_day_desc")}
							</p>
						</div>
						<Controller
							control={control}
							name="isAllDay"
							render={({ field }) => (
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							)}
						/>
					</div>
					<div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-muted/5">
						<div className="space-y-0.5">
							<Label>{t("school_closed")}</Label>
							<p className="text-xs text-muted-foreground">
								{t("school_closed_desc")}
							</p>
						</div>
						<Controller
							control={control}
							name="isSchoolClosed"
							render={({ field }) => (
								<Switch
									checked={field.value}
									onCheckedChange={field.onChange}
								/>
							)}
						/>
					</div>
				</div>

				<Controller
					control={control}
					name="location"
					render={({ field }) => (
						<div className="space-y-2">
							<Label htmlFor="location">{t("location")}</Label>
							<Input
								{...field}
								id="location"
								placeholder={
									t("location_placeholder") || "e.g., School Auditorium"
								}
							/>
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
								className="resize-none h-24"
							/>
						</div>
					)}
				/>
			</div>

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
