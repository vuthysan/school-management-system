"use client";

import { useTranslation } from "react-i18next";
import { StatsCard } from "@/components/dashboard/stats-card";
import { BookOpen, BookMarked, BookUp, AlertTriangle } from "lucide-react";
import type { Book, BorrowRecord } from "@/types/library";

interface LibraryStatsProps {
	books: Book[];
	borrows: BorrowRecord[];
}

export function LibraryStats({ books, borrows }: LibraryStatsProps) {
	const { t } = useTranslation();

	const totalBooks = books.reduce((sum, b) => sum + b.totalCopies, 0);
	const availableBooks = books.reduce((sum, b) => sum + b.availableCopies, 0);
	const borrowedCount = borrows.filter((b) => b.borrowStatus === "Borrowed").length;
	const overdueCount = borrows.filter((b) => b.borrowStatus === "Overdue").length;

	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
			<StatsCard
				title={t("total_books") || "Total Books"}
				value={totalBooks.toLocaleString()}
				subtitle={`${books.length} ${t("titles") || "titles"}`}
				icon={BookOpen}
				color="blue"
				delay={0}
			/>
			<StatsCard
				title={t("available_books") || "Available"}
				value={availableBooks.toLocaleString()}
				subtitle={t("copies_available") || "copies available"}
				icon={BookMarked}
				color="emerald"
				delay={0.05}
			/>
			<StatsCard
				title={t("borrowed_books") || "Borrowed"}
				value={borrowedCount.toLocaleString()}
				subtitle={t("currently_borrowed") || "currently out"}
				icon={BookUp}
				color="violet"
				delay={0.1}
			/>
			<StatsCard
				title={t("overdue_books") || "Overdue"}
				value={overdueCount.toLocaleString()}
				subtitle={t("needs_attention") || "needs attention"}
				icon={AlertTriangle}
				color="amber"
				delay={0.15}
			/>
		</div>
	);
}
