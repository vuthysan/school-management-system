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

const DEFAULT_CATEGORIES = [
  "Science",
  "Mathematics",
  "Language",
  "Social Studies",
  "Arts",
  "Physical Education",
  "Technology",
  "Other",
];

const subjectSchema = z.object({
  subjectName: z.string().min(1, "Subject name is required"),
  subjectCode: z.string().min(1, "Subject code is required"),
  description: z.string().optional(),
  hoursPerWeek: z.preprocess(
    (val) => Number(val),
    z.number().min(1, "Hours per week must be at least 1"),
  ),
  coefficient: z.preprocess(
    (val) => Number(val),
    z.number().min(0.5, "Coefficient must be at least 0.5"),
  ),
  subjectCategory: z.string().optional(),
  status: z.enum(["Active", "Inactive", "Archived"]),
});

interface SubjectFormProps {
  initialData?: Subject | null;
  categories?: string[];
  onSuccess?: (data: SubjectFormData) => void;
  onCancel?: () => void;
}

export const SubjectForm: React.FC<SubjectFormProps> = ({
  initialData,
  categories,
  onSuccess,
  onCancel,
}) => {
  const categoryOptions = categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;
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
      hoursPerWeek: 2,
      coefficient: 1,
      subjectCategory: "",
      status: "Active",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        subjectName: initialData.subjectName,
        subjectCode: initialData.subjectCode,
        description: initialData.description,
        hoursPerWeek: initialData.hoursPerWeek,
        coefficient: initialData.coefficient,
        subjectCategory: initialData.subjectCategory,
        status: initialData.status,
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data: SubjectFormData) => {
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
                placeholder={t("subject_name_placeholder")}
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
                placeholder={t("subject_code_placeholder")}
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
          name="subjectCategory"
          render={({ field }) => (
            <div className="space-y-2">
              <Label>{t("subject_category")}</Label>
              <Select value={field.value || ""} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t("select_category")} />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {t(`category_${cat.toLowerCase().replace(/\s+/g, "_")}`) || cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        />
        <Controller
          control={control}
          name="hoursPerWeek"
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="hoursPerWeek">
                {t("hours_per_week")} <span className="text-destructive">*</span>
              </Label>
              <Input
                {...field}
                className={errors.hoursPerWeek ? "border-destructive" : ""}
                id="hoursPerWeek"
                placeholder="2"
                type="number"
                min={1}
                max={20}
              />
              {errors.hoursPerWeek && (
                <p className="text-sm text-destructive">
                  {errors.hoursPerWeek.message}
                </p>
              )}
            </div>
          )}
        />
        <Controller
          control={control}
          name="coefficient"
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="coefficient">
                {t("coefficient")} <span className="text-destructive">*</span>
              </Label>
              <Input
                {...field}
                className={errors.coefficient ? "border-destructive" : ""}
                id="coefficient"
                placeholder="1"
                type="number"
                min={0.5}
                max={5}
                step={0.5}
              />
              <p className="text-xs text-muted-foreground">
                {t("coefficient_hint")}
              </p>
              {errors.coefficient && (
                <p className="text-sm text-destructive">
                  {errors.coefficient.message}
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
              placeholder={t("subject_description_placeholder")}
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
          {t("cancel")}
        </Button>
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? t("save_changes") : t("create_subject")}
        </Button>
      </div>
    </form>
  );
};
