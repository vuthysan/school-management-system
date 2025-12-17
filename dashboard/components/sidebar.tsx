"use client";

import React, { useState } from "react";
import {
	LayoutDashboard,
	UserCog,
	Settings,
	LogOut,
	Users,
	BookOpen,
	Calendar,
	FileText,
	DollarSign,
	Library,
	Bus,
	Package,
	MessageSquare,
	Building,
	GraduationCap,
	ClipboardList,
	BarChart3,
	Bell,
	Home,
	School,
	UserCheck,
	Briefcase,
	Shield,
	ChevronDown,
	Check,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

import { useLanguage } from "@/contexts/language-context";
import {
	Sidebar as SidebarComponent,
	SidebarBody,
	SidebarLink,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";
import { useDashboard } from "@/hooks/useDashboard";
import { useBranches } from "@/hooks/useBranches";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Branch } from "@/types/branch";

// Define user roles
export type UserRole =
	| "ministry"
	| "owner"
	| "director"
	| "deputyDirector"
	| "admin"
	| "headTeacher"
	| "teacher"
	| "parent"
	| "student";

// Role configuration with colors and labels
const getRoleConfig = (
	t: (key: string) => string
): Record<
	UserRole,
	{
		label: string;
		color: string;
		icon: React.ComponentType<{ className?: string }>;
	}
> => ({
	ministry: {
		label: t("role_ministry"),
		color: "bg-purple-500",
		icon: Shield,
	},
	owner: {
		label: t("role_school_owner"),
		color: "bg-blue-500",
		icon: Briefcase,
	},
	director: {
		label: t("role_director"),
		color: "bg-cyan-500",
		icon: GraduationCap,
	},
	deputyDirector: {
		label: t("role_deputy_director"),
		color: "bg-teal-500",
		icon: GraduationCap,
	},
	admin: {
		label: t("role_admin"),
		color: "bg-green-500",
		icon: UserCog,
	},
	headTeacher: {
		label: t("role_head_teacher"),
		color: "bg-amber-500",
		icon: GraduationCap,
	},
	teacher: {
		label: t("role_teacher"),
		color: "bg-orange-500",
		icon: GraduationCap,
	},
	parent: {
		label: t("role_parent"),
		color: "bg-pink-500",
		icon: Users,
	},
	student: {
		label: t("role_student"),
		color: "bg-indigo-500",
		icon: School,
	},
});

// Menu items by role
const getMenuByRole = (
	t: (key: string) => string
): Record<
	UserRole,
	Array<{
		label: string;
		href: string;
		icon: React.ReactNode;
		badge?: string;
	}>
> => ({
	ministry: [
		{
			label: t("national_dashboard"),
			href: "/auth/ministry",
			icon: <LayoutDashboard className="h-5 w-5" />,
		},
		{
			label: t("schools"),
			href: "/auth/ministry/schools",
			icon: <Building className="h-5 w-5" />,
		},
		{
			label: t("analytics"),
			href: "/auth/ministry/analytics",
			icon: <BarChart3 className="h-5 w-5" />,
		},
		{
			label: t("compliance"),
			href: "/auth/ministry/compliance",
			icon: <ClipboardList className="h-5 w-5" />,
		},
		{
			label: t("reports"),
			href: "/auth/ministry/reports",
			icon: <FileText className="h-5 w-5" />,
		},
		{
			label: t("settings"),
			href: "/auth/ministry/settings",
			icon: <Settings className="h-5 w-5" />,
		},
	],
	owner: [
		{
			label: t("dashboard"),
			href: "/auth/",
			icon: <LayoutDashboard className="h-5 w-5" />,
		},
		{
			label: t("schools_branches"),
			href: "/auth/admin/branches",
			icon: <Building className="h-5 w-5" />,
		},
		{
			label: t("members"),
			href: "/auth/admin/members",
			icon: <Users className="h-5 w-5" />,
		},
		{
			label: t("financial_overview"),
			href: "/auth/finance",
			icon: <DollarSign className="h-5 w-5" />,
		},
		{
			label: t("hr_payroll"),
			href: "/auth/hr",
			icon: <UserCog className="h-5 w-5" />,
		},
		{
			label: t("analytics"),
			href: "/auth/analytics",
			icon: <BarChart3 className="h-5 w-5" />,
		},
		{
			label: t("reports"),
			href: "/auth/reports",
			icon: <FileText className="h-5 w-5" />,
		},
		{
			label: t("settings"),
			href: "/auth/settings",
			icon: <Settings className="h-5 w-5" />,
		},
	],
	// Director and Deputy Director - full school management
	director: [
		{
			label: t("dashboard"),
			href: "/auth/",
			icon: <LayoutDashboard className="h-5 w-5" />,
		},
		{
			label: t("students"),
			href: "/auth/admin/students",
			icon: <Users className="h-5 w-5" />,
		},
		{
			label: t("members"),
			href: "/auth/admin/members",
			icon: <UserCog className="h-5 w-5" />,
		},
		{
			label: t("teachers_staff"),
			href: "/auth/admin/hr",
			icon: <UserCog className="h-5 w-5" />,
		},
		{
			label: t("academic"),
			href: "/auth/admin/academic",
			icon: <BookOpen className="h-5 w-5" />,
		},
		{
			label: t("attendance"),
			href: "/auth/admin/attendance",
			icon: <Calendar className="h-5 w-5" />,
		},
		{
			label: t("grading"),
			href: "/auth/admin/grading",
			icon: <FileText className="h-5 w-5" />,
		},
		{
			label: t("finance"),
			href: "/auth/admin/finance",
			icon: <DollarSign className="h-5 w-5" />,
		},
		{
			label: t("reports"),
			href: "/auth/reports",
			icon: <BarChart3 className="h-5 w-5" />,
		},
		{
			label: t("settings"),
			href: "/auth/admin/settings",
			icon: <Settings className="h-5 w-5" />,
		},
	],
	deputyDirector: [
		{
			label: t("dashboard"),
			href: "/auth/",
			icon: <LayoutDashboard className="h-5 w-5" />,
		},
		{
			label: t("students"),
			href: "/auth/admin/students",
			icon: <Users className="h-5 w-5" />,
		},
		{
			label: t("members"),
			href: "/auth/admin/members",
			icon: <UserCog className="h-5 w-5" />,
		},
		{
			label: t("teachers_staff"),
			href: "/auth/admin/hr",
			icon: <UserCog className="h-5 w-5" />,
		},
		{
			label: t("academic"),
			href: "/auth/admin/academic",
			icon: <BookOpen className="h-5 w-5" />,
		},
		{
			label: t("attendance"),
			href: "/auth/admin/attendance",
			icon: <Calendar className="h-5 w-5" />,
		},
		{
			label: t("grading"),
			href: "/auth/admin/grading",
			icon: <FileText className="h-5 w-5" />,
		},
		{
			label: t("reports"),
			href: "/auth/reports",
			icon: <BarChart3 className="h-5 w-5" />,
		},
		{
			label: t("settings"),
			href: "/auth/admin/settings",
			icon: <Settings className="h-5 w-5" />,
		},
	],
	// HeadTeacher - academic focus
	headTeacher: [
		{
			label: t("dashboard"),
			href: "/auth/",
			icon: <LayoutDashboard className="h-5 w-5" />,
		},
		{
			label: t("my_classes"),
			href: "/auth/teacher/classes",
			icon: <BookOpen className="h-5 w-5" />,
		},
		{
			label: t("department_teachers"),
			href: "/auth/headteacher/teachers",
			icon: <Users className="h-5 w-5" />,
		},
		{
			label: t("attendance"),
			href: "/auth/admin/attendance",
			icon: <Calendar className="h-5 w-5" />,
		},
		{
			label: t("grading"),
			href: "/auth/admin/grading",
			icon: <FileText className="h-5 w-5" />,
		},
		{
			label: t("announcements"),
			href: "/auth/headteacher/announcements",
			icon: <Bell className="h-5 w-5" />,
		},
		{
			label: t("reports"),
			href: "/auth/reports",
			icon: <BarChart3 className="h-5 w-5" />,
		},
	],
	admin: [
		{
			label: t("dashboard"),
			href: "/auth/",
			icon: <LayoutDashboard className="h-5 w-5" />,
		},
		{
			label: t("students"),
			href: "/auth/admin/students",
			icon: <Users className="h-5 w-5" />,
		},
		{
			label: t("schools"),
			href: "/auth/admin/schools/pending",
			icon: <Building className="h-5 w-5" />,
		},
		{
			label: t("academic"),
			href: "/auth/admin/academic",
			icon: <BookOpen className="h-5 w-5" />,
		},
		{
			label: t("attendance"),
			href: "/auth/admin/attendance",
			icon: <Calendar className="h-5 w-5" />,
		},
		{
			label: t("grading"),
			href: "/auth/admin/grading",
			icon: <FileText className="h-5 w-5" />,
		},
		{
			label: t("finance"),
			href: "/auth/admin/finance",
			icon: <DollarSign className="h-5 w-5" />,
		},
		{
			label: t("hr"),
			href: "/auth/admin/hr",
			icon: <UserCog className="h-5 w-5" />,
		},
		{
			label: t("library"),
			href: "/auth/admin/library",
			icon: <Library className="h-5 w-5" />,
		},
		{
			label: t("transport"),
			href: "/auth/admin/transport",
			icon: <Bus className="h-5 w-5" />,
		},
		{
			label: t("inventory"),
			href: "/auth/admin/inventory",
			icon: <Package className="h-5 w-5" />,
		},
		{
			label: t("communication"),
			href: "/auth/admin/communication",
			icon: <MessageSquare className="h-5 w-5" />,
		},
		{
			label: t("settings"),
			href: "/auth/admin/settings",
			icon: <Settings className="h-5 w-5" />,
		},
	],
	teacher: [
		{
			label: t("dashboard"),
			href: "/auth/",
			icon: <Home className="h-5 w-5" />,
		},
		{
			label: t("my_classes"),
			href: "/auth/teacher/classes",
			icon: <BookOpen className="h-5 w-5" />,
		},
		{
			label: t("attendance"),
			href: "/auth/teacher/attendance",
			icon: <UserCheck className="h-5 w-5" />,
		},
		{
			label: t("grading"),
			href: "/auth/teacher/grading",
			icon: <FileText className="h-5 w-5" />,
		},
		{
			label: t("students"),
			href: "/auth/teacher/students",
			icon: <Users className="h-5 w-5" />,
		},
		{
			label: t("messages"),
			href: "/auth/teacher/messages",
			icon: <MessageSquare className="h-5 w-5" />,
			badge: "3",
		},
		{
			label: t("schedule"),
			href: "/auth/teacher/schedule",
			icon: <Calendar className="h-5 w-5" />,
		},
		{
			label: t("profile"),
			href: "/auth/teacher/profile",
			icon: <Settings className="h-5 w-5" />,
		},
	],
	parent: [
		{
			label: t("dashboard"),
			href: "/auth/",
			icon: <Home className="h-5 w-5" />,
		},
		{
			label: t("my_children"),
			href: "/auth/parent/children",
			icon: <Users className="h-5 w-5" />,
		},
		{
			label: t("grades_reports"),
			href: "/auth/parent/grades",
			icon: <FileText className="h-5 w-5" />,
		},
		{
			label: t("attendance"),
			href: "/auth/parent/attendance",
			icon: <Calendar className="h-5 w-5" />,
		},
		{
			label: t("fees_payments"),
			href: "/auth/parent/payments",
			icon: <DollarSign className="h-5 w-5" />,
		},
		{
			label: t("messages"),
			href: "/auth/parent/messages",
			icon: <MessageSquare className="h-5 w-5" />,
			badge: "2",
		},
		{
			label: t("announcements"),
			href: "/auth/parent/announcements",
			icon: <Bell className="h-5 w-5" />,
		},
		{
			label: t("profile"),
			href: "/auth/parent/profile",
			icon: <Settings className="h-5 w-5" />,
		},
	],
	student: [
		{
			label: t("dashboard"),
			href: "/auth/",
			icon: <Home className="h-5 w-5" />,
		},
		{
			label: t("my_schedule"),
			href: "/auth/student/schedule",
			icon: <Calendar className="h-5 w-5" />,
		},
		{
			label: t("my_grades"),
			href: "/auth/student/grades",
			icon: <FileText className="h-5 w-5" />,
		},
		{
			label: t("attendance"),
			href: "/auth/student/attendance",
			icon: <UserCheck className="h-5 w-5" />,
		},
		{
			label: t("library"),
			href: "/auth/student/library",
			icon: <Library className="h-5 w-5" />,
		},
		{
			label: t("announcements"),
			href: "/auth/student/announcements",
			icon: <Bell className="h-5 w-5" />,
		},
		{
			label: t("profile"),
			href: "/auth/student/profile",
			icon: <Settings className="h-5 w-5" />,
		},
	],
});

// Helper function to map backend role to frontend UserRole
const mapBackendRoleToUserRole = (backendRole: string | null): UserRole => {
	if (!backendRole) return "teacher"; // Default fallback

	const roleMap: Record<string, UserRole> = {
		// Uppercase variants from backend
		OWNER: "owner",
		DIRECTOR: "director",
		DEPUTY_DIRECTOR: "deputyDirector",
		ADMIN: "admin",
		HEAD_TEACHER: "headTeacher",
		TEACHER: "teacher",
		PARENT: "parent",
		STUDENT: "student",
		MINISTRY: "ministry",
		// Lowercase/mixed case variants
		Owner: "owner",
		Director: "director",
		DeputyDirector: "deputyDirector",
		Admin: "admin",
		HeadTeacher: "headTeacher",
		Teacher: "teacher",
		Parent: "parent",
		Student: "student",
		Ministry: "ministry",
	};

	return roleMap[backendRole] || "teacher";
};

export const Sidebar = () => {
	const [open, setOpen] = useState(false);
	const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
	const { t } = useLanguage();
	const { user, logout } = useAuth();
	const {
		currentRole: backendRole,
		currentSchool,
		currentMembership,
	} = useDashboard();
	const schoolId = currentSchool?.idStr || currentSchool?.id;
	const { branches, loading: loadingBranches } = useBranches(schoolId);

	// State for selected branch
	const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);

	// Get current branch from membership or first available branch
	const currentBranch = selectedBranchId
		? branches.find((b) => b.id === selectedBranchId)
		: currentMembership?.branchId
			? branches.find((b) => b.id === currentMembership.branchId)
			: branches[0];

	// Map backend role to frontend role
	const currentRole = mapBackendRoleToUserRole(backendRole);
	const roleConfig = getRoleConfig(t);

	const links = getMenuByRole(t)[currentRole];
	const RoleIcon = roleConfig[currentRole].icon;

	return (
		<div className="h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800 w-auto border-r border-neutral-200 dark:border-neutral-700 overflow-hidden">
			<SidebarComponent open={open} setOpen={setOpen}>
				<SidebarBody className="justify-between gap-6">
					<div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
						{/* Logo */}
						<motion.div
							initial={{ opacity: 0, y: -20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.3 }}
						>
							{open ? <Logo /> : <LogoIcon />}
						</motion.div>

						{/* Branch Selector - shown when sidebar is expanded */}
						{open &&
							currentRole !== "ministry" &&
							currentRole !== "student" &&
							branches.length > 0 && (
								<motion.div
									initial={{ opacity: 0, scale: 0.95 }}
									animate={{ opacity: 1, scale: 1 }}
									transition={{ delay: 0.2, duration: 0.3 }}
									className="mt-4 px-2"
								>
									<div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
										{t("current_branch")}
									</div>
									<DropdownMenu>
										<DropdownMenuTrigger className="w-full">
											<div className="bg-primary/5 border border-primary/20 rounded-lg p-3 hover:bg-primary/10 transition-colors cursor-pointer">
												<div className="flex items-center gap-2">
													<div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
														<Building className="h-4 w-4 text-primary" />
													</div>
													<div className="flex flex-col min-w-0 flex-1 text-left">
														<span className="text-xs text-muted-foreground">
															{loadingBranches ? t("loading") : t("branch")}
														</span>
														<span className="text-sm font-medium truncate">
															{currentBranch?.name || t("all_branches")}
														</span>
													</div>
													<ChevronDown className="h-4 w-4 text-muted-foreground" />
												</div>
											</div>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="start" className="w-52">
											<DropdownMenuLabel>
												{t("switch_branch")}
											</DropdownMenuLabel>
											<DropdownMenuSeparator />
											{currentRole === "owner" && (
												<DropdownMenuItem
													onClick={() => setSelectedBranchId(null)}
													className="gap-2"
												>
													<Building className="h-4 w-4" />
													<span className="flex-1">{t("all_branches")}</span>
													{!selectedBranchId &&
														!currentMembership?.branchId && (
															<Check className="h-4 w-4 text-primary" />
														)}
												</DropdownMenuItem>
											)}
											{branches.map((branch) => (
												<DropdownMenuItem
													key={branch.id}
													onClick={() => setSelectedBranchId(branch.id)}
													className="gap-2"
												>
													<Building className="h-4 w-4" />
													<span className="flex-1">{branch.name}</span>
													{currentBranch?.id === branch.id && (
														<Check className="h-4 w-4 text-primary" />
													)}
												</DropdownMenuItem>
											))}
										</DropdownMenuContent>
									</DropdownMenu>
								</motion.div>
							)}

						{/* Menu Items */}
						<motion.div
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.3, duration: 0.3 }}
							className="mt-6 flex flex-col gap-1"
						>
							<AnimatePresence mode="wait">
								{links.map((link, idx) => (
									<motion.div
										key={`${currentRole}-${link.href}`}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										exit={{ opacity: 0, x: 20 }}
										transition={{ delay: idx * 0.05, duration: 0.2 }}
									>
										<SidebarLink
											link={{
												...link,
												icon: (
													<div className="text-neutral-700 dark:text-neutral-200 flex-shrink-0">
														{link.icon}
													</div>
												),
											}}
										/>
										{link.badge && open && (
											<motion.div
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold"
											>
												{link.badge}
											</motion.div>
										)}
									</motion.div>
								))}
							</AnimatePresence>
						</motion.div>
					</div>

					{/* Footer Section: Logout & User Profile */}
					<div className="flex flex-col gap-4">
						{/* Logout Button */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4, duration: 0.3 }}
						>
							<button
								className="cursor-pointer w-full text-left bg-transparent border-none p-0 outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
								onClick={(e) => {
									e.preventDefault();
									logout();
								}}
								type="button"
							>
								<SidebarLink
									link={{
										label: t("logout"),
										href: "#",
										icon: (
											<LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
										),
									}}
								/>
							</button>
						</motion.div>

						{/* User Profile */}
						{open ? (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.5, duration: 0.3 }}
								className="flex items-center gap-3 p-2 rounded-xl bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shadow-sm"
							>
								<div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-sm">
									{user?.name?.charAt(0).toUpperCase() || "U"}
								</div>
								<div className="flex flex-col min-w-0">
									<span className="text-sm font-semibold truncate text-neutral-900 dark:text-neutral-100">
										{user?.name || t("user")}
									</span>
									<div className="flex items-center gap-1.5">
										<div
											className={`h-2 w-2 rounded-full ${roleConfig[currentRole].color}`}
										/>
										<span className="text-xs text-muted-foreground truncate">
											{roleConfig[currentRole].label}
										</span>
									</div>
								</div>
							</motion.div>
						) : (
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="h-7 w-7 mx-auto rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-sm"
							>
								{user?.name?.charAt(0).toUpperCase() || "U"}
							</motion.div>
						)}
					</div>
				</SidebarBody>
			</SidebarComponent>
		</div>
	);
};

export const Logo = () => {
	const { t } = useLanguage();
	return (
		<Link
			className="font-normal flex space-x-2 items-center text-sm py-1 relative z-20"
			href="#"
		>
			<motion.div
				className="h-8 w-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg"
				whileHover={{ scale: 1.05, rotate: 5 }}
				whileTap={{ scale: 0.95 }}
			>
				<School className="h-5 w-5 text-white" />
			</motion.div>
			<motion.div
				initial={{ opacity: 0, x: -10 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ delay: 0.1 }}
				className="flex flex-col"
			>
				<span className="font-bold text-base text-black dark:text-white whitespace-pre">
					{t("app_title")}
				</span>
				<span className="text-xs text-muted-foreground">
					{t("app_subtitle")}
				</span>
			</motion.div>
		</Link>
	);
};

export const LogoIcon = () => {
	return (
		<Link
			className="font-normal flex items-center text-sm py-1 relative z-20"
			href="#"
		>
			<motion.div
				className="h-8 w-8 bg-gradient-to-br from-primary to-primary/70 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg"
				whileHover={{ scale: 1.1, rotate: 10 }}
				whileTap={{ scale: 0.9 }}
			>
				<School className="h-5 w-5 text-white" />
			</motion.div>
		</Link>
	);
};
