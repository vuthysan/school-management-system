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
import {
	MoreHorizontal,
	Edit,
	Trash,
	CheckCircle2,
	Calendar,
} from "lucide-react";
import { AcademicYear } from "@/hooks/useAcademicYears";
import { cn } from "@/lib/utils";

interface AcademicYearsTableProps {
	items: AcademicYear[];
	isLoading: boolean;
	onEdit: (item: AcademicYear) => void;
	onDelete: (item: AcademicYear) => void;
	onSetCurrent: (id: string) => void;
}

export function AcademicYearsTable({
	items,
	isLoading,
	onEdit,
	onDelete,
	onSetCurrent,
}: AcademicYearsTableProps) {
	const { t } = useTranslation();

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "Active":
				return (
					<Badge
						variant="default"
						className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
					>
						{t("Active")}
					</Badge>
				);
			case "Planning":
				return (
					<Badge
						variant="outline"
						className="text-amber-500 border-amber-500/20"
					>
						{t("Planning")}
					</Badge>
				);
			case "Completed":
				return <Badge variant="secondary">{t("Completed")}</Badge>;
			case "Archived":
				return <Badge variant="outline">{t("Archived")}</Badge>;
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64 border rounded-xl bg-muted/10">
				<div className="flex flex-col items-center gap-2">
					<Calendar className="h-8 w-8 animate-pulse text-muted-foreground" />
					<p className="text-sm text-muted-foreground">{t("loading_data")}</p>
				</div>
			</div>
		);
	}

	if (items.length === 0) {
		return (
			<div className="flex flex-col items-center justify-center h-64 border border-dashed rounded-xl bg-muted/5 gap-4">
				<div className="p-4 rounded-full bg-muted/20">
					<Calendar className="h-8 w-8 text-muted-foreground" />
				</div>
				<div className="text-center space-y-1">
					<h3 className="font-semibold">{t("no_academic_years")}</h3>
					<p className="text-sm text-muted-foreground">
						{t("start_by_adding_academic_year")}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="border rounded-xl overflow-hidden bg-background">
			<Table>
				<TableHeader>
					<TableRow className="bg-muted/30">
						<TableHead className="font-bold">{t("name")}</TableHead>
						<TableHead className="font-bold">{t("dates")}</TableHead>
						<TableHead className="font-bold">{t("status")}</TableHead>
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
							className="hover:bg-muted/20 transition-colors group"
						>
							<TableCell className="font-medium">
								<div className="flex flex-col">
									<span>{item.name}</span>
									{item.label && (
										<span className="text-xs text-muted-foreground">
											{item.label}
										</span>
									)}
								</div>
							</TableCell>
							<TableCell className="text-sm text-muted-foreground">
								<div className="flex items-center gap-2">
									<span>
										{new Date(item.startDateStr).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										})}
									</span>
									<span>-</span>
									<span>
										{new Date(item.endDateStr).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										})}
									</span>
								</div>
							</TableCell>
							<TableCell>{getStatusBadge(item.status)}</TableCell>
							<TableCell>
								{item.isCurrent ? (
									<Badge className="bg-primary/20 text-primary border-primary/30 flex w-fit items-center gap-1">
										<CheckCircle2 className="h-3 w-3" />
										{t("current")}
									</Badge>
								) : (
									<Button
										variant="ghost"
										size="sm"
										className="opacity-0 group-hover:opacity-100 h-7 text-xs"
										onClick={() => onSetCurrent(item.idStr)}
									>
										{t("set_as_current")}
									</Button>
								)}
							</TableCell>
							<TableCell className="text-right">
								<DropdownMenu>
									<DropdownMenuTrigger asChild>
										<Button variant="ghost" size="icon" className="h-8 w-8">
											<MoreHorizontal className="h-4 w-4" />
										</Button>
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end" className="w-40">
										<DropdownMenuItem onClick={() => onEdit(item)}>
											<Edit className="mr-2 h-4 w-4" /> {t("edit")}
										</DropdownMenuItem>
										{!item.isCurrent && (
											<DropdownMenuItem
												onClick={() => onSetCurrent(item.idStr)}
											>
												<CheckCircle2 className="mr-2 h-4 w-4" />{" "}
												{t("set_as_current")}
											</DropdownMenuItem>
										)}
										<DropdownMenuItem
											className="text-destructive focus:text-destructive"
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
