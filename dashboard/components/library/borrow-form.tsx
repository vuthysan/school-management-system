"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { Book, BorrowRecord, BorrowerType } from "@/types/library";

interface BorrowFormProps {
	initialData?: BorrowRecord | null;
	books: Book[];
	onSave: (data: {
		bookId: string;
		borrowerId: string;
		borrowerName: string;
		borrowerType?: BorrowerType;
		borrowDate: string;
		dueDate: string;
		notes?: string;
	}) => Promise<void>;
	onCancel: () => void;
	isSaving: boolean;
}

export function BorrowForm({ initialData, books, onSave, onCancel, isSaving }: BorrowFormProps) {
	const { t } = useTranslation();

	const [bookId, setBookId] = useState("");
	const [borrowerId, setBorrowerId] = useState("");
	const [borrowerName, setBorrowerName] = useState("");
	const [borrowerType, setBorrowerType] = useState<BorrowerType>("Student");
	const [borrowDate, setBorrowDate] = useState("");
	const [dueDate, setDueDate] = useState("");
	const [notes, setNotes] = useState("");

	useEffect(() => {
		if (initialData) {
			setBookId(initialData.bookId);
			setBorrowerId(initialData.borrowerId);
			setBorrowerName(initialData.borrowerName);
			setBorrowerType(initialData.borrowerType);
			setBorrowDate(initialData.borrowDate);
			setDueDate(initialData.dueDate);
			setNotes(initialData.notes || "");
		} else {
			setBookId("");
			setBorrowerId("");
			setBorrowerName("");
			setBorrowerType("Student");
			setBorrowDate(new Date().toISOString().split("T")[0]);
			// Default due date 14 days from now
			const due = new Date();
			due.setDate(due.getDate() + 14);
			setDueDate(due.toISOString().split("T")[0]);
			setNotes("");
		}
	}, [initialData]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await onSave({
			bookId,
			borrowerId,
			borrowerName,
			borrowerType,
			borrowDate,
			dueDate,
			notes: notes || undefined,
		});
	};

	// Only show books with available copies for new borrows
	const availableBooks = initialData ? books : books.filter((b) => b.availableCopies > 0 && b.status === "Active");

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="space-y-2">
				<Label>{t("book_title") || "Book"} *</Label>
				<Select value={bookId} onValueChange={setBookId}>
					<SelectTrigger className="h-9">
						<SelectValue placeholder={t("select_book") || "Select a book"} />
					</SelectTrigger>
					<SelectContent>
						{availableBooks.map((b) => (
							<SelectItem key={b.id} value={b.id}>
								{b.title} — {b.author} ({b.availableCopies} {t("available") || "available"})
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="borrowerId">{t("borrower_id") || "Borrower ID"} *</Label>
					<Input
						id="borrowerId"
						value={borrowerId}
						onChange={(e) => setBorrowerId(e.target.value)}
						required
						disabled={!!initialData}
						className="h-9"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="borrowerName">{t("borrower_name") || "Borrower Name"} *</Label>
					<Input
						id="borrowerName"
						value={borrowerName}
						onChange={(e) => setBorrowerName(e.target.value)}
						required
						className="h-9"
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<div className="space-y-2">
					<Label>{t("borrower_type") || "Type"}</Label>
					<Select value={borrowerType} onValueChange={(v) => setBorrowerType(v as BorrowerType)}>
						<SelectTrigger className="h-9">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Student">{t("student") || "Student"}</SelectItem>
							<SelectItem value="Staff">{t("staff") || "Staff"}</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label htmlFor="borrowDate">{t("borrow_date") || "Borrow Date"} *</Label>
					<Input
						id="borrowDate"
						type="date"
						value={borrowDate}
						onChange={(e) => setBorrowDate(e.target.value)}
						required
						className="h-9"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="dueDate">{t("due_date") || "Due Date"} *</Label>
					<Input
						id="dueDate"
						type="date"
						value={dueDate}
						onChange={(e) => setDueDate(e.target.value)}
						required
						className="h-9"
					/>
				</div>
			</div>

			<div className="space-y-2">
				<Label htmlFor="notes">{t("notes") || "Notes"}</Label>
				<Input
					id="notes"
					value={notes}
					onChange={(e) => setNotes(e.target.value)}
					className="h-9"
				/>
			</div>

			<div className="flex justify-end gap-2 pt-2">
				<Button type="button" variant="ghost" onClick={onCancel} disabled={isSaving}>
					{t("cancel")}
				</Button>
				<Button type="submit" disabled={isSaving || !bookId || !borrowerId || !borrowerName}>
					{isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					{initialData ? t("save_changes") || "Save Changes" : t("add_borrow") || "Record Borrow"}
				</Button>
			</div>
		</form>
	);
}
