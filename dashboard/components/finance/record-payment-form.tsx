"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
	Loader2,
	Receipt,
	CreditCard,
	Banknote,
	Smartphone,
	CreditCardIcon,
} from "lucide-react";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	PAYMENT_METHODS,
	CURRENCIES,
	CreatePaymentInput,
} from "@/types/finance";
import { useLanguage } from "@/contexts/language-context";

const paymentSchema = z.object({
	amountPaid: z
		.string()
		.min(1, "Amount is required")
		.refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
			message: "Amount must be greater than 0",
		}),
	currency: z.enum(["USD", "KHR"]),
	paymentMethod: z.enum(["cash", "bank_transfer", "mobile_payment", "card"]),
	remarks: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface RecordPaymentFormProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (input: CreatePaymentInput) => Promise<void>;
	schoolId: string;
	studentId: string;
	feeId: string;
	feeName?: string;
	maxAmount?: number;
	currency?: string;
}

const METHOD_ICONS: Record<string, React.ReactNode> = {
	cash: <Banknote className="w-4 h-4" />,
	bank_transfer: <CreditCard className="w-4 h-4" />,
	mobile_payment: <Smartphone className="w-4 h-4" />,
	card: <CreditCardIcon className="w-4 h-4" />,
};

export function RecordPaymentForm({
	isOpen,
	onClose,
	onSubmit,
	schoolId,
	studentId,
	feeId,
	feeName,
	maxAmount,
	currency = "USD",
}: RecordPaymentFormProps) {
	const { t } = useLanguage();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		reset,
	} = useForm<PaymentFormData>({
		resolver: zodResolver(paymentSchema),
		defaultValues: {
			amountPaid: maxAmount?.toString() || "",
			currency: currency as "USD" | "KHR",
			paymentMethod: "cash",
			remarks: "",
		},
	});

	const selectedMethod = watch("paymentMethod");
	const selectedCurrency = watch("currency");

	const handleFormSubmit = async (data: PaymentFormData) => {
		setIsSubmitting(true);
		setError(null);

		try {
			await onSubmit({
				schoolId,
				studentId,
				feeId,
				amountPaid: parseFloat(data.amountPaid),
				currency: data.currency,
				paymentMethod: data.paymentMethod,
				remarks: data.remarks,
			});
			reset();
			onClose();
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to record payment");
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleClose = () => {
		reset();
		setError(null);
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={handleClose}>
			<DialogContent className="max-w-md rounded-lg">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Receipt className="h-5 w-5 text-primary" />
						{t("record_payment") || "Record Payment"}
					</DialogTitle>
				</DialogHeader>

				<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
					{error && (
						<div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
							<p className="text-sm text-red-700 dark:text-red-300">{error}</p>
						</div>
					)}

					{feeName && (
						<div className="p-3 bg-muted/50 rounded-lg">
							<p className="text-xs text-muted-foreground">{t("fee")}</p>
							<p className="font-medium">{feeName}</p>
						</div>
					)}

					{/* Amount */}
					<div className="space-y-2">
						<Label htmlFor="amountPaid">
							{t("amount")} *
							{maxAmount && (
								<span className="text-muted-foreground font-normal ml-1">
									(max: {selectedCurrency === "USD" ? "$" : "៛"}
									{maxAmount.toLocaleString()})
								</span>
							)}
						</Label>
						<div className="flex gap-2">
							<Input
								id="amountPaid"
								type="number"
								step="0.01"
								min="0"
								max={maxAmount}
								className="flex-1 h-11 rounded-lg"
								placeholder="0.00"
								{...register("amountPaid")}
							/>
							<Select
								value={selectedCurrency}
								onValueChange={(val) =>
									setValue("currency", val as "USD" | "KHR")
								}
							>
								<SelectTrigger className="w-28 h-11 rounded-lg">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="rounded-xl">
									{CURRENCIES.map((curr) => (
										<SelectItem
											key={curr.value}
											value={curr.value}
											className="rounded-lg"
										>
											{curr.symbol} {curr.value}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						{errors.amountPaid && (
							<p className="text-xs text-red-500">
								{t(errors.amountPaid.message as string) ||
									errors.amountPaid.message}
							</p>
						)}
					</div>

					{/* Payment Method */}
					<div className="space-y-2">
						<Label>{t("payment_method")} *</Label>
						<div className="grid grid-cols-2 gap-2">
							{PAYMENT_METHODS.map((method) => (
								<button
									key={method.value}
									type="button"
									onClick={() => setValue("paymentMethod", method.value as any)}
									className={`
										flex items-center gap-2 p-3 rounded-lg border transition-all
										${
											selectedMethod === method.value
												? "border-primary bg-primary/5 ring-1 ring-primary"
												: "border-black/6 dark:border-white/6 hover:border-primary/50"
										}
									`}
								>
									{METHOD_ICONS[method.value]}
									<span className="text-sm font-medium">
										{t(method.value) || method.label}
									</span>
								</button>
							))}
						</div>
					</div>

					{/* Remarks */}
					<div className="space-y-2">
						<Label htmlFor="remarks">
							{t("remarks")} ({t("optional")})
						</Label>
						<Textarea
							id="remarks"
							className="rounded-lg resize-none"
							placeholder={
								t("payment_remarks_placeholder") || "Add any notes..."
							}
							rows={2}
							{...register("remarks")}
						/>
					</div>

					<DialogFooter className="pt-4">
						<Button
							type="button"
							variant="ghost"
							className="rounded-lg"
							onClick={handleClose}
							disabled={isSubmitting}
						>
							{t("cancel")}
						</Button>
						<Button
							type="submit"
							className="rounded-lg px-8 h-11 shadow-lg shadow-primary/20"
							disabled={isSubmitting}
						>
							{isSubmitting && (
								<Loader2 className="h-4 w-4 animate-spin mr-2" />
							)}
							{t("confirm_payment") || "Confirm Payment"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
