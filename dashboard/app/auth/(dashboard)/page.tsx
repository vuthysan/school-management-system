"use client";

import { motion } from "framer-motion";
import {
	Users,
	GraduationCap,
	BookOpen,
	TrendingUp,
	Calendar,
	DollarSign,
	AlertCircle,
	Building,
	BarChart3,
	Clock,
	CheckCircle2,
	XCircle,
	ArrowRight,
	ArrowUpRight,
	Megaphone,
} from "lucide-react";

import { useDashboard } from "@/hooks/useDashboard";
import Link from "next/link";
import { AnnouncementFeed } from "@/components/dashboard/announcement-feed";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/dashboard/loading-state";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const stats = {
	admin: [
		{ title: "Total Students", value: "1,234", icon: Users, color: "blue" as const },
		{ title: "Total Teachers", value: "89", icon: GraduationCap, color: "emerald" as const },
		{ title: "Active Classes", value: "42", icon: BookOpen, color: "violet" as const },
		{ title: "Attendance Rate", value: "94.5%", icon: TrendingUp, color: "amber" as const },
	],
	teacher: [
		{ title: "My Classes", value: "6", icon: BookOpen, color: "blue" as const },
		{ title: "Total Students", value: "187", icon: Users, color: "emerald" as const },
		{ title: "Avg. Attendance", value: "92%", icon: TrendingUp, color: "violet" as const },
		{ title: "Pending Grades", value: "23", icon: AlertCircle, color: "amber" as const },
	],
	parent: [
		{ title: "Children", value: "2", icon: Users, color: "blue" as const },
		{ title: "Attendance", value: "96%", icon: Calendar, color: "emerald" as const },
		{ title: "Avg. Grade", value: "A-", icon: GraduationCap, color: "violet" as const },
		{ title: "Outstanding Fees", value: "$450", icon: DollarSign, color: "amber" as const },
	],
	student: [
		{ title: "My Classes", value: "8", icon: BookOpen, color: "blue" as const },
		{ title: "Attendance", value: "95%", icon: Calendar, color: "emerald" as const },
		{ title: "Current GPA", value: "3.7", icon: GraduationCap, color: "violet" as const },
		{ title: "Assignments Due", value: "4", icon: AlertCircle, color: "amber" as const },
	],
	owner: [
		{ title: "Total Revenue", value: "$125K", icon: DollarSign, color: "emerald" as const },
		{ title: "Total Students", value: "2,456", icon: Users, color: "blue" as const },
		{ title: "Active Branches", value: "3", icon: Building, color: "violet" as const },
		{ title: "Staff Count", value: "156", icon: GraduationCap, color: "amber" as const },
	],
	ministry: [
		{ title: "Total Schools", value: "1,234", icon: Building, color: "blue" as const },
		{ title: "Total Students", value: "456K", icon: Users, color: "emerald" as const },
		{ title: "Total Teachers", value: "23K", icon: GraduationCap, color: "violet" as const },
		{ title: "Compliance Rate", value: "87%", icon: BarChart3, color: "amber" as const },
	],
};

const recentActivities = {
	admin: [
		{ title: "New student enrollment", description: "John Doe enrolled in Grade 10A", time: "5 min ago", icon: Users },
		{ title: "Attendance submitted", description: "Grade 9B attendance marked by Ms. Smith", time: "1 hr ago", icon: CheckCircle2 },
		{ title: "Fee payment received", description: "$500 payment from Sarah Johnson", time: "2 hrs ago", icon: DollarSign },
		{ title: "New teacher added", description: "Mr. Brown joined as Math teacher", time: "3 hrs ago", icon: GraduationCap },
	],
	teacher: [
		{ title: "Assignment submitted", description: "Math homework from Grade 10A", time: "10 min ago", icon: BookOpen },
		{ title: "Parent message", description: "Message from Mrs. Johnson about exam", time: "1 hr ago", icon: Users },
		{ title: "Attendance reminder", description: "Mark attendance for Grade 9B", time: "2 hrs ago", icon: AlertCircle },
	],
	parent: [
		{ title: "Grade updated", description: "Math test score: A (95%)", time: "30 min ago", icon: GraduationCap },
		{ title: "Fee reminder", description: "Tuition fee due in 5 days", time: "2 hrs ago", icon: DollarSign },
		{ title: "School announcement", description: "Parent-teacher meeting on Friday", time: "1 day ago", icon: Calendar },
	],
	student: [
		{ title: "New assignment", description: "Physics homework due Friday", time: "1 hr ago", icon: BookOpen },
		{ title: "Grade posted", description: "Chemistry quiz: B+ (88%)", time: "3 hrs ago", icon: GraduationCap },
		{ title: "Library reminder", description: "Return 'Physics Fundamentals' by tomorrow", time: "1 day ago", icon: AlertCircle },
	],
	owner: [
		{ title: "Revenue milestone", description: "Monthly revenue exceeded target by 15%", time: "2 hrs ago", icon: TrendingUp },
		{ title: "New branch proposal", description: "Siem Reap branch feasibility study completed", time: "5 hrs ago", icon: Building },
		{ title: "Compliance report", description: "Q4 MoEYS report submitted successfully", time: "1 day ago", icon: CheckCircle2 },
	],
	ministry: [
		{ title: "New school registered", description: "International School of Phnom Penh", time: "1 hr ago", icon: Building },
		{ title: "Compliance alert", description: "3 schools pending accreditation review", time: "3 hrs ago", icon: AlertCircle },
		{ title: "National report", description: "Q4 education statistics published", time: "1 day ago", icon: BarChart3 },
	],
};

const quickActions = [
	{
		icon: Users,
		label: "Students",
		description: "Manage enrollment",
		href: "/auth/admin/students",
		color: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
	},
	{
		icon: Calendar,
		label: "Attendance",
		description: "Mark daily records",
		href: "/auth/admin/attendance",
		color: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
	},
	{
		icon: BookOpen,
		label: "Classes",
		description: "View & manage",
		href: "/auth/admin/academic",
		color: "bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400",
	},
	{
		icon: DollarSign,
		label: "Finance",
		description: "Fees & payments",
		href: "/auth/admin/finance",
		color: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
	},
	{
		icon: GraduationCap,
		label: "Teachers",
		description: "Staff directory",
		href: "/auth/admin/hr",
		color: "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400",
	},
	{
		icon: Megaphone,
		label: "Notices",
		description: "Communication",
		href: "/auth/admin/communication",
		color: "bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400",
	},
];

const upcomingEvents = [
	{
		date: "10",
		month: "MAR",
		title: "Parent Meeting",
		subtitle: "Main Hall, 9:00 AM",
	},
	{
		date: "15",
		month: "MAR",
		title: "Final Exams",
		subtitle: "All grades",
	},
	{
		date: "25",
		month: "MAR",
		title: "Winter Break",
		subtitle: "School closed",
	},
];

const activityIconColors = [
	"bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
	"bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400",
	"bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400",
	"bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function DashboardPage() {
	const {
		currentSchool,
		currentRole,
		memberships,
		isLoading,
		error,
		hasSchools,
		user,
	} = useDashboard();
	const schoolId = currentSchool?.idStr || currentSchool?.id || null;

	const uiRole = currentRole?.toLowerCase() || "admin";
	const roleForStats =
		uiRole === "owner"
			? "owner"
			: uiRole === "teacher"
				? "teacher"
				: uiRole === "student"
					? "student"
					: uiRole === "parent"
						? "parent"
						: "admin";

	const currentStats =
		hasSchools && currentSchool?.stats
			? [
					{
						title: "Total Students",
						value: currentSchool.stats.totalStudents?.toString() || "0",
						icon: Users,
						color: "blue" as const,
					},
					{
						title: "Total Teachers",
						value: currentSchool.stats.totalTeachers?.toString() || "0",
						icon: GraduationCap,
						color: "emerald" as const,
					},
					{
						title: "Active Classes",
						value: currentSchool.stats.totalClasses?.toString() || "0",
						icon: BookOpen,
						color: "violet" as const,
					},
					{
						title: "Branches",
						value: currentSchool.stats.totalBranches?.toString() || "0",
						icon: Building,
						color: "amber" as const,
					},
				]
			: stats[roleForStats as keyof typeof stats] || stats.admin;

	const currentActivities =
		recentActivities[roleForStats as keyof typeof recentActivities] ||
		recentActivities.admin;

	// Loading state — skeleton UI
	if (isLoading) {
		return <LoadingState variant="page" />;
	}

	// Error state
	if (error) {
		return (
			<div className="min-h-[60vh] flex items-center justify-center p-6">
				<div className="text-center p-8 liquid-glass-card rounded-2xl max-w-sm w-full">
					<XCircle className="h-10 w-10 text-destructive/50 mx-auto mb-3" />
					<h3 className="text-lg font-semibold text-foreground mb-1.5">
						Something went wrong
					</h3>
					<p className="text-sm text-muted-foreground">{error}</p>
				</div>
			</div>
		);
	}

	const schoolName =
		hasSchools && currentSchool ? currentSchool.name.en : "Academic Hub";

	return (
		<div className="space-y-6 pb-10">
			{/* Header */}
			<PageHeader
				title={schoolName}
				subtitle={`Welcome back, ${user?.name || "Member"}. Here's your daily overview.`}
				icon={Building}
			>
				{memberships.length > 1 && (
					<div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/8 text-xs font-medium text-primary border border-primary/15">
						<Building className="w-3.5 h-3.5" />
						{memberships.length} Schools
					</div>
				)}
			</PageHeader>

			{/* No school alert */}
			{!hasSchools && (
				<motion.div
					initial={{ opacity: 0, y: -8 }}
					animate={{ opacity: 1, y: 0 }}
					className="p-4 bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200 rounded-2xl border border-blue-200 dark:border-blue-800/40"
				>
					<div className="flex items-start gap-3">
						<div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center shrink-0">
							<AlertCircle className="w-4 h-4" />
						</div>
						<div>
							<h3 className="font-semibold text-sm mb-0.5">
								No School Membership Found
							</h3>
							<p className="text-sm opacity-80">
								You aren't managing any schools yet. Contact your
								administrator to be added to a school.
							</p>
						</div>
					</div>
				</motion.div>
			)}

			{/* Stats Grid */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				{currentStats.map((stat: any, index: number) => (
					<StatsCard
						key={index}
						title={stat.title}
						value={stat.value}
						icon={stat.icon}
						color={stat.color}
						delay={index * 0.05}
						trend={{ value: 12, isPositive: true }}
					/>
				))}
			</div>

			{/* Quick Actions */}
			<motion.div
				initial={{ opacity: 0, y: 8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.15, duration: 0.3 }}
			>
				<h2 className="text-sm font-semibold text-foreground mb-3">
					Quick Actions
				</h2>
				<div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
					{quickActions.map((action, i) => (
						<Link key={i} href={action.href}>
							<div className="liquid-glass-card rounded-2xl p-4 flex flex-col items-center text-center gap-3 hover:border-primary/20 cursor-pointer group h-full">
								<div
									className={cn(
										"w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105",
										action.color
									)}
								>
									<action.icon className="w-4.5 h-4.5" strokeWidth={1.8} />
								</div>
								<div>
									<span className="text-sm font-medium text-foreground block leading-tight">
										{action.label}
									</span>
									<span className="text-xs text-muted-foreground/70 mt-0.5 block">
										{action.description}
									</span>
								</div>
							</div>
						</Link>
					))}
				</div>
			</motion.div>

			{/* Content Grid: Activity + Sidebar */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				{/* Recent Activity - Takes 2 cols */}
				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.3 }}
					className="lg:col-span-2"
				>
					<div className="liquid-glass-card rounded-2xl overflow-hidden h-full">
						<div className="flex items-center justify-between px-4 py-3 border-b border-black/6 dark:border-white/6">
							<h2 className="text-sm font-semibold text-foreground flex items-center gap-2">
								<div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
									<Clock className="w-3 h-3 text-blue-600 dark:text-blue-400" strokeWidth={2} />
								</div>
								Recent Activity
							</h2>
							<Button
								variant="ghost"
								size="sm"
								className="text-xs text-muted-foreground hover:text-foreground h-7 px-2"
							>
								View All
								<ArrowRight className="w-3 h-3 ml-1" />
							</Button>
						</div>

						<div className="divide-y divide-black/6 dark:divide-white/6">
							{currentActivities.map((activity, index) => {
								const Icon = activity.icon;
								return (
									<motion.div
										key={index}
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.05 * index }}
										className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors cursor-pointer group"
									>
										<div
											className={cn(
												"w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
												activityIconColors[index % activityIconColors.length]
											)}
										>
											<Icon className="h-3.5 w-3.5" strokeWidth={2} />
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
												{activity.title}
											</p>
											<p className="text-xs text-muted-foreground mt-0.5 truncate">
												{activity.description}
											</p>
										</div>
										<span className="text-xs text-muted-foreground/50 whitespace-nowrap tabular-nums shrink-0">
											{activity.time}
										</span>
									</motion.div>
								);
							})}
						</div>
					</div>
				</motion.div>

				{/* Right Column */}
				<div className="space-y-4">
					{/* Upcoming Events */}
					<motion.div
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.25, duration: 0.3 }}
					>
						<div className="liquid-glass-card rounded-2xl overflow-hidden">
							<div className="px-4 py-3 border-b border-black/6 dark:border-white/6">
								<h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
									<div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-950/40 flex items-center justify-center">
										<Calendar className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
									</div>
									Upcoming Events
								</h3>
							</div>
							<div className="divide-y divide-black/6 dark:divide-white/6">
								{upcomingEvents.map((event, i) => (
									<div
										key={i}
										className="flex items-center gap-3 px-4 py-2.5 hover:bg-muted/30 transition-colors cursor-pointer group"
									>
										<div className="w-10 h-10 rounded-lg bg-muted/60 flex flex-col items-center justify-center shrink-0">
											<span className="text-xs uppercase font-semibold leading-none text-muted-foreground">
												{event.month}
											</span>
											<span className="text-sm font-bold leading-tight text-foreground">
												{event.date}
											</span>
										</div>
										<div className="flex-1 min-w-0">
											<p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-tight truncate">
												{event.title}
											</p>
											<p className="text-xs text-muted-foreground/60 mt-0.5 truncate">
												{event.subtitle}
											</p>
										</div>
										<ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground/20 group-hover:text-primary transition-colors shrink-0" />
									</div>
								))}
							</div>
						</div>
					</motion.div>

					{/* Announcements */}
					<motion.div
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3, duration: 0.3 }}
					>
						<div className="liquid-glass-card rounded-2xl px-4 py-3">
							<AnnouncementFeed schoolId={schoolId} limit={3} />
						</div>
					</motion.div>
				</div>
			</div>

			{/* Performance Analytics Placeholder */}
			<motion.div
				initial={{ opacity: 0, y: 8 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.35, duration: 0.3 }}
			>
				<div className="liquid-glass-card rounded-2xl overflow-hidden">
					<div className="px-4 py-3 border-b border-black/6 dark:border-white/6">
						<h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
							<div className="w-6 h-6 rounded-md bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center">
								<BarChart3 className="h-3 w-3 text-violet-600 dark:text-violet-400" />
							</div>
							Performance Analytics
						</h3>
					</div>
					<div className="p-8 flex items-center justify-center min-h-40">
						<div className="text-center space-y-2">
							<div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center mx-auto">
								<BarChart3 className="h-5 w-5 text-violet-500 dark:text-violet-400" />
							</div>
							<p className="text-xs text-muted-foreground">
								Analytics charts coming soon
							</p>
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
