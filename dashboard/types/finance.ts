// Finance TypeScript types

export interface Fee {
	id: string;
	schoolId: string;
	feeName: string;
	description?: string;
	amount: number;
	currency: string;
	gradeLevel?: string;
	academicYear: string;
	dueDate: string;
	isMandatory: boolean;
	formattedAmount: string;
	isAllGrades: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface Payment {
	id: string;
	schoolId: string;
	studentId: string;
	feeId: string;
	amountPaid: number;
	currency: string;
	paymentMethod: string;
	paymentMethodLabel: string;
	paymentDate: string;
	receiptNumber: string;
	status: string;
	remarks?: string;
	processedBy: string;
	formattedAmount: string;
	createdAt: string;
	updatedAt: string;
}

export interface Invoice {
	id: string;
	schoolId: string;
	invoiceNumber: string;
	studentId: string;
	feeIds: string[];
	totalAmount: number;
	amountPaid: number;
	balance: number;
	currency: string;
	issueDate: string;
	dueDate: string;
	status: string;
	formattedTotal: string;
	formattedBalance: string;
	paymentPercentage: number;
	isOverdue: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface FinanceSummary {
	totalCollected: number;
	totalPending: number;
	totalOverdue: number;
	currency: string;
	studentsWithBalance: number;
	totalStudents: number;
	collectionRate: number;
}

// Input types
export interface CreateFeeInput {
	schoolId: string;
	feeName: string;
	description?: string;
	amount: number;
	currency: string;
	gradeLevel?: string;
	academicYear: string;
	dueDate: string;
	isMandatory?: boolean;
}

export interface UpdateFeeInput {
	feeName?: string;
	description?: string;
	amount?: number;
	currency?: string;
	gradeLevel?: string;
	academicYear?: string;
	dueDate?: string;
	isMandatory?: boolean;
}

export interface CreatePaymentInput {
	schoolId: string;
	studentId: string;
	feeId: string;
	amountPaid: number;
	currency: string;
	paymentMethod: string;
	remarks?: string;
}

export interface CreateInvoiceInput {
	schoolId: string;
	studentId: string;
	feeIds: string[];
	totalAmount: number;
	currency: string;
	dueDate: string;
}

export interface PaymentFilters {
	studentId?: string;
	status?: string;
	paymentMethod?: string;
	dateFrom?: string;
	dateTo?: string;
}

export interface InvoiceFilters {
	studentId?: string;
	status?: string;
}

// Fee form data for UI
export interface FeeFormData {
	feeName: string;
	description: string;
	amount: string;
	currency: "USD" | "KHR";
	gradeLevel: string;
	academicYear: string;
	dueDate: string;
	isMandatory: boolean;
}

// Payment form data for UI
export interface PaymentFormData {
	studentId: string;
	feeId: string;
	amountPaid: string;
	currency: "USD" | "KHR";
	paymentMethod: "cash" | "bank_transfer" | "mobile_payment" | "card";
	remarks: string;
}

// Payment method options
export const PAYMENT_METHODS = [
	{ value: "cash", label: "Cash" },
	{ value: "bank_transfer", label: "Bank Transfer" },
	{ value: "mobile_payment", label: "Mobile Payment (Wing/KHQR)" },
	{ value: "card", label: "Card (Visa/Mastercard)" },
] as const;

// Currency options
export const CURRENCIES = [
	{ value: "USD", label: "US Dollar (USD)", symbol: "$" },
	{ value: "KHR", label: "Khmer Riel (KHR)", symbol: "៛" },
] as const;

// Status options
export const PAYMENT_STATUSES = [
	{ value: "completed", label: "Completed", color: "success" },
	{ value: "pending", label: "Pending", color: "warning" },
	{ value: "failed", label: "Failed", color: "danger" },
] as const;

export const INVOICE_STATUSES = [
	{ value: "unpaid", label: "Unpaid", color: "default" },
	{ value: "partial", label: "Partial", color: "warning" },
	{ value: "paid", label: "Paid", color: "success" },
	{ value: "overdue", label: "Overdue", color: "danger" },
] as const;
