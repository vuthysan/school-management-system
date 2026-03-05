"use client";

import React, { useMemo, useState, useCallback } from "react";
import {
	Search,
	Trash2,
	Filter,
	Pencil,
	ChevronLeft,
	ChevronRight,
	MoreHorizontal,
	Users,
	Building2,
	Shield,
	Crown,
	GraduationCap,
	Briefcase,
	UserCog,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SearchInput } from "@/components/shared/search-input";
import { Member } from "@/hooks/useMembers";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

// Role configuration
const ROLE_CONFIG = [
	{ value: "Owner", labelKey: "role_owner", icon: Crown, color: "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400" },
	{ value: "Director", labelKey: "role_director", icon: GraduationCap, color: "bg-cyan-50 text-cyan-600 dark:bg-cyan-950/50 dark:text-cyan-400" },
	{ value: "DeputyDirector", labelKey: "role_deputy_director", icon: GraduationCap, color: "bg-teal-50 text-teal-600 dark:bg-teal-950/50 dark:text-teal-400" },
	{ value: "Admin", labelKey: "role_admin", icon: UserCog, color: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400" },
	{ value: "HeadTeacher", labelKey: "role_head_teacher", icon: GraduationCap, color: "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400" },
	{ value: "Teacher", labelKey: "role_teacher", icon: GraduationCap, color: "bg-orange-50 text-orange-600 dark:bg-orange-950/50 dark:text-orange-400" },
	{ value: "Staff", labelKey: "role_staff", icon: Briefcase, color: "bg-gray-50 text-gray-600 dark:bg-gray-950/50 dark:text-gray-400" },
	{ value: "Accountant", labelKey: "role_accountant", icon: Shield, color: "bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400" },
	{ value: "Librarian", labelKey: "role_librarian", icon: Shield, color: "bg-pink-50 text-pink-600 dark:bg-pink-950/50 dark:text-pink-400" },
	{ value: "Student", labelKey: "role_student", icon: Users, color: "bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400" },
	{ value: "Parent", labelKey: "role_parent", icon: Users, color: "bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400" },
] as const;

function getRoleInfo(role: string) {
	const normalizedRole = role.toLowerCase();
	return (
		ROLE_CONFIG.find((r) => r.value.toLowerCase() === normalizedRole) ||
		ROLE_CONFIG[ROLE_CONFIG.length - 1]
	);
}

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

interface MembersTableProps {
	members: Member[];
	branches: any[];
	onEdit: (member: Member) => void;
	onDelete: (member: Member) => void;
}

export const MembersTable: React.FC<MembersTableProps> = ({
	members,
	branches,
	onEdit,
	onDelete,
}) => {
	const { t } = useLanguage();

	const [searchQuery, setSearchQuery] = useState("");
	const [roleFilter, setRoleFilter] = useState("all");
	const [page, setPage] = useState(1);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	// Filter and search
	const filteredMembers = useMemo(() => {
		let filtered = [...members];

		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			filtered = filtered.filter(
				(member) =>
					member.user?.fullName?.toLowerCase().includes(query) ||
					member.user?.email?.toLowerCase().includes(query) ||
					member.userId.toLowerCase().includes(query)
			);
		}

		if (roleFilter !== "all") {
			filtered = filtered.filter(
				(member) => member.role.toLowerCase() === roleFilter.toLowerCase()
			);
		}

		return filtered;
	}, [members, searchQuery, roleFilter]);

	// Paginate
	const paginatedMembers = useMemo(() => {
		const start = (page - 1) * rowsPerPage;
		const end = start + rowsPerPage;
		return filteredMembers.slice(start, end);
	}, [filteredMembers, page, rowsPerPage]);

	const totalPages = Math.ceil(filteredMembers.length / rowsPerPage);

	const handleClearFilters = useCallback(() => {
		setRoleFilter("all");
		setSearchQuery("");
	}, []);

	const hasActiveFilters = searchQuery || roleFilter !== "all";

	return (
		<motion.div
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.15, duration: 0.3 }}
		>
			<div className="liquid-glass-card rounded-2xl overflow-hidden">
				{/* Card header with search + filter */}
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 border-b border-black/6 dark:border-white/6">
					<div className="flex items-center gap-3">
						<div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
							<Users className="w-3 h-3 text-blue-600 dark:text-blue-400" strokeWidth={2} />
						</div>
						<h2 className="text-sm font-semibold text-foreground">
							{t("all_members") || "All Members"}
						</h2>
						<span className="text-xs text-muted-foreground/60 tabular-nums">
							{filteredMembers.length}
						</span>
					</div>
					<div className="flex items-center gap-2 w-full sm:w-auto">
						<Select value={roleFilter} onValueChange={setRoleFilter}>
							<SelectTrigger className="w-[150px] h-9 text-xs">
								<div className="flex items-center gap-1.5">
									<Filter className="h-3 w-3 text-muted-foreground" />
									<SelectValue placeholder={t("all_roles")} />
								</div>
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">
									{t("all_roles")}
								</SelectItem>
								{ROLE_CONFIG.map((role) => (
									<SelectItem key={role.value} value={role.value}>
										{t(role.labelKey as any)}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						{hasActiveFilters && (
							<Button
								size="sm"
								variant="ghost"
								onClick={handleClearFilters}
								className="h-9 text-xs text-muted-foreground"
							>
								{t("clear")}
							</Button>
						)}
						<SearchInput
							placeholder={t("search_members_placeholder") || "Search..."}
							value={searchQuery}
							onChange={setSearchQuery}
							className="w-full sm:w-56"
						/>
					</div>
				</div>

				{/* Table */}
				<Table>
					<TableHeader>
						<TableRow className="hover:bg-transparent border-b border-black/6 dark:border-white/6">
							<TableHead className="w-75 h-10 text-xs font-medium text-muted-foreground">
								{t("user")}
							</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">
								{t("role")}
							</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">
								{t("branch")}
							</TableHead>
							<TableHead className="h-10 text-xs font-medium text-muted-foreground">
								{t("status")}
							</TableHead>
							<TableHead className="text-right h-10 text-xs font-medium text-muted-foreground">
								{t("actions")}
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						<AnimatePresence mode="popLayout">
							{paginatedMembers.length === 0 ? (
								<TableRow>
									<TableCell
										className="h-60 text-center"
										colSpan={5}
									>
										<div className="flex flex-col items-center justify-center gap-3">
											<div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center">
												<Users className="h-5 w-5 text-muted-foreground" />
											</div>
											<p className="text-sm font-medium text-foreground">
												{hasActiveFilters ? t("no_results") : t("no_members")}
											</p>
										</div>
									</TableCell>
								</TableRow>
							) : (
								paginatedMembers.map((member, index) => {
									const roleInfo = getRoleInfo(member.role);
									const RoleIcon = roleInfo.icon;
									return (
										<motion.tr
											key={member.idStr}
											initial={{ opacity: 0 }}
											animate={{ opacity: 1 }}
											exit={{ opacity: 0 }}
											transition={{ delay: index * 0.03 }}
											className="group hover:bg-muted/30 transition-colors border-b border-black/6 dark:border-white/6"
										>
											<TableCell className="py-3">
												<div className="flex items-center gap-3">
													<Avatar className="h-9 w-9 border border-black/6 dark:border-white/6">
														{member.user?.avatarUrl ? (
															<img
																src={member.user.avatarUrl}
																alt={member.user.fullName || ""}
																className="h-full w-full object-cover"
															/>
														) : (
															<AvatarFallback className="bg-muted text-muted-foreground text-xs font-semibold">
																<Users className="h-3.5 w-3.5" />
															</AvatarFallback>
														)}
													</Avatar>
													<div className="min-w-0">
														<p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
															{member.user?.fullName || member.userId}
														</p>
														<p className="text-xs text-muted-foreground/60 truncate mt-0.5">
															{member.user?.email || member.userId}
														</p>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<div
														className={cn(
															"w-6 h-6 rounded-md flex items-center justify-center",
															roleInfo.color
														)}
													>
														<RoleIcon className="h-3 w-3" />
													</div>
													<span className="text-sm text-foreground/80">
														{t(roleInfo.labelKey as any)}
													</span>
												</div>
											</TableCell>
											<TableCell>
												{member.branchId ? (
													<Badge
														variant="secondary"
														className="bg-primary/8 text-primary border-none text-xs font-medium gap-1"
													>
														<Building2 className="h-3 w-3" />
														{branches.find((b) => b.id === member.branchId)
															?.name || member.branchId}
													</Badge>
												) : (
													<span className="text-xs text-muted-foreground">
														{t("school_wide") || "School-wide"}
													</span>
												)}
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-1.5">
													<div
														className={cn(
															"w-1.5 h-1.5 rounded-full",
															member.status === "Active"
																? "bg-emerald-500"
																: "bg-muted-foreground/30"
														)}
													/>
													<span
														className={cn(
															"text-xs font-medium",
															member.status === "Active"
																? "text-emerald-600 dark:text-emerald-400"
																: "text-muted-foreground"
														)}
													>
														{member.status}
													</span>
												</div>
											</TableCell>
											<TableCell className="text-right">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant="ghost"
															size="sm"
															className="h-7 w-7 p-0 hover:bg-muted"
														>
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent
														align="end"
														className="w-[150px]"
													>
														<DropdownMenuItem
															onClick={() => onEdit(member)}
														>
															<Pencil className="mr-2 h-3.5 w-3.5" />
															{t("edit_role")}
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => onDelete(member)}
															className="text-destructive focus:text-destructive focus:bg-destructive/10"
															disabled={member.role === "Owner"}
														>
															<Trash2 className="mr-2 h-3.5 w-3.5" />
															{t("remove")}
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

				{/* Pagination */}
				{totalPages > 0 && (
					<div className="flex items-center justify-between px-4 py-3 border-t border-black/6 dark:border-white/6">
						<div className="flex items-center gap-2">
							<span className="text-xs text-muted-foreground">
								{filteredMembers.length} {t("total_members") || "members"}
							</span>
							<Select
								value={rowsPerPage.toString()}
								onValueChange={(value) => {
									setRowsPerPage(parseInt(value));
									setPage(1);
								}}
							>
								<SelectTrigger className="w-[65px] h-7 text-xs">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{ROWS_PER_PAGE_OPTIONS.map((option) => (
										<SelectItem
											key={option}
											value={option.toString()}
										>
											{option}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

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
		</motion.div>
	);
};
