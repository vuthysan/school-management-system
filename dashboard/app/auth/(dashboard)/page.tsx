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
	ArrowUpRight,
} from "lucide-react";

import { useDashboard } from "@/hooks/useDashboard";
import Link from "next/link";
import { AnnouncementFeed } from "@/components/dashboard/announcement-feed";
import { PageHeader } from "@/components/dashboard/page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { StatsCard } from "@/components/dashboard/stats-card";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Mock data remains the same
const stats = {
	admin: [
		{ title: "Total Students", value: "1,234", icon: Users },
		{ title: "Total Teachers", value: "89", icon: GraduationCap },
		{ title: "Active Classes", value: "42", icon: BookOpen },
		{ title: "Attendance Rate", value: "94.5%", icon: TrendingUp },
	],
	teacher: [
		{ title: "My Classes", value: "6", icon: BookOpen },
		{ title: "Total Students", value: "187", icon: Users },
		{ title: "Avg. Attendance", value: "92%", icon: TrendingUp },
		{ title: "Pending Grades", value: "23", icon: AlertCircle },
	],
	parent: [
		{ title: "Children", value: "2", icon: Users },
		{ title: "Attendance", value: "96%", icon: Calendar },
		{ title: "Avg. Grade", value: "A-", icon: GraduationCap },
		{ title: "Outstanding Fees", value: "$450", icon: DollarSign },
	],
	student: [
		{ title: "My Classes", value: "8", icon: BookOpen },
		{ title: "Attendance", value: "95%", icon: Calendar },
		{ title: "Current GPA", value: "3.7", icon: GraduationCap },
		{ title: "Assignments Due", value: "4", icon: AlertCircle },
	],
	owner: [
		{ title: "Total Revenue", value: "$125K", icon: DollarSign },
		{ title: "Total Students", value: "2,456", icon: Users },
		{ title: "Active Branches", value: "3", icon: Building },
		{ title: "Staff Count", value: "156", icon: GraduationCap },
	],
	ministry: [
		{ title: "Total Schools", value: "1,234", icon: Building },
		{ title: "Total Students", value: "456K", icon: Users },
		{ title: "Total Teachers", value: "23K", icon: GraduationCap },
		{ title: "Compliance Rate", value: "87%", icon: BarChart3 },
	],
};

const recentActivities = {
	admin: [
		{
			title: "New student enrollment",
			description: "John Doe enrolled in Grade 10A",
			time: "5 minutes ago",
			icon: Users,
			color: "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30",
		},
		{
			title: "Attendance submitted",
			description: "Grade 9B attendance marked by Ms. Smith",
			time: "1 hour ago",
			icon: CheckCircle2,
			color:
				"text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30",
		},
		{
			title: "Fee payment received",
			description: "$500 payment from Sarah Johnson",
			time: "2 hours ago",
			icon: DollarSign,
			color:
				"text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/30",
		},
		{
			title: "New teacher added",
			description: "Mr. Brown joined as Math teacher",
			time: "3 hours ago",
			icon: GraduationCap,
			color:
				"text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30",
		},
	],
	teacher: [
		{
			title: "Assignment submitted",
			description: "Math homework from Grade 10A",
			time: "10 minutes ago",
			icon: BookOpen,
			color: "text-blue-600 bg-blue-100",
		},
		{
			title: "Parent message",
			description: "Message from Mrs. Johnson about exam",
			time: "1 hour ago",
			icon: Users,
			color: "text-green-600 bg-green-100",
		},
		{
			title: "Attendance reminder",
			description: "Mark attendance for Grade 9B",
			time: "2 hours ago",
			icon: AlertCircle,
			color: "text-orange-600 bg-orange-100",
		},
	],
	parent: [
		{
			title: "Grade updated",
			description: "Math test score: A (95%)",
			time: "30 minutes ago",
			icon: GraduationCap,
			color: "text-green-600 bg-green-100",
		},
		{
			title: "Fee reminder",
			description: "Tuition fee due in 5 days",
			time: "2 hours ago",
			icon: DollarSign,
			color: "text-orange-600 bg-orange-100",
		},
		{
			title: "School announcement",
			description: "Parent-teacher meeting on Friday",
			time: "1 day ago",
			icon: Calendar,
			color: "text-blue-600 bg-blue-100",
		},
	],
	student: [
		{
			title: "New assignment",
			description: "Physics homework due Friday",
			time: "1 hour ago",
			icon: BookOpen,
			color: "text-blue-600 bg-blue-100",
		},
		{
			title: "Grade posted",
			description: "Chemistry quiz: B+ (88%)",
			time: "3 hours ago",
			icon: GraduationCap,
			color: "text-green-600 bg-green-100",
		},
		{
			title: "Library reminder",
			description: "Return 'Physics Fundamentals' by tomorrow",
			time: "1 day ago",
			icon: AlertCircle,
			color: "text-orange-600 bg-orange-100",
		},
	],
	owner: [
		{
			title: "Revenue milestone",
			description: "Monthly revenue exceeded target by 15%",
			time: "2 hours ago",
			icon: TrendingUp,
			color: "text-green-600 bg-green-100",
		},
		{
			title: "New branch proposal",
			description: "Siem Reap branch feasibility study completed",
			time: "5 hours ago",
			icon: Building,
			color: "text-blue-600 bg-blue-100",
		},
		{
			title: "Compliance report",
			description: "Q4 MoEYS report submitted successfully",
			time: "1 day ago",
			icon: CheckCircle2,
			color: "text-purple-600 bg-purple-100",
		},
	],
	ministry: [
		{
			title: "New school registered",
			description: "International School of Phnom Penh",
			time: "1 hour ago",
			icon: Building,
			color: "text-blue-600 bg-blue-100",
		},
		{
			title: "Compliance alert",
			description: "3 schools pending accreditation review",
			time: "3 hours ago",
			icon: AlertCircle,
			color: "text-orange-600 bg-orange-100",
		},
		{
			title: "National report",
			description: "Q4 education statistics published",
			time: "1 day ago",
			icon: BarChart3,
			color: "text-green-600 bg-green-100",
		},
	],
};

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
						gradient: "blue",
					},
					{
						title: "Total Teachers",
						value: currentSchool.stats.totalTeachers?.toString() || "0",
						icon: GraduationCap,
						gradient: "green",
					},
					{
						title: "Active Classes",
						value: currentSchool.stats.totalClasses?.toString() || "0",
						icon: BookOpen,
						gradient: "purple",
					},
					{
						title: "Branches",
						value: currentSchool.stats.totalBranches?.toString() || "0",
						icon: Building,
						gradient: "orange",
					},
				]
			: (stats[roleForStats as keyof typeof stats] || stats.admin).map(
					(s, idx) => ({
						...s,
						gradient: ["blue", "green", "purple", "orange"][idx % 4],
					})
				);

	const currentActivities =
		recentActivities[roleForStats as keyof typeof recentActivities] ||
		recentActivities.admin;

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center space-y-4">
					<div className="h-16 w-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin mx-auto" />
					<p className="font-bold uppercase tracking-widest text-primary animate-pulse text-sm">
						Initializing Dashboard...
					</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center p-6">
				<div className="text-center p-12 glass-card max-w-md w-full">
					<XCircle className="h-20 w-20 text-destructive mx-auto mb-6 opacity-30" />
					<h3 className="text-2xl font-black text-foreground mb-2">
						System Error
					</h3>
					<p className="text-muted-foreground">{error}</p>
				</div>
			</div>
		);
	}

	const schoolName =
		hasSchools && currentSchool ? currentSchool.name.en : "Academic Hub";

	return (
		<div className="space-y-10 pb-10">
			{/* Professional Header */}
			<PageHeader
				title={schoolName}
				subtitle={`Welcome back, ${user?.name || "Member"}! Here is your daily overview.`}
				icon={Building}
			>
				{memberships.length > 1 && (
					<div className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 font-bold text-xs uppercase tracking-widest text-foreground shadow-sm hover:bg-white/20 transition-colors cursor-pointer">
						<Building className="w-4 h-4 text-primary" />
						{memberships.length} Schools Connected
					</div>
				)}
			</PageHeader>

			{!hasSchools && (
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					className="p-8 bg-blue-500/10 text-blue-600 dark:text-blue-300 rounded-2xl border border-blue-500/20 backdrop-blur-md"
				>
					<div className="flex items-center gap-6">
						<div className="w-16 h-16 rounded-3xl bg-blue-500/20 flex items-center justify-center shadow-lg shadow-blue-500/10">
							<AlertCircle className="w-8 h-8" />
						</div>
						<div>
							<h3 className="font-bold text-xl mb-1">
								No School Membership Found
							</h3>
							<p className="opacity-80 max-w-xl">
								It looks like you aren't managing any schools yet. Contact your
								administrator to be added to a school and access specific
								features.
							</p>
						</div>
					</div>
				</motion.div>
			)}

			{/* Colorful Stats Grid */}
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
				{currentStats.map((stat: any, index: number) => (
					<StatsCard
						key={index}
						title={stat.title}
						value={stat.value}
						icon={stat.icon}
						color={stat.gradient || "blue"}
						delay={index * 0.1}
						trend={{ value: 12, isPositive: true }}
					/>
				))}
			</div>

			{/* Content Grid */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				{/* Recent Activity */}
				<div className="lg:col-span-2 space-y-6">
					<div className="flex items-center justify-between px-2">
						<h2 className="text-xl font-black uppercase tracking-tight text-foreground flex items-center gap-3">
							<div className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
								<Clock className="w-5 h-5 text-primary" strokeWidth={2.5} />
							</div>
							Recent Activity
						</h2>
						<Button
							variant="ghost"
							className="text-xs font-black uppercase tracking-widest text-primary hover:bg-primary/10 hover:text-primary"
						>
							View History
						</Button>
					</div>

					<div className="space-y-4">
						{currentActivities.map((activity, index) => {
							const Icon = activity.icon;
							return (
								<motion.div
									key={index}
									initial={{ opacity: 0, x: -20 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: 0.1 * index }}
									className=" group glass-card p-5 flex items-start gap-5 hover:border-primary/30 relative overflow-hidden"
								>
									{/* Hover Gradient */}
									<div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

									<div
										className={cn(
											"p-4 rounded-2xl smooth-transition group-hover:scale-110 shadow-sm z-10",
											"bg-white/10 dark:bg-black/20 backdrop-blur-md"
										)}
									>
										<Icon
											className="h-5 w-5 text-foreground"
											strokeWidth={2.5}
										/>
									</div>
									<div className="flex-1 min-w-0 pt-1 z-10">
										<div className="flex justify-between items-start">
											<p className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
												{activity.title}
											</p>
											<span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 whitespace-nowrap ml-2 bg-white/5 px-2 py-1 rounded-full">
												{activity.time}
											</span>
										</div>
										<p className="text-sm text-muted-foreground font-medium mt-1 pr-4">
											{activity.description}
										</p>
									</div>
								</motion.div>
							);
						})}
					</div>
				</div>

				{/* Quick Actions & Others */}
				<div className="space-y-8">
					<DashboardCard
						title="Quick Actions"
						className="glass-panel bg-transparent border-0 shadow-none p-0"
					>
						<div className="grid grid-cols-2 gap-4">
							{[
								{
									icon: Users,
									label: "Students",
									color: "blue",
									href: "/auth/admin/students",
								},
								{
									icon: Calendar,
									label: "Attendance",
									color: "green",
									href: "/auth/admin/attendance",
								},
								{
									icon: BookOpen,
									label: "Classes",
									color: "purple",
									href: "/auth/admin/academic",
								},
								{
									icon: DollarSign,
									label: "Finance",
									color: "orange",
									href: "/auth/admin/finance",
								},
							].map((action, i) => (
								<Link key={i} href={action.href} className="block">
									<div className="group glass-card p-5 flex flex-col items-center justify-center hover:border-primary/40 hover:bg-white/10 dark:hover:bg-white/5 transition-all duration-300">
										<div
											className={cn(
												"w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300",
												action.color === "blue" &&
													"bg-gradient-to-br from-blue-400 to-blue-600 shadow-blue-500/30",
												action.color === "green" &&
													"bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/30",
												action.color === "purple" &&
													"bg-gradient-to-br from-violet-400 to-violet-600 shadow-violet-500/30",
												action.color === "orange" &&
													"bg-gradient-to-br from-amber-400 to-amber-600 shadow-amber-500/30"
											)}
										>
											<action.icon className="w-6 h-6" strokeWidth={2.5} />
										</div>
										<span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
											{action.label}
										</span>
									</div>
								</Link>
							))}
						</div>
					</DashboardCard>

					<div className="glass-panel p-8">
						<AnnouncementFeed schoolId={schoolId} limit={3} />
					</div>

					<div className="space-y-5">
						<h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground ml-2 flex items-center gap-2">
							<Calendar className="w-3 h-3" />
							Upcoming Events
						</h3>
						<div className="space-y-3">
							{[
								{
									color: "bg-blue-500 shadow-blue-500/40",
									date: "10",
									month: "DEC",
									title: "Parent Meeting",
								},
								{
									color: "bg-rose-500 shadow-rose-500/40",
									date: "15",
									month: "DEC",
									title: "Final Exams",
								},
								{
									color: "bg-emerald-500 shadow-emerald-500/40",
									date: "25",
									month: "DEC",
									title: "Winter Break",
								},
							].map((event, i) => (
								<motion.div
									whileHover={{ x: 5 }}
									key={i}
									className="glass-card flex items-center gap-4 p-4 hover:border-primary/30 cursor-pointer group"
								>
									<div
										className={cn(
											"w-12 h-12 rounded-2xl flex flex-col items-center justify-center text-white font-black text-xs shadow-lg group-hover:scale-105 transition-transform",
											event.color
										)}
									>
										<span className="text-[10px] opacity-80">
											{event.month}
										</span>
										<span className="text-base leading-none">{event.date}</span>
									</div>
									<p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
										{event.title}
									</p>
									<ArrowUpRight className="w-4 h-4 ml-auto text-muted-foreground/30 group-hover:text-primary/50 transition-colors" />
								</motion.div>
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Footer Charts Section */}
			<DashboardCard
				title="Performance Analytics"
				className="glass-panel bg-transparent border-0 p-0"
			>
				<div className="glass-card p-8 flex items-center justify-center min-h-[200px]">
					<div className="text-center space-y-4">
						<div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mx-auto animate-pulse">
							<BarChart3 className="h-10 w-10 text-primary opacity-50" />
						</div>
						<p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">
							Dynamic charts rendering in real-time...
						</p>
					</div>
				</div>
			</DashboardCard>
		</div>
	);
}
