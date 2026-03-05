"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/language-context";
import { useDashboard } from "@/hooks/useDashboard";
import { getModulesByRole } from "@/config/sidebar-modules";
import {
	SidebarBody,
	SidebarLink,
	useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

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
	const { t } = useLanguage();
	const { currentRole: backendRole, currentSchool } = useDashboard();
	const { open } = useSidebar();
	const lang = (typeof window !== "undefined" && localStorage.getItem("sms-language")) || "en";

	const currentRole = mapBackendRoleToUserRole(backendRole);
	const modules = getModulesByRole(currentRole, t);

	return (
		<SidebarBody>
				<div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
					{/* Logo header */}
					<div className="px-4 py-4 shrink-0">
						{open ? <Logo /> : <LogoIcon />}
					</div>

					{/* School logo & name */}
					{currentSchool && (
						<div className="mx-3 mb-1 px-2.5 py-2 rounded-xl bg-primary/5 dark:bg-primary/10">
							{open ? (
								<div className="flex items-center gap-2">
									<img
										src={currentSchool.effectiveLogoUrl || currentSchool.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentSchool.name.en || "S")}&background=4f46e5&color=fff&size=64&bold=true`}
										alt=""
										className="w-7 h-7 rounded-lg shrink-0 object-cover"
									/>
									<p className="text-xs font-semibold text-foreground truncate">
										{lang === "km" ? currentSchool.name.km : currentSchool.name.en}
									</p>
								</div>
							) : (
								<div className="flex justify-center" title={currentSchool.name.en}>
									<img
										src={currentSchool.effectiveLogoUrl || currentSchool.logoUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentSchool.name.en || "S")}&background=4f46e5&color=fff&size=64&bold=true`}
										alt=""
										className="w-7 h-7 rounded-lg object-cover"
									/>
								</div>
							)}
						</div>
					)}

					{/* Divider */}
					<div className="mx-4 border-t border-black/6 dark:border-white/6" />

					{/* Navigation */}
					<nav className="flex-1 px-3 py-3 space-y-4">
						{modules.map((module, idx) => (
							<div key={module.id + idx}>
								{/* Section label */}
								{open && (
									<div className="flex items-center gap-2 px-2.5 mb-1.5">
										<span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/40">
											{module.label}
										</span>
									</div>
								)}
								{/* Items */}
								<div className="space-y-0.5">
									{module.sections.map((section, sIdx) =>
										section.items.map((item, iIdx) => {
											const Icon = item.icon;
											const isActive =
												pathname === item.href ||
												(item.href !== "/auth" &&
													item.href !== "/auth/" &&
													pathname.startsWith(item.href));

											return (
												<SidebarLink
													key={item.href + sIdx + iIdx}
													active={isActive}
													link={{
														label: item.label,
														href: item.href,
														icon: (
															<Icon
																className={cn(
																	"h-4 w-4 shrink-0 transition-colors duration-150",
																	isActive
																		? "text-primary-foreground"
																		: "text-muted-foreground/60 group-hover/sidebar:text-foreground"
																)}
																strokeWidth={isActive ? 2 : 1.5}
															/>
														),
													}}
												/>
											);
										})
									)}
								</div>
							</div>
						))}
					</nav>
				</div>

			</SidebarBody>
	);
};

export const Logo = () => {
	return (
		<Link
			className="flex items-center gap-2.5 relative z-20"
			href="/auth"
		>
			<img
				src="https://gateway.stadiumx.asia/file-1766072912641-586620334.png"
				width={28}
				height={28}
				alt="Logo"
				className="rounded-lg"
			/>
			<span className="font-serif text-[15px] font-semibold text-foreground tracking-tight whitespace-pre">
				KOOMPI SMS
			</span>
		</Link>
	);
};

export const LogoIcon = () => {
	return (
		<Link
			className="flex items-center justify-center relative z-20"
			href="/auth"
		>
			<img
				src="https://gateway.stadiumx.asia/file-1766072912641-586620334.png"
				width={28}
				height={28}
				alt="Logo"
				className="rounded-lg"
			/>
		</Link>
	);
};
