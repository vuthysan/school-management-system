"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Student } from "@/types/student";

interface ViewStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: Student | null;
}

export const ViewStudentModal: React.FC<ViewStudentModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  if (!student) return null;

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className="flex justify-between py-2">
      <span className="text-muted-foreground font-medium">{label}:</span>
      <span className="text-foreground">{value}</span>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Student Details</DialogTitle>
          <DialogDescription>
            {student.firstName} {student.lastName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-4">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Personal Information
            </h3>
            <div className="space-y-1">
              <InfoRow label="First Name" value={student.firstName} />
              <InfoRow label="Last Name" value={student.lastName} />
              <InfoRow label="Email" value={student.email} />
              <InfoRow label="Date of Birth" value={student.dateOfBirth} />
              <InfoRow
                label="Gender"
                value={
                  student.gender.charAt(0).toUpperCase() +
                  student.gender.slice(1)
                }
              />
              <InfoRow label="Phone" value={student.phone} />
              <InfoRow label="Address" value={student.address} />
            </div>
          </div>

          <Separator />

          {/* Academic Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Academic Information
            </h3>
            <div className="space-y-1">
              <InfoRow label="Grade Level" value={student.gradeLevel} />
              {student.enrollmentDate && (
                <InfoRow
                  label="Enrollment Date"
                  value={student.enrollmentDate}
                />
              )}
              {student.status && (
                <InfoRow
                  label="Status"
                  value={
                    student.status.charAt(0).toUpperCase() +
                    student.status.slice(1)
                  }
                />
              )}
            </div>
          </div>

          <Separator />

          {/* Guardian Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Guardian Information
            </h3>
            <div className="space-y-1">
              <InfoRow label="Guardian Name" value={student.guardianName} />
              <InfoRow
                label="Guardian Phone"
                value={student.guardianPhone}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
