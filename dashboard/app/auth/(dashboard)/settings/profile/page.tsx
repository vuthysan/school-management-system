"use client";

import {
	User,
	Mail,
	Shield,
	Building2,
	Calendar,
	MapPin,
	Phone,
	Hash,
	Copy,
	Check,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useDashboard } from "@/hooks/useDashboard";
import { useLanguage } from "@/contexts/language-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/page-header";

export default function ProfilePage() {
	const { user } = useAuth();
	const [copied, setCopied] = useState(false);

	const handleCopyUserId = () => {
		if (user?.user_id) {
			navigator.clipboard.writeText(user.user_id);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		}
	};
	const { currentRole, currentSchool } = useDashboard();
	const { t } = useLanguage();

	return (
		<div className="space-y-6 pb-10">
			<PageHeader
				title={t("profile") || "Profile"}
				subtitle={t("personal_information") || "Your account details"}
				icon={User}
			/>

			{/* Profile Header */}
			<div className="liquid-glass-card rounded-2xl px-6 py-5">
				<div className="flex flex-col sm:flex-row items-center gap-5">
					<Avatar className="h-16 w-16 border-2 border-black/6 dark:border-white/6">
						<AvatarImage
							src={(user as any)?.avatar_url || user?.picture || ""}
						/>
						<AvatarFallback className="text-xl font-semibold bg-primary/10 text-primary">
							{user?.name?.charAt(0).toUpperCase() || "U"}
						</AvatarFallback>
					</Avatar>
					<div className="text-center sm:text-left space-y-1.5">
						<h2 className="text-lg font-semibold text-foreground tracking-tight">
							{user?.name || t("profile")}
						</h2>
						<div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
							<Badge variant="secondary" className="bg-primary/8 text-primary border-none text-xs font-medium font-mono">
								ID: {user?.user_id}
							</Badge>
							<Badge variant="secondary" className="bg-primary/8 text-primary border-none text-xs font-medium">
								{currentRole || "User"}
							</Badge>
							{currentSchool && (
								<div className="flex items-center gap-1.5 text-muted-foreground text-xs">
									<Building2 className="h-3 w-3" />
									<span>{currentSchool.name.en}</span>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{/* Personal Information */}
				<div className="md:col-span-2">
					<div className="liquid-glass-card rounded-2xl overflow-hidden">
						<div className="px-4 py-3 border-b border-black/6 dark:border-white/6">
							<h3 className="text-sm font-semibold text-foreground">{t("personal_information")}</h3>
							<p className="text-xs text-muted-foreground mt-0.5">
								{t("basic_account_details") || "Your basic account details and contact information."}
							</p>
						</div>
						<div className="divide-y divide-black/6 dark:divide-white/6">
							<div className="flex items-center gap-3.5 px-4 py-3">
								<div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center shrink-0">
									<Hash className="h-4 w-4 text-violet-600 dark:text-violet-400" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-xs text-muted-foreground font-medium">{t("user_id") || "User ID"}</p>
									<p className="text-sm font-bold text-foreground font-mono tracking-wider">{user?.user_id}</p>
								</div>
								<button
									onClick={handleCopyUserId}
									className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
									title={t("copy") || "Copy"}
								>
									{copied ? (
										<Check className="h-4 w-4 text-emerald-500" />
									) : (
										<Copy className="h-4 w-4" />
									)}
								</button>
							</div>
							<div className="flex items-center gap-3.5 px-4 py-3">
								<div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center shrink-0">
									<User className="h-4 w-4 text-blue-600 dark:text-blue-400" />
								</div>
								<div className="min-w-0">
									<p className="text-xs text-muted-foreground font-medium">{t("full_name") || "Full Name"}</p>
									<p className="text-sm font-medium text-foreground">{user?.name}</p>
								</div>
							</div>
							<div className="flex items-center gap-3.5 px-4 py-3">
								<div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center shrink-0">
									<Mail className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
								</div>
								<div className="min-w-0">
									<p className="text-xs text-muted-foreground font-medium">{t("email") || "Email Address"}</p>
									<p className="text-sm font-medium text-foreground">{user?.email || "No email provided"}</p>
								</div>
							</div>
							<div className="flex items-center gap-3.5 px-4 py-3">
								<div className="w-8 h-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center shrink-0">
									<Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
								</div>
								<div className="min-w-0">
									<p className="text-xs text-muted-foreground font-medium">{t("account_status") || "Account Status"}</p>
									<div className="flex items-center gap-1.5">
										<div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
										<span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">{t("active") || "Active"}</span>
									</div>
								</div>
							</div>
						</div>

						{/* Other details */}
						<div className="px-4 py-3 border-t border-black/6 dark:border-white/6">
							<p className="text-xs text-muted-foreground font-medium mb-3">{t("other_details") || "Other Details"}</p>
							<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
								<div className="flex items-center gap-2">
									<Phone className="h-3.5 w-3.5 text-muted-foreground" />
									<span className="text-sm text-muted-foreground">{t("not_provided") || "Not provided"}</span>
								</div>
								<div className="flex items-center gap-2">
									<MapPin className="h-3.5 w-3.5 text-muted-foreground" />
									<span className="text-sm text-muted-foreground">Cambodia</span>
								</div>
								<div className="flex items-center gap-2">
									<Calendar className="h-3.5 w-3.5 text-muted-foreground" />
									<span className="text-sm text-muted-foreground">Joined Oct 2024</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Sidebar */}
				<div className="space-y-4">
					<div className="liquid-glass-card rounded-2xl overflow-hidden">
						<div className="px-4 py-3 border-b border-black/6 dark:border-white/6">
							<h3 className="text-sm font-semibold text-foreground">{t("security") || "Security"}</h3>
						</div>
						<div className="px-4 py-3 space-y-3">
							<p className="text-sm text-muted-foreground">
								{t("koompi_auth_message") || "Your account is protected by KOOMPI ID authentication."}
							</p>
							<Badge variant="secondary" className="w-full justify-center py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border-none">
								KOOMPI ID Verified
							</Badge>
						</div>
					</div>

					<div className="liquid-glass-card rounded-2xl overflow-hidden">
						<div className="px-4 py-3 border-b border-black/6 dark:border-white/6">
							<h3 className="text-sm font-semibold text-foreground">{t("role_permissions") || "Role Permissions"}</h3>
						</div>
						<div className="px-4 py-3">
							<p className="text-sm text-muted-foreground">
								{t("role_access_message") || "You have access to"}{" "}
								<span className="font-medium text-foreground">{currentRole}</span>{" "}
								{t("level_features_in") || "level features in"}{" "}
								<span className="font-medium text-foreground">{currentSchool?.name.en}</span>.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
