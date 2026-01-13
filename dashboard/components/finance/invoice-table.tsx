"use client";

import { FileText, Loader2, MoreHorizontal, Eye, Receipt } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Invoice, INVOICE_STATUSES } from "@/types/finance";
import { useLanguage } from "@/contexts/language-context";

interface InvoiceTableProps {
	invoices: Invoice[];
	isLoading: boolean;
	onView?: (invoice: Invoice) => void;
	onRecordPayment?: (invoice: Invoice) => void;
}

export function InvoiceTable({
	invoices,
	isLoading,
	onView,
	onRecordPayment,
}: InvoiceTableProps) {
	const { t } = useLanguage();

	const formatDate = (dateStr: string) => {
		try {
			return new Date(dateStr).toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
			});
		} catch {
			return dateStr;
		}
	};

	const getStatusBadge = (status: string, isOverdue: boolean) => {
		if (isOverdue && status !== "paid") {
			return (
				<Badge className="bg-red-100 text-red-700 border-none text-xs">
					{t("overdue") || "Overdue"}
				</Badge>
			);
		}

		const statusInfo = INVOICE_STATUSES.find((s) => s.value === status);
		const colorMap: Record<string, string> = {
			success: "bg-emerald-100 text-emerald-700",
			warning: "bg-amber-100 text-amber-700",
			danger: "bg-red-100 text-red-700",
			default: "bg-gray-100 text-gray-700",
		};

		return (
			<Badge
				className={`${colorMap[statusInfo?.color || "default"]} border-none text-xs`}
			>
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
			<div className="p-4 border-b flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="p-2 rounded-lg bg-primary/10">
						<FileText className="w-4 h-4 text-primary" />
					</div>
					<div>
						<h3 className="font-semibold">{t("invoices") || "Invoices"}</h3>
						<p className="text-xs text-muted-foreground">
							{invoices.length} {t("total_invoices") || "total invoices"}
						</p>
					</div>
				</div>
			</div>

			{invoices.length === 0 ? (
				<div className="p-12 text-center">
					<div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-4">
						<FileText className="w-6 h-6 text-muted-foreground" />
					</div>
					<h3 className="font-medium text-foreground mb-1">
						{t("no_invoices") || "No Invoices"}
					</h3>
					<p className="text-sm text-muted-foreground">
						{t("no_invoices_desc") ||
							"Invoices will appear here when students have pending fees."}
					</p>
				</div>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>{t("invoice_number") || "Invoice #"}</TableHead>
							<TableHead>{t("student") || "Student"}</TableHead>
							<TableHead>{t("amount") || "Amount"}</TableHead>
							<TableHead>{t("progress") || "Progress"}</TableHead>
							<TableHead>{t("due_date") || "Due Date"}</TableHead>
							<TableHead>{t("status") || "Status"}</TableHead>
							<TableHead className="text-right">
								{t("actions") || "Actions"}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{invoices.map((invoice) => (
							<TableRow key={invoice.id}>
								<TableCell>
									<span className="font-mono text-sm font-medium">
										{invoice.invoiceNumber}
									</span>
								</TableCell>
								<TableCell>
									<span className="text-sm">{invoice.studentId}</span>
								</TableCell>
								<TableCell>
									<div className="text-sm">
										<div className="font-medium">{invoice.formattedTotal}</div>
										{invoice.balance > 0 && (
											<div className="text-xs text-muted-foreground">
												{t("balance")}: {invoice.formattedBalance}
											</div>
										)}
									</div>
								</TableCell>
								<TableCell>
									<div className="w-24">
										<div className="h-2 w-full bg-muted rounded-full overflow-hidden">
											<div
												className="h-full bg-primary rounded-full transition-all"
												style={{ width: `${invoice.paymentPercentage}%` }}
											/>
										</div>
										<span className="text-xs text-muted-foreground">
											{invoice.paymentPercentage}%
										</span>
									</div>
								</TableCell>
								<TableCell>
									<span className="text-sm">{formatDate(invoice.dueDate)}</span>
								</TableCell>
								<TableCell>
									{getStatusBadge(invoice.status, invoice.isOverdue)}
								</TableCell>
								<TableCell className="text-right">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="icon" className="h-8 w-8">
												<MoreHorizontal className="w-4 h-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end" className="rounded-xl">
											{onView && (
												<DropdownMenuItem
													onClick={() => onView(invoice)}
													className="rounded-lg"
												>
													<Eye className="w-4 h-4 mr-2" />
													{t("view") || "View"}
												</DropdownMenuItem>
											)}
											{onRecordPayment && invoice.status !== "paid" && (
												<DropdownMenuItem
													onClick={() => onRecordPayment(invoice)}
													className="rounded-lg"
												>
													<Receipt className="w-4 h-4 mr-2" />
													{t("record_payment") || "Record Payment"}
												</DropdownMenuItem>
											)}
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</Card>
	);
}
