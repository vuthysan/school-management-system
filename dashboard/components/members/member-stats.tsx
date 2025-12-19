"use client";

import React, { useMemo } from "react";
import { Users, UserCheck, ShieldCheck, Building2 } from "lucide-react";
import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { Member } from "@/hooks/useMembers";
import { cn } from "@/lib/utils";

interface MemberStatsProps {
	members: Member[];
	branchCount: number;
}

export const MemberStats: React.FC<MemberStatsProps> = ({
	members,
	branchCount,
}) => {
	const { t } = useLanguage();

	const stats = useMemo(() => {
		const total = members.length;
		const activeCount = members.filter((m) => m.status === "Active").length;
		const highPrivilegeCount = members.filter((m) =>
			["Owner", "Director", "DeputyDirector", "Admin"].includes(m.role)
		).length;
		const staffAndTeachersCount = members.filter((m) =>
			["Teacher", "HeadTeacher", "Staff", "Accountant", "Librarian"].includes(
				m.role
			)
		).length;

		return {
			total,
			activeCount,
			highPrivilegeCount,
			staffAndTeachersCount,
			branchCount,
		};
	}, [members, branchCount]);

	const StatCard = ({
		title,
		value,
		icon: Icon,
		color = "blue",
		index,
	}: {
		title: string;
		value: string | number;
		icon: React.ElementType;
		color?: "blue" | "emerald" | "amber" | "violet";
		index: number;
	}) => {
		const variants = {
			blue: {
				bg: "bg-card",
				icon: "bg-blue-500 text-white shadow-blue-500/20",
				glow: "from-blue-500/10 to-transparent",
				label: "text-slate-400",
			},
			emerald: {
				bg: "bg-card",
				icon: "bg-emerald-500 text-white shadow-emerald-500/20",
				glow: "from-emerald-500/10 to-transparent",
				label: "text-slate-400",
			},
			amber: {
				bg: "bg-card",
				icon: "bg-amber-500 text-white shadow-amber-500/20",
				glow: "from-amber-500/10 to-transparent",
				label: "text-slate-400",
			},
			violet: {
				bg: "bg-card",
				icon: "bg-violet-500 text-white shadow-violet-500/20",
				glow: "from-violet-500/10 to-transparent",
				label: "text-slate-400",
			},
		};

		const style = variants[color as keyof typeof variants] || variants.blue;

		return (
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, delay: index * 0.1 }}
			>
				<Card
					className={cn(
						"relative overflow-hidden border-none rounded-lg shadow-sm transition-all duration-300 hover:shadow-md group h-[140px]",
						style.bg
					)}
				>
					<div
						className={cn(
							"absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l opacity-50 group-hover:opacity-100 transition-opacity duration-500",
							style.glow
						)}
					/>

					<CardContent className="p-6 h-full flex items-center justify-between relative z-10">
						<div className="flex flex-col justify-between h-full py-1">
							<h3
								className={cn(
									"text-xs font-medium tracking-wide uppercase",
									style.label
								)}
							>
								{title}
							</h3>
							<span className="text-4xl font-black tracking-tighter text-slate-900">
								{value}
							</span>
						</div>

						<div
							className={cn(
								"p-4 rounded-lg shadow-xl transition-transform duration-500 group-hover:scale-110",
								style.icon
							)}
						>
							<Icon className="h-7 w-7" />
						</div>
					</CardContent>
				</Card>
			</motion.div>
		);
	};

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
			<StatCard
				index={0}
				title={t("total_members")}
				value={stats.total}
				icon={Users}
				color="blue"
			/>
			<StatCard
				index={1}
				title={t("active_members")}
				value={stats.activeCount}
				icon={UserCheck}
				color="emerald"
			/>
			<StatCard
				index={2}
				title={t("admins_directors")}
				value={stats.highPrivilegeCount}
				icon={ShieldCheck}
				color="amber"
			/>
			<StatCard
				index={3}
				title={t("branches")}
				value={stats.branchCount}
				icon={Building2}
				color="violet"
			/>
		</div>
	);
};
