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
  t: (key: string) => string,
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
              {
                label: t("fees_payments"),
                href: "/auth/admin/finance/fees",
                icon: DollarSign,
              },
              {
                label: t("payroll"),
                href: "/auth/admin/finance/payroll",
                icon: UserCog,
              },
            ],
          },
        ],
      });

      // Reports
      modules.push({
        id: "reports",
        label: t("reports"),
        icon: BarChart3,
        sections: [
          {
            title: t("analytics"),
            items: [
              { label: t("reports"), href: "/auth/reports", icon: FileText },
              {
                label: t("analytics"),
                href: "/auth/analytics",
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
            title: t("my_classes"),
            items: [
              {
                label: t("classes"),
                href: "/auth/teacher/classes",
                icon: BookOpen,
              },
              {
                label: t("schedule"),
                href: "/auth/teacher/schedule",
                icon: Calendar,
              },
            ],
          },
          {
            title: t("student_management"),
            items: [
              {
                label: t("attendance"),
                href: "/auth/teacher/attendance",
                icon: UserCheck,
              },
              {
                label: t("grading"),
                href: "/auth/teacher/grading",
                icon: FileText,
              },
              {
                label: t("students"),
                href: "/auth/teacher/students",
                icon: Users,
              },
            ],
          },
        ],
      });
      modules.push({
        id: "communication",
        label: t("communication"),
        icon: MessageSquare,
        sections: [
          {
            title: t("messages"),
            items: [
              {
                label: t("messages"),
                href: "/auth/teacher/messages",
                icon: MessageSquare,
                badge: "3",
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
                label: t("my_grades"),
                href: "/auth/student/grades",
                icon: FileText,
              },
              {
                label: t("attendance"),
                href: "/auth/student/attendance",
                icon: UserCheck,
              },
              {
                label: t("library"),
                href: "/auth/student/library",
                icon: Library,
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
                label: t("grades_reports"),
                href: "/auth/parent/grades",
                icon: FileText,
              },
              {
                label: t("attendance"),
                href: "/auth/parent/attendance",
                icon: Calendar,
              },
            ],
          },
          {
            title: t("finance"),
            items: [
              {
                label: t("fees_payments"),
                href: "/auth/parent/payments",
                icon: DollarSign,
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
                href: "/auth/ministry/schools",
                icon: Building,
              },
              {
                label: t("compliance"),
                href: "/auth/ministry/compliance",
                icon: ClipboardList,
              },
            ],
          },
          {
            title: t("data"),
            items: [
              {
                label: t("analytics"),
                href: "/auth/ministry/analytics",
                icon: BarChart3,
              },
              {
                label: t("reports"),
                href: "/auth/ministry/reports",
                icon: FileText,
              },
            ],
          },
        ],
      });
      break;
  }

  // Settings at the bottom for everyone
  const settingsModule = { ...commonModules.settings };

  if (role === "admin" || role === "owner") {
    settingsModule.sections[0].items.push({
      label: t("school_settings"),
      href: "/auth/admin/settings",
      icon: Settings,
    });
  }
  modules.push(settingsModule);

  return modules;
};
