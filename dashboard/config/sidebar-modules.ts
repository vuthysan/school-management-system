import {
	LayoutDashboard,
	Users,
	BookOpen,
	Calendar,
	CalendarDays,
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
	DoorOpen,
	Settings2,
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
			// Management
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
								label: t("teachers_staff"),
								href: "/auth/admin/hr",
								icon: UserCog,
							},
							{
								label: t("students"),
								href: "/auth/admin/students",
								icon: GraduationCap,
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
						title: t("configuration"),
						items: [
							{
								label: t("school_setup"),
								href: "/auth/admin/setup",
								icon: Settings,
							},
							{
								label: t("school_calendar"),
								href: "/auth/admin/calendar",
								icon: CalendarDays,
							},
							{
								label: t("rooms"),
								href: "/auth/admin/rooms",
								icon: DoorOpen,
							},
						],
					},
					{
						title: t("structure"),
						items: [
							{
								label: t("grade_levels"),
								href: "/auth/admin/grade-levels",
								icon: GraduationCap,
							},
							{
								label: t("subjects"),
								href: "/auth/admin/subjects",
								icon: ClipboardList,
							},
						],
					},
					{
						title: t("daily_operations"),
						items: [
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

			// Analytics & Reporting
			modules.push({
				id: "analytics",
				label: t("analytics_reporting"),
				icon: BarChart3,
				sections: [
					{
						title: t("overview"),
						items: [
							{
								label: t("analytics"),
								href: "/auth/admin/analytics",
								icon: BarChart3,
							},
							{
								label: t("reports"),
								href: "/auth/admin/reports",
								icon: FileText,
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
								label: t("grade_levels"),
								href: "/auth/admin/grade-levels",
								icon: GraduationCap,
							},
							{
								label: t("subjects"),
								href: "/auth/admin/subjects",
								icon: ClipboardList,
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
								label: t("my_schedule"),
								href: "/auth/student/schedule",
								icon: Calendar,
							},
							{
								label: t("my_attendance"),
								href: "/auth/student/attendance",
								icon: UserCheck,
							},
							{
								label: t("my_grades"),
								href: "/auth/student/grades",
								icon: FileText,
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
							{
								label: t("attendance"),
								href: "/auth/parent/attendance",
								icon: UserCheck,
							},
							{
								label: t("fees_payments"),
								href: "/auth/parent/fees",
								icon: DollarSign,
							},
						],
					},
					{
						title: t("school_info"),
						items: [
							{
								label: t("school_events"),
								href: "/auth/parent/events",
								icon: Calendar,
							},
							{
								label: t("communication"),
								href: "/auth/admin/communication",
								icon: MessageSquare,
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
		settingsModule.sections[0].items.push({
			label: t("system_configuration"),
			href: "/auth/admin/settings/configuration",
			icon: Settings2,
		});
	}
	modules.push(settingsModule);

	return modules;
};
