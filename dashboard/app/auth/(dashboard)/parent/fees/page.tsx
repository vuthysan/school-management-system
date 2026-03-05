"use client";

import { DollarSign, CreditCard, AlertTriangle, CheckCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useParentChildren } from "@/hooks/useParentChildren";

export default function ParentFeesPage() {
	const { t } = useTranslation();
	const { children } = useParentChildren();

	// Demo fee data per child
	const feeData = children.map((child) => ({
		childName: child.fullName,
		totalFees: 1200,
		paid: 800,
		outstanding: 400,
		payments: [
			{ date: "2026-01-15", amount: 400, method: "Cash", status: "paid" },
			{ date: "2025-12-01", amount: 400, method: "Bank Transfer", status: "paid" },
			{ date: "2026-03-01", amount: 400, method: "—", status: "pending" },
		],
	}));

	const totalFees = feeData.reduce((s, f) => s + f.totalFees, 0);
	const totalPaid = feeData.reduce((s, f) => s + f.paid, 0);
	const totalOutstanding = feeData.reduce((s, f) => s + f.outstanding, 0);

	return (
		<div className="space-y-6 pb-10">
			<PageHeader
				title={t("fee_status")}
				subtitle={t("view_fees_payments")}
				icon={DollarSign}
			/>

			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<StatsCard title={t("total_fees")} value={`$${totalFees}`} icon={DollarSign} color="blue" delay={0} />
				<StatsCard title={t("total_paid_amount")} value={`$${totalPaid}`} icon={CheckCircle} color="emerald" delay={0.05} />
				<StatsCard title={t("outstanding")} value={`$${totalOutstanding}`} icon={AlertTriangle} color="amber" delay={0.1} />
				<StatsCard title={t("children")} value={children.length.toString()} icon={CreditCard} color="violet" delay={0.15} />
			</div>

			{/* Fee cards per child */}
			{feeData.map((fee, idx) => (
				<motion.div
					key={idx}
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 + idx * 0.05 }}
				>
					<div className="liquid-glass-card rounded-2xl overflow-hidden">
						<div className="px-4 py-3 border-b border-black/6 dark:border-white/6 flex items-center justify-between">
							<h3 className="text-sm font-semibold text-foreground">{fee.childName}</h3>
							<div className="flex items-center gap-3 text-xs">
								<span className="text-emerald-600 dark:text-emerald-400">
									{t("total_paid_amount")}: ${fee.paid}
								</span>
								<span className="text-amber-600 dark:text-amber-400">
									{t("outstanding")}: ${fee.outstanding}
								</span>
							</div>
						</div>
						<Table>
							<TableHeader>
								<TableRow className="hover:bg-transparent border-b border-black/6 dark:border-white/6">
									<TableHead className="h-10 text-xs">{t("date")}</TableHead>
									<TableHead className="h-10 text-xs text-right">{t("amount")}</TableHead>
									<TableHead className="h-10 text-xs">{t("payment_method")}</TableHead>
									<TableHead className="h-10 text-xs">{t("status")}</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{fee.payments.map((p, pi) => (
									<TableRow key={pi} className="border-b border-black/4 dark:border-white/4">
										<TableCell className="text-sm">{p.date}</TableCell>
										<TableCell className="text-sm text-right font-medium tabular-nums">${p.amount}</TableCell>
										<TableCell className="text-sm text-foreground/80">{p.method}</TableCell>
										<TableCell>
											<Badge
												variant="secondary"
												className={cn(
													"border-none text-xs",
													p.status === "paid"
														? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
														: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
												)}
											>
												{p.status === "paid" ? t("paid") : t("pending_lowercase")}
											</Badge>
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</motion.div>
			))}
		</div>
	);
}
