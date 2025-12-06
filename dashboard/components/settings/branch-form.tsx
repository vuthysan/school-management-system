"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
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

export function BranchForm({ schoolId, onSubmit, onCancel, isLoading = false }: BranchFormProps) {
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
    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-4">
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <div className="space-y-2">
            <Label htmlFor="name">Branch Name *</Label>
            <Input
              {...field}
              id="name"
              placeholder="Main Campus"
              className={errors.name ? "border-destructive" : ""}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message as string}</p>
            )}
          </div>
        )}
      />

      <div className="space-y-2">
        <h4 className="text-sm font-medium">Address</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="province"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="province">Province *</Label>
                <Input
                  {...field}
                  id="province"
                  placeholder="Phnom Penh"
                  className={errors.province ? "border-destructive" : ""}
                />
                {errors.province && (
                  <p className="text-sm text-destructive">{errors.province.message as string}</p>
                )}
              </div>
            )}
          />

          <Controller
            name="district"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input {...field} id="district" placeholder="Chamkarmon" />
              </div>
            )}
          />

          <Controller
            name="commune"
            control={control}
            render={({ field }) => (
              <div className="space-y-2">
                <Label htmlFor="commune">Commune</Label>
                <Input {...field} id="commune" placeholder="Tonle Bassac" />
              </div>
            )}
          />

          <Controller
            name="village"
            control={control}
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
          name="contactEmail"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email *</Label>
              <Input
                {...field}
                id="contactEmail"
                type="email"
                placeholder="branch@school.com"
                className={errors.contactEmail ? "border-destructive" : ""}
              />
              {errors.contactEmail && (
                <p className="text-sm text-destructive">{errors.contactEmail.message as string}</p>
              )}
            </div>
          )}
        />

        <Controller
          name="contactPhone"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone *</Label>
              <Input
                {...field}
                id="contactPhone"
                placeholder="+855 12 345 678"
                className={errors.contactPhone ? "border-destructive" : ""}
              />
              {errors.contactPhone && (
                <p className="text-sm text-destructive">{errors.contactPhone.message as string}</p>
              )}
            </div>
          )}
        />
      </div>

      <div className="flex justify-end gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Branch
        </Button>
      </div>
    </form>
  );
}
