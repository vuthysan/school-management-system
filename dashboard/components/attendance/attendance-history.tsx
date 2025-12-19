"use client";

import React, { useState, useMemo } from "react";
import {
	Search,
	Eye,
	ChevronLeft,
	ChevronRight,
	Loader2,
	Calendar,
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
import { Card, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/language-context";
import { useAttendanceByClass } from "@/hooks/useAttendance";
import { Class } from "@/types/academic";

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

	// Fetch attendance for selected class and date
	const { attendance, isLoading, error } = useAttendanceByClass(
		selectedClassId,
		selectedDate || null
	);

	const handleClassChange = (classId: string) => {
		onClassChange(classId || null);
		setPage(1);
	};

	const columns = [
		{ key: "studentId", label: t("student_id").toUpperCase() },
		{ key: "date", label: t("date").toUpperCase() },
		{ key: "status", label: t("status").toUpperCase() },
		{ key: "remarks", label: t("remarks").toUpperCase() },
	];

	const filteredHistory = useMemo(() => {
		return attendance.filter((record) => {
			const matchesSearch = record.studentId
				.toLowerCase()
				.includes(searchQuery.toLowerCase());
			return matchesSearch;
		});
	}, [attendance, searchQuery]);

	const paginatedHistory = useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		return filteredHistory.slice(start, start + rowsPerPage);
	}, [filteredHistory, page]);

	const totalPages = Math.ceil(filteredHistory.length / rowsPerPage);

	const getStatusBadge = (status: string) => {
		const statusLower = status.toLowerCase();
		switch (statusLower) {
			case "present":
				return (
					<Badge className="bg-green-500/10 text-green-600" variant="secondary">
						{t("present")}
					</Badge>
				);
			case "absent":
				return (
					<Badge className="bg-red-500/10 text-red-600" variant="secondary">
						{t("absent")}
					</Badge>
				);
			case "late":
				return (
					<Badge
						className="bg-yellow-500/10 text-yellow-600"
						variant="secondary"
					>
						{t("late")}
					</Badge>
				);
			case "excused":
				return (
					<Badge className="bg-primary/10 text-primary" variant="secondary">
						{t("excused")}
					</Badge>
				);
			default:
				return <Badge variant="secondary">{status}</Badge>;
		}
	};

	const selectedClassName = classes.find((c) => c.id === selectedClassId)?.name;

	return (
		<div className="flex flex-col gap-4">
			{/* Filters */}
			<Card className="border">
				<CardContent className="flex flex-col sm:flex-row gap-4 items-end p-6">
					<div className="space-y-2 w-full sm:max-w-xs">
						<label className="text-sm font-medium">{t("select_class")}</label>
						<Select
							value={selectedClassId || ""}
							onValueChange={handleClassChange}
						>
							<SelectTrigger className="h-11 rounded-lg">
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
					<div className="space-y-2 w-full sm:max-w-xs">
						<label className="text-sm font-medium">{t("select_date")}</label>
						<Input
							type="date"
							className="h-11 rounded-lg"
							value={selectedDate}
							onChange={(e) => onDateChange(e.target.value)}
						/>
					</div>
					<div className="relative w-full sm:max-w-xs">
						<Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							className="pl-8 h-11 rounded-lg"
							placeholder={t("search_placeholder")}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</CardContent>
			</Card>

			{/* Loading State */}
			{isLoading && selectedClassId && (
				<div className="flex items-center justify-center py-12">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
				</div>
			)}

			{/* Empty State - No Class Selected */}
			{!selectedClassId && (
				<Card className="border">
					<CardContent className="flex flex-col items-center justify-center py-12 gap-4">
						<Calendar className="h-12 w-12 text-muted-foreground" />
						<p className="text-muted-foreground">
							{t("select_class_to_view_history")}
						</p>
					</CardContent>
				</Card>
			)}

			{/* Error State */}
			{error && (
				<Card className="border border-destructive/50">
					<CardContent className="flex flex-col items-center justify-center py-12 gap-4">
						<p className="text-destructive">{error}</p>
					</CardContent>
				</Card>
			)}

			{/* Table */}
			{selectedClassId && !isLoading && !error && (
				<>
					<div className="rounded-lg border overflow-hidden">
						<Table>
							<TableHeader>
								<TableRow className="bg-muted/50">
									{columns.map((column) => (
										<TableHead key={column.key}>{column.label}</TableHead>
									))}
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginatedHistory.length === 0 ? (
									<TableRow>
										<TableCell
											className="h-24 text-center"
											colSpan={columns.length}
										>
											{t("no_attendance_records")}
										</TableCell>
									</TableRow>
								) : (
									paginatedHistory.map((record) => (
										<TableRow
											key={record.id}
											className="hover:bg-muted/50 transition-colors"
										>
											<TableCell>
												<p className="font-medium text-sm">
													{record.studentId}
												</p>
											</TableCell>
											<TableCell>
												<p className="text-sm text-muted-foreground">
													{record.date.split("T")[0]}
												</p>
											</TableCell>
											<TableCell>{getStatusBadge(record.status)}</TableCell>
											<TableCell>
												<p className="text-sm text-muted-foreground">
													{record.remarks || "-"}
												</p>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex items-center justify-center gap-2">
							<Button
								disabled={page === 1}
								size="icon"
								variant="outline"
								className="rounded-lg"
								onClick={() => setPage(Math.max(1, page - 1))}
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<span className="text-sm text-muted-foreground">
								{t("page")} {page} {t("of")} {totalPages}
							</span>
							<Button
								disabled={page === totalPages}
								size="icon"
								variant="outline"
								className="rounded-lg"
								onClick={() => setPage(Math.min(totalPages, page + 1))}
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
						</div>
					)}
				</>
			)}
		</div>
	);
};
