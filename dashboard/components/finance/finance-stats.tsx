"use client";

import {
	DollarSign,
	Clock,
	AlertTriangle,
	Users,
	TrendingUp,
} from "lucide-react";

import { StatsCard } from "@/components/dashboard/stats-card";
import { FinanceSummary } from "@/types/finance";
import { useLanguage } from "@/contexts/language-context";

interface FinanceStatsProps {
	summary: FinanceSummary | null;
	isLoading?: boolean;
}

export function FinanceStats({ summary, isLoading }: FinanceStatsProps) {
	const { t } = useLanguage();

	const formatCurrency = (amount: number, currency: string = "USD") => {
		if (currency === "KHR") {
			return `${amount.toLocaleString()}៛`;
		}
		return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
	};

	if (isLoading) {
		return (
			<div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
				{[1, 2, 3, 4, 5].map((i) => (
					<div key={i} className="liquid-glass-card px-4 py-3.5 animate-pulse">
						<div className="flex items-center gap-3.5">
							<div className="w-9 h-9 rounded-lg bg-muted" />
							<div className="flex-1">
								<div className="h-5 bg-muted rounded w-16 mb-1" />
								<div className="h-3 bg-muted rounded w-20" />
							</div>
						</div>
					</div>
				))}
			</div>
		);
	}

	return (
		<div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
			<StatsCard
				title={t("total_collected") || "Total Collected"}
				value={summary ? formatCurrency(summary.totalCollected, summary.currency) : "$0.00"}
				icon={DollarSign}
				color="emerald"
				delay={0}
			/>
			<StatsCard
				title={t("pending_amount") || "Pending Amount"}
				value={summary ? formatCurrency(summary.totalPending, summary.currency) : "$0.00"}
				icon={Clock}
				color="amber"
				delay={0.05}
			/>
			<StatsCard
				title={t("overdue_amount") || "Overdue Amount"}
				value={summary ? formatCurrency(summary.totalOverdue, summary.currency) : "$0.00"}
				icon={AlertTriangle}
				color="rose"
				delay={0.1}
			/>
			<StatsCard
				title={t("students_with_balance") || "With Balance"}
				value={summary ? `${summary.studentsWithBalance}/${summary.totalStudents}` : "0/0"}
				icon={Users}
				color="blue"
				delay={0.15}
			/>
			<StatsCard
				title={t("collection_rate") || "Collection Rate"}
				value={summary ? `${summary.collectionRate.toFixed(1)}%` : "0%"}
				icon={TrendingUp}
				color="violet"
				delay={0.2}
			/>
		</div>
	);
}
