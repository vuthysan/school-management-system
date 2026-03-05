"use client";

import { useState } from "react";
import {
	Check,
	X,
	Clock,
	CalendarDays,
	Loader2,
	FileText,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/dashboard/loading-state";
import { type LeaveRecord, type Staff } from "@/hooks/useStaff";

interface LeavesTableProps {
	leaves: LeaveRecord[];
	staffList: Staff[];
	loading: boolean;
	onApprove: (id: string, approvedBy: string) => Promise<void>;
	onReject: (id: string, reason: string) => Promise<void>;
	mutationLoading: boolean;
}

const leaveStatusColors: Record<string, string> = {
	Pending:
		"bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400",
	Approved:
		"bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
	Rejected:
		"bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
};

const leaveTypeColors: Record<string, string> = {
	Annual:
		"bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
	Sick: "bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400",
	Maternity:
		"bg-pink-50 text-pink-700 dark:bg-pink-950/40 dark:text-pink-400",
	Personal:
		"bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-400",
	Unpaid:
		"bg-gray-50 text-gray-700 dark:bg-gray-950/40 dark:text-gray-400",
};

export function LeavesTable({
	leaves,
	staffList,
	loading,
	onApprove,
	onReject,
	mutationLoading,
}: LeavesTableProps) {
	const { t } = useTranslation();
	const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
	const [rejectingLeaveId, setRejectingLeaveId] = useState<string | null>(
		null
	);
	const [rejectionReason, setRejectionReason] = useState("");

	const getStaffName = (staffId: string) => {
		const staff = staffList.find((s) => s.id === staffId);
		return staff ? `${staff.firstName} ${staff.lastName}` : staffId;
	};

	const handleRejectClick = (leaveId: string) => {
		setRejectingLeaveId(leaveId);
		setRejectionReason("");
		setRejectDialogOpen(true);
	};

	const handleConfirmReject = async () => {
		if (!rejectingLeaveId) return;
		await onReject(rejectingLeaveId, rejectionReason);
		setRejectDialogOpen(false);
		setRejectingLeaveId(null);
	};

	return (
		<>
			<Table>
				<TableHeader>
					<TableRow className="hover:bg-transparent border-b border-black/6 dark:border-white/6">
						<TableHead className="h-10 text-xs font-medium text-muted-foreground">
							{t("staff_member")}
						</TableHead>
						<TableHead className="h-10 text-xs font-medium text-muted-foreground">
							{t("leave_type")}
						</TableHead>
						<TableHead className="h-10 text-xs font-medium text-muted-foreground">
							{t("date_range")}
						</TableHead>
						<TableHead className="h-10 text-xs font-medium text-muted-foreground">
							{t("days")}
						</TableHead>
						<TableHead className="h-10 text-xs font-medium text-muted-foreground">
							{t("reason")}
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
						{loading ? (
							<TableRow>
								<TableCell colSpan={7}>
									<LoadingState message={t("loading_leaves")} />
								</TableCell>
							</TableRow>
						) : leaves.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7} className="h-60 text-center">
									<div className="flex flex-col items-center justify-center gap-3">
										<div className="w-12 h-12 rounded-2xl bg-muted/60 flex items-center justify-center">
											<CalendarDays className="h-5 w-5 text-muted-foreground" />
										</div>
										<div className="space-y-1">
											<p className="text-sm font-medium text-foreground">
												{t("no_leave_requests")}
											</p>
											<p className="text-xs text-muted-foreground max-w-xs mx-auto">
												{t("no_leave_requests_desc")}
											</p>
										</div>
									</div>
								</TableCell>
							</TableRow>
						) : (
							leaves.map((leave, index) => (
								<motion.tr
									key={leave.id}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ delay: index * 0.03 }}
									className="group hover:bg-muted/30 transition-colors border-b border-black/6 dark:border-white/6"
								>
									<TableCell className="py-3">
										<span className="text-sm font-medium text-foreground">
											{getStaffName(leave.staffId)}
										</span>
									</TableCell>
									<TableCell>
										<Badge
											variant="secondary"
											className={cn(
												"border-none text-xs font-medium",
												leaveTypeColors[leave.leaveType] ||
													leaveTypeColors.Personal
											)}
										>
											{t(`leave_type_${leave.leaveType.toLowerCase()}`) ||
												leave.leaveType}
										</Badge>
									</TableCell>
									<TableCell>
										<span className="text-sm text-foreground/80">
											{leave.startDate} — {leave.endDate}
										</span>
									</TableCell>
									<TableCell>
										<span className="text-sm font-medium tabular-nums">
											{leave.days}
										</span>
									</TableCell>
									<TableCell>
										<span className="text-sm text-foreground/80 max-w-[200px] truncate block">
											{leave.reason}
										</span>
									</TableCell>
									<TableCell>
										<div className="flex items-center gap-1.5">
											{leave.status === "Pending" && (
												<Clock className="w-3 h-3 text-amber-500" />
											)}
											{leave.status === "Approved" && (
												<Check className="w-3 h-3 text-emerald-500" />
											)}
											{leave.status === "Rejected" && (
												<X className="w-3 h-3 text-red-500" />
											)}
											<Badge
												variant="secondary"
												className={cn(
													"border-none text-xs font-medium",
													leaveStatusColors[leave.status] ||
														leaveStatusColors.Pending
												)}
											>
												{t(
													`leave_status_${leave.status.toLowerCase()}`
												) || leave.status}
											</Badge>
										</div>
									</TableCell>
									<TableCell className="text-right">
										{leave.status === "Pending" && (
											<div className="flex items-center gap-1 justify-end">
												<Button
													size="sm"
													variant="ghost"
													className="h-7 px-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
													onClick={() =>
														onApprove(leave.id, "admin")
													}
													disabled={mutationLoading}
												>
													<Check className="h-3.5 w-3.5 mr-1" />
													{t("approve")}
												</Button>
												<Button
													size="sm"
													variant="ghost"
													className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
													onClick={() =>
														handleRejectClick(leave.id)
													}
													disabled={mutationLoading}
												>
													<X className="h-3.5 w-3.5 mr-1" />
													{t("reject")}
												</Button>
											</div>
										)}
										{leave.status !== "Pending" && (
											<span className="text-xs text-muted-foreground">
												—
											</span>
										)}
									</TableCell>
								</motion.tr>
							))
						)}
					</AnimatePresence>
				</TableBody>
			</Table>

			{/* Rejection Reason Dialog */}
			<Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
				<DialogContent className="max-w-sm">
					<DialogHeader>
						<DialogTitle>{t("reject_leave")}</DialogTitle>
						<DialogDescription>
							{t("reject_leave_desc")}
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-2">
						<Label>{t("rejection_reason")}</Label>
						<Input
							value={rejectionReason}
							onChange={(e) => setRejectionReason(e.target.value)}
							placeholder={t("enter_rejection_reason") || "Enter reason..."}
						/>
					</div>
					<DialogFooter className="gap-2">
						<Button
							variant="ghost"
							onClick={() => setRejectDialogOpen(false)}
						>
							{t("cancel")}
						</Button>
						<Button
							variant="destructive"
							onClick={handleConfirmReject}
							disabled={mutationLoading}
						>
							{mutationLoading && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							{t("reject")}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
