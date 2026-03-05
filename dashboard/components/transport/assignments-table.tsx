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
import { MoreHorizontal, Pencil, Trash2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StudentTransportAssignment, TransportRoute } from "@/types/transport";

interface AssignmentsTableProps {
	assignments: StudentTransportAssignment[];
	routes: TransportRoute[];
	isLoading: boolean;
	onEdit: (assignment: StudentTransportAssignment) => void;
	onDelete: (assignment: StudentTransportAssignment) => void;
}

const STATUS_STYLES: Record<string, { dot: string; text: string }> = {
	Active: { dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
	Inactive: { dot: "bg-muted-foreground/30", text: "text-muted-foreground" },
	Pending: { dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
};

export function AssignmentsTable({ assignments, routes, isLoading, onEdit, onDelete }: AssignmentsTableProps) {
	const { t } = useTranslation();
	const [search, setSearch] = useState("");

	const getRouteName = (routeId: string) => {
		return routes.find((r) => r.id === routeId)?.name || routeId;
	};

	const filtered = assignments.filter((a) =>
		a.studentId.toLowerCase().includes(search.toLowerCase()) ||
		getRouteName(a.routeId).toLowerCase().includes(search.toLowerCase())
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
							<Users className="w-3 h-3 text-violet-600 dark:text-violet-400" strokeWidth={2} />
						</div>
						<h2 className="text-sm font-semibold text-foreground">{t("assignments")}</h2>
						<span className="text-xs text-muted-foreground/60 tabular-nums">{filtered.length}</span>
					</div>
					<SearchInput
						placeholder={t("search_assignments") || "Search assignments..."}
						value={search}
						onChange={setSearch}
						className="w-full sm:w-64"
					/>
				</div>

				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent border-b border-black/6 dark:border-white/6">
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("student_id") || "Student ID"}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("route")}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("pickup_stop")}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("dropoff_stop")}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("status")}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground text-right">{t("actions")}</TableHead>
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
												<Users className="h-5 w-5 text-muted-foreground" />
											</div>
											<p className="text-sm font-medium text-foreground">{t("no_assignments") || "No assignments"}</p>
											<p className="text-xs text-muted-foreground">{t("no_assignments_desc") || "Assign students to routes"}</p>
										</div>
									</TableCell>
								</TableRow>
							) : (
								filtered.map((assignment, index) => {
									const statusStyle = STATUS_STYLES[assignment.status] || STATUS_STYLES.Inactive;
									return (
										<motion.tr
											key={assignment.id}
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											transition={{ delay: index * 0.03 }}
											className="group hover:bg-muted/30 transition-colors border-b border-black/6 dark:border-white/6"
										>
											<TableCell className="py-3">
												<p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
													{assignment.studentId}
												</p>
											</TableCell>
											<TableCell className="py-3">
												<span className="text-sm text-muted-foreground">{getRouteName(assignment.routeId)}</span>
											</TableCell>
											<TableCell className="py-3">
												<span className="text-sm text-muted-foreground">{assignment.pickupStop || "-"}</span>
											</TableCell>
											<TableCell className="py-3">
												<span className="text-sm text-muted-foreground">{assignment.dropoffStop || "-"}</span>
											</TableCell>
											<TableCell className="py-3">
												<div className="flex items-center gap-1.5">
													<div className={cn("w-1.5 h-1.5 rounded-full", statusStyle.dot)} />
													<span className={cn("text-xs font-medium", statusStyle.text)}>
														{t(assignment.status.toLowerCase()) || assignment.status}
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
														<DropdownMenuItem onClick={() => onEdit(assignment)}>
															<Pencil className="mr-2 h-3.5 w-3.5" /> {t("edit")}
														</DropdownMenuItem>
														<DropdownMenuItem
															className="text-destructive focus:text-destructive focus:bg-destructive/10"
															onClick={() => onDelete(assignment)}
														>
															<Trash2 className="mr-2 h-3.5 w-3.5" /> {t("delete")}
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
