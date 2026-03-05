"use client";

import { useState, useCallback } from "react";
import { DollarSign, Plus, Loader2, AlertCircle } from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useLanguage } from "@/contexts/language-context";
import { useDashboard } from "@/hooks/useDashboard";
import {
	useFees,
	useFeeMutations,
	usePayments,
	useInvoices,
	useFinanceSummary,
	usePaymentMutations,
} from "@/hooks/useFinance";
import {
	Fee,
	Invoice,
	FeeFormData,
	CreateFeeInput,
	UpdateFeeInput,
	CreatePaymentInput,
} from "@/types/finance";

import { PageHeader } from "@/components/dashboard/page-header";
import { FinanceStats } from "@/components/finance/finance-stats";
import { FeeTable } from "@/components/finance/fee-table";
import { FeeForm } from "@/components/finance/fee-form";
import { PaymentTable } from "@/components/finance/payment-table";
import { InvoiceTable } from "@/components/finance/invoice-table";
import { RecordPaymentForm } from "@/components/finance/record-payment-form";

export default function FinancePage() {
	const { t } = useLanguage();
	const { currentSchool, isLoading: isDashboardLoading } = useDashboard();
	const schoolId = currentSchool?.idStr || currentSchool?.id || null;

	const [activeTab, setActiveTab] = useState<"fees" | "payments" | "invoices">(
		"fees"
	);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [isPaymentOpen, setIsPaymentOpen] = useState(false);
	const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
	const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

	const {
		fees,
		isLoading: isFeesLoading,
		refresh: refreshFees,
	} = useFees(schoolId);
	const {
		payments,
		isLoading: isPaymentsLoading,
		refresh: refreshPayments,
	} = usePayments(schoolId);
	const {
		invoices,
		isLoading: isInvoicesLoading,
		refresh: refreshInvoices,
	} = useInvoices(schoolId);
	const {
		summary,
		isLoading: isSummaryLoading,
		refresh: refreshSummary,
	} = useFinanceSummary(schoolId);
	const {
		createFee,
		updateFee,
		deleteFee,
		isLoading: isMutating,
	} = useFeeMutations();
	const { recordPayment } = usePaymentMutations();

	const handleAddFee = () => {
		setSelectedFee(null);
		setIsFormOpen(true);
	};

	const handleEditFee = (fee: Fee) => {
		setSelectedFee(fee);
		setIsFormOpen(true);
	};

	const handleDeleteFee = (fee: Fee) => {
		setSelectedFee(fee);
		setIsDeleteOpen(true);
	};

	const handleRecordPayment = (invoice: Invoice) => {
		setSelectedInvoice(invoice);
		setIsPaymentOpen(true);
	};

	const handlePaymentSubmit = async (input: CreatePaymentInput) => {
		await recordPayment(input);
		refreshPayments();
		refreshInvoices();
		refreshSummary();
		setIsPaymentOpen(false);
	};

	const handleViewInvoice = (invoice: Invoice) => {
		if (invoice.status !== "paid") {
			handleRecordPayment(invoice);
		}
	};

	const handleFormSubmit = useCallback(
		async (data: FeeFormData) => {
			if (!schoolId) return;

			const input: CreateFeeInput = {
				schoolId,
				feeName: data.feeName,
				description: data.description || undefined,
				amount: parseFloat(data.amount),
				currency: data.currency,
				gradeLevel: data.gradeLevel || undefined,
				academicYear: data.academicYear || "2024-2025",
				dueDate: new Date(data.dueDate).toISOString(),
				isMandatory: data.isMandatory,
			};

			if (selectedFee) {
				const updateInput: UpdateFeeInput = {
					feeName: data.feeName,
					description: data.description,
					amount: parseFloat(data.amount),
					currency: data.currency,
					gradeLevel: data.gradeLevel || undefined,
					academicYear: data.academicYear,
					dueDate: new Date(data.dueDate).toISOString(),
					isMandatory: data.isMandatory,
				};
				await updateFee(selectedFee.id, updateInput);
			} else {
				await createFee(input);
			}

			setIsFormOpen(false);
			setSelectedFee(null);
			refreshFees();
		},
		[schoolId, selectedFee, createFee, updateFee, refreshFees]
	);

	const handleConfirmDelete = useCallback(async () => {
		if (!selectedFee) return;

		await deleteFee(selectedFee.id);
		setIsDeleteOpen(false);
		setSelectedFee(null);
		refreshFees();
	}, [selectedFee, deleteFee, refreshFees]);

	if (isDashboardLoading) {
		return (
			<div className="min-h-[60vh] flex items-center justify-center">
				<div className="text-center space-y-3">
					<div className="h-8 w-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin mx-auto" />
					<p className="text-sm text-muted-foreground">{t("loading") || "Loading..."}</p>
				</div>
			</div>
		);
	}

	if (!schoolId) {
		return (
			<div className="min-h-[60vh] flex items-center justify-center">
				<div className="text-center space-y-3">
					<div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center mx-auto">
						<AlertCircle className="h-5 w-5 text-amber-500" />
					</div>
					<p className="text-sm text-muted-foreground">
						{t("no_school_selected") || "No school selected"}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6 pb-10">
			<PageHeader
				title={t("finance_management") || "Finance Management"}
				subtitle={t("manage_fees_payments") || "Manage fees, payments, and invoices"}
				icon={DollarSign}
			>
				{activeTab === "fees" && (
					<Button onClick={handleAddFee} size="sm" className="gap-2">
						<Plus className="h-4 w-4" />
						{t("add_new_fee") || "Add Fee"}
					</Button>
				)}
			</PageHeader>

			<FinanceStats summary={summary} isLoading={isSummaryLoading} />

			<Tabs
				value={activeTab}
				onValueChange={(v) => setActiveTab(v as "fees" | "payments" | "invoices")}
			>
				<TabsList>
					<TabsTrigger value="fees">
						{t("fee_structure") || "Fee Structure"}
					</TabsTrigger>
					<TabsTrigger value="payments">
						{t("payments") || "Payments"}
					</TabsTrigger>
					<TabsTrigger value="invoices">
						{t("invoices") || "Invoices"}
					</TabsTrigger>
				</TabsList>

				<TabsContent value="fees">
					<FeeTable
						fees={fees}
						isLoading={isFeesLoading}
						onAdd={handleAddFee}
						onEdit={handleEditFee}
						onDelete={handleDeleteFee}
					/>
				</TabsContent>

				<TabsContent value="payments">
					<PaymentTable payments={payments} isLoading={isPaymentsLoading} />
				</TabsContent>

				<TabsContent value="invoices">
					<InvoiceTable
						invoices={invoices}
						isLoading={isInvoicesLoading}
						onView={handleViewInvoice}
						onRecordPayment={handleRecordPayment}
					/>
				</TabsContent>
			</Tabs>

			{/* Fee Form Dialog */}
			<Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
				<DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							{selectedFee
								? t("edit_fee") || "Edit Fee"
								: t("add_new_fee") || "Add New Fee"}
						</DialogTitle>
					</DialogHeader>
					<FeeForm
						fee={selectedFee}
						onSubmit={handleFormSubmit}
						onCancel={() => setIsFormOpen(false)}
					/>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation */}
			<AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{t("confirm_delete") || "Confirm Delete"}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t("delete_fee_warning", { name: selectedFee?.feeName }) ||
								`Are you sure you want to delete "${selectedFee?.feeName}"?`}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>{t("cancel") || "Cancel"}</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleConfirmDelete}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isMutating && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
							{t("delete") || "Delete"}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>

			{/* Record Payment Dialog */}
			{schoolId && selectedInvoice && (
				<RecordPaymentForm
					isOpen={isPaymentOpen}
					onClose={() => setIsPaymentOpen(false)}
					onSubmit={handlePaymentSubmit}
					schoolId={schoolId}
					studentId={selectedInvoice.studentId}
					feeId={selectedInvoice.feeIds[0]}
					feeName={`${t("invoice")} #${selectedInvoice.invoiceNumber}`}
					maxAmount={selectedInvoice.balance}
					currency={selectedInvoice.currency}
				/>
			)}
		</div>
	);
}
