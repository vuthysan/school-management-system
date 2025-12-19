"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
	Users,
	Plus,
	Loader2,
	AlertCircle,
	Search,
	Building2,
	UserPlus,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MemberStats } from "@/components/members/member-stats";
import { MembersTable } from "@/components/members/members-table";
import { useDashboard } from "@/hooks/useDashboard";
import {
	useSchoolMembers,
	useAddMember,
	useUpdateMemberRole,
	useRemoveMember,
	useSearchUser,
	Member,
	User,
} from "@/hooks/useMembers";
import { useBranches } from "@/hooks/useBranches";
import { useLanguage } from "@/contexts/language-context";

// Role configuration
const ROLE_CONFIG = [
	{
		value: "Owner",
		labelKey: "role_owner",
		icon: "Crown",
		color: "bg-blue-500",
	},
	{
		value: "Director",
		labelKey: "role_director",
		icon: "GraduationCap",
		color: "bg-cyan-500",
	},
	{
		value: "DeputyDirector",
		labelKey: "role_deputy_director",
		icon: "GraduationCap",
		color: "bg-teal-500",
	},
	{
		value: "Admin",
		labelKey: "role_admin",
		icon: "UserCog",
		color: "bg-green-500",
	},
	{
		value: "HeadTeacher",
		labelKey: "role_head_teacher",
		icon: "GraduationCap",
		color: "bg-amber-500",
	},
	{
		value: "Teacher",
		labelKey: "role_teacher",
		icon: "GraduationCap",
		color: "bg-orange-500",
	},
	{
		value: "Staff",
		labelKey: "role_staff",
		icon: "Briefcase",
		color: "bg-gray-500",
	},
	{
		value: "Accountant",
		labelKey: "role_accountant",
		icon: "Shield",
		color: "bg-purple-500",
	},
	{
		value: "Librarian",
		labelKey: "role_librarian",
		icon: "Shield",
		color: "bg-pink-500",
	},
	{
		value: "Student",
		labelKey: "role_student",
		icon: "Users",
		color: "bg-indigo-500",
	},
	{
		value: "Parent",
		labelKey: "role_parent",
		icon: "Users",
		color: "bg-rose-500",
	},
] as const;

export default function MembersPage() {
	const { t } = useLanguage();
	const { currentSchool, isOwner, currentRole } = useDashboard();
	const schoolId = currentSchool?.idStr || currentSchool?.id;
	const { members, loading, error, refetch } = useSchoolMembers(schoolId);
	const { addMember, loading: adding } = useAddMember();
	const { updateMemberRole, loading: updating } = useUpdateMemberRole();
	const { removeMember, loading: removing } = useRemoveMember();
	const { searchUser, loading: searching } = useSearchUser();
	const { branches } = useBranches(schoolId);

	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedMember, setSelectedMember] = useState<Member | null>(null);
	const [formError, setFormError] = useState<string | null>(null);

	const [searchQuery, setSearchQuery] = useState("");
	const [foundUser, setFoundUser] = useState<User | null>(null);
	const [selectedRole, setSelectedRole] = useState("Teacher");
	const [selectedBranchId, setSelectedBranchId] = useState<string>("");
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

	const MIN_SEARCH_CHARS = 5;

	useEffect(() => {
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		if (searchQuery.trim().length >= MIN_SEARCH_CHARS) {
			debounceTimerRef.current = setTimeout(async () => {
				setFormError(null);
				const user = await searchUser(searchQuery.trim());
				if (user) {
					setFoundUser(user);
				} else {
					setFormError(
						"User not found. Make sure they have an account in the system."
					);
					setFoundUser(null);
				}
			}, 3000);
		} else {
			setFoundUser(null);
		}

		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, [searchQuery, searchUser]);

	const handleOpenAdd = () => {
		setSearchQuery("");
		setFoundUser(null);
		setSelectedRole("Teacher");
		setSelectedBranchId("");
		setFormError(null);
		setIsAddDialogOpen(true);
	};

	const handleSearchUser = async () => {
		if (searchQuery.trim().length < MIN_SEARCH_CHARS) {
			setFormError(
				`Please enter at least ${MIN_SEARCH_CHARS} characters to search`
			);
			return;
		}
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}
		setFormError(null);
		const user = await searchUser(searchQuery);
		if (user) {
			setFoundUser(user);
		} else {
			setFormError(
				"User not found. Make sure they have an account in the system."
			);
			setFoundUser(null);
		}
	};

	const handleOpenEdit = (member: Member) => {
		setSelectedMember(member);
		setSelectedRole(member.role);
		setFormError(null);
		setIsEditDialogOpen(true);
	};

	const handleOpenDelete = (member: Member) => {
		setSelectedMember(member);
		setIsDeleteDialogOpen(true);
	};

	const handleAdd = async (e: React.FormEvent) => {
		e.preventDefault();
		setFormError(null);
		if (!foundUser?.idStr) {
			setFormError("Please search and select a user first");
			return;
		}
		if (!schoolId) {
			setFormError("No school selected");
			return;
		}

		try {
			await addMember({
				schoolId,
				userId: foundUser.idStr,
				role: selectedRole,
				branchId:
					selectedBranchId && selectedBranchId !== "__none__"
						? selectedBranchId
						: undefined,
			});
			setIsAddDialogOpen(false);
			setFoundUser(null);
			setSearchQuery("");
			refetch();
		} catch (err) {
			setFormError(err instanceof Error ? err.message : "Failed to add member");
		}
	};

	const handleUpdateRole = async (e: React.FormEvent) => {
		e.preventDefault();
		setFormError(null);
		if (!selectedMember) return;

		try {
			await updateMemberRole({
				memberId: selectedMember.idStr,
				role: selectedRole,
			});
			setIsEditDialogOpen(false);
			refetch();
		} catch (err) {
			setFormError(
				err instanceof Error ? err.message : "Failed to update role"
			);
		}
	};

	const handleRemove = async () => {
		if (!selectedMember) return;
		try {
			await removeMember({ memberId: selectedMember.idStr });
			setIsDeleteDialogOpen(false);
			setSelectedMember(null);
			refetch();
		} catch (err) {
			console.error("Failed to remove member:", err);
		}
	};

	if (!currentSchool) {
		return (
			<div className="flex items-center justify-center min-h-[400px]">
				<div className="text-center">
					<AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
					<p className="text-gray-600 dark:text-gray-400">
						{t("select_school_first")}
					</p>
				</div>
			</div>
		);
	}

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="space-y-4 pb-10"
		>
			{/* Hero Header Section */}
			<Card className="p-4">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 relative">
					<div className="flex items-center gap-5">
						<div className="relative group">
							<div className="absolute -inset-1 bg-primary/20 blur opacity-0 group-hover:opacity-100 transition duration-500 rounded-lg" />
							<div className="relative p-4 bg-primary rounded-lg shadow-lg shadow-primary/20 text-primary-foreground">
								<Users className="w-8 h-8" />
							</div>
						</div>
						<div className="space-y-1">
							<h1 className="text-3xl font-bold tracking-tight text-foreground/90">
								{t("member_management")}
							</h1>
							<p className="text-sm text-muted-foreground/80 font-medium">
								{t("manage_members")}
							</p>
						</div>
					</div>

					<Button
						onClick={handleOpenAdd}
						className="rounded-lg px-6 h-12 bg-primary hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 text-sm gap-2"
					>
						<UserPlus className="w-5 h-5" />
						{t("add_member")}
					</Button>
				</div>
			</Card>

			{/* Statistics Section */}
			{!loading && members.length > 0 && (
				<MemberStats members={members} branchCount={branches.length} />
			)}

			{/* Members Table */}
			<div className="relative">
				<div className="absolute -bottom-40 -right-20 w-96 h-96 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
				{loading ? (
					<div className="flex items-center justify-center py-20 bg-card rounded-lg border border-border/50">
						<Loader2 className="h-8 w-8 animate-spin text-primary" />
					</div>
				) : (
					<MembersTable
						members={members}
						branches={branches}
						onEdit={handleOpenEdit}
						onDelete={handleOpenDelete}
					/>
				)}
			</div>

			{/* Redesigned Add Member Dialog */}
			<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
				<DialogContent className="max-w-md rounded-lg">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2">
							<UserPlus className="h-5 w-5 text-primary" />
							{t("add_new_member")}
						</DialogTitle>
					</DialogHeader>
					<form className="space-y-4" onSubmit={handleAdd}>
						{formError && (
							<div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
								<p className="text-sm text-red-700 dark:text-red-300">
									{formError}
								</p>
							</div>
						)}

						<div className="space-y-2">
							<Label htmlFor="searchQuery">{t("search_user_label")} *</Label>
							<div className="flex gap-2">
								<Input
									className="flex-1 bg-card rounded-lg h-11"
									id="searchQuery"
									placeholder={t("search_user_placeholder")}
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
								<Button
									disabled={searching}
									type="button"
									variant="outline"
									className="h-11 px-4 rounded-lg"
									onClick={handleSearchUser}
								>
									{searching ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<Search className="h-4 w-4" />
									)}
								</Button>
							</div>
						</div>

						{foundUser && (
							<div className="p-4 bg-primary/5 rounded-lg border border-primary/20 animate-in fade-in zoom-in duration-300">
								<div className="flex items-center gap-3">
									<Avatar className="h-12 w-12 border-2 border-primary/20">
										{foundUser.avatarUrl ? (
											<img
												src={foundUser.avatarUrl}
												alt=""
												className="object-cover"
											/>
										) : (
											<AvatarFallback className="bg-primary/10 text-primary uppercase">
												{foundUser.fullName?.charAt(0) ||
													foundUser.username?.charAt(0)}
											</AvatarFallback>
										)}
									</Avatar>
									<div className="flex-1">
										<p className="font-medium text-foreground">
											{foundUser.fullName || foundUser.username}
										</p>
										<p className="text-xs text-muted-foreground">
											{foundUser.email}
										</p>
									</div>
									<Badge
										className="bg-emerald-500/10 text-emerald-600 border-none"
										variant="outline"
									>
										{t("user_found")}
									</Badge>
								</div>
							</div>
						)}

						{foundUser && (
							<div className="space-y-4 animate-in slide-in-from-top-2 duration-300">
								<div className="space-y-2">
									<Label htmlFor="role">{t("role")} *</Label>
									<Select value={selectedRole} onValueChange={setSelectedRole}>
										<SelectTrigger className="bg-card rounded-lg h-11">
											<SelectValue />
										</SelectTrigger>
										<SelectContent className="rounded-xl shadow-xl">
											{ROLE_CONFIG.filter(
												(r) => r.value !== "Owner" || isOwner
											).map((role) => (
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
								</div>

								{branches.length > 0 && (
									<div className="space-y-2">
										<Label htmlFor="branch">
											{t("branch")} {isOwner ? `(${t("optional")})` : "*"}
										</Label>
										<Select
											value={selectedBranchId}
											onValueChange={setSelectedBranchId}
										>
											<SelectTrigger className="bg-card rounded-lg h-11">
												<SelectValue placeholder={t("select_branch")} />
											</SelectTrigger>
											<SelectContent className="rounded-xl shadow-xl">
												{isOwner && (
													<SelectItem value="__none__" className="rounded-lg">
														<span className="text-muted-foreground">
															{t("school_wide_access")}
														</span>
													</SelectItem>
												)}
												{branches.map((branch) => (
													<SelectItem
														key={branch.id}
														value={branch.id}
														className="rounded-lg"
													>
														{branch.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								)}
							</div>
						)}

						<DialogFooter className="pt-4">
							<Button
								type="button"
								variant="ghost"
								className="rounded-lg"
								onClick={() => {
									setIsAddDialogOpen(false);
									setFoundUser(null);
									setSearchQuery("");
								}}
							>
								Cancel
							</Button>
							<Button
								disabled={adding || !foundUser}
								type="submit"
								className="rounded-lg px-8 h-11 shadow-lg shadow-primary/20"
							>
								{adding && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
								{t("add_member")}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Edit Role Dialog */}
			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent className="max-w-md rounded-lg">
					<DialogHeader>
						<DialogTitle className="font-bold text-xl">
							{t("edit_member")}
						</DialogTitle>
					</DialogHeader>
					<form className="space-y-4" onSubmit={handleUpdateRole}>
						<div className="space-y-2">
							<Label className="font-semibold text-muted-foreground uppercase text-[10px] tracking-widest">
								{t("member")}
							</Label>
							<p className="font-medium text-lg">
								{selectedMember?.user?.fullName || selectedMember?.userId}
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="editRole">{t("new_role")} *</Label>
							<Select value={selectedRole} onValueChange={setSelectedRole}>
								<SelectTrigger className="bg-card rounded-lg h-11">
									<SelectValue />
								</SelectTrigger>
								<SelectContent className="rounded-xl shadow-xl">
									{ROLE_CONFIG.filter(
										(r) => r.value !== "Owner" || isOwner
									).map((role) => (
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
						</div>

						<DialogFooter className="pt-4">
							<Button
								type="button"
								variant="ghost"
								className="rounded-lg"
								onClick={() => setIsEditDialogOpen(false)}
							>
								{t("cancel")}
							</Button>
							<Button
								disabled={updating}
								type="submit"
								className="rounded-lg px-8 h-11 shadow-lg shadow-primary/20"
							>
								{updating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
								{t("update_role")}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<DialogContent className="max-w-sm rounded-lg">
					<DialogHeader>
						<DialogTitle className="font-bold text-xl text-destructive">
							{t("confirm_remove_member")}
						</DialogTitle>
					</DialogHeader>
					<p className="text-muted-foreground py-2">
						{t("confirm_remove_desc")}
					</p>
					<DialogFooter className="gap-2 sm:gap-0">
						<Button
							variant="ghost"
							className="rounded-lg"
							onClick={() => setIsDeleteDialogOpen(false)}
						>
							{t("cancel")}
						</Button>
						<Button
							disabled={removing}
							variant="destructive"
							className="rounded-lg px-8 h-11 bg-red-100 text-red-600 hover:bg-red-200 border-none shadow-none"
							onClick={handleRemove}
						>
							{removing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
							{t("remove")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</motion.div>
	);
}
