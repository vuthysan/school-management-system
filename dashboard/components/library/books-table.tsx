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
import { MoreHorizontal, Pencil, Trash2, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Book, BookCategory } from "@/types/library";

interface BooksTableProps {
	books: Book[];
	isLoading: boolean;
	onEdit: (book: Book) => void;
	onDelete: (book: Book) => void;
}

const STATUS_STYLES: Record<string, { dot: string; text: string }> = {
	Active: { dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
	Inactive: { dot: "bg-muted-foreground/30", text: "text-muted-foreground" },
};

const CATEGORY_STYLES: Record<BookCategory, { bg: string; text: string }> = {
	Textbook: { bg: "bg-blue-50 dark:bg-blue-950/40", text: "text-blue-600 dark:text-blue-400" },
	Reference: { bg: "bg-purple-50 dark:bg-purple-950/40", text: "text-purple-600 dark:text-purple-400" },
	Fiction: { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-600 dark:text-emerald-400" },
	NonFiction: { bg: "bg-amber-50 dark:bg-amber-950/40", text: "text-amber-600 dark:text-amber-400" },
	Magazine: { bg: "bg-pink-50 dark:bg-pink-950/40", text: "text-pink-600 dark:text-pink-400" },
	Other: { bg: "bg-muted/60", text: "text-muted-foreground" },
};

export function BooksTable({ books, isLoading, onEdit, onDelete }: BooksTableProps) {
	const { t } = useTranslation();
	const [search, setSearch] = useState("");

	const filtered = books.filter((b) =>
		b.title.toLowerCase().includes(search.toLowerCase()) ||
		b.author.toLowerCase().includes(search.toLowerCase()) ||
		(b.isbn && b.isbn.toLowerCase().includes(search.toLowerCase()))
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
						<div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
							<BookOpen className="w-3 h-3 text-blue-600 dark:text-blue-400" strokeWidth={2} />
						</div>
						<h2 className="text-sm font-semibold text-foreground">{t("books") || "Books"}</h2>
						<span className="text-xs text-muted-foreground/60 tabular-nums">{filtered.length}</span>
					</div>
					<SearchInput
						placeholder={t("search_books") || "Search books..."}
						value={search}
						onChange={setSearch}
						className="w-full sm:w-64"
					/>
				</div>

				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent border-b border-black/6 dark:border-white/6">
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("book_title") || "Title"}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground hidden md:table-cell">{t("isbn") || "ISBN"}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("category") || "Category"}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("copies") || "Copies"}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground hidden lg:table-cell">{t("location") || "Location"}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("status") || "Status"}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground text-right">{t("actions") || "Actions"}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<AnimatePresence mode="popLayout">
							{isLoading ? (
								Array.from({ length: 4 }).map((_, i) => (
									<TableRow key={i} className="border-b border-black/6 dark:border-white/6">
										{[1, 2, 3, 4, 5, 6, 7].map((col) => (
											<TableCell key={col} className="py-3">
												<Skeleton className="h-5 w-full rounded-md" />
											</TableCell>
										))}
									</TableRow>
								))
							) : filtered.length === 0 ? (
								<TableRow>
									<TableCell className="h-60 text-center" colSpan={7}>
										<div className="flex flex-col items-center justify-center gap-3">
											<div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center">
												<BookOpen className="h-5 w-5 text-muted-foreground" />
											</div>
											<p className="text-sm font-medium text-foreground">{t("no_books") || "No books"}</p>
											<p className="text-xs text-muted-foreground">{t("no_books_desc") || "Add a book to get started"}</p>
										</div>
									</TableCell>
								</TableRow>
							) : (
								filtered.map((book, index) => {
									const statusStyle = STATUS_STYLES[book.status] || STATUS_STYLES.Inactive;
									const categoryStyle = CATEGORY_STYLES[book.category] || CATEGORY_STYLES.Other;
									return (
										<motion.tr
											key={book.id}
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											transition={{ delay: index * 0.03 }}
											className="group hover:bg-muted/30 transition-colors border-b border-black/6 dark:border-white/6"
										>
											<TableCell className="py-3">
												<div>
													<p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate max-w-[200px]">
														{book.title}
													</p>
													<p className="text-xs text-muted-foreground truncate max-w-[200px]">{book.author}</p>
												</div>
											</TableCell>
											<TableCell className="py-3 hidden md:table-cell">
												<span className="text-sm text-muted-foreground font-mono">{book.isbn || "-"}</span>
											</TableCell>
											<TableCell className="py-3">
												<span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium", categoryStyle.bg, categoryStyle.text)}>
													{t(book.category.toLowerCase()) || book.category}
												</span>
											</TableCell>
											<TableCell className="py-3">
												<span className="text-sm tabular-nums">
													<span className="font-medium text-foreground">{book.availableCopies}</span>
													<span className="text-muted-foreground">/{book.totalCopies}</span>
												</span>
											</TableCell>
											<TableCell className="py-3 hidden lg:table-cell">
												<span className="text-sm text-muted-foreground">{book.location || "-"}</span>
											</TableCell>
											<TableCell className="py-3">
												<div className="flex items-center gap-1.5">
													<div className={cn("w-1.5 h-1.5 rounded-full", statusStyle.dot)} />
													<span className={cn("text-xs font-medium", statusStyle.text)}>
														{t(book.status.toLowerCase()) || book.status}
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
													<DropdownMenuContent align="end" className="w-[150px]">
														<DropdownMenuItem onClick={() => onEdit(book)}>
															<Pencil className="mr-2 h-3.5 w-3.5" /> {t("edit") || "Edit"}
														</DropdownMenuItem>
														<DropdownMenuItem
															className="text-destructive focus:text-destructive focus:bg-destructive/10"
															onClick={() => onDelete(book)}
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
