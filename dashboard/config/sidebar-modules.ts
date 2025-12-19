import {
	LayoutDashboard,
	Users,
	BookOpen,
	Calendar,
	FileText,
	DollarSign,
	Settings,
	Building,
	BarChart3,
	MessageSquare,
	Library,
	Bus,
	Package,
	UserCog,
	GraduationCap,
	Home,
	UserCheck,
	ClipboardList,
} from "lucide-react";

import { UserRole } from "@/components/sidebar";

export interface SidebarItem {
	label: string;
	href: string;
	icon?: any; // Lucide icon
	badge?: string;
}

export interface SidebarSection {
	title: string;
	items: SidebarItem[];
}

export interface SidebarModule {
	id: string;
	label: string;
	icon: any; // Lucide icon
	sections: SidebarSection[];
}

export const getModulesByRole = (
	role: UserRole,
	t: (key: string) => string
): SidebarModule[] => {
	const commonModules: Record<string, SidebarModule> = {
		dashboard: {
			id: "dashboard",
			label: t("dashboard"),
			icon: LayoutDashboard,
			sections: [
				{
					title: t("overview"),
					items: [{ label: t("dashboard"), href: "/auth/", icon: Home }],
				},
			],
		},
		settings: {
			id: "settings",
			label: t("settings"),
			icon: Settings,
			sections: [
				{
					title: t("account"),
					items: [
						{
							label: t("profile"),
							href: "/auth/settings/profile",
							icon: UserCog,
						},
					],
				},
			],
		},
	};

	// Helper to create modules efficiently
	const modules: SidebarModule[] = [];

	// 1. Dashboard Module (Everyone has this)
	modules.push(commonModules.dashboard);

	// 2. Role Specific Modules
	switch (role) {
		case "owner":
		case "admin":
		case "director":
		case "deputyDirector":
		case "headTeacher":
			// School Management
			modules.push({
				id: "management",
				label: t("management"),
				icon: Building,
				sections: [
					{
						title: t("institution"),
						items: [
							...(role === "owner"
								? [
										{
											label: t("schools_branches"),
											href: "/auth/admin/branches",
											icon: Building,
										},
									]
								: []),
							{ label: t("members"), href: "/auth/admin/members", icon: Users },
							{
								label: t("students"),
								href: "/auth/admin/students",
								icon: GraduationCap,
							},
							{
								label: t("teachers_staff"),
								href: "/auth/admin/hr",
								icon: UserCog,
							},
						],
					},
					{
						title: t("operations"),
						items: [
							{
								label: t("library"),
								href: "/auth/admin/library",
								icon: Library,
							},
							{
								label: t("transport"),
								href: "/auth/admin/transport",
								icon: Bus,
							},
							{
								label: t("inventory"),
								href: "/auth/admin/inventory",
								icon: Package,
							},
						],
					},
				],
			});

			// Academic
			modules.push({
				id: "academic",
				label: t("academic"),
				icon: BookOpen,
				sections: [
					{
						title: t("academics"),
						items: [
							{
								label: t("classes_subjects"),
								href: "/auth/admin/academic",
								icon: BookOpen,
							},
							{
								label: t("attendance"),
								href: "/auth/admin/attendance",
								icon: Calendar,
							},
							{
								label: t("grading"),
								href: "/auth/admin/grading",
								icon: FileText,
							},
						],
					},
				],
			});

			// Finance
			modules.push({
				id: "finance",
				label: t("finance"),
				icon: DollarSign,
				sections: [
					{
						title: t("financials"),
						items: [
							{
								label: t("overview"),
								href: "/auth/admin/finance",
								icon: BarChart3,
							},
						],
					},
				],
			});
			break;

		case "teacher":
			modules.push({
				id: "teaching",
				label: t("teaching"),
				icon: BookOpen,
				sections: [
					{
						title: t("academics"),
						items: [
							{
								label: t("classes_subjects"),
								href: "/auth/admin/academic",
								icon: BookOpen,
							},
							{
								label: t("attendance"),
								href: "/auth/admin/attendance",
								icon: Calendar,
							},
							{
								label: t("grading"),
								href: "/auth/admin/grading",
								icon: FileText,
							},
						],
					},
					{
						title: t("students"),
						items: [
							{
								label: t("my_students"),
								href: "/auth/admin/students",
								icon: Users,
							},
						],
					},
				],
			});
			break;

		case "student":
			modules.push({
				id: "learning",
				label: t("learning"),
				icon: BookOpen,
				sections: [
					{
						title: t("academics"),
						items: [
							{
								label: t("my_grades"),
								href: "/auth/student/academic",
								icon: FileText,
							},
							{
								label: t("my_schedule"),
								href: "/auth/student/academic",
								icon: Calendar,
							},
						],
					},
				],
			});
			break;

		case "parent":
			modules.push({
				id: "family",
				label: t("family"),
				icon: Users,
				sections: [
					{
						title: t("my_children"),
						items: [
							{
								label: t("children"),
								href: "/auth/parent/children",
								icon: Users,
							},
						],
					},
				],
			});
			break;

		case "ministry":
			modules.push({
				id: "national",
				label: t("national"),
				icon: Building,
				sections: [
					{
						title: t("oversight"),
						items: [
							{
								label: t("schools"),
								href: "/auth/admin/schools",
								icon: Building,
							},
						],
					},
				],
			});
			break;
	}

	// Settings at the bottom for everyone
	const settingsModule = { ...commonModules.settings };

	if (role === "admin" || role === "owner" || role === "headTeacher") {
		settingsModule.sections[0].items.push({
			label: t("school_settings"),
			href: "/auth/admin/settings",
			icon: Settings,
		});
	}
	modules.push(settingsModule);

	return modules;
};
