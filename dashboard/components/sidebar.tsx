"use client";

import React, { useState } from "react";
import { LogOut, ChevronUp, User, Palette } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

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
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SupportedLang } from "@/config/translations";
import { cn } from "@/lib/utils";
import { ThemeCustomizer } from "@/components/theme-customizer";
import Image from "next/image";

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
	const [open, setOpen] = useState(true);
	const [profileExpanded, setProfileExpanded] = useState(false);

	// Determine current role and modules
	const currentRole = mapBackendRoleToUserRole(backendRole);
	const modules = getModulesByRole(currentRole, t);

	return (
		<SidebarContainer open={open} setOpen={setOpen}>
			<SidebarBody className="justify-between gap-10">
				<div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin">
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
													active={isActive}
													link={{
														label: item.label,
														href: item.href,
														icon: (
															<Icon
																className={cn(
																	"h-5 w-5 flex-shrink-0",
																	isActive
																		? "text-primary dark:text-primary"
																		: "text-neutral-700 dark:text-neutral-200"
																)}
																strokeWidth={isActive ? 2.5 : 2}
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

				{/* User Profile Section - Collapsible */}
				<motion.div
					animate={{ opacity: 1, y: 0 }}
					className="flex flex-col gap-2 mt-auto pt-4 border-t border-neutral-200 dark:border-neutral-700"
					initial={{ opacity: 0, y: 10 }}
					transition={{ duration: 0.2, ease: "easeOut" }}
				>
					{/* Profile Toggle Button */}
					<motion.button
						className="flex items-center gap-2 py-2 px-1 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors w-full"
						whileHover={{ scale: 1.01 }}
						whileTap={{ scale: 0.99 }}
						onClick={() => setProfileExpanded(!profileExpanded)}
					>
						<div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">
							{user?.name?.charAt(0).toUpperCase() || "U"}
						</div>
						{open && (
							<>
								<div className="flex flex-col items-start flex-1 min-w-0">
									<span className="text-sm font-medium text-neutral-700 dark:text-neutral-200 truncate w-full text-left">
										{user?.name || "Profile"}
									</span>
									<span className="text-xs text-neutral-500 dark:text-neutral-400 truncate w-full text-left">
										{currentRole}
									</span>
								</div>
								<motion.div
									animate={{ rotate: profileExpanded ? 180 : 0 }}
									transition={{ duration: 0.2 }}
								>
									<ChevronUp className="h-4 w-4 text-neutral-500" />
								</motion.div>
							</>
						)}
					</motion.button>

					{/* Collapsible Profile Menu */}
					<AnimatePresence>
						{profileExpanded && open && (
							<motion.div
								animate={{ height: "auto", opacity: 1 }}
								className="overflow-hidden"
								exit={{ height: 0, opacity: 0 }}
								initial={{ height: 0, opacity: 0 }}
								transition={{ duration: 0.2, ease: "easeInOut" }}
							>
								<div className="flex flex-col gap-1 pl-2 pb-2">
									<Link
										className="flex items-center gap-2 py-2 px-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors text-sm text-neutral-700 dark:text-neutral-200"
										href="/auth/settings/profile"
									>
										<User className="h-4 w-4" />
										{t("profile")}
									</Link>

									<div className="flex items-center justify-between gap-2 py-2 px-2 rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors">
										<div className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-200">
											<Palette className="h-4 w-4" />
											{t("theme")}
										</div>
										<ThemeCustomizer />
									</div>

									<button
										className="flex items-center gap-2 py-2 px-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors text-sm text-red-600 w-full text-left"
										onClick={logout}
									>
										<LogOut className="h-4 w-4" />
										{t("logout")}
									</button>
								</div>
							</motion.div>
						)}
					</AnimatePresence>

					{/* Language Switcher - Always visible below profile */}
					<motion.div
						animate={{ opacity: 1 }}
						className={cn(
							"flex items-center gap-2",
							open ? "px-0" : "justify-center"
						)}
						initial={{ opacity: 0 }}
						transition={{ delay: 0.1, duration: 0.2 }}
					>
						{open ? (
							<Select
								value={language}
								onValueChange={(v) => setLanguage(v as SupportedLang)}
							>
								<SelectTrigger className="h-8 w-full text-xs">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="en">🇺🇸 English</SelectItem>
									<SelectItem value="km">🇰🇭 Khmer</SelectItem>
								</SelectContent>
							</Select>
						) : (
							<button
								className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-neutral-200 dark:hover:bg-neutral-700 text-xs transition-colors"
								title={
									language === "en" ? "Switch to Khmer" : "Switch to English"
								}
								onClick={() => setLanguage(language === "en" ? "km" : "en")}
							>
								{language === "en" ? "🇺🇸" : "🇰🇭"}
							</button>
						)}
					</motion.div>
				</motion.div>
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
			<img
				src="https://gateway.stadiumx.asia/file-1766072912641-586620334.png"
				width={40}
				height={40}
				alt="Logo"
			/>
			<motion.span
				animate={{ opacity: 1 }}
				className="font-black text-xl text-black dark:text-white whitespace-pre"
				initial={{ opacity: 0 }}
			>
				KOOMPI SMS
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
			<img
				src="https://gateway.stadiumx.asia/file-1766072912641-586620334.png"
				width={40}
				height={40}
				alt="Logo"
			/>
		</Link>
	);
};
