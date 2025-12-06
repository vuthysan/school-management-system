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
import { Student } from "@/types/student";
import { Loader2 } from "lucide-react";

interface DeleteStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  student: Student | null;
  isDeleting?: boolean;
}

export const DeleteStudentModal: React.FC<DeleteStudentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  student,
  isDeleting = false,
}) => {
  if (!student) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Student</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <strong>
              {student.firstName} {student.lastName}
            </strong>
            ?
          </DialogDescription>
        </DialogHeader>
        
        <p className="text-muted-foreground text-sm">
          This action cannot be undone. All student records and associated
          data will be permanently removed.
        </p>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={isDeleting}
            onClick={onConfirm}
          >
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Student
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
