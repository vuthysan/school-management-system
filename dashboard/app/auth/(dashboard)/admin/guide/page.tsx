"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
	Compass,
	CalendarDays,
	Layers,
	BookOpen,
	DoorOpen,
	Users,
	GraduationCap,
	DollarSign,
	Bus,
	ClipboardCheck,
	ArrowRight,
	Building2,
	UserCog,
	FileText,
	Calendar,
	BarChart3,
	Crown,
	Shield,
	MessageSquare,
	Library,
	Check,
} from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

// ── Types ──────────────────────────────────────────────────────

type RoleId = "owner" | "admin" | "teacher" | "parent" | "student";

interface RoleCard {
	id: RoleId;
	labelKey: string;
	descKey: string;
	icon: LucideIcon;
	color: string;
	bg: string;
	ring: string;
}

interface SetupStep {
	titleKey: string;
	descKey: string;
	icon: LucideIcon;
	href: string;
	section: string;
}

interface SectionMeta {
	labelKey: string;
	color: string;
	dot: string;
}

// ── Role definitions ───────────────────────────────────────────

const roles: RoleCard[] = [
	{
		id: "owner",
		labelKey: "guide_role_owner",
		descKey: "guide_role_owner_desc",
		icon: Crown,
		color: "text-amber-600 dark:text-amber-400",
		bg: "bg-amber-50 dark:bg-amber-950/40",
		ring: "ring-amber-500/30",
	},
	{
		id: "admin",
		labelKey: "guide_role_admin",
		descKey: "guide_role_admin_desc",
		icon: Shield,
		color: "text-blue-600 dark:text-blue-400",
		bg: "bg-blue-50 dark:bg-blue-950/40",
		ring: "ring-blue-500/30",
	},
	{
		id: "teacher",
		labelKey: "guide_role_teacher",
		descKey: "guide_role_teacher_desc",
		icon: BookOpen,
		color: "text-violet-600 dark:text-violet-400",
		bg: "bg-violet-50 dark:bg-violet-950/40",
		ring: "ring-violet-500/30",
	},
	{
		id: "parent",
		labelKey: "guide_role_parent",
		descKey: "guide_role_parent_desc",
		icon: Users,
		color: "text-emerald-600 dark:text-emerald-400",
		bg: "bg-emerald-50 dark:bg-emerald-950/40",
		ring: "ring-emerald-500/30",
	},
	{
		id: "student",
		labelKey: "guide_role_student",
		descKey: "guide_role_student_desc",
		icon: GraduationCap,
		color: "text-rose-600 dark:text-rose-400",
		bg: "bg-rose-50 dark:bg-rose-950/40",
		ring: "ring-rose-500/30",
	},
];

// ── Section metadata ───────────────────────────────────────────

const sectionsMeta: Record<string, SectionMeta> = {
	foundation: {
		labelKey: "guide_foundation",
		color: "text-blue-600 dark:text-blue-400",
		dot: "bg-blue-500",
	},
	structure: {
		labelKey: "guide_structure",
		color: "text-violet-600 dark:text-violet-400",
		dot: "bg-violet-500",
	},
	operations: {
		labelKey: "guide_operations",
		color: "text-emerald-600 dark:text-emerald-400",
		dot: "bg-emerald-500",
	},
	teaching: {
		labelKey: "guide_teaching",
		color: "text-violet-600 dark:text-violet-400",
		dot: "bg-violet-500",
	},
	classroom: {
		labelKey: "guide_classroom",
		color: "text-emerald-600 dark:text-emerald-400",
		dot: "bg-emerald-500",
	},
	family: {
		labelKey: "guide_family",
		color: "text-emerald-600 dark:text-emerald-400",
		dot: "bg-emerald-500",
	},
	learning: {
		labelKey: "guide_learning",
		color: "text-rose-600 dark:text-rose-400",
		dot: "bg-rose-500",
	},
	staying_connected: {
		labelKey: "guide_staying_connected",
		color: "text-blue-600 dark:text-blue-400",
		dot: "bg-blue-500",
	},
};

// ── Steps per role ─────────────────────────────────────────────

const stepsByRole: Record<RoleId, SetupStep[]> = {
	owner: [
		{ titleKey: "step_owner_1_title", descKey: "step_owner_1_desc", icon: Building2, href: "/auth/admin/settings", section: "foundation" },
		{ titleKey: "step_owner_2_title", descKey: "step_owner_2_desc", icon: CalendarDays, href: "/auth/admin/setup", section: "foundation" },
		{ titleKey: "step_owner_3_title", descKey: "step_owner_3_desc", icon: Layers, href: "/auth/admin/academic", section: "structure" },
		{ titleKey: "step_owner_4_title", descKey: "step_owner_4_desc", icon: BookOpen, href: "/auth/admin/academic", section: "structure" },
		{ titleKey: "step_owner_5_title", descKey: "step_owner_5_desc", icon: DoorOpen, href: "/auth/admin/rooms", section: "structure" },
		{ titleKey: "step_owner_6_title", descKey: "step_owner_6_desc", icon: Users, href: "/auth/admin/members", section: "structure" },
		{ titleKey: "step_owner_7_title", descKey: "step_owner_7_desc", icon: GraduationCap, href: "/auth/admin/students", section: "operations" },
		{ titleKey: "step_owner_8_title", descKey: "step_owner_8_desc", icon: DollarSign, href: "/auth/admin/finance", section: "operations" },
		{ titleKey: "step_owner_9_title", descKey: "step_owner_9_desc", icon: Bus, href: "/auth/admin/library", section: "operations" },
		{ titleKey: "step_owner_10_title", descKey: "step_owner_10_desc", icon: ClipboardCheck, href: "/auth/admin/attendance", section: "operations" },
	],
	admin: [
		{ titleKey: "step_admin_1_title", descKey: "step_admin_1_desc", icon: CalendarDays, href: "/auth/admin/setup", section: "foundation" },
		{ titleKey: "step_admin_2_title", descKey: "step_admin_2_desc", icon: Layers, href: "/auth/admin/academic", section: "foundation" },
		{ titleKey: "step_admin_3_title", descKey: "step_admin_3_desc", icon: Users, href: "/auth/admin/members", section: "structure" },
		{ titleKey: "step_admin_4_title", descKey: "step_admin_4_desc", icon: GraduationCap, href: "/auth/admin/students", section: "structure" },
		{ titleKey: "step_admin_5_title", descKey: "step_admin_5_desc", icon: DollarSign, href: "/auth/admin/finance", section: "operations" },
		{ titleKey: "step_admin_6_title", descKey: "step_admin_6_desc", icon: ClipboardCheck, href: "/auth/admin/attendance", section: "operations" },
		{ titleKey: "step_admin_7_title", descKey: "step_admin_7_desc", icon: BarChart3, href: "/auth/admin/analytics", section: "operations" },
	],
	teacher: [
		{ titleKey: "step_teacher_1_title", descKey: "step_teacher_1_desc", icon: BookOpen, href: "/auth/admin/academic", section: "teaching" },
		{ titleKey: "step_teacher_2_title", descKey: "step_teacher_2_desc", icon: Calendar, href: "/auth/admin/academic", section: "teaching" },
		{ titleKey: "step_teacher_3_title", descKey: "step_teacher_3_desc", icon: ClipboardCheck, href: "/auth/admin/attendance", section: "classroom" },
		{ titleKey: "step_teacher_4_title", descKey: "step_teacher_4_desc", icon: FileText, href: "/auth/admin/grading", section: "classroom" },
		{ titleKey: "step_teacher_5_title", descKey: "step_teacher_5_desc", icon: MessageSquare, href: "/auth/admin/communication", section: "classroom" },
	],
	parent: [
		{ titleKey: "step_parent_1_title", descKey: "step_parent_1_desc", icon: Users, href: "/auth/parent/children", section: "family" },
		{ titleKey: "step_parent_2_title", descKey: "step_parent_2_desc", icon: ClipboardCheck, href: "/auth/parent/children", section: "family" },
		{ titleKey: "step_parent_3_title", descKey: "step_parent_3_desc", icon: FileText, href: "/auth/parent/children", section: "family" },
		{ titleKey: "step_parent_4_title", descKey: "step_parent_4_desc", icon: DollarSign, href: "/auth/parent/children", section: "staying_connected" },
		{ titleKey: "step_parent_5_title", descKey: "step_parent_5_desc", icon: MessageSquare, href: "/auth/parent/children", section: "staying_connected" },
	],
	student: [
		{ titleKey: "step_student_1_title", descKey: "step_student_1_desc", icon: UserCog, href: "/auth/settings/profile", section: "learning" },
		{ titleKey: "step_student_2_title", descKey: "step_student_2_desc", icon: Calendar, href: "/auth/student/academic", section: "learning" },
		{ titleKey: "step_student_3_title", descKey: "step_student_3_desc", icon: FileText, href: "/auth/student/academic", section: "learning" },
		{ titleKey: "step_student_4_title", descKey: "step_student_4_desc", icon: Library, href: "/auth/admin/library", section: "learning" },
	],
};

// ── Component ──────────────────────────────────────────────────

export default function GuidePage() {
	const { t } = useTranslation();
	const [selectedRole, setSelectedRole] = useState<RoleId>("owner");

	const steps = stepsByRole[selectedRole];
	const currentRole = roles.find((r) => r.id === selectedRole)!;

	// Group steps by section preserving order
	const sectionOrder: string[] = [];
	const grouped: Record<string, SetupStep[]> = {};
	for (const step of steps) {
		if (!grouped[step.section]) {
			grouped[step.section] = [];
			sectionOrder.push(step.section);
		}
		grouped[step.section].push(step);
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="space-y-6 pb-10"
		>
			<PageHeader
				title={t("getting_started")}
				subtitle={t("setup_guide_subtitle")}
				icon={Compass}
			/>

			{/* Role Selector — full width */}
			<div>
				<p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wider">
					{t("guide_select_role")}
				</p>
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
					{roles.map((role) => {
						const Icon = role.icon;
						const isActive = selectedRole === role.id;
						return (
							<motion.button
								key={role.id}
								whileTap={{ scale: 0.97 }}
								onClick={() => setSelectedRole(role.id)}
								className={cn(
									"liquid-glass-card p-4 text-left transition-all duration-200 cursor-pointer",
									isActive && `ring-2 ${role.ring}`,
								)}
							>
								<div
									className={cn(
										"w-9 h-9 rounded-lg flex items-center justify-center mb-2.5",
										role.bg,
										role.color,
									)}
								>
									<Icon className="w-4.5 h-4.5" strokeWidth={1.8} />
								</div>
								<p className="text-sm font-semibold text-foreground leading-tight">
									{t(role.labelKey)}
								</p>
								<p className="text-xs text-muted-foreground mt-1 leading-snug">
									{t(role.descKey)}
								</p>
								{isActive && (
									<div className={cn("mt-2.5 inline-flex items-center gap-1 text-xs font-medium", role.color)}>
										<Check className="w-3.5 h-3.5" />
										{t("selected")}
									</div>
								)}
							</motion.button>
						);
					})}
				</div>
			</div>

			{/* Steps — two-column on large screens */}
			<AnimatePresence mode="wait">
				<motion.div
					key={selectedRole}
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -8 }}
					transition={{ duration: 0.25 }}
					className="space-y-8"
				>
					{sectionOrder.map((sectionKey) => {
						const meta = sectionsMeta[sectionKey];
						const sectionSteps = grouped[sectionKey];
						if (!meta || !sectionSteps) return null;

						return (
							<div key={sectionKey} className="space-y-3">
								<span
									className={cn(
										"inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider",
										meta.color,
									)}
								>
									<span className={cn("w-1.5 h-1.5 rounded-full", meta.dot)} />
									{t(meta.labelKey)}
								</span>

								<div className="grid gap-3 sm:grid-cols-2">
									{sectionSteps.map((step, i) => {
										const Icon = step.icon;
										const stepNum = steps.indexOf(step) + 1;

										return (
											<motion.div
												key={step.titleKey}
												initial={{ opacity: 0, y: 14 }}
												animate={{ opacity: 1, y: 0 }}
												transition={{
													duration: 0.3,
													delay: i * 0.06,
													ease: [0.25, 0.46, 0.45, 0.94],
												}}
											>
												<div className="liquid-glass-card p-4 h-full flex gap-3">
													{/* Number badge */}
													<div className="flex flex-col items-center shrink-0">
														<div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
															{stepNum}
														</div>
													</div>

													{/* Content */}
													<div className="flex-1 min-w-0">
														<div className="flex items-start gap-2.5">
															<div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center text-primary shrink-0">
																<Icon className="w-4 h-4" strokeWidth={1.8} />
															</div>
															<div className="flex-1 min-w-0 pt-0.5">
																<h3 className="text-sm font-semibold text-foreground leading-tight">
																	{t(step.titleKey)}
																</h3>
																<p className="text-xs text-muted-foreground mt-1 leading-relaxed">
																	{t(step.descKey)}
																</p>
															</div>
														</div>
														<div className="mt-3">
															<Link href={step.href}>
																<Button
																	variant="outline"
																	size="sm"
																	className="gap-1.5 text-xs h-7"
																>
																	{t("go_to_module")}
																	<ArrowRight className="w-3 h-3" />
																</Button>
															</Link>
														</div>
													</div>
												</div>
											</motion.div>
										);
									})}
								</div>
							</div>
						);
					})}
				</motion.div>
			</AnimatePresence>
		</motion.div>
	);
}
