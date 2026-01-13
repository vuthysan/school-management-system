"use client";

import { useState, useMemo, useEffect } from "react";
import {
	Plus,
	Trash2,
	Clock,
	MapPin,
	User,
	BookOpen,
	Save,
	Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, useFieldArray, Controller } from "react-hook-form";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/language-context";
import {
	Class,
	ClassSchedule,
	SchedulePeriod,
	DayOfWeek,
} from "@/types/academic";
import { useSubjects } from "@/hooks/useSubjects";
import { useSchoolMembers } from "@/hooks/useMembers";

interface TimetableEditorProps {
	classData: Class;
	onSave: (schedule: ClassSchedule[]) => Promise<void>;
	onCancel: () => void;
}

const DAYS: DayOfWeek[] = [
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday",
	"Sunday",
];

export function TimetableEditor({
	classData,
	onSave,
	onCancel,
}: TimetableEditorProps) {
	const { t } = useLanguage();
	const [activeDay, setActiveDay] = useState<DayOfWeek>("Monday");
	const [isSaving, setIsSaving] = useState(false);

	// Fetch subjects and teachers
	const { subjects, isLoading: isLoadingSubjects } = useSubjects({
		schoolId: classData.schoolId,
		pageSize: 100,
	});
	const { members, loading: isLoadingMembers } = useSchoolMembers(
		classData.schoolId
	);

	const teachers = useMemo(() => {
		// Filter for teachers/staff
		return members.filter(
			(m) => m.role === "Teacher" || m.role === "Staff" || m.role === "Admin"
		);
	}, [members]);

	// Form setup
	const { control, handleSubmit, reset, watch } = useForm<{
		schedule: ClassSchedule[];
	}>({
		defaultValues: {
			schedule: DAYS.map((day) => {
				const existingDay = classData.schedule?.find((s) => s.day === day);
				return {
					day,
					periods: existingDay?.periods || [],
				};
			}),
		},
	});

	// We need nested field arrays, but for simplicity we can manage current day's periods
	const dayIndex = DAYS.indexOf(activeDay);
	const { fields, append, remove } = useFieldArray({
		control,
		name: `schedule.${dayIndex}.periods` as any,
	});

	const onSubmit = async (data: { schedule: ClassSchedule[] }) => {
		setIsSaving(true);
		try {
			// Filter out days with no periods if necessary, or just send all
			await onSave(data.schedule);
		} catch (error) {
			console.error("Failed to save schedule:", error);
		} finally {
			setIsSaving(false);
		}
	};

	const addPeriod = () => {
		const lastPeriod = fields[fields.length - 1] as unknown as SchedulePeriod;
		const nextNumber = fields.length + 1;

		append({
			periodNumber: nextNumber,
			subjectId: "",
			teacherId: "",
			startTime: lastPeriod ? lastPeriod.endTime : "08:00",
			endTime: lastPeriod ? "" : "09:00",
			room: classData.roomNumber || "",
		});
	};

	return (
		<Card className="w-full">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Clock className="h-5 w-5 text-primary" />
					{t("edit_schedule") || "Edit Weekly Schedule"}: {classData.name}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Tabs
					value={activeDay}
					onValueChange={(v) => setActiveDay(v as DayOfWeek)}
				>
					<TabsList className="bg-muted/50 p-1 w-full justify-start overflow-x-auto h-auto">
						{DAYS.map((day) => (
							<TabsTrigger
								key={day}
								value={day}
								className="data-[state=active]:bg-background data-[state=active]:shadow-sm"
							>
								{t(day.toLowerCase()) || day}
							</TabsTrigger>
						))}
					</TabsList>

					{DAYS.map((day, idx) => (
						<TabsContent key={day} value={day} className="mt-4 space-y-4">
							<div className="flex items-center justify-between mb-2">
								<h3 className="font-semibold">
									{t(day.toLowerCase()) || day} {t("schedule") || "Schedule"}
								</h3>
								<Button
									type="button"
									variant="outline"
									size="sm"
									onClick={addPeriod}
									className="gap-1"
								>
									<Plus className="h-4 w-4" />
									{t("add_period") || "Add Period"}
								</Button>
							</div>

							<div className="space-y-3">
								<AnimatePresence mode="popLayout">
									{fields.length === 0 ? (
										<div className="py-8 text-center border-2 border-dashed rounded-lg bg-muted/30">
											<p className="text-muted-foreground text-sm">
												{t("no_periods_added") ||
													"No periods added for this day."}
											</p>
										</div>
									) : (
										fields.map((field, pIdx) => (
											<motion.div
												key={field.id}
												initial={{ opacity: 0, height: 0 }}
												animate={{ opacity: 1, height: "auto" }}
												exit={{ opacity: 0, height: 0 }}
												className="p-4 border rounded-lg bg-background shadow-sm hover:shadow-md transition-shadow relative"
											>
												<Button
													type="button"
													variant="ghost"
													size="icon"
													className="absolute top-2 right-2 text-muted-foreground hover:text-destructive h-8 w-8"
													onClick={() => remove(pIdx)}
												>
													<Trash2 className="h-4 w-4" />
												</Button>

												<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
													{/* Period & Subject */}
													<div className="space-y-2">
														<Label className="text-xs uppercase text-muted-foreground font-bold">
															{t("period") || "Period"} {pIdx + 1}
														</Label>
														<Controller
															control={control}
															name={
																`schedule.${idx}.periods.${pIdx}.subjectId` as any
															}
															render={({ field }: { field: any }) => (
																<Select
																	value={field.value}
																	onValueChange={field.onChange}
																>
																	<SelectTrigger className="h-9">
																		<SelectValue
																			placeholder={
																				t("select_subject") || "Select Subject"
																			}
																		/>
																	</SelectTrigger>
																	<SelectContent>
																		{subjects.map((s) => (
																			<SelectItem key={s.id} value={s.id}>
																				{s.subjectName}
																			</SelectItem>
																		))}
																	</SelectContent>
																</Select>
															)}
														/>
													</div>

													{/* Teacher */}
													<div className="space-y-2">
														<Label className="text-xs uppercase text-muted-foreground font-bold">
															{t("teacher") || "Teacher"}
														</Label>
														<Controller
															control={control}
															name={
																`schedule.${idx}.periods.${pIdx}.teacherId` as any
															}
															render={({ field }: { field: any }) => (
																<Select
																	value={field.value}
																	onValueChange={field.onChange}
																>
																	<SelectTrigger className="h-9">
																		<SelectValue
																			placeholder={
																				t("select_teacher") || "Select Teacher"
																			}
																		/>
																	</SelectTrigger>
																	<SelectContent>
																		{teachers.map((t) => (
																			<SelectItem
																				key={t.idStr}
																				value={t.userId}
																			>
																				{t.user?.fullName ||
																					t.user?.displayName ||
																					t.user?.username}
																			</SelectItem>
																		))}
																	</SelectContent>
																</Select>
															)}
														/>
													</div>

													{/* Times */}
													<div className="space-y-2">
														<Label className="text-xs uppercase text-muted-foreground font-bold">
															{t("time") || "Time"}
														</Label>
														<div className="flex items-center gap-2">
															<Controller
																control={control}
																name={
																	`schedule.${idx}.periods.${pIdx}.startTime` as any
																}
																render={({ field }: { field: any }) => (
																	<Input
																		type="time"
																		{...field}
																		className="h-9"
																	/>
																)}
															/>
															<span className="text-muted-foreground text-xs font-bold">
																-
															</span>
															<Controller
																control={control}
																name={
																	`schedule.${idx}.periods.${pIdx}.endTime` as any
																}
																render={({ field }: { field: any }) => (
																	<Input
																		type="time"
																		{...field}
																		className="h-9"
																	/>
																)}
															/>
														</div>
													</div>

													{/* Room */}
													<div className="space-y-2">
														<Label className="text-xs uppercase text-muted-foreground font-bold">
															{t("room") || "Room"}
														</Label>
														<Controller
															control={control}
															name={
																`schedule.${idx}.periods.${pIdx}.room` as any
															}
															render={({ field }: { field: any }) => (
																<Input
																	{...field}
																	placeholder="e.g. 101"
																	className="h-9"
																/>
															)}
														/>
													</div>
												</div>
											</motion.div>
										))
									)}
								</AnimatePresence>
							</div>
						</TabsContent>
					))}
				</Tabs>
			</CardContent>
			<CardFooter className="flex justify-end gap-3 border-t pt-6 bg-muted/10">
				<Button variant="outline" onClick={onCancel} disabled={isSaving}>
					{t("cancel") || "Cancel"}
				</Button>
				<Button
					onClick={handleSubmit(onSubmit)}
					disabled={isSaving}
					className="gap-2"
				>
					{isSaving ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<Save className="h-4 w-4" />
					)}
					{t("save_schedule") || "Save Schedule"}
				</Button>
			</CardFooter>
		</Card>
	);
}
