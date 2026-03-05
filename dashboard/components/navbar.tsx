"use client";

import React, { useEffect, useState } from "react";
import { LogOut, User, ChevronDown, Search, Moon, Sun, PanelLeft, HelpCircle, Map } from "lucide-react";
import { NotificationBell } from "@/components/notifications/notification-bell";
import Link from "next/link";
import { useTheme } from "next-themes";

import { useLanguage } from "@/contexts/language-context";
import { useAuth } from "@/contexts/auth-context";
import { useDashboard } from "@/hooks/useDashboard";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const mapRoleLabel = (role: string | null): string => {
	if (!role) return "User";
	const labels: Record<string, string> = {
		OWNER: "Owner",
		DIRECTOR: "Director",
		DEPUTY_DIRECTOR: "Deputy Director",
		ADMIN: "Admin",
		HEAD_TEACHER: "Head Teacher",
		TEACHER: "Teacher",
		PARENT: "Parent",
		STUDENT: "Student",
		MINISTRY: "Ministry",
		Owner: "Owner",
		Director: "Director",
		DeputyDirector: "Deputy Director",
		Admin: "Admin",
		HeadTeacher: "Head Teacher",
		Teacher: "Teacher",
		Parent: "Parent",
		Student: "Student",
		Ministry: "Ministry",
	};
	return labels[role] || role;
};

export function Navbar() {
	const { t, language, setLanguage } = useLanguage();
	const { user, logout } = useAuth();
	const { currentRole } = useDashboard();
	const { theme, setTheme } = useTheme();
	const { open: sidebarOpen, setOpen: setSidebarOpen } = useSidebar();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	const roleLabel = mapRoleLabel(currentRole);
	const initials = user?.name?.charAt(0).toUpperCase() || "U";
	const isDark = mounted && theme === "dark";

	return (
		<header className="h-14 shrink-0 flex items-center justify-between px-6 gap-4 liquid-glass-surface border-0 border-b border-b-black/6 dark:border-b-white/6">
			{/* Left side — sidebar toggle + search */}
			<div className="flex items-center gap-2 flex-1 min-w-0">
				<button
					className={cn(
						"h-8 w-8 rounded-lg hidden md:flex items-center justify-center transition-colors cursor-pointer",
						"text-muted-foreground/70 hover:text-foreground hover:bg-muted/50"
					)}
					title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
					onClick={() => setSidebarOpen(!sidebarOpen)}
				>
					<PanelLeft className="h-4 w-4" />
				</button>
				<div className="relative max-w-sm w-full hidden sm:block">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/50" />
					<input
						type="text"
						placeholder={t("search") || "Search..."}
						className="h-9 w-full rounded-lg border border-black/6 dark:border-white/6 bg-muted/30 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background focus:border-transparent transition-all"
					/>
				</div>
			</div>

			{/* Right side — actions + profile */}
			<div className="flex items-center gap-1.5 shrink-0">
				{/* Development Roadmap */}
				<Link
					href="/auth/admin/roadmap"
					className={cn(
						"h-8 w-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer",
						"text-muted-foreground/70 hover:text-foreground hover:bg-muted/50"
					)}
					title={t("development_roadmap") || "Development Roadmap"}
				>
					<Map className="h-4 w-4" />
				</Link>

				{/* Getting Started Guide */}
				<Link
					href="/auth/admin/guide"
					className={cn(
						"h-8 w-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer",
						"text-muted-foreground/70 hover:text-foreground hover:bg-muted/50"
					)}
					title={t("getting_started") || "Getting Started Guide"}
				>
					<HelpCircle className="h-4 w-4" />
				</Link>

				{/* Notification Bell */}
				<NotificationBell />

				{/* Dark/Light mode toggle */}
				<button
					className={cn(
						"h-8 w-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer",
						"text-muted-foreground/70 hover:text-foreground hover:bg-muted/50"
					)}
					title={isDark ? "Switch to light mode" : "Switch to dark mode"}
					onClick={() => setTheme(isDark ? "light" : "dark")}
				>
					{isDark ? (
						<Sun className="h-4 w-4" />
					) : (
						<Moon className="h-4 w-4" />
					)}
				</button>

				{/* Language toggle */}
				<button
					className={cn(
						"h-8 px-2.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer",
						"text-muted-foreground/70 hover:text-foreground hover:bg-muted/50"
					)}
					title={language === "en" ? "Switch to Khmer" : "Switch to English"}
					onClick={() => setLanguage(language === "en" ? "km" : "en")}
				>
					{language === "en" ? "EN" : "KM"}
				</button>

				{/* Divider */}
				<div className="h-6 w-px bg-border/50 mx-1" />

				{/* Profile dropdown */}
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button className="flex items-center gap-2.5 h-9 pl-1.5 pr-2.5 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
							<div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold shrink-0 ring-2 ring-primary/10">
								{initials}
							</div>
							<div className="hidden md:flex flex-col items-start">
								<span className="text-sm font-medium text-foreground leading-tight truncate max-w-30">
									{user?.name || "Profile"}
								</span>
								<span className="text-xs text-muted-foreground/60 leading-tight capitalize">
									{roleLabel}
								</span>
							</div>
							<ChevronDown className="h-3.5 w-3.5 text-muted-foreground/40 hidden md:block" />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-56">
						<DropdownMenuLabel className="font-normal">
							<div className="flex flex-col space-y-1">
								<p className="text-sm font-medium leading-none">
									{user?.name || "Profile"}
								</p>
								<p className="text-xs text-muted-foreground leading-none font-mono">
									ID: {user?.user_id}
								</p>
								<p className="text-xs text-muted-foreground leading-none capitalize">
									{roleLabel}
								</p>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem asChild className="cursor-pointer">
							<Link href="/auth/settings/profile">
								<User className="h-4 w-4" />
								{t("profile")}
							</Link>
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							className="cursor-pointer text-destructive/80 focus:text-destructive focus:bg-destructive/5"
							onClick={logout}
						>
							<LogOut className="h-4 w-4" />
							{t("logout")}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</header>
	);
}
