"use client";

import { motion } from "framer-motion";
import {
	User,
	Mail,
	Shield,
	Building2,
	Calendar,
	MapPin,
	Phone,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { useDashboard } from "@/hooks/useDashboard";
import { useLanguage } from "@/contexts/language-context";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function ProfilePage() {
	const { user } = useAuth();
	const { currentRole, currentSchool } = useDashboard();
	const { t } = useLanguage();

	const containerVariants = {
		hidden: { opacity: 0, y: 20 },
		visible: {
			opacity: 1,
			y: 0,
			transition: {
				duration: 0.5,
				staggerChildren: 0.1,
			},
		},
	};

	const itemVariants = {
		hidden: { opacity: 0, x: -20 },
		visible: { opacity: 1, x: 0 },
	};

	return (
		<div className="container max-w-4xl py-10">
			<motion.div
				initial="hidden"
				animate="visible"
				variants={containerVariants}
				className="space-y-8"
			>
				{/* Header Section */}
				<div className="flex flex-col md:flex-row items-center gap-6">
					<Avatar className="h-24 w-24 border-4 border-primary/10">
						<AvatarImage src={user?.avatar_url || ""} />
						<AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-primary/80 to-primary text-white">
							{user?.name?.charAt(0).toUpperCase() || "U"}
						</AvatarFallback>
					</Avatar>
					<div className="text-center md:text-left space-y-2">
						<h1 className="text-3xl font-bold tracking-tight">
							{user?.name || t("profile")}
						</h1>
						<div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
							<Badge variant="secondary" className="px-3 py-1">
								{currentRole || "User"}
							</Badge>
							{currentSchool && (
								<div className="flex items-center gap-1 text-muted-foreground text-sm px-2">
									<Building2 className="h-4 w-4" />
									<span>{currentSchool.name.en}</span>
								</div>
							)}
						</div>
					</div>
				</div>

				<Separator />

				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{/* Main Info */}
					<div className="md:col-span-2 space-y-6">
						<Card>
							<CardHeader>
								<CardTitle>{t("personal_information")}</CardTitle>
								<CardDescription>
									Your basic account details and contact information.
								</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<motion.div
									variants={itemVariants}
									className="flex items-center gap-4 p-3 rounded-lg bg-muted/30"
								>
									<div className="p-2 bg-background rounded-md shadow-sm">
										<User className="h-5 w-5 text-primary" />
									</div>
									<div>
										<p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
											Full Name
										</p>
										<p className="font-medium">{user?.name}</p>
									</div>
								</motion.div>

								<motion.div
									variants={itemVariants}
									className="flex items-center gap-4 p-3 rounded-lg bg-muted/30"
								>
									<div className="p-2 bg-background rounded-md shadow-sm">
										<Mail className="h-5 w-5 text-primary" />
									</div>
									<div>
										<p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
											Email Address
										</p>
										<p className="font-medium">
											{user?.email || "No email provided"}
										</p>
									</div>
								</motion.div>

								<motion.div
									variants={itemVariants}
									className="flex items-center gap-4 p-3 rounded-lg bg-muted/30"
								>
									<div className="p-2 bg-background rounded-md shadow-sm">
										<Shield className="h-5 w-5 text-primary" />
									</div>
									<div>
										<p className="text-xs text-muted-foreground uppercase font-semibold tracking-wider">
											Account Status
										</p>
										<div className="flex items-center gap-2">
											<div className="h-2 w-2 rounded-full bg-green-500" />
											<p className="font-medium underline-offset-4 decoration-green-500 decoration-2">
												Active
											</p>
										</div>
									</div>
								</motion.div>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Other Details</CardTitle>
								<CardDescription>
									Additional information associated with your account.
								</CardDescription>
							</CardHeader>
							<CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<div className="flex items-center gap-3">
									<Phone className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">Not provided</span>
								</div>
								<div className="flex items-center gap-3">
									<MapPin className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">Cambodia</span>
								</div>
								<div className="flex items-center gap-3">
									<Calendar className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">Joined Oct 2024</span>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Sidebar Info */}
					<div className="space-y-6">
						<Card className="bg-primary/[0.02] border-primary/10">
							<CardHeader>
								<CardTitle className="text-lg">Security</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<p className="text-sm text-muted-foreground">
									Your account is protected by KOOMPI ID authentication.
								</p>
								<Badge
									variant="outline"
									className="w-full justify-center py-2 shadow-sm"
								>
									KOOMPI ID Verified
								</Badge>
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle className="text-lg">Role Permissions</CardTitle>
							</CardHeader>
							<CardContent>
								<p className="text-sm text-muted-foreground">
									You have access to <strong>{currentRole}</strong> level
									features in <strong>{currentSchool?.name.en}</strong>.
								</p>
							</CardContent>
						</Card>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
