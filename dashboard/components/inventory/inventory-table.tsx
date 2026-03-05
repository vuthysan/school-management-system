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
import { MoreHorizontal, Pencil, Trash2, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InventoryItem, InventoryCategory, ItemCondition } from "@/types/inventory";

interface InventoryTableProps {
	items: InventoryItem[];
	isLoading: boolean;
	onEdit: (item: InventoryItem) => void;
	onDelete: (item: InventoryItem) => void;
}

const STATUS_STYLES: Record<string, { dot: string; text: string }> = {
	Active:   { dot: "bg-emerald-500",         text: "text-emerald-600 dark:text-emerald-400" },
	Inactive: { dot: "bg-muted-foreground/30",  text: "text-muted-foreground" },
	Pending:  { dot: "bg-amber-500",            text: "text-amber-600 dark:text-amber-400" },
	Archived: { dot: "bg-slate-400",            text: "text-slate-500 dark:text-slate-400" },
};

const CONDITION_STYLES: Record<ItemCondition, { bg: string; text: string }> = {
	New:     { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-600 dark:text-emerald-400" },
	Good:    { bg: "bg-blue-50 dark:bg-blue-950/40",       text: "text-blue-600 dark:text-blue-400" },
	Fair:    { bg: "bg-amber-50 dark:bg-amber-950/40",     text: "text-amber-600 dark:text-amber-400" },
	Poor:    { bg: "bg-orange-50 dark:bg-orange-950/40",   text: "text-orange-600 dark:text-orange-400" },
	Damaged: { bg: "bg-red-50 dark:bg-red-950/40",         text: "text-red-600 dark:text-red-400" },
};

const CATEGORY_STYLES: Record<InventoryCategory, { bg: string; text: string }> = {
	Furniture:    { bg: "bg-amber-50 dark:bg-amber-950/40",   text: "text-amber-600 dark:text-amber-400" },
	Electronics:  { bg: "bg-blue-50 dark:bg-blue-950/40",     text: "text-blue-600 dark:text-blue-400" },
	Stationery:   { bg: "bg-purple-50 dark:bg-purple-950/40", text: "text-purple-600 dark:text-purple-400" },
	Sports:       { bg: "bg-emerald-50 dark:bg-emerald-950/40", text: "text-emerald-600 dark:text-emerald-400" },
	LabEquipment: { bg: "bg-cyan-50 dark:bg-cyan-950/40",     text: "text-cyan-600 dark:text-cyan-400" },
	Books:        { bg: "bg-indigo-50 dark:bg-indigo-950/40", text: "text-indigo-600 dark:text-indigo-400" },
	Other:        { bg: "bg-muted/60",                         text: "text-muted-foreground" },
};

export function InventoryTable({ items, isLoading, onEdit, onDelete }: InventoryTableProps) {
	const { t } = useTranslation();
	const [search, setSearch] = useState("");

	const filtered = items.filter((item) =>
		item.name.toLowerCase().includes(search.toLowerCase()) ||
		item.category.toLowerCase().includes(search.toLowerCase()) ||
		(item.location && item.location.toLowerCase().includes(search.toLowerCase())) ||
		(item.supplier && item.supplier.toLowerCase().includes(search.toLowerCase()))
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
							<Package className="w-3 h-3 text-blue-600 dark:text-blue-400" strokeWidth={2} />
						</div>
						<h2 className="text-sm font-semibold text-foreground">
							{t("inventory_items") || "Inventory Items"}
						</h2>
						<span className="text-xs text-muted-foreground/60 tabular-nums">{filtered.length}</span>
					</div>
					<SearchInput
						placeholder={t("search_inventory") || "Search items..."}
						value={search}
						onChange={setSearch}
						className="w-full sm:w-64"
					/>
				</div>

				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent border-b border-black/6 dark:border-white/6">
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("item_name") || "Name"}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("category") || "Category"}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("quantity") || "Qty"}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground hidden md:table-cell">{t("unit_cost") || "Unit Cost"}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("condition") || "Condition"}</TableHead>
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
										{[1, 2, 3, 4, 5, 6, 7, 8].map((col) => (
											<TableCell key={col} className="py-3">
												<Skeleton className="h-5 w-full rounded-md" />
											</TableCell>
										))}
									</TableRow>
								))
							) : filtered.length === 0 ? (
								<TableRow>
									<TableCell className="h-60 text-center" colSpan={8}>
										<div className="flex flex-col items-center justify-center gap-3">
											<div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center">
												<Package className="h-5 w-5 text-muted-foreground" />
											</div>
											<p className="text-sm font-medium text-foreground">
												{t("no_inventory_items") || "No items found"}
											</p>
											<p className="text-xs text-muted-foreground">
												{t("no_inventory_items_desc") || "Add an item to get started"}
											</p>
										</div>
									</TableCell>
								</TableRow>
							) : (
								filtered.map((item, index) => {
									const statusStyle = STATUS_STYLES[item.status] || STATUS_STYLES.Inactive;
									const conditionStyle = CONDITION_STYLES[item.condition] || CONDITION_STYLES.Good;
									const categoryStyle = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.Other;
									const isLowStock = item.quantity > 0 && item.quantity <= 5;
									return (
										<motion.tr
											key={item.id}
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											transition={{ delay: index * 0.03 }}
											className="group hover:bg-muted/30 transition-colors border-b border-black/6 dark:border-white/6"
										>
											<TableCell className="py-3">
												<div>
													<p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate max-w-[200px]">
														{item.name}
													</p>
													{item.description && (
														<p className="text-xs text-muted-foreground truncate max-w-[200px]">
															{item.description}
														</p>
													)}
												</div>
											</TableCell>
											<TableCell className="py-3">
												<span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium", categoryStyle.bg, categoryStyle.text)}>
													{t(item.category.toLowerCase()) || item.category}
												</span>
											</TableCell>
											<TableCell className="py-3">
												<span className={cn("text-sm tabular-nums font-medium", isLowStock ? "text-amber-600 dark:text-amber-400" : "text-foreground")}>
													{item.quantity.toLocaleString()}
												</span>
											</TableCell>
											<TableCell className="py-3 hidden md:table-cell">
												<span className="text-sm text-muted-foreground tabular-nums">
													{item.currency === "KHR"
														? `${item.unitCost.toLocaleString()} ៛`
														: `$${item.unitCost.toLocaleString()}`}
												</span>
											</TableCell>
											<TableCell className="py-3">
												<span className={cn("inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium", conditionStyle.bg, conditionStyle.text)}>
													{t(item.condition.toLowerCase()) || item.condition}
												</span>
											</TableCell>
											<TableCell className="py-3 hidden lg:table-cell">
												<span className="text-sm text-muted-foreground">{item.location || "-"}</span>
											</TableCell>
											<TableCell className="py-3">
												<div className="flex items-center gap-1.5">
													<div className={cn("w-1.5 h-1.5 rounded-full", statusStyle.dot)} />
													<span className={cn("text-xs font-medium", statusStyle.text)}>
														{t(item.status.toLowerCase()) || item.status}
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
														<DropdownMenuItem onClick={() => onEdit(item)}>
															<Pencil className="mr-2 h-3.5 w-3.5" /> {t("edit") || "Edit"}
														</DropdownMenuItem>
														<DropdownMenuItem
															className="text-destructive focus:text-destructive focus:bg-destructive/10"
															onClick={() => onDelete(item)}
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
