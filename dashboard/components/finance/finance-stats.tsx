"use client";

import { motion } from "framer-motion";
import {
	DollarSign,
	Clock,
	AlertTriangle,
	Users,
	TrendingUp,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { FinanceSummary } from "@/types/finance";
import { useLanguage } from "@/contexts/language-context";

interface FinanceStatsProps {
	summary: FinanceSummary | null;
	isLoading?: boolean;
}

const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
		},
	},
};

const itemVariants = {
	hidden: { y: 20, opacity: 0 },
	visible: {
		y: 0,
		opacity: 1,
		transition: {
			type: "spring",
			stiffness: 100,
		},
	},
};

export function FinanceStats({ summary, isLoading }: FinanceStatsProps) {
	const { t } = useLanguage();

	const formatCurrency = (amount: number, currency: string = "USD") => {
		if (currency === "KHR") {
			return `${amount.toLocaleString()}៛`;
		}
		return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
	};

	const stats = [
		{
			label: t("total_collected") || "Total Collected",
			value: summary
				? formatCurrency(summary.totalCollected, summary.currency)
				: "$0.00",
			icon: DollarSign,
			color: "from-emerald-500 to-green-600",
			bgColor: "bg-emerald-500/10",
			textColor: "text-emerald-600",
		},
		{
			label: t("pending_amount") || "Pending Amount",
			value: summary
				? formatCurrency(summary.totalPending, summary.currency)
				: "$0.00",
			icon: Clock,
			color: "from-amber-500 to-yellow-600",
			bgColor: "bg-amber-500/10",
			textColor: "text-amber-600",
		},
		{
			label: t("overdue_amount") || "Overdue Amount",
			value: summary
				? formatCurrency(summary.totalOverdue, summary.currency)
				: "$0.00",
			icon: AlertTriangle,
			color: "from-red-500 to-rose-600",
			bgColor: "bg-red-500/10",
			textColor: "text-red-600",
		},
		{
			label: t("students_with_balance") || "Students with Balance",
			value: summary
				? `${summary.studentsWithBalance} / ${summary.totalStudents}`
				: "0 / 0",
			icon: Users,
			color: "from-blue-500 to-indigo-600",
			bgColor: "bg-blue-500/10",
			textColor: "text-blue-600",
		},
		{
			label: t("collection_rate") || "Collection Rate",
			value: summary ? `${summary.collectionRate.toFixed(1)}%` : "0%",
			icon: TrendingUp,
			color: "from-purple-500 to-violet-600",
			bgColor: "bg-purple-500/10",
			textColor: "text-purple-600",
		},
	];

	if (isLoading) {
		return (
			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="visible"
				className="grid gap-4 grid-cols-2 lg:grid-cols-5"
			>
				{[1, 2, 3, 4, 5].map((i) => (
					<motion.div key={i} variants={itemVariants}>
						<Card className="p-4">
							<div className="animate-pulse">
								<div className="h-4 bg-muted rounded w-24 mb-2" />
								<div className="h-6 bg-muted rounded w-16" />
							</div>
						</Card>
					</motion.div>
				))}
			</motion.div>
		);
	}

	return (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			className="grid gap-4 grid-cols-2 lg:grid-cols-5"
		>
			{stats.map((stat, index) => (
				<motion.div key={index} variants={itemVariants}>
					<Card className="p-4 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
						{/* Background gradient */}
						<div
							className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
						/>

						<div className="flex items-start justify-between gap-2">
							<div className="space-y-1">
								<p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
									{stat.label}
								</p>
								<p className="text-xl font-bold tracking-tight">{stat.value}</p>
							</div>
							<div className={`p-2 rounded-lg ${stat.bgColor}`}>
								<stat.icon className={`w-4 h-4 ${stat.textColor}`} />
							</div>
						</div>
					</Card>
				</motion.div>
			))}
		</motion.div>
	);
}
