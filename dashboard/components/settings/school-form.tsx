"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SchoolFormData } from "@/types/school";

const schoolSchema = z.object({
  name: z.string().min(1, "School name is required"),
  contactEmail: z.string().email("Valid email is required"),
  contactPhone: z.string().min(1, "Phone number is required"),
  website: z.string().url().optional().or(z.literal("")),
  logoUrl: z.string().url().optional().or(z.literal("")),
});

interface SchoolFormProps {
  onSubmit: (data: SchoolFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function SchoolForm({
  onSubmit,
  onCancel,
  isLoading = false,
}: SchoolFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schoolSchema) as any,
    defaultValues: {
      name: "",
      contactEmail: "",
      contactPhone: "",
      website: "",
      logoUrl: "",
    },
  });

  const handleFormSubmit = async (data: any) => {
    await onSubmit({
      ownerId: "000000000000000000000000", // Temporary mock owner ID
      name: data.name,
      banners: [],
      logoUrl: data.logoUrl || undefined,
      website: data.website || undefined,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
    });
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <Controller
        control={control}
        name="name"
        render={({ field }) => (
          <div className="space-y-2">
            <Label htmlFor="name">School Name *</Label>
            <Input
              {...field}
              className={errors.name ? "border-destructive" : ""}
              id="name"
              placeholder="Enter school name"
            />
            {errors.name && (
              <p className="text-sm text-destructive">
                {errors.name.message as string}
              </p>
            )}
          </div>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          control={control}
          name="contactEmail"
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email *</Label>
              <Input
                {...field}
                className={errors.contactEmail ? "border-destructive" : ""}
                id="contactEmail"
                placeholder="contact@school.com"
                type="email"
              />
              {errors.contactEmail && (
                <p className="text-sm text-destructive">
                  {errors.contactEmail.message as string}
                </p>
              )}
            </div>
          )}
        />

        <Controller
          control={control}
          name="contactPhone"
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone *</Label>
              <Input
                {...field}
                className={errors.contactPhone ? "border-destructive" : ""}
                id="contactPhone"
                placeholder="+855 12 345 678"
              />
              {errors.contactPhone && (
                <p className="text-sm text-destructive">
                  {errors.contactPhone.message as string}
                </p>
              )}
            </div>
          )}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Controller
          control={control}
          name="website"
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                {...field}
                id="website"
                placeholder="https://www.school.com"
              />
            </div>
          )}
        />

        <Controller
          control={control}
          name="logoUrl"
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                {...field}
                id="logoUrl"
                placeholder="https://example.com/logo.png"
              />
            </div>
          )}
        />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button disabled={isLoading} type="submit">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create School
        </Button>
      </div>
    </form>
  );
}
