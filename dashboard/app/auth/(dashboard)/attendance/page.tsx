"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { title } from "@/components/primitives";
import { useLanguage } from "@/contexts/language-context";
import { AttendanceStats } from "@/components/attendance/attendance-stats";
import { MarkAttendance } from "@/components/attendance/mark-attendance";
import { AttendanceHistory } from "@/components/attendance/attendance-history";

// Mock Stats
const MOCK_STATS = {
  attendanceRate: 95,
  totalPresent: 450,
  totalAbsent: 15,
  totalLate: 10,
  totalExcused: 5,
};

export default function AttendancePage() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"mark" | "history">("mark");

  const handleSaveAttendance = (data: any) => {
    console.log("Attendance saved:", data);
    // Here you would typically update the stats and history
    alert("Attendance marked successfully!");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h1 className={title()}>{t("attendance_management")}</h1>
          <p className="mt-2 text-muted-foreground">
            {t("track_attendance")}
          </p>
        </div>
      </div>

      <AttendanceStats stats={MOCK_STATS} />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "mark" | "history")}>
        <TabsList className="w-full justify-start border-b rounded-none bg-transparent p-0 h-auto">
          <TabsTrigger 
            value="mark" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
          >
            {t("mark_attendance")}
          </TabsTrigger>
          <TabsTrigger 
            value="history"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3"
          >
            {t("attendance_history")}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="mark" className="mt-4">
          <MarkAttendance onSave={handleSaveAttendance} />
        </TabsContent>
        <TabsContent value="history" className="mt-4">
          <AttendanceHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
