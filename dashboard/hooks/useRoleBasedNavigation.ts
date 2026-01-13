"use client";

import { usePermissions } from "@/components/auth/role-guard";
import {
	Users,
	BookOpen,
	Calendar,
	DollarSign,
	Building2,
	Settings,
	GraduationCap,
	ClipboardList,
	AlertCircle,
	LucideIcon,
} from "lucide-react";

export interface NavItem {
	label: string;
	href: string;
	icon: LucideIcon;
	roles: string[];
}

// Define navigation items with their required roles
const ALL_NAV_ITEMS: NavItem[] = [
	// Academic Section
	{
		label: "Academic",
		href: "/auth/admin/academic",
		icon: BookOpen,
		roles: ["Admin", "Owner", "Director", "DeputyDirector"],
	},
	{
		label: "Attendance",
		href: "/auth/admin/attendance",
		icon: Calendar,
		roles: ["Admin", "Owner", "Director", "DeputyDirector", "Teacher"],
	},
	{
		label: "Exams",
		href: "/auth/admin/exams",
		icon: ClipboardList,
		roles: ["Admin", "Owner", "Director", "DeputyDirector", "Teacher"],
	},
	{
		label: "Grading",
		href: "/auth/admin/grading",
		icon: GraduationCap,
		roles: ["Admin", "Owner", "Director", "DeputyDirector", "Teacher"],
	},
	// Management Section
	{
		label: "Students",
		href: "/auth/admin/students",
		icon: Users,
		roles: ["Admin", "Owner", "Director", "DeputyDirector"],
	},
	{
		label: "Members",
		href: "/auth/admin/members",
		icon: Users,
		roles: ["Admin", "Owner", "Director"],
	},
	// Finance & HR
	{
		label: "Finance",
		href: "/auth/admin/finance",
		icon: DollarSign,
		roles: ["Admin", "Owner", "Director", "Accountant"],
	},
	{
		label: "HR",
		href: "/auth/admin/hr",
		icon: Users,
		roles: ["Admin", "Owner", "Director", "HRManager"],
	},
	// Institution
	{
		label: "Branches",
		href: "/auth/admin/branches",
		icon: Building2,
		roles: ["Admin", "Owner"],
	},
	{
		label: "Settings",
		href: "/auth/admin/settings",
		icon: Settings,
		roles: ["Admin", "Owner"],
	},
];

export function useRoleBasedNavigation() {
	const { hasRole } = usePermissions();

	// Filter navigation items based on user's role
	const visibleNavItems = ALL_NAV_ITEMS.filter((item) => hasRole(item.roles));

	return {
		navItems: visibleNavItems,
		allNavItems: ALL_NAV_ITEMS,
	};
}
