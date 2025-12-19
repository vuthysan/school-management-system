"use client";

import React, { useMemo, useState, useCallback } from "react";
import {
	Search,
	Eye,
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
import { Input } from "@/components/ui/input";
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
import { Member } from "@/hooks/useMembers";
import { useLanguage } from "@/contexts/language-context";
import { cn } from "@/lib/utils";

// Role configuration
const ROLE_CONFIG = [
	{ value: "Owner", labelKey: "role_owner", icon: Crown, color: "bg-blue-500" },
	{
		value: "Director",
		labelKey: "role_director",
		icon: GraduationCap,
		color: "bg-cyan-500",
	},
	{
		value: "DeputyDirector",
		labelKey: "role_deputy_director",
		icon: GraduationCap,
		color: "bg-teal-500",
	},
	{
		value: "Admin",
		labelKey: "role_admin",
		icon: UserCog,
		color: "bg-green-500",
	},
	{
		value: "HeadTeacher",
		labelKey: "role_head_teacher",
		icon: GraduationCap,
		color: "bg-amber-500",
	},
	{
		value: "Teacher",
		labelKey: "role_teacher",
		icon: GraduationCap,
		color: "bg-orange-500",
	},
	{
		value: "Staff",
		labelKey: "role_staff",
		icon: Briefcase,
		color: "bg-gray-500",
	},
	{
		value: "Accountant",
		labelKey: "role_accountant",
		icon: Shield,
		color: "bg-purple-500",
	},
	{
		value: "Librarian",
		labelKey: "role_librarian",
		icon: Shield,
		color: "bg-pink-500",
	},
	{
		value: "Student",
		labelKey: "role_student",
		icon: Users,
		color: "bg-indigo-500",
	},
	{
		value: "Parent",
		labelKey: "role_parent",
		icon: Users,
		color: "bg-rose-500",
	},
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
	branches: any[]; // Use any for simplicity or correct type if known
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

	const columns = [
		{ key: "user", label: t("user").toUpperCase() },
		{ key: "role", label: t("role").toUpperCase() },
		{ key: "branch", label: t("branch").toUpperCase() },
		{ key: "status", label: t("status").toUpperCase() },
		{ key: "actions", label: t("actions").toUpperCase() },
	];

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
		<div className="flex flex-col gap-6">
			{/* Toolbar */}
			<motion.div
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
			>
				<div className="flex flex-col md:flex-row gap-4">
					<div className="relative flex-1 group">
						<Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" />
						<Input
							className="pl-10 h-11 transition-all"
							placeholder={
								t("search_members_placeholder") || "Search members..."
							}
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
					<div className="flex flex-wrap gap-3">
						<Select value={roleFilter} onValueChange={setRoleFilter}>
							<SelectTrigger className="w-[180px] h-11 rounded-lg">
								<div className="flex items-center gap-2">
									<Filter className="h-3.5 w-3.5 text-muted-foreground" />
									<SelectValue placeholder={t("all_roles")} />
								</div>
							</SelectTrigger>
							<SelectContent className="rounded-xl shadow-xl">
								<SelectItem value="all" className="rounded-lg">
									{t("all_roles")}
								</SelectItem>
								{ROLE_CONFIG.map((role) => (
									<SelectItem
										key={role.value}
										value={role.value}
										className="rounded-lg"
									>
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
								className="h-11 px-4 rounded-lg hover:bg-destructive/5 text-destructive font-medium"
							>
								{t("clear")}
							</Button>
						)}
					</div>
				</div>
			</motion.div>

			{/* Table */}
			<div className="rounded-lg border-none shadow-sm overflow-hidden bg-card">
				<Table>
					<TableHeader>
						<TableRow>
							{columns.map((column) => (
								<TableHead
									key={column.key}
									className={cn(
										"uppercase tracking-widest px-4",
										column.key === "actions" && "text-right"
									)}
								>
									{column.label}
								</TableHead>
							))}
						</TableRow>
					</TableHeader>
					<TableBody>
						<AnimatePresence mode="popLayout">
							{paginatedMembers.length === 0 ? (
								<motion.tr
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
								>
									<TableCell
										className="h-64 text-center text-muted-foreground font-medium"
										colSpan={columns.length}
									>
										<div className="flex flex-col items-center gap-3">
											<div className="p-4 bg-secondary/20 rounded-full">
												<Search className="h-6 w-6 opacity-20" />
											</div>
											{hasActiveFilters ? t("no_results") : t("no_members")}
										</div>
									</TableCell>
								</motion.tr>
							) : (
								paginatedMembers.map((member, index) => {
									const roleInfo = getRoleInfo(member.role);
									const RoleIcon = roleInfo.icon;
									return (
										<motion.tr
											key={member.idStr}
											initial={{ opacity: 0, y: 10 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ duration: 0.3, delay: index * 0.05 }}
											className="group transition-all hover:bg-secondary/10 cursor-pointer"
										>
											<TableCell className="px-6 py-4">
												<div className="flex items-center gap-4">
													<Avatar className="h-10 w-10 border-2 border-background shadow-sm transition-transform group-hover:scale-110">
														{member.user?.avatarUrl ? (
															<img
																src={member.user.avatarUrl}
																alt={member.user.fullName || ""}
																className="h-full w-full object-cover"
															/>
														) : (
															<AvatarFallback className="bg-gradient-to-br from-primary/10 to-primary/20 text-primary text-xs">
																<Users className="h-4 w-4" />
															</AvatarFallback>
														)}
													</Avatar>
													<div className="flex flex-col">
														<span className="text-foreground group-hover:text-primary transition-colors font-medium">
															{member.user?.fullName || member.userId}
														</span>
														<span className="text-[11px] text-muted-foreground/80 font-medium tracking-wide">
															{member.user?.email || member.userId}
														</span>
													</div>
												</div>
											</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<div
														className={cn(
															"p-1.5 rounded-lg text-white",
															roleInfo.color
														)}
													>
														<RoleIcon className="h-3.5 w-3.5" />
													</div>
													<span className="text-sm font-medium">
														{t(roleInfo.labelKey as any)}
													</span>
												</div>
											</TableCell>
											<TableCell>
												{member.branchId ? (
													<Badge
														variant="outline"
														className="rounded-lg gap-1 px-2.5 py-0.5 font-medium border-primary/20 text-primary bg-primary/5"
													>
														<Building2 className="h-3 w-3" />
														{branches.find((b) => b.id === member.branchId)
															?.name || member.branchId}
													</Badge>
												) : (
													<Badge
														variant="secondary"
														className="rounded-lg px-2.5 py-0.5 font-medium bg-muted text-muted-foreground border-none"
													>
														{t("school_wide") || "School-wide"}
													</Badge>
												)}
											</TableCell>
											<TableCell>
												<Badge
													className={cn(
														"rounded-lg px-2.5 py-0.5 text-[11px] border-none font-bold",
														member.status === "Active"
															? "bg-emerald-500/10 text-emerald-600"
															: "bg-muted text-muted-foreground"
													)}
												>
													{member.status}
												</Badge>
											</TableCell>
											<TableCell className="px-6 text-right">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant="ghost"
															className="h-8 w-8 p-0 hover:bg-muted rounded-full"
														>
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent
														align="end"
														className="w-[160px] rounded-lg"
													>
														<DropdownMenuItem
															onClick={() => onEdit(member)}
															className="text-emerald-500 focus:text-emerald-600 focus:bg-emerald-50"
														>
															<Pencil className="mr-2 h-4 w-4" />
															<span>{t("edit_role")}</span>
														</DropdownMenuItem>
														<DropdownMenuItem
															onClick={() => onDelete(member)}
															className="text-destructive focus:text-destructive focus:bg-destructive/10"
															disabled={member.role === "Owner"}
														>
															<Trash2 className="mr-2 h-4 w-4" />
															<span>{t("remove")}</span>
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

			{/* Pagination */}
			<div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4 py-2">
				<div className="flex flex-col gap-1 items-center sm:items-start order-2 sm:order-1">
					<span className="text-xs text-muted-foreground/60 uppercase tracking-widest">
						{t("total_members_count", { count: filteredMembers.length })}
					</span>
					<div className="flex items-center gap-2 mt-1">
						<span className="text-xs font-medium text-muted-foreground/60">
							{t("rows_per_page")}
						</span>
						<Select
							value={rowsPerPage.toString()}
							onValueChange={(value) => {
								setRowsPerPage(parseInt(value));
								setPage(1);
							}}
						>
							<SelectTrigger className="w-[70px] h-8 rounded-lg text-xs ">
								<SelectValue />
							</SelectTrigger>
							<SelectContent className="rounded-xl shadow-xl min-w-[70px]">
								{ROWS_PER_PAGE_OPTIONS.map((option) => (
									<SelectItem
										key={option}
										value={option.toString()}
										className="rounded-lg text-xs"
									>
										{option}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{totalPages > 1 && (
					<div className="flex items-center gap-2 order-1 sm:order-2">
						<Button
							disabled={page === 1}
							size="icon"
							variant="outline"
							className="h-10 w-10 rounded-xl hover:bg-primary/5 hover:text-primary transition-all disabled:opacity-30"
							onClick={() => setPage(Math.max(1, page - 1))}
						>
							<ChevronLeft className="h-5 w-5" />
						</Button>

						<div className="flex items-center gap-1.5 mx-2">
							{Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
								let pageNum = page;
								if (page <= 3) pageNum = i + 1;
								else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
								else pageNum = page - 2 + i;

								if (pageNum > 0 && pageNum <= totalPages) {
									return (
										<Button
											key={pageNum}
											variant={page === pageNum ? "default" : "ghost"}
											className={cn(
												"h-10 w-10 rounded-xl transition-all text-sm",
												page === pageNum
													? "shadow-md shadow-primary/5 scale-110"
													: "hover:bg-primary/5 hover:text-primary text-muted-foreground"
											)}
											onClick={() => setPage(pageNum)}
										>
											{pageNum}
										</Button>
									);
								}
								return null;
							})}
						</div>

						<Button
							disabled={page === totalPages}
							size="icon"
							variant="outline"
							className="h-10 w-10 rounded-xl hover:bg-primary/5 hover:text-primary transition-all disabled:opacity-30"
							onClick={() => setPage(Math.min(totalPages, page + 1))}
						>
							<ChevronRight className="h-5 w-5" />
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};
