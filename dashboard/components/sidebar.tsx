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
  ChevronDown,
  Shield,
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

// Define user roles
export type UserRole = "ministry" | "owner" | "admin" | "teacher" | "parent" | "student";

// Role configuration with colors and labels
const roleConfig = {
  ministry: {
    label: "Ministry (MoEYS)",
    color: "bg-purple-500",
    icon: Shield,
  },
  owner: {
    label: "School Owner",
    color: "bg-blue-500",
    icon: Briefcase,
  },
  admin: {
    label: "Administrator",
    color: "bg-green-500",
    icon: UserCog,
  },
  teacher: {
    label: "Teacher",
    color: "bg-orange-500",
    icon: GraduationCap,
  },
  parent: {
    label: "Parent",
    color: "bg-pink-500",
    icon: Users,
  },
  student: {
    label: "Student",
    color: "bg-indigo-500",
    icon: School,
  },
};

// Menu items by role
const menuByRole: Record<UserRole, Array<{
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}>> = {
  ministry: [
    {
      label: "National Dashboard",
      href: "/auth/ministry",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: "Schools",
      href: "/auth/ministry/schools",
      icon: <Building className="h-5 w-5" />,
    },
    {
      label: "Analytics",
      href: "/auth/ministry/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      label: "Compliance",
      href: "/auth/ministry/compliance",
      icon: <ClipboardList className="h-5 w-5" />,
    },
    {
      label: "Reports",
      href: "/auth/ministry/reports",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      label: "Settings",
      href: "/auth/ministry/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ],
  owner: [
    {
      label: "Dashboard",
      href: "/auth/",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: "Schools & Branches",
      href: "/auth/schools",
      icon: <Building className="h-5 w-5" />,
    },
    {
      label: "Financial Overview",
      href: "/auth/finance",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      label: "HR & Payroll",
      href: "/auth/hr",
      icon: <UserCog className="h-5 w-5" />,
    },
    {
      label: "Analytics",
      href: "/auth/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      label: "Reports",
      href: "/auth/reports",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      label: "Settings",
      href: "/auth/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ],
  admin: [
    {
      label: "Dashboard",
      href: "/auth/",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      label: "Students",
      href: "/auth/admin/students",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Schools",
      href: "/auth/admin/schools/pending",
      icon: <Building className="h-5 w-5" />,
    },
    {
      label: "Academic",
      href: "/auth/admin/academic",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      label: "Attendance",
      href: "/auth/admin/attendance",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      label: "Grading",
      href: "/auth/admin/grading",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      label: "Finance",
      href: "/auth/admin/finance",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      label: "HR",
      href: "/auth/admin/hr",
      icon: <UserCog className="h-5 w-5" />,
    },
    {
      label: "Library",
      href: "/auth/admin/library",
      icon: <Library className="h-5 w-5" />,
    },
    {
      label: "Transport",
      href: "/auth/admin/transport",
      icon: <Bus className="h-5 w-5" />,
    },
    {
      label: "Inventory",
      href: "/auth/admin/inventory",
      icon: <Package className="h-5 w-5" />,
    },
    {
      label: "Communication",
      href: "/auth/admin/communication",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      label: "Settings",
      href: "/auth/admin/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ],
  teacher: [
    {
      label: "Dashboard",
      href: "/auth/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      label: "My Classes",
      href: "/auth/teacher/classes",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      label: "Attendance",
      href: "/auth/teacher/attendance",
      icon: <UserCheck className="h-5 w-5" />,
    },
    {
      label: "Grading",
      href: "/auth/teacher/grading",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      label: "Students",
      href: "/auth/teacher/students",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Messages",
      href: "/auth/teacher/messages",
      icon: <MessageSquare className="h-5 w-5" />,
      badge: "3",
    },
    {
      label: "Schedule",
      href: "/auth/teacher/schedule",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      label: "Profile",
      href: "/auth/teacher/profile",
      icon: <Settings className="h-5 w-5" />,
    },
  ],
  parent: [
    {
      label: "Dashboard",
      href: "/auth/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      label: "My Children",
      href: "/auth/parent/children",
      icon: <Users className="h-5 w-5" />,
    },
    {
      label: "Grades & Reports",
      href: "/auth/parent/grades",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      label: "Attendance",
      href: "/auth/parent/attendance",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      label: "Fees & Payments",
      href: "/auth/parent/payments",
      icon: <DollarSign className="h-5 w-5" />,
    },
    {
      label: "Messages",
      href: "/auth/parent/messages",
      icon: <MessageSquare className="h-5 w-5" />,
      badge: "2",
    },
    {
      label: "Announcements",
      href: "/auth/parent/announcements",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      label: "Profile",
      href: "/auth/parent/profile",
      icon: <Settings className="h-5 w-5" />,
    },
  ],
  student: [
    {
      label: "Dashboard",
      href: "/auth/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      label: "My Schedule",
      href: "/auth/student/schedule",
      icon: <Calendar className="h-5 w-5" />,
    },
    {
      label: "My Grades",
      href: "/auth/student/grades",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      label: "Attendance",
      href: "/auth/student/attendance",
      icon: <UserCheck className="h-5 w-5" />,
    },
    {
      label: "Library",
      href: "/auth/student/library",
      icon: <Library className="h-5 w-5" />,
    },
    {
      label: "Announcements",
      href: "/auth/student/announcements",
      icon: <Bell className="h-5 w-5" />,
    },
    {
      label: "Profile",
      href: "/auth/student/profile",
      icon: <Settings className="h-5 w-5" />,
    },
  ],
};

export const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState<UserRole>("admin");
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const { t } = useLanguage();
  const { logout } = useAuth();

  const links = menuByRole[currentRole];
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

            {/* Role Switcher - For Development/Testing */}
            {open && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="mt-4 px-2"
              >
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
                  Current Role
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
                    className={`w-full ${roleConfig[currentRole].color} text-white rounded-lg p-3 flex items-center justify-between hover:opacity-90 transition-opacity`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-lg bg-white/20 flex items-center justify-center">
                        <RoleIcon className="h-4 w-4" />
                      </div>
                      <div className="flex flex-col items-start">
                        <span className="text-xs opacity-90">Viewing as</span>
                        <span className="text-sm font-semibold">
                          {roleConfig[currentRole].label}
                        </span>
                      </div>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${
                        showRoleSwitcher ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {showRoleSwitcher && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden z-50"
                      >
                        {(Object.keys(roleConfig) as UserRole[]).map((role) => {
                          const Icon = roleConfig[role].icon;
                          return (
                            <button
                              key={role}
                              onClick={() => {
                                setCurrentRole(role);
                                setShowRoleSwitcher(false);
                              }}
                              className={`w-full px-3 py-2 flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors ${
                                currentRole === role
                                  ? "bg-gray-50 dark:bg-neutral-700/50"
                                  : ""
                              }`}
                            >
                              <div
                                className={`h-6 w-6 rounded ${roleConfig[role].color} flex items-center justify-center`}
                              >
                                <Icon className="h-3 w-3 text-white" />
                              </div>
                              <span className="text-sm font-medium">
                                {roleConfig[role].label}
                              </span>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* Branch Selector - shown when sidebar is expanded */}
            {open && currentRole !== "ministry" && currentRole !== "student" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.3 }}
                className="mt-4 px-2"
              >
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
                  Current Branch
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 hover:bg-primary/10 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Building className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-muted-foreground">
                        Main Campus
                      </span>
                      <span className="text-sm font-medium truncate">
                        Phnom Penh Branch
                      </span>
                    </div>
                  </div>
                </div>
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
                  label: "Logout",
                  href: "#",
                  icon: (
                    <LogOut className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
                  ),
                }}
              />
            </button>
          </motion.div>
        </SidebarBody>
      </SidebarComponent>
    </div>
  );
};

export const Logo = () => {
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
          Cambodia SMS
        </span>
        <span className="text-xs text-muted-foreground">
          School Management
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
