"use client";

import { useState } from "react";
import {
	Pencil,
	Trash2,
	MoreHorizontal,
	Plus,
	Loader2,
	DollarSign,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Fee } from "@/types/finance";
import { useLanguage } from "@/contexts/language-context";

interface FeeTableProps {
	fees: Fee[];
	isLoading: boolean;
	onAdd: () => void;
	onEdit: (fee: Fee) => void;
	onDelete: (fee: Fee) => void;
}

export function FeeTable({
	fees,
	isLoading,
	onAdd,
	onEdit,
	onDelete,
}: FeeTableProps) {
	const { t } = useLanguage();

	const formatDate = (dateStr: string) => {
		try {
			return new Date(dateStr).toLocaleDateString("en-US", {
				year: "numeric",
				month: "short",
				day: "numeric",
			});
		} catch {
			return dateStr;
		}
	};

	if (isLoading) {
		return (
			<Card className="p-8">
				<div className="flex items-center justify-center gap-2">
					<Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
					<span className="text-muted-foreground">
						{t("loading") || "Loading..."}
					</span>
				</div>
			</Card>
		);
	}

	return (
		<Card>
			<div className="p-4 border-b flex items-center justify-between">
				<div className="flex items-center gap-3">
					<div className="p-2 rounded-lg bg-primary/10">
						<DollarSign className="w-4 h-4 text-primary" />
					</div>
					<div>
						<h3 className="font-semibold">
							{t("fee_structure") || "Fee Structure"}
						</h3>
						<p className="text-sm text-muted-foreground">
							{fees.length} {t("fees") || "fees"}{" "}
							{t("configured") || "configured"}
						</p>
					</div>
				</div>
				<Button onClick={onAdd} size="sm" className="gap-2">
					<Plus className="w-4 h-4" />
					{t("add_fee") || "Add Fee"}
				</Button>
			</div>

			{fees.length === 0 ? (
				<div className="p-8 text-center">
					<DollarSign className="w-12 h-12 mx-auto text-muted-foreground/50 mb-3" />
					<p className="text-muted-foreground">
						{t("no_fees") || "No fees configured yet"}
					</p>
					<Button onClick={onAdd} variant="outline" className="mt-4 gap-2">
						<Plus className="w-4 h-4" />
						{t("create_first_fee") || "Create your first fee"}
					</Button>
				</div>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>{t("fee_name") || "Fee Name"}</TableHead>
							<TableHead>{t("amount") || "Amount"}</TableHead>
							<TableHead>{t("grade_level") || "Grade Level"}</TableHead>
							<TableHead>{t("academic_year") || "Academic Year"}</TableHead>
							<TableHead>{t("due_date") || "Due Date"}</TableHead>
							<TableHead>{t("type") || "Type"}</TableHead>
							<TableHead className="w-[50px]"></TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{fees.map((fee) => (
							<TableRow key={fee.id} className="group">
								<TableCell className="font-medium">
									<div>
										{fee.feeName}
										{fee.description && (
											<p className="text-xs text-muted-foreground mt-0.5">
												{fee.description}
											</p>
										)}
									</div>
								</TableCell>
								<TableCell>
									<span className="font-semibold">{fee.formattedAmount}</span>
								</TableCell>
								<TableCell>
									{fee.isAllGrades ? (
										<Badge variant="secondary">
											{t("all_grades") || "All Grades"}
										</Badge>
									) : (
										<Badge variant="outline">{fee.gradeLevel}</Badge>
									)}
								</TableCell>
								<TableCell>{fee.academicYear}</TableCell>
								<TableCell>{formatDate(fee.dueDate)}</TableCell>
								<TableCell>
									{fee.isMandatory ? (
										<Badge variant="default">
											{t("mandatory") || "Mandatory"}
										</Badge>
									) : (
										<Badge variant="secondary">
											{t("optional") || "Optional"}
										</Badge>
									)}
								</TableCell>
								<TableCell>
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button
												variant="ghost"
												size="icon"
												className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
											>
												<MoreHorizontal className="w-4 h-4" />
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuItem onClick={() => onEdit(fee)}>
												<Pencil className="w-4 h-4 mr-2" />
												{t("edit") || "Edit"}
											</DropdownMenuItem>
											<DropdownMenuItem
												onClick={() => onDelete(fee)}
												className="text-destructive"
											>
												<Trash2 className="w-4 h-4 mr-2" />
												{t("delete") || "Delete"}
											</DropdownMenuItem>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</Card>
	);
}
