"use client";

import { useState } from "react";
import { Plus, Building2, Building } from "lucide-react";

import { title } from "@/components/primitives";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSchools, useCreateSchool } from "@/hooks/useSchools";
import { useBranches, useCreateBranch } from "@/hooks/useBranches";
import { SchoolsTable } from "@/components/settings/schools-table";
import { BranchesTable } from "@/components/settings/branches-table";
import { SchoolForm } from "@/components/settings/school-form";
import { BranchForm } from "@/components/settings/branch-form";
import { School, SchoolFormData, CreateSchoolInput } from "@/types/school";
import { BranchFormData, CreateBranchInput } from "@/types/branch";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"schools" | "branches">("schools");
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  // Hooks
  const {
    schools,
    loading: schoolsLoading,
    refetch: refetchSchools,
  } = useSchools();
  const { createSchool, loading: creatingSchool } = useCreateSchool();
  const {
    branches,
    loading: branchesLoading,
    refetch: refetchBranches,
  } = useBranches(selectedSchool?.id);
  const { createBranch, loading: creatingBranch } = useCreateBranch();

  const handleCreateSchool = async (data: SchoolFormData) => {
    const input: CreateSchoolInput = {
      owner_id: data.ownerId,
      name: data.name,
      banners: data.banners,
      logo_url: data.logoUrl,
      website: data.website,
      contact_email: data.contactEmail,
      contact_phone: data.contactPhone,
    };

    await createSchool(input);
    setIsSchoolModalOpen(false);
    refetchSchools();
  };

  const handleCreateBranch = async (data: BranchFormData) => {
    const input: CreateBranchInput = {
      schoolId: data.schoolId,
      name: data.name,
      address: data.address,
      contactEmail: data.contactEmail,
      contactPhone: data.contactPhone,
    };

    await createBranch(input);
    setIsBranchModalOpen(false);
    refetchBranches();
  };

  const handleSelectSchool = (school: School) => {
    setSelectedSchool(school);
    setActiveTab("branches");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h1 className={title()}>System Settings</h1>
          <p className="mt-2 text-muted-foreground">
            Manage schools, branches, and system configuration.
          </p>
        </div>
        {activeTab === "schools" && (
          <Button onClick={() => setIsSchoolModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add School
          </Button>
        )}
        {activeTab === "branches" && selectedSchool && (
          <Button onClick={() => setIsBranchModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Branch
          </Button>
        )}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "schools" | "branches")}
      >
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto">
          <TabsTrigger
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 gap-2"
            value="schools"
          >
            <Building2 className="w-4 h-4" />
            Schools
          </TabsTrigger>
          <TabsTrigger
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 gap-2"
            value="branches"
          >
            <Building className="w-4 h-4" />
            Branches
            {selectedSchool && (
              <span className="ml-1 text-xs text-muted-foreground">
                ({selectedSchool.name})
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent className="mt-6" value="schools">
          <SchoolsTable
            loading={schoolsLoading}
            schools={schools}
            selectedSchoolId={selectedSchool?.id}
            onSelectSchool={handleSelectSchool}
          />
        </TabsContent>

        <TabsContent className="mt-6" value="branches">
          {selectedSchool ? (
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
                <Building2 className="w-5 h-5 text-primary" />
                <span className="font-medium">Branches for:</span>
                <span className="text-primary">{selectedSchool.name}</span>
                <Button
                  className="ml-auto"
                  size="sm"
                  variant="ghost"
                  onClick={() => setActiveTab("schools")}
                >
                  Change School
                </Button>
              </div>
              <BranchesTable branches={branches} loading={branchesLoading} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No School Selected</h3>
              <p className="text-muted-foreground mb-4">
                Please select a school first to view or add branches.
              </p>
              <Button variant="outline" onClick={() => setActiveTab("schools")}>
                Go to Schools
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create School Modal */}
      <Dialog open={isSchoolModalOpen} onOpenChange={setIsSchoolModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New School</DialogTitle>
          </DialogHeader>
          <SchoolForm
            isLoading={creatingSchool}
            onCancel={() => setIsSchoolModalOpen(false)}
            onSubmit={handleCreateSchool}
          />
        </DialogContent>
      </Dialog>

      {/* Create Branch Modal */}
      <Dialog open={isBranchModalOpen} onOpenChange={setIsBranchModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create New Branch</DialogTitle>
          </DialogHeader>
          {selectedSchool && (
            <BranchForm
              isLoading={creatingBranch}
              schoolId={selectedSchool.id}
              onCancel={() => setIsBranchModalOpen(false)}
              onSubmit={handleCreateBranch}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
