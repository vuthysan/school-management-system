"use client";

import { useState } from "react";
import {
	Plus,
	BookOpen,
	AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { useDashboard } from "@/hooks/useDashboard";
import {
	useBooks,
	useBookMutations,
	useBorrowRecords,
	useBorrowMutations,
} from "@/hooks/useLibrary";
import { LibraryStats } from "@/components/library/library-stats";
import { BooksTable } from "@/components/library/books-table";
import { BorrowsTable } from "@/components/library/borrows-table";
import { BookForm } from "@/components/library/book-form";
import { BorrowForm } from "@/components/library/borrow-form";
import type { Book, BorrowRecord } from "@/types/library";

export default function LibraryPage() {
	const { t } = useTranslation();
	const { currentSchool, isLoading: isDashboardLoading } = useDashboard();
	const schoolId = currentSchool?.idStr || currentSchool?.id || null;

	const [activeTab, setActiveTab] = useState<"books" | "borrows">("books");
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [selectedBook, setSelectedBook] = useState<Book | null>(null);
	const [selectedBorrow, setSelectedBorrow] = useState<BorrowRecord | null>(null);

	// Data hooks
	const { books, isLoading: isBooksLoading, error: booksError, refresh: refreshBooks } = useBooks(schoolId);
	const { borrows, isLoading: isBorrowsLoading, error: borrowsError, refresh: refreshBorrows } = useBorrowRecords(schoolId);

	// Mutation hooks
	const { createBook, updateBook, deleteBook } = useBookMutations();
	const { createBorrow, updateBorrow, deleteBorrow, returnBook } = useBorrowMutations();

	// ========================================================================
	// HANDLERS
	// ========================================================================

	const handleAddNew = () => {
		setSelectedBook(null);
		setSelectedBorrow(null);
		setIsFormOpen(true);
	};

	const handleEditBook = (item: Book) => {
		setSelectedBook(item);
		setIsFormOpen(true);
	};
	const handleEditBorrow = (item: BorrowRecord) => {
		setSelectedBorrow(item);
		setIsFormOpen(true);
	};

	const handleDeleteBook = (item: Book) => {
		setSelectedBook(item);
		setIsDeleteOpen(true);
	};
	const handleDeleteBorrow = (item: BorrowRecord) => {
		setSelectedBorrow(item);
		setIsDeleteOpen(true);
	};

	const handleReturnBook = async (item: BorrowRecord) => {
		setIsSubmitting(true);
		try {
			await returnBook(item.id);
			refreshBorrows();
			refreshBooks();
		} catch (err) {
			console.error("Return failed", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const onConfirmDelete = async () => {
		if (!schoolId) return;
		setIsSubmitting(true);
		try {
			if (activeTab === "books" && selectedBook) {
				await deleteBook(selectedBook.id);
				refreshBooks();
			} else if (activeTab === "borrows" && selectedBorrow) {
				await deleteBorrow(selectedBorrow.id);
				refreshBorrows();
			}
			setIsDeleteOpen(false);
		} catch (err) {
			console.error("Delete failed", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const onBookSave = async (values: any) => {
		if (!schoolId) return;
		setIsSubmitting(true);
		try {
			if (selectedBook) {
				await updateBook(selectedBook.id, values);
			} else {
				await createBook({ ...values, schoolId });
			}
			refreshBooks();
			setIsFormOpen(false);
		} catch (err) {
			console.error("Book save failed", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const onBorrowSave = async (values: any) => {
		if (!schoolId) return;
		setIsSubmitting(true);
		try {
			if (selectedBorrow) {
				await updateBorrow(selectedBorrow.id, values);
			} else {
				await createBorrow({ ...values, schoolId });
			}
			refreshBorrows();
			refreshBooks();
			setIsFormOpen(false);
		} catch (err) {
			console.error("Borrow save failed", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	// ========================================================================
	// GUARDS
	// ========================================================================

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
					<p className="text-sm text-muted-foreground">{t("no_school_selected") || "No school selected"}</p>
				</div>
			</div>
		);
	}

	// ========================================================================
	// RENDER
	// ========================================================================

	return (
		<div className="space-y-6 pb-10">
			<PageHeader
				title={t("library_management") || "Library Management"}
				subtitle={t("manage_library_subtitle") || "Manage books, borrowing records, and library inventory"}
				icon={BookOpen}
			>
				<Button onClick={handleAddNew} size="sm" className="gap-2">
					<Plus className="h-4 w-4" />
					{activeTab === "books"
						? t("add_book") || "Add Book"
						: t("add_borrow") || "Record Borrow"}
				</Button>
			</PageHeader>

			{/* Stats */}
			<LibraryStats books={books} borrows={borrows} />

			{/* Tabs */}
			<Tabs
				value={activeTab}
				onValueChange={(v) => setActiveTab(v as any)}
			>
				<TabsList>
					<TabsTrigger value="books">{t("books") || "Books"}</TabsTrigger>
					<TabsTrigger value="borrows">{t("borrows") || "Borrows"}</TabsTrigger>
				</TabsList>

				<TabsContent value="books">
					{booksError ? (
						<div className="min-h-[40vh] flex items-center justify-center">
							<div className="text-center space-y-3">
								<p className="text-sm text-destructive">{booksError}</p>
								<Button variant="outline" size="sm" onClick={refreshBooks}>{t("retry") || "Retry"}</Button>
							</div>
						</div>
					) : (
						<BooksTable
							books={books}
							isLoading={isBooksLoading}
							onEdit={handleEditBook}
							onDelete={handleDeleteBook}
						/>
					)}
				</TabsContent>

				<TabsContent value="borrows">
					{borrowsError ? (
						<div className="min-h-[40vh] flex items-center justify-center">
							<div className="text-center space-y-3">
								<p className="text-sm text-destructive">{borrowsError}</p>
								<Button variant="outline" size="sm" onClick={refreshBorrows}>{t("retry") || "Retry"}</Button>
							</div>
						</div>
					) : (
						<BorrowsTable
							borrows={borrows}
							books={books}
							isLoading={isBorrowsLoading}
							onEdit={handleEditBorrow}
							onDelete={handleDeleteBorrow}
							onReturn={handleReturnBook}
						/>
					)}
				</TabsContent>
			</Tabs>

			{/* Form Modal */}
			<Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							{activeTab === "books"
								? (selectedBook ? t("edit_book") || "Edit Book" : t("add_book") || "Add Book")
								: (selectedBorrow ? t("edit_borrow") || "Edit Borrow" : t("add_borrow") || "Record Borrow")}
						</DialogTitle>
						<DialogDescription>{t("fill_form_details") || "Fill in the details below."}</DialogDescription>
					</DialogHeader>

					{activeTab === "books" ? (
						<BookForm
							initialData={selectedBook}
							onSave={onBookSave}
							onCancel={() => setIsFormOpen(false)}
							isSaving={isSubmitting}
						/>
					) : (
						<BorrowForm
							initialData={selectedBorrow}
							books={books}
							onSave={onBorrowSave}
							onCancel={() => setIsFormOpen(false)}
							isSaving={isSubmitting}
						/>
					)}
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation */}
			<DeleteConfirmDialog
				open={isDeleteOpen}
				onOpenChange={setIsDeleteOpen}
				title={t("confirm_delete") || "Confirm Delete"}
				description={t("delete_item_warning") || "This action cannot be undone."}
				onConfirm={onConfirmDelete}
				isLoading={isSubmitting}
				cancelLabel={t("cancel") || "Cancel"}
				confirmLabel={t("delete") || "Delete"}
			/>
		</div>
	);
}
