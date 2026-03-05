"use client";

import { useState } from "react";
import {
	Users,
	Plus,
	Briefcase,
	DollarSign,
	CalendarDays,
	Pencil,
	Trash2,
	Loader2,
	CheckCircle2,
	MoreHorizontal,
	CalendarClock,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatsCard } from "@/components/dashboard/stats-card";
import { UserIdInput } from "@/components/shared/user-id-input";
import { LoadingState } from "@/components/dashboard/loading-state";
import { SearchInput } from "@/components/shared/search-input";
import { LeavesTable } from "@/components/hr/leaves-table";
import { LeaveRequestForm } from "@/components/hr/leave-request-form";
import { PayrollTable } from "@/components/hr/payroll-table";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useDashboard } from "@/hooks/useDashboard";
import {
	useStaff,
	useHRMutations,
	useLeaves,
	useLeaveMutations,
	usePayroll,
	usePayrollMutations,
	CreateStaffInput,
	Staff,
	UpdateStaffInput,
} from "@/hooks/useStaff";
import { useSearchUser, User } from "@/hooks/useMembers";

export default function HRPage() {
	const { t } = useTranslation();
	const { currentSchool } = useDashboard();
	const schoolId = currentSchool?.idStr || currentSchool?.id;

	const { staffList, loading, error, refetch } = useStaff(schoolId);
	const {
		createStaff,
		updateStaff,
		deleteStaff,
		loading: mutationLoading,
	} = useHRMutations();
	const { searchUser, loading: searching } = useSearchUser();

	// Leave hooks
	const { leaves, loading: leavesLoading, refetch: refetchLeaves } = useLeaves(schoolId);
	const { createLeave, updateLeaveStatus, loading: leaveMutationLoading } = useLeaveMutations();

	// Payroll hooks
	const currentMonth = new Date().toISOString().slice(0, 7); // "2026-03"
	const [selectedMonth, setSelectedMonth] = useState(currentMonth);
	const { payrolls, loading: payrollLoading, refetch: refetchPayroll } = usePayroll(schoolId, selectedMonth);
	const { generateMonthlyPayroll, updatePayrollStatus, loading: payrollMutationLoading } = usePayrollMutations();

	const [searchQuery, setSearchQuery] = useState("");
	const [activeTab, setActiveTab] = useState("staff");
	const [isLeaveFormOpen, setIsLeaveFormOpen] = useState(false);
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

	// User search state
	const [userSearchQuery, setUserSearchQuery] = useState("");
	const [foundUser, setFoundUser] = useState<User | null>(null);
	const [formError, setFormError] = useState<string | null>(null);

	const [editFormData, setEditFormData] = useState<Partial<UpdateStaffInput>>(
		{}
	);

	const [formData, setFormData] = useState<Partial<CreateStaffInput>>({
		schoolId: schoolId || "",
		staffId: "",
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		dateOfBirth: "",
		gender: "male",
		address: "",
		role: "teacher",
		department: "",
		subjects: [],
		salary: 0,
		currency: "USD",
	});

	const handleUserIdChange = async (value: string) => {
		setUserSearchQuery(value);
		setFoundUser(null);
		setFormError(null);

		// Auto-search when all 8 digits are entered
		if (value.length === 8) {
			const user = await searchUser(value);
			if (user) {
				setFoundUser(user);
				setFormData((prev) => ({
					...prev,
					firstName:
						user.fullName?.split(" ")[0] ||
						user.displayName?.split(" ")[0] ||
						"",
					lastName:
						user.fullName?.split(" ").slice(1).join(" ") ||
						user.displayName?.split(" ").slice(1).join(" ") ||
						"",
					email: user.email || "",
				}));
			} else {
				setFormError(t("user_not_found"));
			}
		}
	};

	const handleOpenAdd = () => {
		setUserSearchQuery("");
		setFoundUser(null);
		setFormError(null);
		setFormData({
			schoolId: schoolId || "",
			staffId: "",
			firstName: "",
			lastName: "",
			email: "",
			phone: "",
			dateOfBirth: "",
			gender: "male",
			address: "",
			role: "teacher",
			department: "",
			subjects: [],
			salary: 0,
			currency: "USD",
		});
		setIsAddDialogOpen(true);
	};

	const handleInputChange = (
		field: keyof CreateStaffInput,
		value: string | number | string[]
	) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleAddStaff = async () => {
		if (!foundUser) {
			setFormError(t("search_user_first"));
			return;
		}
		try {
			await createStaff(formData as CreateStaffInput);
			setIsAddDialogOpen(false);
			setFoundUser(null);
			setUserSearchQuery("");
			setFormData({
				schoolId: schoolId || "",
				staffId: "",
				firstName: "",
				lastName: "",
				email: "",
				phone: "",
				dateOfBirth: "",
				gender: "male",
				address: "",
				role: "teacher",
				department: "",
				subjects: [],
				salary: 0,
				currency: "USD",
			});
			refetch();
		} catch (err) {
			console.error("Failed to add staff:", err);
			setFormError(err instanceof Error ? err.message : "Failed to add staff");
		}
	};

	const handleOpenEdit = (staff: Staff) => {
		setSelectedStaff(staff);
		setEditFormData({
			firstName: staff.firstName,
			lastName: staff.lastName,
			email: staff.email,
			phone: staff.phone,
			address: staff.address,
			role: staff.role,
			department: staff.department,
			subjects: staff.subjects,
			salary: staff.salary,
			status: staff.status,
		});
		setFormError(null);
		setIsEditDialogOpen(true);
	};

	const handleEditInputChange = (field: keyof UpdateStaffInput, value: any) => {
		setEditFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleUpdateStaff = async () => {
		if (!selectedStaff) return;
		try {
			await updateStaff(selectedStaff.id, editFormData as UpdateStaffInput);
			setIsEditDialogOpen(false);
			setSelectedStaff(null);
			refetch();
		} catch (err) {
			console.error("Failed to update staff:", err);
			setFormError(
				err instanceof Error ? err.message : "Failed to update staff"
			);
		}
	};

	const handleOpenDelete = (staff: Staff) => {
		setSelectedStaff(staff);
		setIsDeleteDialogOpen(true);
	};

	const handleDeleteStaff = async () => {
		if (!selectedStaff) return;
		try {
			await deleteStaff(selectedStaff.id);
			setIsDeleteDialogOpen(false);
			setSelectedStaff(null);
			refetch();
		} catch (err) {
			console.error("Failed to delete staff:", err);
		}
	};

	const filteredStaff = staffList.filter(
		(s) =>
			`${s.firstName} ${s.lastName}`
				.toLowerCase()
				.includes(searchQuery.toLowerCase()) ||
			s.staffId.toLowerCase().includes(searchQuery.toLowerCase()) ||
			s.email.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className="space-y-6 pb-10">
			{/* Header */}
			<PageHeader
				title={t("hr_payroll")}
				subtitle={t("manage_staff")}
				icon={Briefcase}
			>
				<Button onClick={handleOpenAdd} size="sm" className="gap-2">
					<Plus className="h-4 w-4" />
					{t("add_member")}
				</Button>
			</PageHeader>

			{/* Stats Grid */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<StatsCard
					title={t("total_staff")}
					value={staffList.length.toString()}
					icon={Users}
					color="blue"
					delay={0}
				/>
				<StatsCard
					title={t("total_payroll")}
					value={`$${payrolls.reduce((s, p) => s + p.netSalary, 0).toLocaleString()}`}
					icon={DollarSign}
					color="emerald"
					delay={0.05}
				/>
				<StatsCard
					title={t("active_members")}
					value={staffList
						.filter((s) => s.status === "active")
						.length.toString()}
					icon={Briefcase}
					color="violet"
					delay={0.1}
				/>
				<StatsCard
					title={t("pending_leaves")}
					value={leaves.filter((l) => l.status === "Pending").length.toString()}
					icon={CalendarClock}
					color="amber"
					delay={0.15}
				/>
			</div>

			{/* Staff Table Section */}
			<Tabs
				defaultValue="staff"
				value={activeTab}
				onValueChange={setActiveTab}
			>
				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.15, duration: 0.3 }}
				>
					<div className="liquid-glass-card rounded-2xl overflow-hidden">
						{/* Card header with tabs + search */}
						<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 border-b border-black/6 dark:border-white/6">
							<div className="flex items-center gap-3">
								<div className="w-6 h-6 rounded-md bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center">
									<Users className="w-3 h-3 text-blue-600 dark:text-blue-400" strokeWidth={2} />
								</div>
								<TabsList>
									<TabsTrigger value="staff">
										{t("all_members")}
									</TabsTrigger>
									<TabsTrigger value="leaves">
										{t("leaves")}
									</TabsTrigger>
									<TabsTrigger value="payroll">
										{t("payroll")}
									</TabsTrigger>
								</TabsList>
							</div>
							<div className="flex items-center gap-2">
								{activeTab === "leaves" && (
									<Button size="sm" className="gap-2" onClick={() => setIsLeaveFormOpen(true)}>
										<Plus className="h-4 w-4" />
										{t("request_leave")}
									</Button>
								)}
								{activeTab === "staff" && (
									<SearchInput
										placeholder={t("search_staff") || "Search staff..."}
										value={searchQuery}
										onChange={setSearchQuery}
										className="w-full sm:w-64"
									/>
								)}
							</div>
						</div>

						<TabsContent value="staff" className="mt-0">
							<Table>
								<TableHeader>
									<TableRow className="hover:bg-transparent border-b border-black/6 dark:border-white/6">
										<TableHead className="w-[300px] h-10 text-xs font-medium text-muted-foreground">
											{t("user")}
										</TableHead>
										<TableHead className="h-10 text-xs font-medium text-muted-foreground">
											{t("department")}
										</TableHead>
										<TableHead className="h-10 text-xs font-medium text-muted-foreground">
											{t("role")}
										</TableHead>
										<TableHead className="h-10 text-xs font-medium text-muted-foreground">
											{t("status")}
										</TableHead>
										<TableHead className="h-10 text-xs font-medium text-muted-foreground">
											{t("salary")}
										</TableHead>
										<TableHead className="text-right h-10 text-xs font-medium text-muted-foreground">
											{t("actions")}
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									<AnimatePresence mode="popLayout">
										{loading ? (
											<TableRow>
												<TableCell colSpan={6}>
													<LoadingState message={t("loading_staff")} />
												</TableCell>
											</TableRow>
										) : filteredStaff.length === 0 ? (
											<TableRow>
												<TableCell colSpan={6} className="h-60 text-center">
													<div className="flex flex-col items-center justify-center gap-3">
														<div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center">
															<Users className="h-5 w-5 text-muted-foreground" />
														</div>
														<div className="space-y-1">
															<p className="text-sm font-medium text-foreground">
																{t("no_staff_records")}
															</p>
															<p className="text-xs text-muted-foreground max-w-xs mx-auto">
																{t("no_staff_desc")}
															</p>
														</div>
														<Button
															size="sm"
															onClick={handleOpenAdd}
															className="mt-1 gap-2"
														>
															<Plus className="h-4 w-4" />
															{t("add_member")}
														</Button>
													</div>
												</TableCell>
											</TableRow>
										) : (
											filteredStaff.map((staff, index) => (
												<motion.tr
													key={staff.id}
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													exit={{ opacity: 0 }}
													transition={{ delay: index * 0.03 }}
													className="group hover:bg-muted/30 transition-colors border-b border-black/6 dark:border-white/6"
												>
													<TableCell className="py-3">
														<div className="flex items-center gap-3">
															<Avatar className="h-9 w-9 border border-black/6 dark:border-white/6">
																<AvatarFallback
																	className={cn(
																		"text-xs font-semibold",
																		[
																			"bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
																			"bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400",
																			"bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
																			"bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
																			"bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400",
																		][staff.firstName.length % 5]
																	)}
																>
																	{staff.firstName[0]}
																	{staff.lastName[0]}
																</AvatarFallback>
															</Avatar>
															<div className="min-w-0">
																<p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">
																	{staff.firstName} {staff.lastName}
																</p>
																<div className="flex items-center gap-1.5 mt-0.5">
																	<span className="text-xs text-muted-foreground/60 truncate">
																		{staff.staffId}
																	</span>
																	<span className="text-muted-foreground/30">·</span>
																	<span className="text-xs text-muted-foreground/60 truncate max-w-[140px]">
																		{staff.email}
																	</span>
																</div>
															</div>
														</div>
													</TableCell>
													<TableCell>
														<span className="text-sm text-foreground/80">
															{staff.department || "—"}
														</span>
													</TableCell>
													<TableCell>
														<Badge
															variant="secondary"
															className="bg-primary/8 text-primary border-none text-xs font-medium capitalize"
														>
															{staff.role}
														</Badge>
													</TableCell>
													<TableCell>
														<div className="flex items-center gap-1.5">
															<div
																className={cn(
																	"w-1.5 h-1.5 rounded-full",
																	staff.status === "active"
																		? "bg-emerald-500"
																		: "bg-muted-foreground/30"
																)}
															/>
															<span
																className={cn(
																	"text-xs font-medium capitalize",
																	staff.status === "active"
																		? "text-emerald-600 dark:text-emerald-400"
																		: "text-muted-foreground"
																)}
															>
																{staff.status}
															</span>
														</div>
													</TableCell>
													<TableCell>
														<span className="text-sm font-medium tabular-nums text-foreground/80">
															<span className="text-xs text-muted-foreground/50 mr-0.5">
																{staff.currency}
															</span>
															{staff.salary.toLocaleString()}
														</span>
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
																	onClick={() => handleOpenEdit(staff)}
																>
																	<Pencil className="mr-2 h-3.5 w-3.5" />
																	{t("edit")}
																</DropdownMenuItem>
																<DropdownMenuItem
																	onClick={() => handleOpenDelete(staff)}
																	className="text-destructive focus:text-destructive focus:bg-destructive/10"
																>
																	<Trash2 className="mr-2 h-3.5 w-3.5" />
																	{t("remove")}
																</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</TableCell>
												</motion.tr>
											))
										)}
									</AnimatePresence>
								</TableBody>
							</Table>
						</TabsContent>

						<TabsContent value="leaves" className="mt-0">
							<LeavesTable
								leaves={leaves}
								staffList={staffList}
								loading={leavesLoading}
								onApprove={async (id, approvedBy) => {
									await updateLeaveStatus(id, { status: "Approved", approvedBy });
									refetchLeaves();
								}}
								onReject={async (id, reason) => {
									await updateLeaveStatus(id, { status: "Rejected", rejectionReason: reason });
									refetchLeaves();
								}}
								mutationLoading={leaveMutationLoading}
							/>
						</TabsContent>

						<TabsContent value="payroll" className="mt-0">
							<PayrollTable
								payrolls={payrolls}
								loading={payrollLoading}
								schoolId={schoolId || ""}
								selectedMonth={selectedMonth}
								onMonthChange={(month) => {
									setSelectedMonth(month);
								}}
								onGenerate={async (input) => {
									const result = await generateMonthlyPayroll(input);
									refetchPayroll();
									return result;
								}}
								onMarkPaid={async (id) => {
									await updatePayrollStatus(id, "paid");
									refetchPayroll();
								}}
								mutationLoading={payrollMutationLoading}
							/>
						</TabsContent>
					</div>
				</motion.div>
			</Tabs>

			{/* Add Staff Dialog */}
			<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>{t("add_member")}</DialogTitle>
						<DialogDescription>
							{t("search_by_user_id_desc")}
						</DialogDescription>
					</DialogHeader>

					{formError && (
						<div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800/40">
							<p className="text-sm text-red-700 dark:text-red-300">
								{formError}
							</p>
						</div>
					)}

					{/* Step 1: Search by User ID */}
					<div className="space-y-3">
						<Label>
							{t("user_id")}{" "}
							<span className="text-destructive">*</span>
						</Label>
						<UserIdInput
							value={userSearchQuery}
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

					{/* User Found Preview */}
					{foundUser && (
						<div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800/40">
							<Avatar className="h-10 w-10 border border-emerald-200 dark:border-emerald-800">
								{foundUser.avatarUrl && (
									<AvatarImage src={foundUser.avatarUrl} />
								)}
								<AvatarFallback className="bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-sm font-semibold">
									{foundUser.fullName?.charAt(0) ||
										foundUser.username?.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium text-foreground truncate">
									{foundUser.fullName ||
										foundUser.displayName ||
										foundUser.username ||
										"Unknown"}
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

					{/* Step 2: Staff Details (only show if user found) */}
					{foundUser && (
						<div className="grid grid-cols-2 gap-4 pt-4 border-t border-black/6 dark:border-white/6">
							<div className="space-y-2">
								<Label htmlFor="staffId">
									{t("staff_id")} <span className="text-destructive">*</span>
								</Label>
								<Input
									id="staffId"
									value={formData.staffId}
									onChange={(e) => handleInputChange("staffId", e.target.value)}
									placeholder="STF-001"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="email">
									{t("email")} <span className="text-destructive">*</span>
								</Label>
								<Input
									id="email"
									type="email"
									value={formData.email}
									onChange={(e) => handleInputChange("email", e.target.value)}
									placeholder="john@example.com"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="firstName">
									{t("first_name")} <span className="text-destructive">*</span>
								</Label>
								<Input
									id="firstName"
									value={formData.firstName}
									onChange={(e) =>
										handleInputChange("firstName", e.target.value)
									}
									placeholder="John"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="lastName">
									{t("last_name")} <span className="text-destructive">*</span>
								</Label>
								<Input
									id="lastName"
									value={formData.lastName}
									onChange={(e) =>
										handleInputChange("lastName", e.target.value)
									}
									placeholder="Doe"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="phone">
									{t("phone")} <span className="text-destructive">*</span>
								</Label>
								<Input
									id="phone"
									value={formData.phone}
									onChange={(e) => handleInputChange("phone", e.target.value)}
									placeholder="+1234567890"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="dateOfBirth">
									{t("date_of_birth")}{" "}
									<span className="text-destructive">*</span>
								</Label>
								<Input
									id="dateOfBirth"
									type="date"
									value={formData.dateOfBirth}
									onChange={(e) =>
										handleInputChange("dateOfBirth", e.target.value)
									}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="gender">
									{t("gender")} <span className="text-destructive">*</span>
								</Label>
								<Select
									value={formData.gender}
									onValueChange={(value) => handleInputChange("gender", value)}
								>
									<SelectTrigger>
										<SelectValue placeholder={t("select_gender")} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="male">{t("male")}</SelectItem>
										<SelectItem value="female">{t("female")}</SelectItem>
										<SelectItem value="other">{t("other")}</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2">
								<Label htmlFor="role">
									{t("role")} <span className="text-destructive">*</span>
								</Label>
								<Select
									value={formData.role}
									onValueChange={(value) => handleInputChange("role", value)}
								>
									<SelectTrigger>
										<SelectValue placeholder={t("select_role")} />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="teacher">{t("teacher")}</SelectItem>
										<SelectItem value="admin">{t("admin")}</SelectItem>
										<SelectItem value="staff">{t("staff")}</SelectItem>
										<SelectItem value="principal">{t("principal")}</SelectItem>
									</SelectContent>
								</Select>
							</div>
							<div className="space-y-2 col-span-2">
								<Label htmlFor="address">
									{t("address")} <span className="text-destructive">*</span>
								</Label>
								<Input
									id="address"
									value={formData.address}
									onChange={(e) => handleInputChange("address", e.target.value)}
									placeholder="123 Main St, City"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="department">{t("department")}</Label>
								<Input
									id="department"
									value={formData.department}
									onChange={(e) =>
										handleInputChange("department", e.target.value)
									}
									placeholder="Mathematics"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="salary">
									{t("salary")} <span className="text-destructive">*</span>
								</Label>
								<Input
									id="salary"
									type="number"
									value={formData.salary}
									onChange={(e) =>
										handleInputChange("salary", parseFloat(e.target.value) || 0)
									}
									placeholder="0"
								/>
							</div>
						</div>
					)}
					<DialogFooter className="pt-4 border-t border-black/6 dark:border-white/6 gap-2">
						<Button
							variant="ghost"
							onClick={() => setIsAddDialogOpen(false)}
						>
							{t("cancel")}
						</Button>
						<Button
							onClick={handleAddStaff}
							disabled={mutationLoading || !foundUser}
						>
							{mutationLoading && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							{t("save")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Edit Staff Dialog */}
			<Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>{t("edit_member")}</DialogTitle>
						<DialogDescription>
							{t("update_staff_details")}
						</DialogDescription>
					</DialogHeader>

					{formError && (
						<div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800/40">
							<p className="text-sm text-red-700 dark:text-red-300">
								{formError}
							</p>
						</div>
					)}

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label>{t("first_name")}</Label>
							<Input
								value={editFormData.firstName}
								onChange={(e) =>
									handleEditInputChange("firstName", e.target.value)
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>{t("last_name")}</Label>
							<Input
								value={editFormData.lastName}
								onChange={(e) =>
									handleEditInputChange("lastName", e.target.value)
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>{t("email")}</Label>
							<Input
								type="email"
								value={editFormData.email}
								onChange={(e) => handleEditInputChange("email", e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label>{t("phone")}</Label>
							<Input
								value={editFormData.phone}
								onChange={(e) => handleEditInputChange("phone", e.target.value)}
							/>
						</div>
						<div className="space-y-2">
							<Label>{t("role")}</Label>
							<Select
								value={editFormData.role}
								onValueChange={(value) => handleEditInputChange("role", value)}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="teacher">{t("teacher")}</SelectItem>
									<SelectItem value="admin">{t("admin")}</SelectItem>
									<SelectItem value="staff">{t("staff")}</SelectItem>
									<SelectItem value="principal">{t("principal")}</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2">
							<Label>{t("status")}</Label>
							<Select
								value={editFormData.status}
								onValueChange={(value) =>
									handleEditInputChange("status", value)
								}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="active">{t("active")}</SelectItem>
									<SelectItem value="inactive">{t("inactive")}</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="space-y-2 col-span-2">
							<Label>{t("address")}</Label>
							<Input
								value={editFormData.address}
								onChange={(e) =>
									handleEditInputChange("address", e.target.value)
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>{t("department")}</Label>
							<Input
								value={editFormData.department}
								onChange={(e) =>
									handleEditInputChange("department", e.target.value)
								}
							/>
						</div>
						<div className="space-y-2">
							<Label>{t("salary")}</Label>
							<Input
								type="number"
								value={editFormData.salary}
								onChange={(e) =>
									handleEditInputChange(
										"salary",
										parseFloat(e.target.value) || 0
									)
								}
							/>
						</div>
					</div>

					<DialogFooter className="pt-4 border-t border-black/6 dark:border-white/6 gap-2">
						<Button
							variant="ghost"
							onClick={() => setIsEditDialogOpen(false)}
						>
							{t("cancel")}
						</Button>
						<Button
							onClick={handleUpdateStaff}
							disabled={mutationLoading}
						>
							{mutationLoading && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							{t("save")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Leave Request Form Dialog */}
			<LeaveRequestForm
				open={isLeaveFormOpen}
				onOpenChange={setIsLeaveFormOpen}
				staffList={staffList}
				schoolId={schoolId || ""}
				onSubmit={async (input) => {
					await createLeave(input);
					refetchLeaves();
				}}
				loading={leaveMutationLoading}
			/>

			{/* Delete Confirmation Dialog */}
			<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>{t("delete_staff")}</DialogTitle>
						<DialogDescription>
							{t("delete_staff_confirm", {
								name: selectedStaff
									? `${selectedStaff.firstName} ${selectedStaff.lastName}`
									: "",
							})}
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
							variant="destructive"
							onClick={handleDeleteStaff}
							disabled={mutationLoading}
						>
							{mutationLoading && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							{t("delete")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
