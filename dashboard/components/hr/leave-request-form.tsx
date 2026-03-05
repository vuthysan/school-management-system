"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from "@/components/ui/dialog";
import { type Staff, type CreateLeaveInput } from "@/hooks/useStaff";

interface LeaveRequestFormProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	staffList: Staff[];
	schoolId: string;
	onSubmit: (input: CreateLeaveInput) => Promise<void>;
	loading: boolean;
}

export function LeaveRequestForm({
	open,
	onOpenChange,
	staffList,
	schoolId,
	onSubmit,
	loading,
}: LeaveRequestFormProps) {
	const { t } = useTranslation();
	const [formData, setFormData] = useState({
		staffId: "",
		leaveType: "Annual",
		startDate: "",
		endDate: "",
		days: 1,
		reason: "",
	});
	const [formError, setFormError] = useState<string | null>(null);

	const handleSubmit = async () => {
		if (!formData.staffId || !formData.startDate || !formData.endDate || !formData.reason) {
			setFormError(t("fill_required_fields") || "Please fill all required fields");
			return;
		}

		setFormError(null);
		try {
			await onSubmit({
				schoolId,
				staffId: formData.staffId,
				leaveType: formData.leaveType,
				startDate: formData.startDate,
				endDate: formData.endDate,
				days: formData.days,
				reason: formData.reason,
			});
			// Reset form
			setFormData({
				staffId: "",
				leaveType: "Annual",
				startDate: "",
				endDate: "",
				days: 1,
				reason: "",
			});
			onOpenChange(false);
		} catch (err) {
			setFormError(
				err instanceof Error ? err.message : "Failed to create leave request"
			);
		}
	};

	// Auto-calculate days when dates change
	const handleDateChange = (field: "startDate" | "endDate", value: string) => {
		const newData = { ...formData, [field]: value };
		if (newData.startDate && newData.endDate) {
			const start = new Date(newData.startDate);
			const end = new Date(newData.endDate);
			const diffTime = end.getTime() - start.getTime();
			const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
			newData.days = Math.max(1, diffDays);
		}
		setFormData(newData);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
				<DialogHeader>
					<DialogTitle>{t("request_leave")}</DialogTitle>
					<DialogDescription>
						{t("request_leave_desc")}
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
					<div className="space-y-2 col-span-2">
						<Label>
							{t("staff_member")}{" "}
							<span className="text-destructive">*</span>
						</Label>
						<Select
							value={formData.staffId}
							onValueChange={(value) =>
								setFormData((prev) => ({ ...prev, staffId: value }))
							}
						>
							<SelectTrigger>
								<SelectValue placeholder={t("select_staff")} />
							</SelectTrigger>
							<SelectContent>
								{staffList.map((staff) => (
									<SelectItem key={staff.id} value={staff.id}>
										{staff.firstName} {staff.lastName} ({staff.staffId})
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label>
							{t("leave_type")}{" "}
							<span className="text-destructive">*</span>
						</Label>
						<Select
							value={formData.leaveType}
							onValueChange={(value) =>
								setFormData((prev) => ({ ...prev, leaveType: value }))
							}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="Annual">
									{t("leave_type_annual")}
								</SelectItem>
								<SelectItem value="Sick">
									{t("leave_type_sick")}
								</SelectItem>
								<SelectItem value="Maternity">
									{t("leave_type_maternity")}
								</SelectItem>
								<SelectItem value="Personal">
									{t("leave_type_personal")}
								</SelectItem>
								<SelectItem value="Unpaid">
									{t("leave_type_unpaid")}
								</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label>{t("days")}</Label>
						<Input
							type="number"
							min={1}
							value={formData.days}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									days: parseInt(e.target.value) || 1,
								}))
							}
						/>
					</div>

					<div className="space-y-2">
						<Label>
							{t("start_date")}{" "}
							<span className="text-destructive">*</span>
						</Label>
						<Input
							type="date"
							value={formData.startDate}
							onChange={(e) =>
								handleDateChange("startDate", e.target.value)
							}
						/>
					</div>

					<div className="space-y-2">
						<Label>
							{t("end_date")}{" "}
							<span className="text-destructive">*</span>
						</Label>
						<Input
							type="date"
							value={formData.endDate}
							onChange={(e) =>
								handleDateChange("endDate", e.target.value)
							}
						/>
					</div>

					<div className="space-y-2 col-span-2">
						<Label>
							{t("reason")}{" "}
							<span className="text-destructive">*</span>
						</Label>
						<Input
							value={formData.reason}
							onChange={(e) =>
								setFormData((prev) => ({
									...prev,
									reason: e.target.value,
								}))
							}
							placeholder={t("enter_leave_reason") || "Enter reason for leave..."}
						/>
					</div>
				</div>

				<DialogFooter className="pt-4 border-t border-black/6 dark:border-white/6 gap-2">
					<Button variant="ghost" onClick={() => onOpenChange(false)}>
						{t("cancel")}
					</Button>
					<Button onClick={handleSubmit} disabled={loading}>
						{loading && (
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
						)}
						{t("submit_request")}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
