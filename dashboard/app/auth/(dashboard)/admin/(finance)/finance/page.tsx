"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { DollarSign, Plus, Loader2 } from "lucide-react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
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

	// UI State
	const [activeTab, setActiveTab] = useState<"fees" | "payments" | "invoices">(
		"fees"
	);
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [isPaymentOpen, setIsPaymentOpen] = useState(false);
	const [selectedFee, setSelectedFee] = useState<Fee | null>(null);
	const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

	// Data hooks
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

	// Handlers
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
		// For now just open the record payment if not paid
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

	// Loading state
	if (isDashboardLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (!schoolId) {
		return (
			<div className="flex flex-col items-center justify-center h-64 gap-2">
				<p className="text-muted-foreground">
					{t("no_school_selected") || "No school selected"}
				</p>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="space-y-6 pb-10"
		>
			{/* Hero Header Section */}
			<Card className="p-4">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative">
					<div className="flex items-center gap-5">
						<div className="relative group">
							<div className="absolute -inset-1 bg-emerald-500/20 blur opacity-0 group-hover:opacity-100 transition duration-500 rounded-lg" />
							<div className="relative p-4 bg-emerald-500 rounded-lg shadow-lg shadow-emerald-500/20 text-white">
								<DollarSign className="w-8 h-8" />
							</div>
						</div>
						<div className="space-y-1">
							<h1 className="text-3xl font-bold tracking-tight text-foreground/90">
								{t("finance_management") || "Finance Management"}
							</h1>
							<p className="text-sm text-muted-foreground/80 font-medium">
								{t("manage_fees_payments") ||
									"Manage fees, payments, and invoices"}
							</p>
						</div>
					</div>
				</div>
			</Card>

			{/* Stats */}
			<FinanceStats summary={summary} isLoading={isSummaryLoading} />

			{/* Tabs */}
			<Tabs
				value={activeTab}
				onValueChange={(v) => setActiveTab(v as "fees" | "payments")}
				className="w-full"
			>
				<TabsList className="flex w-full justify-start border-b border-border/50 bg-transparent p-0 h-auto gap-8">
					<TabsTrigger
						className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-2 pb-3 pt-2 font-semibold text-muted-foreground transition-all data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none hover:text-primary/70"
						value="fees"
					>
						{t("fee_structure") || "Fee Structure"}
					</TabsTrigger>
					<TabsTrigger
						className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-2 pb-3 pt-2 font-semibold text-muted-foreground transition-all data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none hover:text-primary/70"
						value="payments"
					>
						{t("payments") || "Payments"}
					</TabsTrigger>
					<TabsTrigger
						className="relative h-12 rounded-none border-b-2 border-transparent bg-transparent px-2 pb-3 pt-2 font-semibold text-muted-foreground transition-all data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none hover:text-primary/70"
						value="invoices"
					>
						{t("invoices") || "Invoices"}
					</TabsTrigger>
				</TabsList>

				<TabsContent className="mt-4" value="fees">
					<FeeTable
						fees={fees}
						isLoading={isFeesLoading}
						onAdd={handleAddFee}
						onEdit={handleEditFee}
						onDelete={handleDeleteFee}
					/>
				</TabsContent>

				<TabsContent className="mt-4" value="payments">
					<PaymentTable payments={payments} isLoading={isPaymentsLoading} />
				</TabsContent>

				<TabsContent className="mt-4" value="invoices">
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
						<DialogTitle className="flex items-center gap-3">
							<div className="p-2 bg-emerald-500/10 rounded-lg">
								<DollarSign className="w-5 h-5 text-emerald-600" />
							</div>
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

			{/* Delete Confirmation Dialog */}
			<AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>
							{t("confirm_delete") || "Confirm Delete"}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t("delete_fee_warning", { name: selectedFee?.feeName }) ||
								t("delete_confirmation") +
									` "${selectedFee?.feeName}"? ` +
									t("delete_warning")}
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
					feeId={selectedInvoice.feeIds[0]} // Simplification: use first fee ID
					feeName={`${t("invoice")} #${selectedInvoice.invoiceNumber}`}
					maxAmount={selectedInvoice.balance}
					currency={selectedInvoice.currency}
				/>
			)}
		</motion.div>
	);
}
