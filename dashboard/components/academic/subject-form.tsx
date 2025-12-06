"use client";

import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Loader2 } from "lucide-react";

const subjectSchema = z.object({
  name: z.string().min(1, "Subject name is required"),
  code: z.string().min(1, "Subject code is required"),
  description: z.string().optional(),
  credits: z.preprocess((val) => Number(val), z.number().min(1, "Credits must be at least 1")),
  department: z.string().min(1, "Department is required"),
  status: z.enum(["active", "inactive", "archived"]),
});

interface SubjectFormProps {
  initialData?: Subject | null;
  onSuccess?: (data: SubjectFormData) => void;
  onCancel?: () => void;
}

export const SubjectForm: React.FC<SubjectFormProps> = ({ initialData, onSuccess, onCancel }) => {
  const { t } = useLanguage();
  
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SubjectFormData>({
    resolver: zodResolver(subjectSchema) as any,
    defaultValues: {
      name: "",
      code: "",
      description: "",
      credits: 3,
      department: "",
      status: "active",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        code: initialData.code,
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="name">{t("subject_name")}</Label>
              <Input
                {...field}
                id="name"
                placeholder="e.g. Mathematics"
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
          )}
        />
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="code">{t("subject_code")}</Label>
              <Input
                {...field}
                id="code"
                placeholder="e.g. MATH101"
                className={errors.code ? "border-destructive" : ""}
              />
              {errors.code && (
                <p className="text-sm text-destructive">{errors.code.message}</p>
              )}
            </div>
          )}
        />
        <Controller
          name="department"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="department">{t("department")}</Label>
              <Input
                {...field}
                id="department"
                placeholder="e.g. Science"
                className={errors.department ? "border-destructive" : ""}
              />
              {errors.department && (
                <p className="text-sm text-destructive">{errors.department.message}</p>
              )}
            </div>
          )}
        />
        <Controller
          name="credits"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="credits">{t("credits")}</Label>
              <Input
                {...field}
                id="credits"
                type="number"
                placeholder="3"
                className={errors.credits ? "border-destructive" : ""}
              />
              {errors.credits && (
                <p className="text-sm text-destructive">{errors.credits.message}</p>
              )}
            </div>
          )}
        />
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label>{t("status")}</Label>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className={errors.status ? "border-destructive" : ""}>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="archived">Archived</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-sm text-destructive">{errors.status.message}</p>
              )}
            </div>
          )}
        />
      </div>
      
      <Controller
        name="description"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label htmlFor="description">{t("description")}</Label>
            <Textarea
              {...field}
              id="description"
              placeholder="Subject description..."
              className={errors.description ? "border-destructive" : ""}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>
        )}
      />

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" type="button" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? t("save_changes") : "Create Subject"}
        </Button>
      </div>
    </form>
  );
};
