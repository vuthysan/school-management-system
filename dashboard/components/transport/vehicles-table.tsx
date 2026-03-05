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
import { MoreHorizontal, Pencil, Trash2, Bus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Vehicle } from "@/types/transport";

interface VehiclesTableProps {
	vehicles: Vehicle[];
	isLoading: boolean;
	onEdit: (vehicle: Vehicle) => void;
	onDelete: (vehicle: Vehicle) => void;
}

const STATUS_STYLES: Record<string, { dot: string; text: string }> = {
	Active: { dot: "bg-emerald-500", text: "text-emerald-600 dark:text-emerald-400" },
	Inactive: { dot: "bg-muted-foreground/30", text: "text-muted-foreground" },
	Pending: { dot: "bg-amber-500", text: "text-amber-600 dark:text-amber-400" },
};

const VEHICLE_TYPE_STYLES: Record<string, string> = {
	Bus: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400",
	Van: "bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400",
	Car: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400",
};

export function VehiclesTable({ vehicles, isLoading, onEdit, onDelete }: VehiclesTableProps) {
	const { t } = useTranslation();
	const [search, setSearch] = useState("");

	const filtered = vehicles.filter((v) =>
		v.name.toLowerCase().includes(search.toLowerCase()) ||
		v.licensePlate.toLowerCase().includes(search.toLowerCase()) ||
		(v.driverName && v.driverName.toLowerCase().includes(search.toLowerCase()))
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
							<Bus className="w-3 h-3 text-blue-600 dark:text-blue-400" strokeWidth={2} />
						</div>
						<h2 className="text-sm font-semibold text-foreground">{t("vehicles")}</h2>
						<span className="text-xs text-muted-foreground/60 tabular-nums">{filtered.length}</span>
					</div>
					<SearchInput
						placeholder={t("search_vehicles") || "Search vehicles..."}
						value={search}
						onChange={setSearch}
						className="w-full sm:w-64"
					/>
				</div>

				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent border-b border-black/6 dark:border-white/6">
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("name")}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("license_plate")}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("type")}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("capacity")}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("driver")}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">{t("status")}</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground text-right">{t("actions")}</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<AnimatePresence mode="popLayout">
							{isLoading ? (
								Array.from({ length: 3 }).map((_, i) => (
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
												<Bus className="h-5 w-5 text-muted-foreground" />
											</div>
											<p className="text-sm font-medium text-foreground">{t("no_vehicles") || "No vehicles"}</p>
											<p className="text-xs text-muted-foreground">{t("no_vehicles_desc") || "Add a vehicle to get started"}</p>
										</div>
									</TableCell>
								</TableRow>
							) : (
								filtered.map((vehicle, index) => {
									const statusStyle = STATUS_STYLES[vehicle.status] || STATUS_STYLES.Inactive;
									const typeStyle = VEHICLE_TYPE_STYLES[vehicle.vehicleType] || "";
									return (
										<motion.tr
											key={vehicle.id}
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											transition={{ delay: index * 0.03 }}
											className="group hover:bg-muted/30 transition-colors border-b border-black/6 dark:border-white/6"
										>
											<TableCell className="py-3">
												<p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
													{vehicle.name}
												</p>
											</TableCell>
											<TableCell className="py-3">
												<span className="text-sm text-muted-foreground font-mono">{vehicle.licensePlate}</span>
											</TableCell>
											<TableCell className="py-3">
												<span className={cn("text-xs font-medium px-2 py-0.5 rounded-md", typeStyle)}>
													{t(vehicle.vehicleType.toLowerCase()) || vehicle.vehicleType}
												</span>
											</TableCell>
											<TableCell className="py-3">
												<span className="text-sm text-muted-foreground tabular-nums">{vehicle.capacity}</span>
											</TableCell>
											<TableCell className="py-3">
												<div className="min-w-0">
													<p className="text-sm text-foreground truncate">{vehicle.driverName || "-"}</p>
													{vehicle.driverPhone && (
														<p className="text-xs text-muted-foreground/60 truncate">{vehicle.driverPhone}</p>
													)}
												</div>
											</TableCell>
											<TableCell className="py-3">
												<div className="flex items-center gap-1.5">
													<div className={cn("w-1.5 h-1.5 rounded-full", statusStyle.dot)} />
													<span className={cn("text-xs font-medium", statusStyle.text)}>
														{t(vehicle.status.toLowerCase()) || vehicle.status}
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
														<DropdownMenuItem onClick={() => onEdit(vehicle)}>
															<Pencil className="mr-2 h-3.5 w-3.5" /> {t("edit")}
														</DropdownMenuItem>
														<DropdownMenuItem
															className="text-destructive focus:text-destructive focus:bg-destructive/10"
															onClick={() => onDelete(vehicle)}
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
