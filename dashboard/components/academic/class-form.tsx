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
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/language-context";
import { Class, ClassFormData } from "@/types/academic";

const classSchema = z.object({
  name: z.string().min(1, "Class name is required"),
  gradeLevel: z.string().min(1, "Grade level is required"),
  section: z.string().min(1, "Section is required"),
  teacherName: z.string().min(1, "Teacher name is required"),
  room: z.string().min(1, "Room is required"),
  capacity: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Capacity must be at least 1"),
  ),
  status: z.enum(["active", "inactive", "archived"]),
  academicYear: z.string().min(1, "Academic year is required"),
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

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ClassFormData>({
    resolver: zodResolver(classSchema) as any,
    defaultValues: {
      name: "",
      gradeLevel: "",
      section: "",
      teacherName: "",
      room: "",
      capacity: 30,
      status: "active",
      academicYear: new Date().getFullYear().toString(),
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        gradeLevel: initialData.gradeLevel,
        section: initialData.section,
        teacherName: initialData.teacherName,
        room: initialData.room,
        capacity: initialData.capacity,
        status: initialData.status,
        academicYear: initialData.academicYear,
      });
    }
  }, [initialData, reset]);

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
              <Label htmlFor="name">{t("class_name")}</Label>
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
          name="gradeLevel"
          render={({ field }) => (
            <div className="space-y-2">
              <Label>{t("grade_level")}</Label>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger
                  className={errors.gradeLevel ? "border-destructive" : ""}
                >
                  <SelectValue placeholder={t("select_grade")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">Grade 10</SelectItem>
                  <SelectItem value="11">Grade 11</SelectItem>
                  <SelectItem value="12">Grade 12</SelectItem>
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
              <Label htmlFor="section">{t("section")}</Label>
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
          name="teacherName"
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="teacherName">{t("teacher")}</Label>
              <Input
                {...field}
                className={errors.teacherName ? "border-destructive" : ""}
                id="teacherName"
                placeholder="Teacher Name"
              />
              {errors.teacherName && (
                <p className="text-sm text-destructive">
                  {errors.teacherName.message}
                </p>
              )}
            </div>
          )}
        />
        <Controller
          control={control}
          name="room"
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="room">{t("room")}</Label>
              <Input
                {...field}
                className={errors.room ? "border-destructive" : ""}
                id="room"
                placeholder="e.g. 101"
              />
              {errors.room && (
                <p className="text-sm text-destructive">
                  {errors.room.message}
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
              <Label htmlFor="capacity">{t("capacity")}</Label>
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
          name="academicYear"
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="academicYear">{t("academic_year")}</Label>
              <Input
                {...field}
                className={errors.academicYear ? "border-destructive" : ""}
                id="academicYear"
                placeholder="e.g. 2024-2025"
              />
              {errors.academicYear && (
                <p className="text-sm text-destructive">
                  {errors.academicYear.message}
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
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
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
