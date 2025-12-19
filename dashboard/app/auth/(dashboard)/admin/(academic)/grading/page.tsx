"use client";

import { useState } from "react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { title } from "@/components/primitives";
import { useLanguage } from "@/contexts/language-context";
import { GradingStats } from "@/components/grading/grading-stats";
import { GradeEntry } from "@/components/grading/grade-entry";
import { ReportCards } from "@/components/grading/report-cards";

// Mock Stats
const MOCK_STATS = {
  averageGpa: 3.2,
  passRate: 92,
  topPerformers: 15,
  totalAssessments: 45,
};

export default function GradingPage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"entry" | "reports">("entry");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h1 className={title()}>{t("grading_management")}</h1>
          <p className="mt-2 text-muted-foreground">{t("manage_grading")}</p>
        </div>
      </div>

      <GradingStats stats={MOCK_STATS} />

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "entry" | "reports")}
      >
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto">
          <TabsTrigger
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
            value="entry"
          >
            {t("grade_entry")}
          </TabsTrigger>
          <TabsTrigger
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
            value="reports"
          >
            {t("report_cards")}
          </TabsTrigger>
        </TabsList>
        <TabsContent className="mt-4" value="entry">
          <GradeEntry />
        </TabsContent>
        <TabsContent className="mt-4" value="reports">
          <ReportCards />
        </TabsContent>
      </Tabs>
    </div>
  );
}
