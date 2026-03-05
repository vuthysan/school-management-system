"use client";

import { useState } from "react";
import { ClipboardList } from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/language-context";
import { PageHeader } from "@/components/dashboard/page-header";
import { GradingStats } from "@/components/grading/grading-stats";
import { GradeEntry } from "@/components/grading/grade-entry";
import { ReportCards } from "@/components/grading/report-cards";

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
		<div className="space-y-6 pb-10">
			<PageHeader
				title={t("grading_management")}
				subtitle={t("manage_grading")}
				icon={ClipboardList}
			/>

			<GradingStats stats={MOCK_STATS} />

			<Tabs
				value={activeTab}
				onValueChange={(v) => setActiveTab(v as "entry" | "reports")}
			>
				<TabsList>
					<TabsTrigger value="entry">
						{t("grade_entry")}
					</TabsTrigger>
					<TabsTrigger value="reports">
						{t("report_cards")}
					</TabsTrigger>
				</TabsList>
				<TabsContent value="entry">
					<GradeEntry />
				</TabsContent>
				<TabsContent value="reports">
					<ReportCards />
				</TabsContent>
			</Tabs>
		</div>
	);
}
