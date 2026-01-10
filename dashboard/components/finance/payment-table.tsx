"use client";

import { Loader2, Receipt, Calendar, CreditCard } from "lucide-react";

import { Card } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Payment, PAYMENT_STATUSES } from "@/types/finance";
import { useLanguage } from "@/contexts/language-context";

interface PaymentTableProps {
	payments: Payment[];
	isLoading: boolean;
}

export function PaymentTable({ payments, isLoading }: PaymentTableProps) {
	const { t } = useLanguage();

	const formatDate = (dateStr: string) => {
		try {
			return new Date(dateStr).toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
				hour: "2-digit",
				minute: "2-digit",
			});
		} catch {
			return dateStr;
		}
	};

	const getStatusBadge = (status: string) => {
		const statusInfo = PAYMENT_STATUSES.find((s) => s.value === status);
		const variant =
			statusInfo?.color === "success"
				? "default"
				: statusInfo?.color === "warning"
					? "secondary"
					: "destructive";

		return (
			<Badge variant={variant}>
				{t(status) || statusInfo?.label || status}
			</Badge>
		);
	};

	if (isLoading) {
		return (
			<Card className="p-8">
				<div className="flex items-center justify-center gap-2">
					<Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
					<span className="text-muted-foreground">
						{t("loading") || "Loading..."}
					</span>
				</div>
			</Card>
		);
	}

	return (
		<Card>
			<div className="p-4 border-b flex items-center gap-3">
				<div className="p-2 rounded-lg bg-emerald-500/10">
					<Receipt className="w-4 h-4 text-emerald-600" />
				</div>
				<div>
					<h3 className="font-semibold">
						{t("payment_history") || "Payment History"}
					</h3>
					<p className="text-sm text-muted-foreground">
						{payments.length} {t("payments_recorded") || "payments recorded"}
					</p>
				</div>
			</div>

			{payments.length === 0 ? (
				<div className="p-8 text-center">
					<Receipt className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
					<p className="text-muted-foreground">
						{t("no_payments") || "No payments recorded yet"}
					</p>
				</div>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>{t("receipt_number") || "Receipt #"}</TableHead>
							<TableHead>{t("student") || "Student"}</TableHead>
							<TableHead>{t("amount") || "Amount"}</TableHead>
							<TableHead>{t("payment_method") || "Method"}</TableHead>
							<TableHead>{t("date") || "Date"}</TableHead>
							<TableHead>{t("status") || "Status"}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{payments.map((payment) => (
							<TableRow key={payment.id}>
								<TableCell className="font-mono text-sm">
									{payment.receiptNumber}
								</TableCell>
								<TableCell>
									{/* TODO: Resolve student name from studentId */}
									<span className="text-muted-foreground text-xs">
										{payment.studentId.slice(0, 8)}...
									</span>
								</TableCell>
								<TableCell>
									<span className="font-semibold text-emerald-600">
										{payment.formattedAmount}
									</span>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<CreditCard className="w-3 h-3 text-muted-foreground" />
										<span className="text-sm">
											{t(payment.paymentMethod) || payment.paymentMethodLabel}
										</span>
									</div>
								</TableCell>
								<TableCell>
									<div className="flex items-center gap-2">
										<Calendar className="w-3 h-3 text-muted-foreground" />
										<span className="text-sm">
											{formatDate(payment.paymentDate)}
										</span>
									</div>
								</TableCell>
								<TableCell>{getStatusBadge(payment.status)}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</Card>
	);
}
