"use client";

import { useState, useEffect, useRef } from "react";
import {
	Users,
	Plus,
	Search,
	Briefcase,
	DollarSign,
	Calendar,
	MoreVertical,
	Pencil,
	Trash2,
	Mail,
	Phone,
	MapPin,
	Building2,
	Loader2,
	CheckCircle2,
	MoreHorizontal,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

	const [searchQuery, setSearchQuery] = useState("");
	const [activeTab, setActiveTab] = useState("staff");
	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
	const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
	const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);

	// User search state
	const [userSearchQuery, setUserSearchQuery] = useState("");
	const [foundUser, setFoundUser] = useState<User | null>(null);
	const [formError, setFormError] = useState<string | null>(null);
	const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
	const lastAutoFilledUserRef = useRef<string | null>(null);
	const MIN_SEARCH_CHARS = 5;

	const [editFormData, setEditFormData] = useState<Partial<UpdateStaffInput>>(
		{}
	);

	const [formData, setFormData] = useState<Partial<CreateStaffInput>>({
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

	// Debounced auto-search when user stops typing
	useEffect(() => {
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}

		// Don't search if we already have a user found
		if (foundUser) {
			return;
		}

		if (userSearchQuery.trim().length >= MIN_SEARCH_CHARS) {
			debounceTimerRef.current = setTimeout(async () => {
				setFormError(null);
				const user = await searchUser(userSearchQuery.trim());
				if (user) {
					setFoundUser(user);
					// Only auto-fill if this is a NEW user (not already filled)
					if (user.idStr !== lastAutoFilledUserRef.current) {
						lastAutoFilledUserRef.current = user.idStr || null;
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
					}
				} else {
					setFormError(t("user_not_found"));
					setFoundUser(null);
				}
			}, 2000);
		} else {
			setFoundUser(null);
			lastAutoFilledUserRef.current = null;
		}

		return () => {
			if (debounceTimerRef.current) {
				clearTimeout(debounceTimerRef.current);
			}
		};
	}, [userSearchQuery, searchUser, t, foundUser]);

	const handleSearchUser = async () => {
		if (userSearchQuery.trim().length < MIN_SEARCH_CHARS) {
			setFormError(t("min_search_chars", { count: MIN_SEARCH_CHARS }));
			return;
		}
		if (debounceTimerRef.current) {
			clearTimeout(debounceTimerRef.current);
		}
		setFormError(null);
		const user = await searchUser(userSearchQuery);
		if (user) {
			setFoundUser(user);
			// Only auto-fill if this is a NEW user (not already filled)
			if (user.idStr !== lastAutoFilledUserRef.current) {
				lastAutoFilledUserRef.current = user.idStr || null;
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
			}
		} else {
			setFormError(t("user_not_found"));
			setFoundUser(null);
		}
	};

	const handleOpenAdd = () => {
		setUserSearchQuery("");
		setFoundUser(null);
		setFormError(null);
		lastAutoFilledUserRef.current = null;
		setFormData({
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
		<div className="flex flex-col gap-6">
			{/* Hero Header Section */}
			<Card className="p-4">
				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 relative">
					<div className="flex items-center gap-5">
						<div className="relative group">
							<div className="absolute -inset-1 bg-primary/20 blur opacity-0 group-hover:opacity-100 transition duration-500 rounded-lg" />
							<div className="relative p-4 bg-primary rounded-lg shadow-lg shadow-primary/20 text-primary-foreground">
								<Briefcase className="w-8 h-8" />
							</div>
						</div>
						<div className="space-y-1">
							<h1 className="text-3xl font-bold tracking-tight text-foreground/90">
								{t("hr_payroll")}
							</h1>
							<p className="text-sm text-muted-foreground/80 font-medium">
								{t("manage_staff")}
							</p>
						</div>
					</div>

					<Button
						onClick={handleOpenAdd}
						className="rounded-lg px-6 h-12 bg-primary hover:opacity-90 text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 text-sm gap-2"
					>
						<Plus className="w-5 h-5" />
						{t("add_member")}
					</Button>
				</div>
			</Card>

			{/* Statistics Section */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
				{[
					{
						title: t("total_teachers"),
						value: staffList.length,
						icon: Users,
						color: "blue",
					},
					{
						title: t("revenue"),
						value: "$12,450",
						icon: DollarSign,
						color: "emerald",
					},
					{
						title: t("active_members"),
						value: staffList.filter((s) => s.status === "active").length,
						icon: Briefcase,
						color: "violet",
					},
					{
						title: t("avg_tenure"),
						value: "2.4 Yrs",
						icon: Calendar,
						color: "amber",
					},
				].map((stat, index) => {
					const colors = {
						blue: {
							bg: "bg-card",
							icon: "bg-blue-500 text-white shadow-blue-500/20",
							glow: "from-blue-500/10 to-transparent",
						},
						emerald: {
							bg: "bg-card",
							icon: "bg-emerald-500 text-white shadow-emerald-500/20",
							glow: "from-emerald-500/10 to-transparent",
						},
						violet: {
							bg: "bg-card",
							icon: "bg-violet-500 text-white shadow-violet-500/20",
							glow: "from-violet-500/10 to-transparent",
						},
						amber: {
							bg: "bg-card",
							icon: "bg-amber-500 text-white shadow-amber-500/20",
							glow: "from-amber-500/10 to-transparent",
						},
					}[stat.color as "blue" | "emerald" | "violet" | "amber"];

					return (
						<motion.div
							key={index}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: index * 0.1 }}
						>
							<Card className="relative overflow-hidden border-none rounded-lg shadow-sm transition-all duration-300 hover:shadow-md group h-[140px]">
								<div
									className={cn(
										"absolute right-0 top-0 bottom-0 w-1/2 bg-gradient-to-l opacity-50 group-hover:opacity-100 transition-opacity duration-500",
										colors.glow
									)}
								/>
								<CardContent className="p-6 h-full flex items-center justify-between relative z-10">
									<div className="flex flex-col justify-between h-full py-1">
										<h3 className="text-xs font-medium tracking-wide uppercase text-slate-400">
											{stat.title}
										</h3>
										<span className="text-4xl font-black tracking-tighter text-slate-900 dark:text-slate-100">
											{stat.value}
										</span>
									</div>
									<div
										className={cn(
											"p-4 rounded-lg shadow-xl transition-transform duration-500 group-hover:scale-110",
											colors.icon
										)}
									>
										<stat.icon className="h-7 w-7" />
									</div>
								</CardContent>
							</Card>
						</motion.div>
					);
				})}
			</div>

			{/* Main Content Sections */}
			<Tabs
				defaultValue="staff"
				value={activeTab}
				onValueChange={setActiveTab}
				className="w-full"
			>
				<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
					<TabsList className="bg-muted/50 p-1 rounded-xl border border-border/50">
						<TabsTrigger
							value="staff"
							className="rounded-lg px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
						>
							{t("all_members")}
						</TabsTrigger>
						<TabsTrigger
							value="payroll"
							className="rounded-lg px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
						>
							{t("payroll")}
						</TabsTrigger>
						<TabsTrigger
							value="attendance"
							className="rounded-lg px-4 py-2 data-[state=active]:bg-background data-[state=active]:shadow-sm transition-all"
						>
							{t("attendance")}
						</TabsTrigger>
					</TabsList>

					<div className="relative w-full sm:w-72 group">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
						<Input
							placeholder={t("search_staff")}
							className="pl-10 h-11 bg-muted/30 border-border/50 rounded-lg focus-visible:ring-primary/20 focus-visible:border-primary transition-all shadow-sm"
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
						/>
					</div>
				</div>

				<TabsContent value="staff">
					<Card className="overflow-hidden border border-border/50 shadow-xl shadow-primary/5 bg-card/50 backdrop-blur-sm rounded-2xl">
						<CardContent className="p-0">
							<Table>
								<TableHeader className="bg-muted/30 border-b border-border/50">
									<TableRow className="hover:bg-transparent border-none">
										<TableHead className="w-[300px] h-12 uppercase tracking-widest text-[11px] font-bold text-muted-foreground/70">
											{t("user")}
										</TableHead>
										<TableHead className="h-12 uppercase tracking-widest text-[11px] font-bold text-muted-foreground/70">
											{t("department")}
										</TableHead>
										<TableHead className="h-12 uppercase tracking-widest text-[11px] font-bold text-muted-foreground/70">
											{t("role")}
										</TableHead>
										<TableHead className="h-12 uppercase tracking-widest text-[11px] font-bold text-muted-foreground/70">
											{t("status")}
										</TableHead>
										<TableHead className="h-12 uppercase tracking-widest text-[11px] font-bold text-muted-foreground/70">
											{t("salary")}
										</TableHead>
										<TableHead className="text-right h-12 uppercase tracking-widest text-[11px] font-bold text-muted-foreground/70">
											{t("actions")}
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									<AnimatePresence mode="popLayout">
										{loading ? (
											<TableRow>
												<TableCell colSpan={6} className="h-32 text-center">
													<div className="flex flex-col items-center justify-center gap-2">
														<Loader2 className="h-8 w-8 animate-spin text-primary" />
														<p className="text-sm text-muted-foreground">
															{t("loading_staff")}
														</p>
													</div>
												</TableCell>
											</TableRow>
										) : filteredStaff.length === 0 ? (
											<TableRow>
												<TableCell colSpan={6} className="h-80 text-center">
													<div className="flex flex-col items-center justify-center gap-4 py-10 animate-in fade-in zoom-in duration-500">
														<div className="relative group">
															<div className="absolute -inset-4 bg-primary/5 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition duration-500" />
															<div className="relative p-6 rounded-full bg-primary/10 border border-primary/20">
																<Users className="h-12 w-12 text-primary/60" />
															</div>
														</div>
														<div className="space-y-1">
															<p className="text-xl font-bold text-foreground/80">
																{t("no_staff_records")}
															</p>
															<p className="text-sm text-muted-foreground max-w-sm mx-auto">
																{t("no_staff_desc")}
															</p>
														</div>
														<Button
															variant="default"
															onClick={handleOpenAdd}
															className="mt-2 rounded-lg px-8 h-12 bg-primary hover:opacity-90 transition-all font-semibold"
														>
															<Plus className="h-5 w-5 mr-2" />
															{t("add_member")}
														</Button>
													</div>
												</TableCell>
											</TableRow>
										) : (
											filteredStaff.map((staff, index) => (
												<motion.tr
													key={staff.id}
													initial={{ opacity: 0, y: 10 }}
													animate={{ opacity: 1, y: 0 }}
													exit={{ opacity: 0, scale: 0.95 }}
													transition={{ duration: 0.3, delay: index * 0.05 }}
													className="group transition-all hover:bg-secondary/10 cursor-pointer border-b border-border/50"
												>
													<TableCell className="py-4">
														<div className="flex items-center gap-4">
															<Avatar className="h-10 w-10 border-2 border-background shadow-sm group-hover:scale-110 transition-transform">
																<AvatarFallback
																	className={cn(
																		"text-white font-bold",
																		[
																			"bg-blue-500",
																			"bg-purple-500",
																			"bg-emerald-500",
																			"bg-amber-500",
																			"bg-rose-500",
																		][staff.firstName.length % 5]
																	)}
																>
																	{staff.firstName[0]}
																	{staff.lastName[0]}
																</AvatarFallback>
															</Avatar>
															<div className="flex flex-col">
																<p className="font-medium text-foreground group-hover:text-primary transition-colors">
																	{staff.firstName} {staff.lastName}
																</p>
																<div className="flex items-center gap-2 text-[11px] text-muted-foreground/80 font-medium tracking-wide">
																	<span className="bg-muted px-1.5 py-0.5 rounded uppercase tracking-wider text-[10px]">
																		{staff.staffId}
																	</span>
																	<span className="text-muted-foreground/30">
																		•
																	</span>
																	<span className="truncate max-w-[150px]">
																		{staff.email}
																	</span>
																</div>
															</div>
														</div>
													</TableCell>
													<TableCell>
														<div className="flex items-center gap-2">
															<div className="p-2 rounded-lg bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
																<Briefcase className="h-3.5 w-3.5" />
															</div>
															<span className="font-medium text-foreground/80">
																{staff.department || "N/A"}
															</span>
														</div>
													</TableCell>
													<TableCell>
														<Badge
															variant="secondary"
															className="bg-primary/5 text-primary border-none rounded-lg font-bold uppercase text-[10px]"
														>
															{staff.role}
														</Badge>
													</TableCell>
													<TableCell>
														<Badge
															className={cn(
																"rounded-lg px-2.5 py-0.5 text-[11px] border-none font-bold uppercase",
																staff.status === "active"
																	? "bg-emerald-500/10 text-emerald-600 animate-pulse"
																	: "bg-muted text-muted-foreground"
															)}
														>
															{staff.status}
														</Badge>
													</TableCell>
													<TableCell className="font-semibold tabular-nums text-foreground/70">
														<span className="text-[10px] mr-1 opacity-50">
															{staff.currency}
														</span>
														{staff.salary.toLocaleString()}
													</TableCell>
													<TableCell className="text-right">
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
																	onClick={() => handleOpenEdit(staff)}
																	className="text-emerald-500 focus:text-emerald-600 focus:bg-emerald-50"
																>
																	<Pencil className="mr-2 h-4 w-4" />
																	<span>{t("edit")}</span>
																</DropdownMenuItem>
																<DropdownMenuItem
																	onClick={() => handleOpenDelete(staff)}
																	className="text-destructive focus:text-destructive focus:bg-destructive/10"
																>
																	<Trash2 className="mr-2 h-4 w-4" />
																	<span>{t("remove")}</span>
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
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="payroll">
					<Card className="border-dashed">
						<CardContent className="flex flex-col items-center justify-center py-12 text-center">
							<DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
							<h3 className="text-lg font-medium">{t("payroll_management")}</h3>
							<p className="text-sm text-muted-foreground max-w-xs">
								{t("payroll_management_desc")}
							</p>
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="attendance">
					<Card className="border-dashed">
						<CardContent className="flex flex-col items-center justify-center py-12 text-center">
							<Calendar className="h-12 w-12 text-muted-foreground mb-4" />
							<h3 className="text-lg font-medium">{t("staff_attendance")}</h3>
							<p className="text-sm text-muted-foreground max-w-xs">
								{t("staff_attendance_desc")}
							</p>
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>

			{/* Add Staff Dialog */}
			<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2 text-xl font-bold">
							<div className="p-2 bg-primary/10 rounded-lg text-primary">
								<Plus className="h-6 w-6" />
							</div>
							{t("add_member")}
						</DialogTitle>
						<DialogDescription className="font-medium text-muted-foreground/80">
							{t("fill_staff_details")}
						</DialogDescription>
					</DialogHeader>

					{/* Error Message */}
					{formError && (
						<div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
							<p className="text-sm text-red-700 dark:text-red-300">
								{formError}
							</p>
						</div>
					)}

					{/* Step 1: Search User */}
					<div className="space-y-3 pt-4">
						<Label htmlFor="userSearch">
							{t("search_user_label")}{" "}
							<span className="text-destructive">*</span>
						</Label>
						<div className="flex gap-2">
							<Input
								id="userSearch"
								className="flex-1 h-11 bg-muted/30 border-border/50 rounded-lg focus-visible:ring-primary/20"
								placeholder={t("search_user_placeholder")}
								value={userSearchQuery}
								onChange={(e) => setUserSearchQuery(e.target.value)}
							/>
							<Button
								type="button"
								variant="outline"
								className="h-11 w-11 p-0 rounded-lg border-border/50 hover:bg-muted/50"
								disabled={searching}
								onClick={handleSearchUser}
							>
								{searching ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Search className="h-4 w-4" />
								)}
							</Button>
						</div>
						<p className="text-xs text-muted-foreground">
							{t("min_search_chars", { count: MIN_SEARCH_CHARS })}
						</p>
					</div>

					{/* User Found Preview */}
					{foundUser && (
						<div className="p-4 bg-primary/5 rounded-lg border border-primary/20 animate-in fade-in zoom-in duration-300">
							<div className="flex items-center gap-4">
								<Avatar className="h-14 w-14 border-2 border-primary/20 shadow-sm">
									{foundUser.avatarUrl && (
										<AvatarImage src={foundUser.avatarUrl} />
									)}
									<AvatarFallback className="bg-primary/10 text-primary uppercase font-bold text-lg">
										{foundUser.fullName?.charAt(0) ||
											foundUser.username?.charAt(0)}
									</AvatarFallback>
								</Avatar>
								<div className="flex-1">
									<p className="font-medium text-foreground text-lg">
										{foundUser.fullName ||
											foundUser.displayName ||
											foundUser.username ||
											"Unknown"}
									</p>
									<p className="text-sm text-muted-foreground">
										{foundUser.email || foundUser.username}
									</p>
								</div>
								<Badge className="bg-emerald-500/10 text-emerald-600 border-none px-3 py-1 font-bold rounded-lg">
									<CheckCircle2 className="h-4 w-4 mr-1.5" />
									{t("user_found")}
								</Badge>
							</div>
						</div>
					)}

					{/* Step 2: Staff Details (only show if user found) */}
					{foundUser && (
						<div className="grid grid-cols-2 gap-5 pt-6 border-t border-border/50 animate-in slide-in-from-top-4 duration-500">
							<div className="space-y-2">
								<Label htmlFor="staffId">
									{t("staff_id")} <span className="text-destructive">*</span>
								</Label>
								<Input
									id="staffId"
									className="h-11 bg-muted/20 border-border/50 rounded-lg"
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
									id="currency"
									className="h-11 bg-muted/20 border-border/50 rounded-lg"
									value={formData.currency}
									onChange={(e) =>
										handleInputChange("currency", e.target.value)
									}
									placeholder="USD"
								/>
							</div>
						</div>
					)}
					<DialogFooter className="pt-6 border-t border-border/50 mt-4 gap-2">
						<Button
							variant="ghost"
							onClick={() => setIsAddDialogOpen(false)}
							className="rounded-lg font-medium"
						>
							{t("cancel")}
						</Button>
						<Button
							onClick={handleAddStaff}
							disabled={mutationLoading || !foundUser}
							className="bg-primary hover:opacity-90 rounded-lg px-8 h-11 shadow-lg shadow-primary/20 font-bold"
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
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2 text-xl font-bold">
							<div className="p-2 bg-primary/10 rounded-lg text-primary">
								<Pencil className="h-6 w-6" />
							</div>
							{t("edit_member")}
						</DialogTitle>
						<DialogDescription className="font-medium text-muted-foreground/80">
							{t("update_staff_details")}
						</DialogDescription>
					</DialogHeader>

					{formError && (
						<div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
							<p className="text-sm text-red-700 dark:text-red-300">
								{formError}
							</p>
						</div>
					)}

					<div className="grid grid-cols-2 gap-4 pt-4">
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
								className="h-11 bg-muted/20 border-border/50 rounded-lg"
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

					<DialogFooter className="pt-6 border-t border-border/50 mt-4 gap-2">
						<Button
							variant="ghost"
							onClick={() => setIsEditDialogOpen(false)}
							className="rounded-lg font-medium"
						>
							{t("cancel")}
						</Button>
						<Button
							onClick={handleUpdateStaff}
							disabled={mutationLoading}
							className="bg-primary hover:opacity-90 rounded-lg px-8 h-11 shadow-lg shadow-primary/20 font-bold"
						>
							{mutationLoading && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							{t("save")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation Dialog */}
			<Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
				<DialogContent className="max-w-md rounded-lg">
					<DialogHeader>
						<DialogTitle className="flex items-center gap-2 text-xl font-bold text-destructive">
							<div className="p-2 bg-destructive/10 rounded-lg">
								<Trash2 className="h-6 w-6" />
							</div>
							{t("delete_staff")}
						</DialogTitle>
						<DialogDescription className="font-medium text-muted-foreground/70 pt-2">
							{t("delete_staff_confirm", {
								name: selectedStaff
									? `${selectedStaff.firstName} ${selectedStaff.lastName}`
									: "",
							})}
						</DialogDescription>
					</DialogHeader>
					<DialogFooter className="pt-4 gap-2">
						<Button
							variant="ghost"
							onClick={() => setIsDeleteDialogOpen(false)}
							className="rounded-lg font-medium"
						>
							{t("cancel")}
						</Button>
						<Button
							variant="destructive"
							onClick={handleDeleteStaff}
							disabled={mutationLoading}
							className="rounded-lg px-8 h-11 font-bold shadow-lg shadow-destructive/20"
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
