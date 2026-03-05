"use client";

import { useState, useMemo } from "react";
import {
	Users,
	Plus,
	Loader2,
	AlertCircle,
	UserCheck,
	ShieldCheck,
	Building2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { UserIdInput } from "@/components/shared/user-id-input";
import {
	Dialog,
	DialogContent,
	DialogDescription,
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
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
import { CheckCircle2 } from "lucide-react";

// Role configuration
const ROLE_CONFIG = [
	{ value: "Owner", labelKey: "role_owner" },
	{ value: "Director", labelKey: "role_director" },
	{ value: "DeputyDirector", labelKey: "role_deputy_director" },
	{ value: "Admin", labelKey: "role_admin" },
	{ value: "HeadTeacher", labelKey: "role_head_teacher" },
	{ value: "Teacher", labelKey: "role_teacher" },
	{ value: "Staff", labelKey: "role_staff" },
	{ value: "Accountant", labelKey: "role_accountant" },
	{ value: "Librarian", labelKey: "role_librarian" },
	{ value: "Student", labelKey: "role_student" },
	{ value: "Parent", labelKey: "role_parent" },
] as const;

export default function MembersPage() {
	const { t } = useLanguage();
	const { currentSchool, isOwner } = useDashboard();
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

	// Computed stats
	const stats = useMemo(() => {
		const total = members.length;
		const active = members.filter((m) => m.status === "Active").length;
		const admins = members.filter((m) =>
			["Owner", "Director", "DeputyDirector", "Admin"].includes(m.role)
		).length;
		return { total, active, admins };
	}, [members]);

	const handleOpenAdd = () => {
		setSearchQuery("");
		setFoundUser(null);
		setSelectedRole("Teacher");
		setSelectedBranchId("");
		setFormError(null);
		setIsAddDialogOpen(true);
	};

	const handleUserIdChange = async (value: string) => {
		setSearchQuery(value);
		setFoundUser(null);
		setFormError(null);

		// Auto-search when all 8 digits are entered
		if (value.length === 8) {
			const user = await searchUser(value);
			if (user) {
				setFoundUser(user);
			} else {
				setFormError(t("user_not_found") || "User not found.");
			}
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
			<div className="min-h-[60vh] flex items-center justify-center">
				<div className="text-center space-y-3">
					<div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center mx-auto">
						<AlertCircle className="h-5 w-5 text-amber-500" />
					</div>
					<p className="text-sm text-muted-foreground">
						{t("select_school_first")}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6 pb-10">
			{/* Header */}
			<PageHeader
				title={t("member_management")}
				subtitle={t("manage_members")}
				icon={Users}
			>
				<Button onClick={handleOpenAdd} size="sm" className="gap-2">
					<Plus className="h-4 w-4" />
					{t("add_member")}
				</Button>
			</PageHeader>

			{/* Stats Grid */}
			{!loading && members.length > 0 && (
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
					<StatsCard
						title={t("total_members")}
						value={stats.total.toString()}
						icon={Users}
						color="blue"
						delay={0}
					/>
					<StatsCard
						title={t("active_members")}
						value={stats.active.toString()}
						icon={UserCheck}
						color="emerald"
						delay={0.05}
					/>
					<StatsCard
						title={t("admins_directors")}
						value={stats.admins.toString()}
						icon={ShieldCheck}
						color="amber"
						delay={0.1}
					/>
					<StatsCard
						title={t("branches")}
						value={branches.length.toString()}
						icon={Building2}
						color="violet"
						delay={0.15}
					/>
				</div>
			)}

			{/* Members Table */}
			{loading ? (
				<div className="min-h-[60vh] flex items-center justify-center">
					<div className="text-center space-y-3">
						<div className="h-8 w-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin mx-auto" />
						<p className="text-sm text-muted-foreground">Loading members...</p>
					</div>
				</div>
			) : (
				<MembersTable
					members={members}
					branches={branches}
					onEdit={handleOpenEdit}
					onDelete={handleOpenDelete}
				/>
			)}

			{/* Add Member Dialog */}
			<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>{t("add_new_member")}</DialogTitle>
						<DialogDescription>
							{t("search_by_user_id_desc")}
						</DialogDescription>
					</DialogHeader>
					<form className="space-y-4" onSubmit={handleAdd}>
						{formError && (
							<div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800/40">
								<p className="text-sm text-red-700 dark:text-red-300">
									{formError}
								</p>
							</div>
						)}

						<div className="space-y-3">
							<Label>
								{t("user_id")} <span className="text-destructive">*</span>
							</Label>
							<UserIdInput
								value={searchQuery}
								onChange={handleUserIdChange}
								disabled={searching}
							/>
							{searching && (
								<div className="flex items-center gap-2 text-xs text-muted-foreground">
									<Loader2 className="h-3 w-3 animate-spin" />
									{t("searching") || "Searching..."}
								</div>
							)}
						</div>

						{foundUser && (
							<div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
								<Avatar className="h-10 w-10 border border-emerald-200 dark:border-emerald-800">
									{foundUser.avatarUrl ? (
										<img
											src={foundUser.avatarUrl}
											alt=""
											className="h-full w-full object-cover"
										/>
									) : (
										<AvatarFallback className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-sm font-semibold">
											{foundUser.fullName?.charAt(0) ||
												foundUser.username?.charAt(0)}
										</AvatarFallback>
									)}
								</Avatar>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium text-foreground truncate">
										{foundUser.fullName || foundUser.username}
									</p>
									<p className="text-xs text-muted-foreground truncate font-mono">
										ID: {foundUser.userId}
									</p>
								</div>
								<div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
									<CheckCircle2 className="h-4 w-4" />
									<span className="text-xs font-medium">{t("user_found")}</span>
								</div>
							</div>
						)}

						{foundUser && (
							<div className="space-y-4 pt-4 border-t border-black/6 dark:border-white/6">
								<div className="space-y-2">
									<Label htmlFor="role">{t("role")} <span className="text-destructive">*</span></Label>
									<Select value={selectedRole} onValueChange={setSelectedRole}>
										<SelectTrigger>
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{ROLE_CONFIG.filter(
												(r) => r.value !== "Owner" || isOwner
											).map((role) => (
												<SelectItem key={role.value} value={role.value}>
													{t(role.labelKey as any)}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>

								{branches.length > 0 && (
									<div className="space-y-2">
										<Label htmlFor="branch">
											{t("branch")} {isOwner ? `(${t("optional")})` : ""}
										</Label>
										<Select
											value={selectedBranchId}
											onValueChange={setSelectedBranchId}
										>
											<SelectTrigger>
												<SelectValue placeholder={t("select_branch")} />
											</SelectTrigger>
											<SelectContent>
												{isOwner && (
													<SelectItem value="__none__">
														{t("school_wide_access")}
													</SelectItem>
												)}
												{branches.map((branch) => (
													<SelectItem key={branch.id} value={branch.id}>
														{branch.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
								)}
							</div>
						)}

						<DialogFooter className="pt-4 border-t border-black/6 dark:border-white/6 gap-2">
							<Button
								type="button"
								variant="ghost"
								onClick={() => {
									setIsAddDialogOpen(false);
									setFoundUser(null);
									setSearchQuery("");
								}}
							>
								{t("cancel")}
							</Button>
							<Button disabled={adding || !foundUser} type="submit">
								{adding && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
								{t("add_member")}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Edit Role Dialog */}
			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>{t("edit_member")}</DialogTitle>
						<DialogDescription>
							{selectedMember?.user?.fullName || selectedMember?.userId}
						</DialogDescription>
					</DialogHeader>
					<form className="space-y-4" onSubmit={handleUpdateRole}>
						{formError && (
							<div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800/40">
								<p className="text-sm text-red-700 dark:text-red-300">
									{formError}
								</p>
							</div>
						)}
						<div className="space-y-2">
							<Label htmlFor="editRole">{t("new_role")} <span className="text-destructive">*</span></Label>
							<Select value={selectedRole} onValueChange={setSelectedRole}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{ROLE_CONFIG.filter(
										(r) => r.value !== "Owner" || isOwner
									).map((role) => (
										<SelectItem key={role.value} value={role.value}>
											{t(role.labelKey as any)}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>

						<DialogFooter className="pt-4 border-t border-black/6 dark:border-white/6 gap-2">
							<Button
								type="button"
								variant="ghost"
								onClick={() => setIsEditDialogOpen(false)}
							>
								{t("cancel")}
							</Button>
							<Button disabled={updating} type="submit">
								{updating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
								{t("update_role")}
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>{t("confirm_remove_member")}</DialogTitle>
						<DialogDescription>
							{t("confirm_remove_desc")}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="gap-2">
						<Button
							variant="ghost"
							onClick={() => setIsDeleteDialogOpen(false)}
						>
							{t("cancel")}
						</Button>
						<Button
							disabled={removing}
							variant="destructive"
							onClick={handleRemove}
						>
							{removing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
							{t("remove")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
