"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  MapPin,
  Phone,
  Mail,
  Loader2,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useDashboard } from "@/hooks/useDashboard";
import {
  useBranches,
  useCreateBranch,
  useUpdateBranch,
  useDeleteBranch,
} from "@/hooks/useBranches";
import { Branch } from "@/types/branch";

interface BranchFormData {
  name: string;
  province: string;
  district: string;
  commune: string;
  street: string;
  contactEmail: string;
  contactPhone: string;
}

const initialFormData: BranchFormData = {
  name: "",
  province: "",
  district: "",
  commune: "",
  street: "",
  contactEmail: "",
  contactPhone: "",
};

export default function BranchesPage() {
  const { currentSchool, isOwner, isAdmin, currentRole, currentMembership } =
    useDashboard();
  const schoolId = currentSchool?.idStr || currentSchool?.id;
  const { branches, loading, error, refetch } = useBranches(schoolId);
  const { createBranch, loading: creating } = useCreateBranch();
  const { updateBranch, loading: updating } = useUpdateBranch();
  const { deleteBranch, loading: deleting } = useDeleteBranch();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [formData, setFormData] = useState<BranchFormData>(initialFormData);
  const [formError, setFormError] = useState<string | null>(null);

  // Debug: log role info
  console.log("Branch Page Debug:", {
    currentRole,
    isOwner,
    isAdmin,
    currentMembership,
    schoolId,
  });

  // Allow management if user has any school selected (page is already admin protected)
  const canManage = !!currentSchool;

  const handleOpenCreate = () => {
    setSelectedBranch(null);
    setFormData(initialFormData);
    setFormError(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (branch: Branch) => {
    setSelectedBranch(branch);
    setFormData({
      name: branch.name || "",
      province: branch.address?.province || "",
      district: branch.address?.district || "",
      commune: branch.address?.commune || "",
      street: branch.address?.street || "",
      contactEmail: branch.contactEmail || "",
      contactPhone: branch.contactPhone || "",
    });
    setFormError(null);
    setIsDialogOpen(true);
  };

  const handleOpenDelete = (branch: Branch) => {
    setSelectedBranch(branch);
    setIsDeleteDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name.trim()) {
      setFormError("Branch name is required");

      return;
    }

    if (!schoolId) {
      setFormError("No school selected");

      return;
    }

    try {
      if (selectedBranch) {
        // Update existing branch
        await updateBranch(selectedBranch.id, {
          name: formData.name,
          address: {
            province: formData.province,
            district: formData.district,
            commune: formData.commune,
            street: formData.street,
          },
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
        });
      } else {
        // Create new branch
        await createBranch({
          schoolId: schoolId,
          name: formData.name,
          address: {
            province: formData.province,
            district: formData.district,
            commune: formData.commune,
            street: formData.street,
          },
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
        });
      }
      setIsDialogOpen(false);
      refetch();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Failed to save branch",
      );
    }
  };

  const handleDelete = async () => {
    if (!selectedBranch) return;

    try {
      await deleteBranch(selectedBranch.id);
      setIsDeleteDialogOpen(false);
      setSelectedBranch(null);
      refetch();
    } catch (err) {
      console.error("Failed to delete branch:", err);
    }
  };

  if (!currentSchool) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Please select a school to manage branches
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
        initial={{ opacity: 0, y: -20 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Branch Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage branches for{" "}
            {currentSchool.name?.en ||
              currentSchool.displayName ||
              "your school"}
          </p>
        </div>
        {canManage && (
          <Button className="gap-2" onClick={handleOpenCreate}>
            <Plus className="h-4 w-4" />
            Add Branch
          </Button>
        )}
      </motion.div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-red-700 dark:text-red-300">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Branches Table */}
      {!loading && branches.length > 0 && (
        <motion.div
          animate={{ opacity: 1 }}
          initial={{ opacity: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                All Branches ({branches.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Contact</TableHead>
                    {canManage && (
                      <TableHead className="text-right">Actions</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {branches.map((branch) => (
                    <TableRow key={branch.id}>
                      <TableCell className="font-medium">
                        {branch.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                          <MapPin className="h-3 w-3" />
                          {[
                            branch.address?.commune,
                            branch.address?.district,
                            branch.address?.province,
                          ]
                            .filter(Boolean)
                            .join(", ") || "—"}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          {branch.contactEmail && (
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {branch.contactEmail}
                            </div>
                          )}
                          {branch.contactPhone && (
                            <div className="flex items-center gap-1">
                              <Phone className="h-3 w-3" />
                              {branch.contactPhone}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      {canManage && (
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenEdit(branch)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              className="text-red-600 hover:text-red-700"
                              size="sm"
                              variant="ghost"
                              onClick={() => handleOpenDelete(branch)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Empty State */}
      {!loading && branches.length === 0 && (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
          initial={{ opacity: 0, scale: 0.95 }}
        >
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            No Branches Yet
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Get started by creating your first branch
          </p>
          {canManage && (
            <Button className="gap-2" onClick={handleOpenCreate}>
              <Plus className="h-4 w-4" />
              Create First Branch
            </Button>
          )}
        </motion.div>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedBranch ? "Edit Branch" : "Create New Branch"}
            </DialogTitle>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {formError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <p className="text-sm text-red-700 dark:text-red-300">
                  {formError}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Branch Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Main Campus"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="province">Province</Label>
                <Input
                  id="province"
                  placeholder="Phnom Penh"
                  value={formData.province}
                  onChange={(e) =>
                    setFormData({ ...formData, province: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Input
                  id="district"
                  placeholder="Chamkarmon"
                  value={formData.district}
                  onChange={(e) =>
                    setFormData({ ...formData, district: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="commune">Commune</Label>
                <Input
                  id="commune"
                  placeholder="Tonle Bassac"
                  value={formData.commune}
                  onChange={(e) =>
                    setFormData({ ...formData, commune: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="street">Street</Label>
                <Input
                  id="street"
                  placeholder="Street 123"
                  value={formData.street}
                  onChange={(e) =>
                    setFormData({ ...formData, street: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                placeholder="branch@school.edu"
                type="email"
                value={formData.contactEmail}
                onChange={(e) =>
                  setFormData({ ...formData, contactEmail: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                placeholder="+855 12 345 678"
                value={formData.contactPhone}
                onChange={(e) =>
                  setFormData({ ...formData, contactPhone: e.target.value })
                }
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button disabled={creating || updating} type="submit">
                {(creating || updating) && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                {selectedBranch ? "Save Changes" : "Create Branch"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Branch</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete &quot;{selectedBranch?.name}&quot;?
            This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              disabled={deleting}
              variant="destructive"
              onClick={handleDelete}
            >
              {deleting && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
