"use client";

import { useState } from "react";
import {
	DollarSign,
	Check,
	Clock,
	Loader2,
	Play,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { LoadingState } from "@/components/dashboard/loading-state";
import {
	type PayrollRecord,
	type GeneratePayrollInput,
	type BatchPayrollResult,
} from "@/hooks/useStaff";

interface PayrollTableProps {
	payrolls: PayrollRecord[];
	loading: boolean;
	schoolId: string;
	selectedMonth: string;
	onMonthChange: (month: string) => void;
	onGenerate: (input: GeneratePayrollInput) => Promise<BatchPayrollResult>;
	onMarkPaid: (id: string) => Promise<void>;
	mutationLoading: boolean;
}

export function PayrollTable({
	payrolls,
	loading,
	schoolId,
	selectedMonth,
	onMonthChange,
	onGenerate,
	onMarkPaid,
	mutationLoading,
}: PayrollTableProps) {
	const { t } = useTranslation();
	const [generateDialogOpen, setGenerateDialogOpen] = useState(false);
	const [defaultBonuses, setDefaultBonuses] = useState(0);
	const [defaultDeductions, setDefaultDeductions] = useState(0);
	const [generateResult, setGenerateResult] =
		useState<BatchPayrollResult | null>(null);

	const handleGenerate = async () => {
		try {
			const result = await onGenerate({
				schoolId,
				month: selectedMonth,
				defaultBonuses: defaultBonuses || undefined,
				defaultDeductions: defaultDeductions || undefined,
			});
			setGenerateResult(result);
		} catch {
			// Error handled by parent
		}
	};

	const handleCloseGenerate = () => {
		setGenerateDialogOpen(false);
		setGenerateResult(null);
		setDefaultBonuses(0);
		setDefaultDeductions(0);
	};

	const totalNetSalary = payrolls.reduce((sum, p) => sum + p.netSalary, 0);
	const paidCount = payrolls.filter((p) => p.status === "paid").length;
	const pendingCount = payrolls.filter((p) => p.status === "pending").length;

	return (
		<>
			{/* Payroll Controls */}
			<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 border-b border-black/6 dark:border-white/6">
				<div className="flex items-center gap-3">
					<Input
						type="month"
						value={selectedMonth}
						onChange={(e) => onMonthChange(e.target.value)}
						className="w-44"
					/>
					{payrolls.length > 0 && (
						<div className="flex items-center gap-3 text-xs text-muted-foreground">
							<span>
								{t("total")}: {payrolls[0]?.currency || "USD"}{" "}
								{totalNetSalary.toLocaleString()}
							</span>
							<span className="text-muted-foreground/30">|</span>
							<span className="text-emerald-600 dark:text-emerald-400">
								{paidCount} {t("paid")}
							</span>
							<span className="text-amber-600 dark:text-amber-400">
								{pendingCount} {t("pending_lowercase")}
							</span>
						</div>
					)}
				</div>
				<Button
					size="sm"
					className="gap-2"
					onClick={() => setGenerateDialogOpen(true)}
				>
					<Play className="h-3.5 w-3.5" />
					{t("generate_payroll")}
				</Button>
			</div>

			{/* Payroll Table */}
			<Table>
				<TableHeader>
					<TableRow className="hover:bg-transparent border-b border-black/6 dark:border-white/6">
						<TableHead className="h-10 text-xs font-medium text-muted-foreground">
							{t("staff_member")}
						</TableHead>
						<TableHead className="h-10 text-xs font-medium text-muted-foreground">
							{t("month")}
						</TableHead>
						<TableHead className="h-10 text-xs font-medium text-muted-foreground text-right">
							{t("base_salary")}
						</TableHead>
						<TableHead className="h-10 text-xs font-medium text-muted-foreground text-right">
							{t("bonuses")}
						</TableHead>
						<TableHead className="h-10 text-xs font-medium text-muted-foreground text-right">
							{t("deductions")}
						</TableHead>
						<TableHead className="h-10 text-xs font-medium text-muted-foreground text-right">
							{t("net_salary")}
						</TableHead>
						<TableHead className="h-10 text-xs font-medium text-muted-foreground">
							{t("status")}
						</TableHead>
						<TableHead className="text-right h-10 text-xs font-medium text-muted-foreground">
							{t("actions")}
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					<AnimatePresence mode="popLayout">
						{loading ? (
							<TableRow>
								<TableCell colSpan={8}>
									<LoadingState message={t("loading_payroll")} />
								</TableCell>
							</TableRow>
						) : payrolls.length === 0 ? (
							<TableRow>
								<TableCell colSpan={8} className="h-60 text-center">
									<div className="flex flex-col items-center justify-center gap-3">
										<div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center">
											<DollarSign className="h-5 w-5 text-muted-foreground" />
										</div>
										<div className="space-y-1">
											<p className="text-sm font-medium text-foreground">
												{t("no_payroll_records")}
											</p>
											<p className="text-xs text-muted-foreground max-w-xs mx-auto">
												{t("no_payroll_desc")}
											</p>
										</div>
										<Button
											size="sm"
											onClick={() => setGenerateDialogOpen(true)}
											className="mt-1 gap-2"
										>
											<Play className="h-4 w-4" />
											{t("generate_payroll")}
										</Button>
									</div>
								</TableCell>
							</TableRow>
						) : (
							payrolls.map((payroll, index) => (
								<motion.tr
									key={payroll.id}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ delay: index * 0.03 }}
									className="group hover:bg-muted/30 transition-colors border-b border-black/6 dark:border-white/6"
								>
									<TableCell className="py-3">
										<span className="text-sm font-medium text-foreground">
											{payroll.staffName || payroll.staffId}
										</span>
									</TableCell>
									<TableCell>
										<span className="text-sm text-foreground/80 tabular-nums">
											{payroll.month}
										</span>
									</TableCell>
									<TableCell className="text-right">
										<span className="text-sm tabular-nums text-foreground/80">
											{payroll.baseSalary.toLocaleString()}
										</span>
									</TableCell>
									<TableCell className="text-right">
										<span className="text-sm tabular-nums text-emerald-600 dark:text-emerald-400">
											+{payroll.bonuses.toLocaleString()}
										</span>
									</TableCell>
									<TableCell className="text-right">
										<span className="text-sm tabular-nums text-red-600 dark:text-red-400">
											-{payroll.deductions.toLocaleString()}
										</span>
									</TableCell>
									<TableCell className="text-right">
										<span className="text-sm font-semibold tabular-nums text-foreground">
											<span className="text-xs text-muted-foreground/50 mr-0.5">
												{payroll.currency}
											</span>
											{payroll.netSalary.toLocaleString()}
										</span>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-1.5">
											{payroll.status === "paid" ? (
												<Check className="w-3 h-3 text-emerald-500" />
											) : (
												<Clock className="w-3 h-3 text-amber-500" />
											)}
											<Badge
												variant="secondary"
												className={cn(
													"border-none text-xs font-medium",
													payroll.status === "paid"
														? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400"
														: "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400"
												)}
											>
												{payroll.status === "paid"
													? t("paid")
													: t("pending_lowercase")}
											</Badge>
										</div>
									</TableCell>
									<TableCell className="text-right">
										{payroll.status === "pending" && (
											<Button
												size="sm"
												variant="ghost"
												className="h-7 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
												onClick={() => onMarkPaid(payroll.id)}
												disabled={mutationLoading}
											>
												<Check className="h-3.5 w-3.5 mr-1" />
												{t("mark_paid")}
											</Button>
										)}
										{payroll.status === "paid" && payroll.paymentDate && (
											<span className="text-xs text-muted-foreground">
												{new Date(
													payroll.paymentDate
												).toLocaleDateString()}
											</span>
										)}
									</TableCell>
								</motion.tr>
							))
						)}
					</AnimatePresence>
				</TableBody>
			</Table>

			{/* Generate Payroll Dialog */}
			<Dialog open={generateDialogOpen} onOpenChange={handleCloseGenerate}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>{t("generate_payroll")}</DialogTitle>
						<DialogDescription>
							{t("generate_payroll_desc", { month: selectedMonth })}
						</DialogDescription>
					</DialogHeader>

					{generateResult ? (
						<div className="space-y-3">
							<div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
								<div className="flex items-center gap-2 mb-2">
									<Check className="h-5 w-5 text-emerald-600" />
									<span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
										{t("payroll_generated_success")}
									</span>
								</div>
								<div className="grid grid-cols-2 gap-2 text-sm">
									<span className="text-muted-foreground">
										{t("records_generated")}:
									</span>
									<span className="font-medium">
										{generateResult.generatedCount}
									</span>
									<span className="text-muted-foreground">
										{t("total_amount")}:
									</span>
									<span className="font-medium">
										${generateResult.totalAmount.toLocaleString()}
									</span>
								</div>
							</div>
							<DialogFooter>
								<Button onClick={handleCloseGenerate}>
									{t("done")}
								</Button>
							</DialogFooter>
						</div>
					) : (
						<>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label>{t("default_bonuses")}</Label>
									<Input
										type="number"
										min={0}
										value={defaultBonuses}
										onChange={(e) =>
											setDefaultBonuses(
												parseFloat(e.target.value) || 0
											)
										}
										placeholder="0"
									/>
								</div>
								<div className="space-y-2">
									<Label>{t("default_deductions")}</Label>
									<Input
										type="number"
										min={0}
										value={defaultDeductions}
										onChange={(e) =>
											setDefaultDeductions(
												parseFloat(e.target.value) || 0
											)
										}
										placeholder="0"
									/>
								</div>
							</div>
							<p className="text-xs text-muted-foreground">
								{t("generate_payroll_note")}
							</p>
							<DialogFooter className="gap-2">
								<Button
									variant="ghost"
									onClick={handleCloseGenerate}
								>
									{t("cancel")}
								</Button>
								<Button
									onClick={handleGenerate}
									disabled={mutationLoading}
									className="gap-2"
								>
									{mutationLoading ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<Play className="h-4 w-4" />
									)}
									{t("generate")}
								</Button>
							</DialogFooter>
						</>
					)}
				</DialogContent>
			</Dialog>
		</>
	);
}
