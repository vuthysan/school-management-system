"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Subject, SubjectFormData } from "@/types/academic";

const subjectSchema = z.object({
  subjectName: z.string().min(1, "Subject name is required"),
  subjectCode: z.string().min(1, "Subject code is required"),
  description: z.string().optional(),
  credits: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Credits must be at least 1"),
  ),
  department: z.string().min(1, "Department is required"),
  status: z.enum(["Active", "Inactive", "Archived"]),
});

interface SubjectFormProps {
  initialData?: Subject | null;
  onSuccess?: (data: SubjectFormData) => void;
  onCancel?: () => void;
}

export const SubjectForm: React.FC<SubjectFormProps> = ({
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
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema) as any,
    defaultValues: {
      subjectName: "",
      subjectCode: "",
      description: "",
      credits: 3,
      department: "",
      status: "Active",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        subjectName: initialData.subjectName,
        subjectCode: initialData.subjectCode,
        description: initialData.description,
        credits: initialData.credits,
        department: initialData.department,
        status: initialData.status,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: SubjectFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (onSuccess) onSuccess(data);
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          control={control}
          name="subjectName"
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="subjectName">
                {t("subject_name")} <span className="text-destructive">*</span>
              </Label>
              <Input
                {...field}
                className={errors.subjectName ? "border-destructive" : ""}
                id="subjectName"
                placeholder="e.g. Mathematics"
              />
              {errors.subjectName && (
                <p className="text-sm text-destructive">
                  {errors.subjectName.message}
                </p>
              )}
            </div>
          )}
        />
        <Controller
          control={control}
          name="subjectCode"
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="subjectCode">
                {t("subject_code")} <span className="text-destructive">*</span>
              </Label>
              <Input
                {...field}
                className={errors.subjectCode ? "border-destructive" : ""}
                id="subjectCode"
                placeholder="e.g. MATH101"
              />
              {errors.subjectCode && (
                <p className="text-sm text-destructive">
                  {errors.subjectCode.message}
                </p>
              )}
            </div>
          )}
        />
        <Controller
          control={control}
          name="department"
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="department">
                {t("department")} <span className="text-destructive">*</span>
              </Label>
              <Input
                {...field}
                className={errors.department ? "border-destructive" : ""}
                id="department"
                placeholder="e.g. Science"
              />
              {errors.department && (
                <p className="text-sm text-destructive">
                  {errors.department.message}
                </p>
              )}
            </div>
          )}
        />
        <Controller
          control={control}
          name="credits"
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="credits">
                {t("credits")} <span className="text-destructive">*</span>
              </Label>
              <Input
                {...field}
                className={errors.credits ? "border-destructive" : ""}
                id="credits"
                placeholder="3"
                type="number"
              />
              {errors.credits && (
                <p className="text-sm text-destructive">
                  {errors.credits.message}
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
              placeholder="Subject description..."
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>
        )}
      />

      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? t("save_changes") : "Create Subject"}
        </Button>
      </div>
    </form>
  );
};
