"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
	Users,
	Plus,
	Pencil,
	Trash2,
	UserCog,
	Loader2,
	AlertCircle,
	Crown,
	GraduationCap,
	Briefcase,
	Shield,
	Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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

// Role options for selection
const ROLES = [
	{ value: "Owner", label: "Owner", icon: Crown, color: "bg-blue-500" },
	{
		value: "Director",
		label: "Director",
		icon: GraduationCap,
		color: "bg-cyan-500",
	},
	{
		value: "DeputyDirector",
		label: "Deputy Director",
		icon: GraduationCap,
		color: "bg-teal-500",
	},
	{
		value: "Admin",
		label: "Administrator",
		icon: UserCog,
		color: "bg-green-500",
	},
	{
		value: "HeadTeacher",
		label: "Head Teacher",
		icon: GraduationCap,
		color: "bg-amber-500",
	},
	{
		value: "Teacher",
		label: "Teacher",
		icon: GraduationCap,
		color: "bg-orange-500",
	},
	{ value: "Staff", label: "Staff", icon: Briefcase, color: "bg-gray-500" },
	{
		value: "Accountant",
		label: "Accountant",
		icon: Shield,
		color: "bg-purple-500",
	},
	{
		value: "Librarian",
		label: "Librarian",
		icon: Shield,
		color: "bg-pink-500",
	},
	{ value: "Student", label: "Student", icon: Users, color: "bg-indigo-500" },
	{ value: "Parent", label: "Parent", icon: Users, color: "bg-rose-500" },
];

function getRoleInfo(role: string) {
	const normalizedRole = role.toLowerCase();
	return (
		ROLES.find((r) => r.value.toLowerCase() === normalizedRole) ||
		ROLES[ROLES.length - 1]
	);
}

export default function MembersPage() {
	const { currentSchool, isOwner, currentRole } = useDashboard();
	const schoolId = currentSchool?.idStr || currentSchool?.id;
	const { members, loading, error, refetch } = useSchoolMembers(schoolId);
	const { addMember, loading: adding } = useAddMember();
	const { updateMemberRole, loading: updating } = useUpdateMemberRole();
	const { removeMember, loading: removing } = useRemoveMember();
	const { searchUser, loading: searching } = useSearchUser();

	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedMember, setSelectedMember] = useState<Member | null>(null);
	const [formError, setFormError] = useState<string | null>(null);

	// Form state for Add Member
	const [searchQuery, setSearchQuery] = useState("");
	const [foundUser, setFoundUser] = useState<User | null>(null);
	const [selectedRole, setSelectedRole] = useState("Teacher");
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

	// Minimum characters required for search
	const MIN_SEARCH_CHARS = 5;

	// Check if user can manage members (Owner, Director, DeputyDirector)
	// Also always allow if there's a school selected (for testing)
	const canManage =
		!!currentSchool ||
		["Owner", "Director", "DeputyDirector"].includes(currentRole || "");

	console.log("DEBUG Members Page:", {
		currentRole,
		canManage,
		schoolId,
		membersCount: members.length,
	});

	// Debounced auto-search when user stops typing (3 seconds delay, min 5 chars)
	useEffect(() => {
		// Clear previous timer
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		// Only search if query has minimum characters
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
			}, 3000); // 3 second delay
		} else {
			// Clear found user if query is too short
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
		// Clear debounce timer since user clicked search manually
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
			await removeMember({
				memberId: selectedMember.idStr,
			});
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
						Please select a school to manage members
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex items-center justify-between"
			>
				<div>
					<h1 className="text-3xl font-bold text-gray-900 dark:text-white">
						Member Management
					</h1>
					<p className="text-gray-600 dark:text-gray-400 mt-1">
						Manage staff and members for{" "}
						{currentSchool.name?.en ||
							currentSchool.displayName ||
							"your school"}
					</p>
				</div>
				{/* Always show Add Member button */}
				<Button onClick={handleOpenAdd} className="gap-2">
					<Plus className="h-4 w-4" />
					Add Member
				</Button>
			</motion.div>

			{/* Error State */}
			{error && (
				<div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
					<p className="text-red-700 dark:text-red-300">{error}</p>
				</div>
			)}

			{/* Loading State */}
			{loading && (
				<div className="flex items-center justify-center py-12">
					<Loader2 className="h-8 w-8 animate-spin text-primary" />
				</div>
			)}

			{/* Members Table */}
			{!loading && members.length > 0 && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
				>
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Users className="h-5 w-5" />
								All Members ({members.length})
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>User</TableHead>
										<TableHead>Role</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="text-right">Actions</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{members.map((member) => {
										const roleInfo = getRoleInfo(member.role);
										const RoleIcon = roleInfo.icon;
										return (
											<TableRow key={member.idStr}>
												<TableCell className="font-medium">
													<div className="flex items-center gap-3">
														{/* Avatar */}
														{member.user?.avatarUrl ? (
															<img
																src={member.user.avatarUrl}
																alt={member.user.fullName || member.userId}
																className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700 flex-shrink-0"
															/>
														) : (
															<div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-gray-700">
																<Users className="h-5 w-5 text-primary" />
															</div>
														)}
														<div className="flex flex-col">
															<span className="font-medium">
																{member.user?.fullName ||
																	member.user?.displayName ||
																	member.user?.username ||
																	member.title ||
																	"Unknown User"}
															</span>
															<span className="text-xs text-muted-foreground">
																{member.user?.email || member.userId}
															</span>
														</div>
													</div>
													{member.isPrimaryContact && (
														<Badge variant="outline" className="ml-2 text-xs">
															Primary
														</Badge>
													)}
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														<div className={`p-1 rounded ${roleInfo.color}`}>
															<RoleIcon className="h-3 w-3 text-white" />
														</div>
														<span>{roleInfo.label}</span>
													</div>
												</TableCell>
												<TableCell>
													<Badge
														variant={
															member.status === "Active"
																? "default"
																: "secondary"
														}
													>
														{member.status}
													</Badge>
												</TableCell>
												<TableCell className="text-right">
													<div className="flex items-center justify-end gap-2">
														<Button
															variant="ghost"
															size="sm"
															onClick={() => handleOpenEdit(member)}
														>
															<Pencil className="h-4 w-4" />
														</Button>
														<Button
															variant="ghost"
															size="sm"
															className="text-red-600 hover:text-red-700"
															onClick={() => handleOpenDelete(member)}
															disabled={member.role === "Owner"}
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										);
									})}
								</TableBody>
							</Table>
						</CardContent>
					</Card>
				</motion.div>
			)}

			{/* Empty State */}
			{!loading && members.length === 0 && (
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					animate={{ opacity: 1, scale: 1 }}
					className="text-center py-12"
				>
					<Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
					<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
						No Members Yet
					</h3>
					<p className="text-gray-600 dark:text-gray-400 mb-6">
						Start by adding staff and members to your school
					</p>
					<Button onClick={handleOpenAdd} className="gap-2">
						<Plus className="h-4 w-4" />
						Add First Member
					</Button>
				</motion.div>
			)}

			{/* Add Member Dialog */}
			<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Add New Member</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleAdd} className="space-y-4">
						{formError && (
							<div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
								<p className="text-sm text-red-700 dark:text-red-300">
									{formError}
								</p>
							</div>
						)}

						{/* Search User */}
						<div className="space-y-2">
							<Label htmlFor="searchQuery">
								Search User by Email or Username *
							</Label>
							<div className="flex gap-2">
								<Input
									id="searchQuery"
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									placeholder="Enter email or username"
									className="flex-1"
								/>
								<Button
									type="button"
									variant="outline"
									onClick={handleSearchUser}
									disabled={searching}
								>
									{searching ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<Search className="h-4 w-4" />
									)}
								</Button>
							</div>
						</div>

						{/* User Preview */}
						{foundUser && (
							<div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
								<div className="flex items-center gap-3">
									{foundUser.avatarUrl ? (
										<img
											src={foundUser.avatarUrl}
											alt={foundUser.fullName || foundUser.username || "User"}
											className="w-12 h-12 rounded-full object-cover border-2 border-green-300 dark:border-green-600"
										/>
									) : (
										<div className="w-12 h-12 rounded-full bg-green-200 dark:bg-green-700 flex items-center justify-center">
											<Users className="h-6 w-6 text-green-700 dark:text-green-200" />
										</div>
									)}
									<div className="flex-1">
										<p className="font-medium text-green-800 dark:text-green-200">
											{foundUser.fullName ||
												foundUser.displayName ||
												foundUser.username ||
												"Unknown"}
										</p>
										<p className="text-sm text-green-600 dark:text-green-300">
											{foundUser.email || foundUser.username}
										</p>
									</div>
									<Badge
										variant="outline"
										className="bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200"
									>
										Found
									</Badge>
								</div>
							</div>
						)}

						{/* Role Selection (only show if user found) */}
						{foundUser && (
							<div className="space-y-2">
								<Label htmlFor="role">Role *</Label>
								<Select value={selectedRole} onValueChange={setSelectedRole}>
									<SelectTrigger>
										<SelectValue />
									</SelectTrigger>
									<SelectContent>
										{ROLES.filter((r) => r.value !== "Owner" || isOwner).map(
											(role) => {
												const RoleIcon = role.icon;
												return (
													<SelectItem key={role.value} value={role.value}>
														<div className="flex items-center gap-2">
															<div className={`p-1 rounded ${role.color}`}>
																<RoleIcon className="h-3 w-3 text-white" />
															</div>
															<span>{role.label}</span>
														</div>
													</SelectItem>
												);
											}
										)}
									</SelectContent>
								</Select>
							</div>
						)}

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => {
									setIsAddDialogOpen(false);
									setFoundUser(null);
									setSearchQuery("");
								}}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={adding || !foundUser}>
								{adding && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
								Add Member
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Edit Role Dialog */}
			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent className="max-w-md">
					<DialogHeader>
						<DialogTitle>Edit Member Role</DialogTitle>
					</DialogHeader>
					<form onSubmit={handleUpdateRole} className="space-y-4">
						{formError && (
							<div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
								<p className="text-sm text-red-700 dark:text-red-300">
									{formError}
								</p>
							</div>
						)}

						<div className="space-y-2">
							<Label>Member</Label>
							<p className="text-sm text-muted-foreground">
								{selectedMember?.userId}
							</p>
						</div>

						<div className="space-y-2">
							<Label htmlFor="editRole">New Role *</Label>
							<Select value={selectedRole} onValueChange={setSelectedRole}>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{ROLES.filter((r) => r.value !== "Owner" || isOwner).map(
										(role) => {
											const RoleIcon = role.icon;
											return (
												<SelectItem key={role.value} value={role.value}>
													<div className="flex items-center gap-2">
														<div className={`p-1 rounded ${role.color}`}>
															<RoleIcon className="h-3 w-3 text-white" />
														</div>
														<span>{role.label}</span>
													</div>
												</SelectItem>
											);
										}
									)}
								</SelectContent>
							</Select>
						</div>

						<DialogFooter>
							<Button
								type="button"
								variant="outline"
								onClick={() => setIsEditDialogOpen(false)}
							>
								Cancel
							</Button>
							<Button type="submit" disabled={updating}>
								{updating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
								Update Role
							</Button>
						</DialogFooter>
					</form>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>Remove Member</DialogTitle>
					</DialogHeader>
					<p className="text-gray-600 dark:text-gray-400">
						Are you sure you want to remove this member? They will lose access
						to the school.
					</p>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setIsDeleteDialogOpen(false)}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleRemove}
							disabled={removing}
						>
							{removing && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
							Remove
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
