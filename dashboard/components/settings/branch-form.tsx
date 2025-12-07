"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { BranchFormData } from "@/types/branch";

const branchSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  province: z.string().min(1, "Province is required"),
  district: z.string().optional(),
  commune: z.string().optional(),
  village: z.string().optional(),
  contactEmail: z.string().email("Valid email is required"),
  contactPhone: z.string().min(1, "Phone number is required"),
});

interface BranchFormProps {
  schoolId: string;
  onSubmit: (data: BranchFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function BranchForm({
  schoolId,
  onSubmit,
  onCancel,
  isLoading = false,
}: BranchFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(branchSchema) as any,
    defaultValues: {
      name: "",
      province: "",
      district: "",
      commune: "",
      village: "",
      contactEmail: "",
      contactPhone: "",
    },
  });

  const handleFormSubmit = async (data: any) => {
    await onSubmit({
      schoolId,
      name: data.name,
      address: {
        province: data.province,
        district: data.district || undefined,
        commune: data.commune || undefined,
        village: data.village || undefined,
      },
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
            <Label htmlFor="name">Branch Name *</Label>
            <Input
              {...field}
              className={errors.name ? "border-destructive" : ""}
              id="name"
              placeholder="Main Campus"
            />
            {errors.name && (
              <p className="text-sm text-destructive">
                {errors.name.message as string}
              </p>
            )}
          </div>
        )}
      />

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            control={control}
            name="province"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="province">Province *</Label>
                <Input
                  {...field}
                  className={errors.province ? "border-destructive" : ""}
                  id="province"
                  placeholder="Phnom Penh"
                />
                {errors.province && (
                  <p className="text-sm text-destructive">
                    {errors.province.message as string}
                  </p>
                )}
              </div>
            )}
          />

          <Controller
            control={control}
            name="district"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input {...field} id="district" placeholder="Chamkarmon" />
              </div>
            )}
          />

          <Controller
            control={control}
            name="commune"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="commune">Commune</Label>
                <Input {...field} id="commune" placeholder="Tonle Bassac" />
              </div>
            )}
          />

          <Controller
            control={control}
            name="village"
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="village">Village</Label>
                <Input {...field} id="village" placeholder="Village name" />
              </div>
            )}
          />
        </div>
      </div>

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
                placeholder="branch@school.com"
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

      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button disabled={isLoading} type="submit">
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Branch
        </Button>
      </div>
    </form>
  );
}
