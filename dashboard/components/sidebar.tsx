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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/language-context";
import Link from "next/link";
import { motion } from "framer-motion";

import {
  Sidebar as SidebarComponent,
  SidebarBody,
  SidebarLink,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts/auth-context";

export const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const { logout } = useAuth();

  const links = [
    {
      label: t("dashboard"),
      href: "/",
      icon: (
        <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: t("students"),
      href: "/students",
      icon: (
        <Users className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: t("academic"),
      href: "/academic",
      icon: (
        <BookOpen className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: t("attendance"),
      href: "/attendance",
      icon: (
        <Calendar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: t("grading"),
      href: "/grading",
      icon: (
        <FileText className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: t("finance"),
      href: "/finance",
      icon: (
        <DollarSign className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: t("hr"),
      href: "/hr",
      icon: (
        <UserCog className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: t("library"),
      href: "/library",
      icon: (
        <Library className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: t("transport"),
      href: "/transport",
      icon: (
        <Bus className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: t("inventory"),
      href: "/inventory",
      icon: (
        <Package className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: t("communication"),
      href: "/communication",
      icon: (
        <MessageSquare className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: t("settings"),
      href: "/settings",
      icon: (
        <Settings className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-gray-100 dark:bg-neutral-800 w-auto border-r border-neutral-200 dark:border-neutral-700 overflow-hidden">
      <SidebarComponent open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            
            {/* Branch Selector - shown when sidebar is expanded */}
            {open && (
              <div className="mt-4 px-2">
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 px-2">
                  Current Branch
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Building className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs text-muted-foreground">No branch selected</span>
                      <span className="text-sm font-medium truncate">Select in Settings</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <div 
                className="cursor-pointer" 
                onClick={(e) => {
                  e.preventDefault();
                  logout();
                }}
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
            </div>
          </div>
        </SidebarBody>
      </SidebarComponent>
    </div>
  );
};

export const Logo = () => {
  return (
    <Link
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
      href="#"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        animate={{ opacity: 1 }}
        className="font-medium text-black dark:text-white whitespace-pre"
        initial={{ opacity: 0 }}
      >
        School MS
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
      href="#"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
