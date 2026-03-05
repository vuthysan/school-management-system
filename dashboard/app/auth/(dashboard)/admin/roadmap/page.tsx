"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
	Map,
	Package,
	Users,
	Bell,
	UserCheck,
	GraduationCap,
	BarChart3,
	FileText,
	Award,
	Send,
	Building2,
	ClipboardList,
	DollarSign,
	BookOpen,
	ArrowRightLeft,
	BadgeCheck,
	Wrench,
	AlertTriangle,
	Check,
	Circle,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────

interface ChecklistItem {
	label: string;
	done: boolean;
}

interface Feature {
	id: string;
	titleKey: string;
	progress: number;
	icon: LucideIcon;
	checklist: ChecklistItem[];
}

interface Phase {
	id: string;
	titleKey: string;
	descKey: string;
	progress: number;
	status: "in_progress" | "not_started";
	color: string;
	bg: string;
	features: Feature[];
}

interface TechDebtItem {
	id: number;
	title: string;
	severity: "HIGH" | "MEDIUM";
}

// ── Roadmap data ──────────────────────────────────────────────

const phases: Phase[] = [
	{
		id: "phase_1",
		titleKey: "roadmap_phase_1",
		descKey: "roadmap_phase_1_desc",
		progress: 40,
		status: "in_progress",
		color: "text-blue-600 dark:text-blue-400",
		bg: "bg-blue-500",
		features: [
			{
				id: "1.1",
				titleKey: "roadmap_inventory",
				progress: 70,
				icon: Package,
				checklist: [
					{ label: "TypeScript types", done: true },
					{ label: "GraphQL queries/mutations", done: true },
					{ label: "useInventory hook", done: true },
					{ label: "Page route", done: true },
					{ label: "InventoryTable with filters", done: false },
					{ label: "InventoryForm (add/edit)", done: false },
					{ label: "InventoryStats", done: false },
					{ label: "Wire to real hooks", done: false },
				],
			},
			{
				id: "1.2",
				titleKey: "roadmap_hr_payroll",
				progress: 35,
				icon: Users,
				checklist: [
					{ label: "Staff CRUD", done: true },
					{ label: "Basic payroll record", done: true },
					{ label: "Salary storage & display", done: true },
					{ label: "Stats cards & tabs UI", done: true },
					{ label: "Leave request form & approval", done: false },
					{ label: "Leave balance tracking", done: false },
					{ label: "Payroll batch processing", done: false },
					{ label: "Payslip detail view", done: false },
					{ label: "Staff attendance calendar", done: false },
				],
			},
			{
				id: "1.3",
				titleKey: "roadmap_notifications",
				progress: 20,
				icon: Bell,
				checklist: [
					{ label: "myNotifications query", done: true },
					{ label: "notificationsByStudent query", done: true },
					{ label: "markNotificationAsRead", done: true },
					{ label: "createNotification mutation", done: false },
					{ label: "markAllAsRead mutation", done: false },
					{ label: "Bell icon with unread count", done: false },
					{ label: "Notification dropdown", done: false },
					{ label: "Notification preferences", done: false },
				],
			},
			{
				id: "1.4",
				titleKey: "roadmap_parent_portal",
				progress: 27,
				icon: UserCheck,
				checklist: [
					{ label: "Children listing page", done: true },
					{ label: "useParentChildren hook", done: true },
					{ label: "myChildren backend query", done: true },
					{ label: "Attendance calendar view", done: false },
					{ label: "Fee status & payment history", done: false },
					{ label: "Events & exam schedule", done: false },
					{ label: "Announcements feed", done: false },
					{ label: "Child's timetable view", done: false },
				],
			},
			{
				id: "1.5",
				titleKey: "roadmap_student_portal",
				progress: 12,
				icon: GraduationCap,
				checklist: [
					{ label: "Stub page exists", done: true },
					{ label: "My timetable view", done: false },
					{ label: "My attendance summary", done: false },
					{ label: "My grades with comparison chart", done: false },
					{ label: "Upcoming exams & deadlines", done: false },
					{ label: "Class announcements", done: false },
					{ label: "Student-specific backend queries", done: false },
				],
			},
			{
				id: "1.6",
				titleKey: "roadmap_analytics",
				progress: 75,
				icon: BarChart3,
				checklist: [
					{ label: "Performance analytics query", done: true },
					{ label: "Attendance analytics query", done: true },
					{ label: "Student progress query", done: true },
					{ label: "Stats cards & 4 charts", done: true },
					{ label: "Academic year & semester selectors", done: true },
					{ label: "useAnalytics hook", done: true },
					{ label: "Enrollment trends query", done: false },
					{ label: "Fee collection rate query", done: false },
					{ label: "Dashboard selector", done: false },
					{ label: "Export chart as PNG/CSV", done: false },
				],
			},
		],
	},
	{
		id: "phase_2",
		titleKey: "roadmap_phase_2",
		descKey: "roadmap_phase_2_desc",
		progress: 7,
		status: "not_started",
		color: "text-violet-600 dark:text-violet-400",
		bg: "bg-violet-500",
		features: [
			{
				id: "2.1",
				titleKey: "roadmap_pdf_infra",
				progress: 0,
				icon: FileText,
				checklist: [
					{ label: "PDF generation service (Rust)", done: false },
					{ label: "Export endpoint", done: false },
					{ label: "School branding template", done: false },
					{ label: "Bilingual layout", done: false },
					{ label: "Buddhist Era year headers", done: false },
				],
			},
			{
				id: "2.2",
				titleKey: "roadmap_report_cards",
				progress: 50,
				icon: FileText,
				checklist: [
					{ label: "Backend reportCard query", done: true },
					{ label: "report-card-view.tsx component", done: true },
					{ label: "MoEYS grading scale", done: true },
					{ label: "Buddhist Era year display", done: true },
					{ label: "PDF export/download", done: false },
				],
			},
			{
				id: "2.3",
				titleKey: "roadmap_transcripts",
				progress: 0,
				icon: FileText,
				checklist: [
					{ label: "Multi-year layout", done: false },
					{ label: "Per-semester grade breakdown", done: false },
					{ label: "Cumulative GPA", done: false },
					{ label: "Official letterhead", done: false },
				],
			},
			{
				id: "2.4",
				titleKey: "roadmap_receipts",
				progress: 0,
				icon: DollarSign,
				checklist: [
					{ label: "Receipt template", done: false },
					{ label: "Fee breakdown display", done: false },
					{ label: "Payment method tracking", done: false },
					{ label: "School stamp area", done: false },
				],
			},
			{
				id: "2.5",
				titleKey: "roadmap_attendance_reports",
				progress: 0,
				icon: ClipboardList,
				checklist: [
					{ label: "Monthly student summary", done: false },
					{ label: "Class-level summary", done: false },
					{ label: "Grade-level summary", done: false },
					{ label: "Excel export for MoEYS", done: false },
				],
			},
			{
				id: "2.6",
				titleKey: "roadmap_class_lists",
				progress: 0,
				icon: ClipboardList,
				checklist: [
					{ label: "Student roster with photos", done: false },
					{ label: "Parent contact column", done: false },
					{ label: "Emergency contact column", done: false },
					{ label: "Excel & PDF export", done: false },
				],
			},
			{
				id: "2.7",
				titleKey: "roadmap_certificates",
				progress: 0,
				icon: Award,
				checklist: [
					{ label: "Completion certificate", done: false },
					{ label: "Award certificate", done: false },
					{ label: "Recommendation letter", done: false },
					{ label: "Transfer certificate", done: false },
				],
			},
		],
	},
	{
		id: "phase_3",
		titleKey: "roadmap_phase_3",
		descKey: "roadmap_phase_3_desc",
		progress: 15,
		status: "not_started",
		color: "text-emerald-600 dark:text-emerald-400",
		bg: "bg-emerald-500",
		features: [
			{
				id: "3.1",
				titleKey: "roadmap_telegram",
				progress: 0,
				icon: Send,
				checklist: [
					{ label: "Telegram bot module", done: false },
					{ label: "School bot token settings", done: false },
					{ label: "Parent linking (6-digit code)", done: false },
					{ label: "Message queue & rate limiting", done: false },
					{ label: "Bilingual message templates", done: false },
					{ label: "Two-way messaging", done: false },
					{ label: "Teacher inbox UI", done: false },
					{ label: "Admin broadcast messaging", done: false },
					{ label: "Notification log", done: false },
				],
			},
			{
				id: "3.2",
				titleKey: "roadmap_moeys_reporting",
				progress: 30,
				icon: Building2,
				checklist: [
					{ label: "MoEYS grading format", done: true },
					{ label: "MoEYS school ID field", done: true },
					{ label: "Buddhist Era date formatting", done: true },
					{ label: "School statistics report", done: false },
					{ label: "Attendance summary report", done: false },
					{ label: "Infrastructure report", done: false },
					{ label: "Financial report", done: false },
					{ label: "Excel export (.xlsx)", done: false },
				],
			},
		],
	},
	{
		id: "phase_4",
		titleKey: "roadmap_phase_4",
		descKey: "roadmap_phase_4_desc",
		progress: 3,
		status: "not_started",
		color: "text-amber-600 dark:text-amber-400",
		bg: "bg-amber-500",
		features: [
			{
				id: "4.1",
				titleKey: "roadmap_enrollment",
				progress: 15,
				icon: ClipboardList,
				checklist: [
					{ label: "EnrollmentType enum", done: true },
					{ label: "EnrollmentInfo struct", done: true },
					{ label: "StudentStatus states", done: true },
					{ label: "Application model", done: false },
					{ label: "Entrance test model", done: false },
					{ label: "Application form (public)", done: false },
					{ label: "Admin review dashboard", done: false },
					{ label: "Status tracking", done: false },
				],
			},
			{
				id: "4.2",
				titleKey: "roadmap_scholarships",
				progress: 0,
				icon: DollarSign,
				checklist: [
					{ label: "Scholarship model", done: false },
					{ label: "StudentScholarship model", done: false },
					{ label: "Auto-apply discounts", done: false },
					{ label: "Management UI", done: false },
				],
			},
			{
				id: "4.3",
				titleKey: "roadmap_discipline",
				progress: 0,
				icon: AlertTriangle,
				checklist: [
					{ label: "Incident model", done: false },
					{ label: "Incident log per student", done: false },
					{ label: "Pattern detection", done: false },
					{ label: "Auto-notify parents", done: false },
				],
			},
			{
				id: "4.4",
				titleKey: "roadmap_lesson_plans",
				progress: 0,
				icon: BookOpen,
				checklist: [
					{ label: "LessonPlan model", done: false },
					{ label: "Weekly plan entry", done: false },
					{ label: "Head teacher review", done: false },
					{ label: "Curriculum alignment", done: false },
				],
			},
			{
				id: "4.5",
				titleKey: "roadmap_transfers",
				progress: 0,
				icon: ArrowRightLeft,
				checklist: [
					{ label: "TransferRequest model", done: false },
					{ label: "Transfer certificate generation", done: false },
					{ label: "Academic records transfer", done: false },
					{ label: "Target school receiving", done: false },
				],
			},
			{
				id: "4.6",
				titleKey: "roadmap_school_certs",
				progress: 0,
				icon: BadgeCheck,
				checklist: [
					{ label: "Template selection", done: false },
					{ label: "Student info + achievement", done: false },
					{ label: "School branding + Buddhist Era", done: false },
					{ label: "PDF generation + tracking", done: false },
				],
			},
		],
	},
];

const techDebt: TechDebtItem[] = [
	{ id: 1, title: "Standardize ID types (ObjectId vs String mix)", severity: "HIGH" },
	{ id: 2, title: "Standardize DateTime handling (ISO 8601)", severity: "MEDIUM" },
	{ id: 3, title: "Standardize Status fields (5+ enum variants)", severity: "MEDIUM" },
	{ id: 4, title: "Add input validation on GraphQL inputs", severity: "HIGH" },
	{ id: 5, title: "Enforce permissions on all resolvers", severity: "MEDIUM" },
	{ id: 6, title: "Standardize error handling with error codes", severity: "HIGH" },
];

// ── Helpers ────────────────────────────────────────────────────

function getStatusVariant(progress: number): "success" | "warning" | "secondary" {
	if (progress > 60) return "success";
	if (progress >= 20) return "warning";
	return "secondary";
}

function getProgressColor(progress: number): string {
	if (progress > 60) return "[&>div]:bg-emerald-500";
	if (progress >= 20) return "[&>div]:bg-amber-500";
	return "[&>div]:bg-muted-foreground/40";
}

// ── Overall progress ──────────────────────────────────────────

const overallProgress = 20;

// ── Component ──────────────────────────────────────────────────

export default function RoadmapPage() {
	const { t } = useTranslation();
	const [activePhase, setActivePhase] = useState("phase_1");

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="space-y-6 pb-10"
		>
			<PageHeader
				title={t("development_roadmap")}
				subtitle={t("roadmap_subtitle")}
				icon={Map}
			>
				<Badge variant="outline" className="text-sm font-semibold gap-1.5">
					{t("overall_progress")}: {overallProgress}%
				</Badge>
			</PageHeader>

			{/* Phase overview cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
				{phases.map((phase, i) => (
					<motion.div
						key={phase.id}
						initial={{ opacity: 0, y: 14 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: i * 0.08 }}
					>
						<button
							onClick={() => setActivePhase(phase.id)}
							className={cn(
								"liquid-glass-card p-4 w-full text-left transition-all duration-200 cursor-pointer",
								activePhase === phase.id && "ring-2 ring-primary/30",
							)}
						>
							<div className="flex items-center gap-2 mb-2">
								<span className={cn("w-2 h-2 rounded-full", phase.bg)} />
								<span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
									{t(phase.titleKey)}
								</span>
							</div>
							<p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-2">
								{t(phase.descKey)}
							</p>
							<div className="flex items-center gap-3">
								<Progress
									value={phase.progress}
									className={cn("flex-1 h-2", getProgressColor(phase.progress))}
								/>
								<span className="text-sm font-bold tabular-nums text-foreground">
									{phase.progress}%
								</span>
							</div>
							<div className="mt-2">
								<Badge
									variant={phase.status === "in_progress" ? "info" : "secondary"}
									className="text-xs"
								>
									{phase.status === "in_progress" ? t("in_progress") : t("not_started")}
								</Badge>
							</div>
						</button>
					</motion.div>
				))}
			</div>

			{/* Phase details with tabs */}
			<Tabs value={activePhase} onValueChange={setActivePhase}>
				<TabsList className="mb-4">
					{phases.map((phase) => (
						<TabsTrigger key={phase.id} value={phase.id} className="text-xs sm:text-sm">
							{t(phase.titleKey)}
						</TabsTrigger>
					))}
				</TabsList>

				{phases.map((phase) => (
					<TabsContent key={phase.id} value={phase.id}>
						<AnimatePresence mode="wait">
							<motion.div
								key={phase.id}
								initial={{ opacity: 0, y: 12 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -8 }}
								transition={{ duration: 0.25 }}
								className="grid gap-4 sm:grid-cols-2"
							>
								{phase.features.map((feature, i) => {
									const Icon = feature.icon;
									const done = feature.checklist.filter((c) => c.done).length;
									const total = feature.checklist.length;

									return (
										<motion.div
											key={feature.id}
											initial={{ opacity: 0, y: 14 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{
												duration: 0.3,
												delay: i * 0.06,
												ease: [0.25, 0.46, 0.45, 0.94],
											}}
										>
											<div className="liquid-glass-card p-4 h-full">
												{/* Header */}
												<div className="flex items-start justify-between gap-2 mb-3">
													<div className="flex items-center gap-2.5">
														<div className={cn(
															"w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
															"bg-primary/10 border border-primary/15 text-primary",
														)}>
															<Icon className="w-4 h-4" strokeWidth={1.8} />
														</div>
														<div>
															<h3 className="text-sm font-semibold text-foreground leading-tight">
																{feature.id} {t(feature.titleKey)}
															</h3>
															<p className="text-xs text-muted-foreground mt-0.5">
																{done}/{total} {t("completed").toLowerCase()}
															</p>
														</div>
													</div>
													<Badge variant={getStatusVariant(feature.progress)} className="text-xs tabular-nums shrink-0">
														{feature.progress}%
													</Badge>
												</div>

												{/* Progress bar */}
												<Progress
													value={feature.progress}
													className={cn("h-1.5 mb-3", getProgressColor(feature.progress))}
												/>

												{/* Checklist */}
												<ul className="space-y-1.5">
													{feature.checklist.map((item, j) => (
														<li key={j} className="flex items-start gap-2 text-xs">
															{item.done ? (
																<Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
															) : (
																<Circle className="w-3.5 h-3.5 text-muted-foreground/40 shrink-0 mt-0.5" />
															)}
															<span className={cn(
																"leading-relaxed",
																item.done
																	? "text-muted-foreground line-through"
																	: "text-foreground",
															)}>
																{item.label}
															</span>
														</li>
													))}
												</ul>
											</div>
										</motion.div>
									);
								})}
							</motion.div>
						</AnimatePresence>
					</TabsContent>
				))}
			</Tabs>

			{/* Technical Debt section */}
			<div className="space-y-3">
				<div className="flex items-center gap-2">
					<Wrench className="w-4 h-4 text-muted-foreground" />
					<h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
						{t("technical_debt")}
					</h2>
				</div>
				<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{techDebt.map((item, i) => (
						<motion.div
							key={item.id}
							initial={{ opacity: 0, y: 14 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3, delay: i * 0.05 }}
						>
							<div className="liquid-glass-card p-4 flex items-start gap-3">
								<div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
									{item.id}
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm text-foreground leading-relaxed">
										{item.title}
									</p>
									<Badge
										variant={item.severity === "HIGH" ? "destructive" : "warning"}
										className="text-xs mt-2"
									>
										{item.severity}
									</Badge>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</motion.div>
	);
}
