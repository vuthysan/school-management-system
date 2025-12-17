"use client";

import React, { useState } from "react";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { useDashboard } from "@/hooks/useDashboard";
import { getModulesByRole } from "@/config/sidebar-modules";
import {
  Sidebar as SidebarContainer,
  SidebarBody,
  SidebarLink,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SupportedLang } from "@/config/translations";
import { cn } from "@/lib/utils";
import { ThemeCustomizer } from "@/components/theme-customizer";

// Define user roles mapping
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

const mapBackendRoleToUserRole = (backendRole: string | null): UserRole => {
  if (!backendRole) return "teacher";
  const roleMap: Record<string, UserRole> = {
    OWNER: "owner",
    DIRECTOR: "director",
    DEPUTY_DIRECTOR: "deputyDirector",
    ADMIN: "admin",
    HEAD_TEACHER: "headTeacher",
    TEACHER: "teacher",
    PARENT: "parent",
    STUDENT: "student",
    MINISTRY: "ministry",
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
  const pathname = usePathname();
  const { t, language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const { currentRole: backendRole } = useDashboard();
  const [open, setOpen] = useState(false);

  // Determine current role and modules
  const currentRole = mapBackendRoleToUserRole(backendRole);
  const modules = getModulesByRole(currentRole, t);

  return (
    <SidebarContainer open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-4">
            {modules.map((module, idx) => (
              <div key={module.id + idx} className="flex flex-col gap-2 mb-4">
                {/* Module Label (only if open) */}
                {open && (
                  <div className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mt-2 first:mt-0">
                    {module.label}
                  </div>
                )}
                {/* Flatten sections and items */}
                {module.sections.map((section, sIdx) => (
                  <div
                    key={section.title + sIdx}
                    className="flex flex-col gap-1"
                  >
                    {section.items.map((item, iIdx) => {
                      const Icon = item.icon;
                      const isActive =
                        pathname === item.href ||
                        (item.href !== "/auth" &&
                          item.href !== "/auth/" &&
                          pathname.startsWith(item.href));

                      return (
                        <SidebarLink
                          key={item.href + iIdx}
                          link={{
                            label: item.label,
                            href: item.href,
                            icon: (
                              <Icon
                                className={cn(
                                  "h-5 w-5 flex-shrink-0",
                                  isActive
                                    ? "text-primary dark:text-primary"
                                    : "text-neutral-700 dark:text-neutral-200",
                                )}
                              />
                            ),
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer">
                <SidebarLink
                  link={{
                    label: user?.name || "Profile",
                    href: "#",
                    icon: (
                      <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                        {user?.name?.charAt(0).toUpperCase() || "U"}
                      </div>
                    ),
                  }}
                />
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-56 mb-2"
              side="right"
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {currentRole}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/auth/settings/profile">{t("profile")}</Link>
              </DropdownMenuItem>

              <div className="px-2 py-2 flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {t("theme")}
                </span>
                <ThemeCustomizer />
              </div>
              <div className="px-2 py-2 flex items-center justify-between gap-2">
                <span className="text-xs font-medium text-muted-foreground">
                  {t("language")}
                </span>
                <Select
                  value={language}
                  onValueChange={(v) => setLanguage(v as SupportedLang)}
                >
                  <SelectTrigger className="h-7 w-[90px] text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">🇺🇸 English</SelectItem>
                    <SelectItem value="km">🇰🇭 Khmer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600"
                onClick={logout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t("logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarBody>
    </SidebarContainer>
  );
};

export const Logo = () => {
  return (
    <Link
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
      href="/auth"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
        initial={{ opacity: 0 }}
      >
        SMS
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
      href="/auth"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
