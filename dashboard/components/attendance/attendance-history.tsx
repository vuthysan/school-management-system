"use client";

import React, { useState, useMemo } from "react";
import {
	ChevronLeft,
	ChevronRight,
	Calendar,
	Filter,
	ClipboardList,
} from "lucide-react";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { SearchInput } from "@/components/shared/search-input";
import { useLanguage } from "@/contexts/language-context";
import { useAttendanceByClass } from "@/hooks/useAttendance";
import { Class } from "@/types/academic";
import { cn } from "@/lib/utils";

interface AttendanceHistoryProps {
	classes: Class[];
	selectedClassId: string | null;
	selectedDate: string;
	onClassChange: (classId: string | null) => void;
	onDateChange: (date: string) => void;
}

export const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({
	classes,
	selectedClassId,
	selectedDate,
	onClassChange,
	onDateChange,
}) => {
	const { t } = useLanguage();
	const [searchQuery, setSearchQuery] = useState("");
	const [page, setPage] = useState(1);
	const rowsPerPage = 10;

	const { attendance, isLoading, error } = useAttendanceByClass(
		selectedClassId,
		selectedDate || null
	);

	const handleClassChange = (classId: string) => {
		onClassChange(classId || null);
		setPage(1);
	};

	const filteredHistory = useMemo(() => {
		return attendance.filter((record) => {
			return record.studentId
				.toLowerCase()
				.includes(searchQuery.toLowerCase());
		});
	}, [attendance, searchQuery]);

	const paginatedHistory = useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		return filteredHistory.slice(start, start + rowsPerPage);
	}, [filteredHistory, page]);

	const totalPages = Math.ceil(filteredHistory.length / rowsPerPage);

	const getStatusDisplay = (status: string) => {
		const statusLower = status.toLowerCase();
		const config: Record<string, { dot: string; text: string }> = {
			present: { dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
			absent: { dot: "bg-rose-500", text: "text-rose-600 dark:text-rose-400" },
			late: { dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
			excused: { dot: "bg-blue-500", text: "text-blue-600 dark:text-blue-400" },
		};
		const style = config[statusLower] || { dot: "bg-muted-foreground/30", text: "text-muted-foreground" };

		return (
			<div className="flex items-center gap-1.5">
				<div className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />
				<span className={cn("text-xs font-medium", style.text)}>
					{t(statusLower) || status}
				</span>
			</div>
		);
	};

	return (
		<div className="flex flex-col gap-4">
			{/* Controls */}
			<div className="liquid-glass-card rounded-2xl px-4 py-3">
				<div className="flex flex-col sm:flex-row gap-3 items-end">
					<div className="space-y-1.5 w-full sm:max-w-xs">
						<Label className="text-xs font-medium text-muted-foreground">{t("select_class")}</Label>
						<Select
							value={selectedClassId || ""}
							onValueChange={handleClassChange}
						>
							<SelectTrigger className="h-9">
								<SelectValue placeholder={t("select_class")} />
							</SelectTrigger>
							<SelectContent>
								{classes.map((cls) => (
									<SelectItem key={cls.id} value={cls.id}>
										{cls.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<div className="space-y-1.5 w-full sm:max-w-xs">
						<Label className="text-xs font-medium text-muted-foreground">{t("select_date")}</Label>
						<Input
							type="date"
							className="h-9"
							value={selectedDate}
							onChange={(e) => onDateChange(e.target.value)}
						/>
					</div>
				</div>
			</div>

			{/* Loading State */}
			{isLoading && selectedClassId && (
				<div className="min-h-[40vh] flex items-center justify-center">
					<div className="text-center space-y-3">
						<div className="h-8 w-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin mx-auto" />
						<p className="text-sm text-muted-foreground">{t("loading") || "Loading..."}</p>
					</div>
				</div>
			)}

			{/* No Class Selected */}
			{!selectedClassId && (
				<div className="min-h-[40vh] flex items-center justify-center">
					<div className="text-center space-y-3">
						<div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center mx-auto">
							<Calendar className="h-5 w-5 text-muted-foreground" />
						</div>
						<p className="text-sm text-muted-foreground">
							{t("select_class_to_view_history")}
						</p>
					</div>
				</div>
			)}

			{/* Error State */}
			{error && (
				<div className="min-h-[40vh] flex items-center justify-center">
					<div className="text-center space-y-3">
						<p className="text-sm text-destructive">{error}</p>
					</div>
				</div>
			)}

			{/* Table */}
			{selectedClassId && !isLoading && !error && (
				<div className="liquid-glass-card rounded-2xl overflow-hidden">
					{/* Card header */}
					<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 border-b border-black/6 dark:border-white/6">
						<div className="flex items-center gap-3">
							<div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
								<ClipboardList className="w-3 h-3 text-blue-600 dark:text-blue-400" strokeWidth={2} />
							</div>
							<h2 className="text-sm font-semibold text-foreground">
								{t("attendance_history")}
							</h2>
							<span className="text-xs text-muted-foreground/60 tabular-nums">
								{filteredHistory.length}
							</span>
						</div>
						<SearchInput
							placeholder={t("search_placeholder") || "Search..."}
							value={searchQuery}
							onChange={setSearchQuery}
							className="w-full sm:w-56"
						/>
					</div>

					<Table>
						<TableHeader>
							<TableRow className="hover:bg-transparent border-b border-black/6 dark:border-white/6">
								<TableHead className="h-10 text-xs font-medium text-muted-foreground">
									{t("student_id")}
								</TableHead>
								<TableHead className="h-10 text-xs font-medium text-muted-foreground">
									{t("date")}
								</TableHead>
								<TableHead className="h-10 text-xs font-medium text-muted-foreground">
									{t("status")}
								</TableHead>
								<TableHead className="h-10 text-xs font-medium text-muted-foreground">
									{t("remarks")}
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{paginatedHistory.length === 0 ? (
								<TableRow>
									<TableCell className="h-60 text-center" colSpan={4}>
										<div className="flex flex-col items-center justify-center gap-3">
											<div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center">
												<ClipboardList className="h-5 w-5 text-muted-foreground" />
											</div>
											<p className="text-sm font-medium text-foreground">
												{t("no_attendance_records")}
											</p>
										</div>
									</TableCell>
								</TableRow>
							) : (
								paginatedHistory.map((record) => (
									<TableRow
										key={record.id}
										className="hover:bg-muted/30 transition-colors border-b border-black/6 dark:border-white/6"
									>
										<TableCell className="py-3">
											<p className="text-sm font-medium text-foreground">
												{record.studentId}
											</p>
										</TableCell>
										<TableCell className="py-3">
											<span className="text-sm text-muted-foreground">
												{record.date.split("T")[0]}
											</span>
										</TableCell>
										<TableCell className="py-3">
											{getStatusDisplay(record.status)}
										</TableCell>
										<TableCell className="py-3">
											<span className="text-sm text-muted-foreground">
												{record.remarks || "-"}
											</span>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>

					{/* Pagination */}
					{totalPages > 0 && (
						<div className="flex items-center justify-between px-4 py-3 border-t border-black/6 dark:border-white/6">
							<span className="text-xs text-muted-foreground">
								{filteredHistory.length} {t("records") || "records"}
							</span>
							{totalPages > 1 && (
								<div className="flex items-center gap-1">
									<Button
										disabled={page === 1}
										size="sm"
										variant="ghost"
										className="h-7 w-7 p-0"
										onClick={() => setPage(Math.max(1, page - 1))}
									>
										<ChevronLeft className="h-4 w-4" />
									</Button>
									<span className="text-xs text-muted-foreground px-2 tabular-nums">
										{page} / {totalPages}
									</span>
									<Button
										disabled={page === totalPages}
										size="sm"
										variant="ghost"
										className="h-7 w-7 p-0"
										onClick={() => setPage(Math.min(totalPages, page + 1))}
									>
										<ChevronRight className="h-4 w-4" />
									</Button>
								</div>
							)}
						</div>
					)}
				</div>
			)}
		</div>
	);
};
