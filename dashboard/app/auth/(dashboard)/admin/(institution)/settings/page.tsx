"use client";

import { useState } from "react";
import { Plus, Settings2, Building2, Building } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

import { useLanguage } from "@/contexts/language-context";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { useSchools, useCreateSchool } from "@/hooks/useSchools";
import { useBranches, useCreateBranch } from "@/hooks/useBranches";
import { SchoolsTable } from "@/components/settings/schools-table";
import { BranchesTable } from "@/components/settings/branches-table";
import { SchoolForm } from "@/components/settings/school-form";
import { BranchForm } from "@/components/settings/branch-form";
import { School, SchoolFormData, CreateSchoolInput } from "@/types/school";
import { BranchFormData, CreateBranchInput } from "@/types/branch";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<"schools" | "branches">("schools");
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  const [isBranchModalOpen, setIsBranchModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

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
  } = useBranches(selectedSchool?.idStr);
  const { createBranch, loading: creatingBranch } = useCreateBranch();

  const getLocalizedName = (name: { en: string; km: string } | string): string => {
    if (typeof name === "string") return name;
    return language === "km" ? (name.km || name.en) : (name.en || name.km);
  };

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6 pb-10"
    >
      <PageHeader
        title={t("school_settings")}
        subtitle={t("manage_schools_branches")}
        icon={Settings2}
      >
        {activeTab === "schools" && (
          <Button onClick={() => setIsSchoolModalOpen(true)} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            {t("add_school")}
          </Button>
        )}
        {activeTab === "branches" && selectedSchool && (
          <Button onClick={() => setIsBranchModalOpen(true)} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            {t("add_branch")}
          </Button>
        )}
      </PageHeader>

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "schools" | "branches")}
      >
        <TabsList>
          <TabsTrigger value="schools">
            <Building2 className="w-4 h-4" />
            {t("schools")}
          </TabsTrigger>
          <TabsTrigger value="branches">
            <Building className="w-4 h-4" />
            {t("branches")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="schools">
          <SchoolsTable
            loading={schoolsLoading}
            schools={schools}
            selectedSchoolId={selectedSchool?.idStr}
            onSelectSchool={handleSelectSchool}
          />
        </TabsContent>

        <TabsContent value="branches">
          {selectedSchool ? (
            <div className="space-y-4">
              <div className="liquid-glass-card flex items-center gap-3 px-4 py-3">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {getLocalizedName(selectedSchool.name)}
                  </p>
                  <p className="text-xs text-muted-foreground">{t("branches")}</p>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setActiveTab("schools")}
                >
                  {t("change")}
                </Button>
              </div>
              <BranchesTable branches={branches} loading={branchesLoading} />
            </div>
          ) : (
            <div className="liquid-glass-card flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-muted/80 flex items-center justify-center mb-4">
                <Building2 className="h-7 w-7 text-muted-foreground/60" />
              </div>
              <h3 className="text-sm font-semibold mb-1">{t("no_school_selected_title")}</h3>
              <p className="text-xs text-muted-foreground mb-4 max-w-xs">
                {t("no_school_selected_desc")}
              </p>
              <Button variant="outline" size="sm" onClick={() => setActiveTab("schools")}>
                {t("go_to_schools")}
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Create School Modal */}
      <Dialog open={isSchoolModalOpen} onOpenChange={setIsSchoolModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("add_school")}</DialogTitle>
            <DialogDescription>{t("fill_form_details")}</DialogDescription>
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
            <DialogTitle>{t("add_branch")}</DialogTitle>
            <DialogDescription>{t("fill_form_details")}</DialogDescription>
          </DialogHeader>
          {selectedSchool && (
            <BranchForm
              isLoading={creatingBranch}
              schoolId={selectedSchool.idStr}
              onCancel={() => setIsBranchModalOpen(false)}
              onSubmit={handleCreateBranch}
            />
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
