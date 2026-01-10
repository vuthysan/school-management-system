"use client";

import { useTranslation } from "react-i18next";
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
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, Edit, Trash, CheckCircle2, Clock } from "lucide-react";
import { Term } from "@/hooks/useTerms";
import { AcademicYear } from "@/hooks/useAcademicYears";

interface TermsTableProps {
	items: Term[];
	academicYears: AcademicYear[];
	isLoading: boolean;
	onEdit: (item: Term) => void;
	onDelete: (item: Term) => void;
}

export function TermsTable({
	items,
	academicYears,
	isLoading,
	onEdit,
	onDelete,
}: TermsTableProps) {
	const { t } = useTranslation();

	const getAcademicYearName = (yearId: string) => {
		return academicYears.find((y) => y.idStr === yearId)?.name || "Unknown";
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64 border rounded-xl bg-muted/10">
				<Clock className="h-8 w-8 animate-spin text-muted-foreground" />
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-64 border border-dashed rounded-xl bg-muted/5 gap-4">
				<Clock className="h-8 w-8 text-neutral-400" />
				<div className="text-center">
					<h3 className="font-semibold">{t("no_terms")}</h3>
					<p className="text-sm text-neutral-500">
						{t("start_by_adding_term")}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="border rounded-xl overflow-hidden bg-background shadow-sm">
			<Table>
				<TableHeader>
					<TableRow className="bg-muted/30">
						<TableHead className="font-bold">{t("name")}</TableHead>
						<TableHead className="font-bold">{t("academic_year")}</TableHead>
						<TableHead className="font-bold">{t("dates")}</TableHead>
						<TableHead className="font-bold">{t("type")}</TableHead>
						<TableHead className="font-bold">{t("current")}</TableHead>
						<TableHead className="text-right font-bold">
							{t("actions")}
						</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{items.map((item) => (
						<TableRow
							key={item.idStr}
							className="hover:bg-muted/10 transition-colors"
						>
							<TableCell className="font-medium">{item.name}</TableCell>
							<TableCell>
								{getAcademicYearName(item.academicYearIdStr)}
							</TableCell>
							<TableCell className="text-sm">
								{new Date(item.startDateStr).toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
								})}{" "}
								-{" "}
								{new Date(item.endDateStr).toLocaleDateString("en-US", {
									month: "short",
									day: "numeric",
									year: "numeric",
								})}
							</TableCell>
							<TableCell>
								<Badge variant="outline">{t(item.termType)}</Badge>
							</TableCell>
							<TableCell>
								{item.isCurrent && (
									<Badge className="bg-primary/20 text-primary border-primary/30 flex w-fit items-center gap-1">
										<CheckCircle2 className="h-3 w-3" />
										{t("current")}
									</Badge>
								)}
							</TableCell>
							<TableCell className="text-right">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon" className="h-8 w-8">
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										<DropdownMenuItem onClick={() => onEdit(item)}>
											<Edit className="mr-2 h-4 w-4" /> {t("edit")}
										</DropdownMenuItem>
										<DropdownMenuItem
											className="text-destructive"
											onClick={() => onDelete(item)}
										>
											<Trash className="mr-2 h-4 w-4" /> {t("delete")}
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
