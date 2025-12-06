"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/language-context";
import { Student, StudentFormData } from "@/types/student";
import { Loader2 } from "lucide-react";

interface StudentFormProps {
  student?: Student | null;
  mode?: "create" | "edit";
  onSuccess?: (student: Student) => void;
}

const GRADE_LEVELS = [
  { key: "10", label: "Grade 10" },
  { key: "11", label: "Grade 11" },
  { key: "12", label: "Grade 12" },
];

export const StudentForm: React.FC<StudentFormProps> = ({
  student = null,
  mode = "create",
  onSuccess,
}) => {
  const { t } = useLanguage();

  // Define the validation schema with translated messages
  const studentSchema = z.object({
    firstName: z.string().min(1, t("required_field")),
    lastName: z.string().min(1, t("required_field")),
    email: z.string().email(t("invalid_email")),
    dob: z.string().min(1, t("required_field")),
    gender: z.enum(["male", "female", "other"], {
      message: t("select_option"),
    }),
    phone: z.string().min(1, t("required_field")),
    address: z.string().min(1, t("required_field")),
    gradeLevel: z.string().min(1, t("required_field")),
    guardianName: z.string().min(1, t("required_field")),
    guardianPhone: z.string().min(1, t("required_field")),
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    defaultValues: {
      firstName: student?.firstName || "",
      lastName: student?.lastName || "",
      email: student?.email || "",
      dob: student?.dateOfBirth || "",
      gender: student?.gender || undefined,
      phone: student?.phone || "",
      address: student?.address || "",
      gradeLevel: student?.gradeLevel || "",
      guardianName: student?.guardianName || "",
      guardianPhone: student?.guardianPhone || "",
    },
  });

  // Update form when student prop changes
  useEffect(() => {
    if (student) {
      reset({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        dob: student.dateOfBirth,
        gender: student.gender,
        phone: student.phone,
        address: student.address,
        gradeLevel: student.gradeLevel,
        guardianName: student.guardianName,
        guardianPhone: student.guardianPhone,
      });
    }
  }, [student, reset]);

  const onSubmit = async (data: StudentFormData) => {
    // Simulate API call
    console.log("Form Data:", data);
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const updatedStudent: Student = {
      id: student?.id || Date.now().toString(),
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      dateOfBirth: data.dob,
      gender: data.gender,
      phone: data.phone,
      address: data.address,
      gradeLevel: data.gradeLevel,
      guardianName: data.guardianName,
      guardianPhone: data.guardianPhone,
      status: student?.status || "active",
      enrollmentDate: student?.enrollmentDate || new Date().toISOString().split("T")[0],
    };

    const message = mode === "edit" ? t("student_updated") : t("student_registered");
    alert(message);

    if (onSuccess) {
      onSuccess(updatedStudent);
    }

    if (mode === "create") {
      reset();
    }
  };

  return (
    <Card className="w-full shadow-lg border">
      <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardTitle>
          {mode === "edit" ? t("edit_student") : t("student_registration")}
        </CardTitle>
        <CardDescription>{t("enter_details")}</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit(onSubmit)}>
          {/* Personal Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-primary rounded-full" />
              <h3 className="text-lg font-semibold">
                {t("personal_info")}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={control}
                name="firstName"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="firstName">{t("first_name")}</Label>
                    <Input
                      {...field}
                      id="firstName"
                      placeholder={t("enter_first_name")}
                      className={errors.firstName ? "border-destructive" : ""}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-destructive">{errors.firstName.message}</p>
                    )}
                  </div>
                )}
              />
              <Controller
                control={control}
                name="lastName"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="lastName">{t("last_name")}</Label>
                    <Input
                      {...field}
                      id="lastName"
                      placeholder={t("enter_last_name")}
                      className={errors.lastName ? "border-destructive" : ""}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-destructive">{errors.lastName.message}</p>
                    )}
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
                      id="email"
                      type="email"
                      placeholder={t("enter_email")}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email.message}</p>
                    )}
                  </div>
                )}
              />
              <Controller
                control={control}
                name="dob"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="dob">{t("dob")}</Label>
                    <Input
                      {...field}
                      id="dob"
                      type="date"
                      className={errors.dob ? "border-destructive" : ""}
                    />
                    {errors.dob && (
                      <p className="text-sm text-destructive">{errors.dob.message}</p>
                    )}
                  </div>
                )}
              />
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label>{t("gender")}</Label>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={errors.gender ? "border-destructive" : ""}>
                        <SelectValue placeholder={t("select_gender")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">{t("male")}</SelectItem>
                        <SelectItem value="female">{t("female")}</SelectItem>
                        <SelectItem value="other">{t("other")}</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.gender && (
                      <p className="text-sm text-destructive">{errors.gender.message}</p>
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
                      id="phone"
                      placeholder={t("enter_phone")}
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive">{errors.phone.message}</p>
                    )}
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
              <h3 className="text-lg font-semibold">
                {t("academic_contact")}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={control}
                name="gradeLevel"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label>{t("grade_level")}</Label>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className={errors.gradeLevel ? "border-destructive" : ""}>
                        <SelectValue placeholder={t("select_grade")} />
                      </SelectTrigger>
                      <SelectContent>
                        {GRADE_LEVELS.map((grade) => (
                          <SelectItem key={grade.key} value={grade.key}>
                            {grade.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.gradeLevel && (
                      <p className="text-sm text-destructive">{errors.gradeLevel.message}</p>
                    )}
                  </div>
                )}
              />
              <Controller
                control={control}
                name="address"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="address">{t("address")}</Label>
                    <Input
                      {...field}
                      id="address"
                      placeholder={t("enter_address")}
                      className={errors.address ? "border-destructive" : ""}
                    />
                    {errors.address && (
                      <p className="text-sm text-destructive">{errors.address.message}</p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Guardian Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-1 h-6 bg-green-500 rounded-full" />
              <h3 className="text-lg font-semibold">
                {t("guardian_info")}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Controller
                control={control}
                name="guardianName"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="guardianName">{t("guardian_name")}</Label>
                    <Input
                      {...field}
                      id="guardianName"
                      placeholder={t("enter_guardian_name")}
                      className={errors.guardianName ? "border-destructive" : ""}
                    />
                    {errors.guardianName && (
                      <p className="text-sm text-destructive">{errors.guardianName.message}</p>
                    )}
                  </div>
                )}
              />
              <Controller
                control={control}
                name="guardianPhone"
                render={({ field }) => (
                  <div className="space-y-2">
                    <Label htmlFor="guardianPhone">{t("guardian_phone")}</Label>
                    <Input
                      {...field}
                      id="guardianPhone"
                      placeholder={t("enter_guardian_phone")}
                      className={errors.guardianPhone ? "border-destructive" : ""}
                    />
                    {errors.guardianPhone && (
                      <p className="text-sm text-destructive">{errors.guardianPhone.message}</p>
                    )}
                  </div>
                )}
              />
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => reset()}
            >
              {t("reset")}
            </Button>
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === "edit" ? t("save_changes") : t("register_student")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
