"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchInput } from "@/components/shared/search-input";
import { MoreHorizontal, Pencil, Trash2, BookUp, Undo2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BorrowRecord, Book, BorrowStatus } from "@/types/library";

interface BorrowsTableProps {
	borrows: BorrowRecord[];
	books: Book[];
	isLoading: boolean;
	onEdit: (record: BorrowRecord) => void;
	onDelete: (record: BorrowRecord) => void;
	onReturn: (record: BorrowRecord) => void;
}

const BORROW_STATUS_STYLES: Record<BorrowStatus, { dot: string; text: string }> = {
	Borrowed: { dot: "bg-blue-500", text: "text-blue-600 dark:text-blue-400" },
	Returned: { dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
	Overdue: { dot: "bg-red-500", text: "text-red-600 dark:text-red-400" },
};

const BORROWER_TYPE_STYLES: Record<string, { bg: string; text: string }> = {
	Student: { bg: "bg-blue-50 dark:bg-blue-950/40", text: "text-blue-600 dark:text-blue-400" },
	Staff: { bg: "bg-purple-50 dark:bg-purple-950/40", text: "text-purple-600 dark:text-purple-400" },
};

export function BorrowsTable({ borrows, books, isLoading, onEdit, onDelete, onReturn }: BorrowsTableProps) {
	const { t } = useTranslation();
	const [search, setSearch] = useState("");

	const getBookTitle = (bookId: string) => {
		return books.find((b) => b.id === bookId)?.title || bookId;
	};

	const filtered = borrows.filter((r) =>
		r.borrowerName.toLowerCase().includes(search.toLowerCase()) ||
		getBookTitle(r.bookId).toLowerCase().includes(search.toLowerCase())
	);

	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.15, duration: 0.3 }}
		>
			<div className="liquid-glass-card rounded-2xl overflow-hidden">
				{/* Header */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 px-4 py-3 border-b border-black/6 dark:border-white/6">
					<div className="flex items-center gap-3 flex-1">
						<div className="w-6 h-6 rounded-md bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center">
							<BookUp className="w-3 h-3 text-violet-600 dark:text-violet-400" strokeWidth={2} />
						</div>
						<h2 className="text-sm font-semibold text-foreground">{t("borrows") || "Borrows"}</h2>
						<span className="text-xs text-muted-foreground/60 tabular-nums">{filtered.length}</span>
					</div>
					<SearchInput
						placeholder={t("search_borrows") || "Search borrows..."}
						value={search}
						onChange={setSearch}
						className="w-full sm:w-64"
					/>
				</div>

				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent border-b border-black/6 dark:border-white/6">
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("borrower") || "Borrower"}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("book_title") || "Book"}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground hidden md:table-cell">{t("borrow_date") || "Borrow Date"}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("due_date") || "Due Date"}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("status") || "Status"}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground text-right">{t("actions") || "Actions"}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<AnimatePresence mode="popLayout">
							{isLoading ? (
								Array.from({ length: 3 }).map((_, i) => (
									<TableRow key={i} className="border-b border-black/6 dark:border-white/6">
										{[1, 2, 3, 4, 5, 6].map((col) => (
											<TableCell key={col} className="py-3">
												<Skeleton className="h-5 w-full rounded-md" />
											</TableCell>
										))}
									</TableRow>
								))
							) : filtered.length === 0 ? (
								<TableRow>
									<TableCell className="h-60 text-center" colSpan={6}>
										<div className="flex flex-col items-center justify-center gap-3">
											<div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center">
												<BookUp className="h-5 w-5 text-muted-foreground" />
											</div>
											<p className="text-sm font-medium text-foreground">{t("no_borrows") || "No borrow records"}</p>
											<p className="text-xs text-muted-foreground">{t("no_borrows_desc") || "Record a borrow to get started"}</p>
										</div>
									</TableCell>
								</TableRow>
							) : (
								filtered.map((record, index) => {
									const statusStyle = BORROW_STATUS_STYLES[record.borrowStatus] || BORROW_STATUS_STYLES.Borrowed;
									const typeStyle = BORROWER_TYPE_STYLES[record.borrowerType] || BORROWER_TYPE_STYLES.Student;
									return (
										<motion.tr
											key={record.id}
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											transition={{ delay: index * 0.03 }}
											className="group hover:bg-muted/30 transition-colors border-b border-black/6 dark:border-white/6"
										>
											<TableCell className="py-3">
												<div className="flex items-center gap-2">
													<div>
														<p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
															{record.borrowerName}
														</p>
														<span className={cn("inline-flex items-center px-1.5 py-0 rounded text-[10px] font-medium", typeStyle.bg, typeStyle.text)}>
															{t(record.borrowerType.toLowerCase()) || record.borrowerType}
														</span>
													</div>
												</div>
											</TableCell>
											<TableCell className="py-3">
												<span className="text-sm text-muted-foreground truncate max-w-[180px] block">
													{getBookTitle(record.bookId)}
												</span>
											</TableCell>
											<TableCell className="py-3 hidden md:table-cell">
												<span className="text-sm text-muted-foreground tabular-nums">{record.borrowDate}</span>
											</TableCell>
											<TableCell className="py-3">
												<span className="text-sm text-muted-foreground tabular-nums">{record.dueDate}</span>
											</TableCell>
											<TableCell className="py-3">
												<div className="flex items-center gap-1.5">
													<div className={cn("w-1.5 h-1.5 rounded-full", statusStyle.dot)} />
													<span className={cn("text-xs font-medium", statusStyle.text)}>
														{t(record.borrowStatus.toLowerCase()) || record.borrowStatus}
													</span>
												</div>
											</TableCell>
											<TableCell className="py-3 text-right">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button variant="ghost" size="sm" className="h-7 w-7 p-0 hover:bg-muted">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end" className="w-[160px]">
														{record.borrowStatus === "Borrowed" && (
															<DropdownMenuItem onClick={() => onReturn(record)}>
																<Undo2 className="mr-2 h-3.5 w-3.5" /> {t("return_book") || "Return"}
															</DropdownMenuItem>
														)}
														<DropdownMenuItem onClick={() => onEdit(record)}>
															<Pencil className="mr-2 h-3.5 w-3.5" /> {t("edit") || "Edit"}
														</DropdownMenuItem>
														<DropdownMenuItem
															className="text-destructive focus:text-destructive focus:bg-destructive/10"
															onClick={() => onDelete(record)}
														>
															<Trash2 className="mr-2 h-3.5 w-3.5" /> {t("delete") || "Delete"}
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</TableCell>
										</motion.tr>
									);
								})
							)}
						</AnimatePresence>
					</TableBody>
				</Table>
			</div>
		</motion.div>
	);
}
