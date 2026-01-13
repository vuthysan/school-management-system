"use client";

import { useState } from "react";
import { Bell, Loader2, Send, AlertCircle, CheckCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogFooter,
	DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useAbsenceNotifications } from "@/hooks/usePromotion";
import { useClasses } from "@/hooks/useClasses";
import { useDashboard } from "@/hooks/useDashboard";

interface AbsenceNotificationDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function AbsenceNotificationDialog({
	open,
	onOpenChange,
}: AbsenceNotificationDialogProps) {
	const { currentSchool } = useDashboard();
	const schoolId = currentSchool?.idStr || currentSchool?.id || null;
	const { classes } = useClasses({ schoolId, pageSize: 100 });
	const { sendAbsenceNotifications } = useAbsenceNotifications();

	const [classId, setClassId] = useState("");
	const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
	const [isLoading, setIsLoading] = useState(false);
	const [result, setResult] = useState<{
		success: boolean;
		notificationsSent: number;
		notificationsFailed: number;
	} | null>(null);

	const handleSend = async () => {
		if (!classId || !date) return;

		setIsLoading(true);
		setResult(null);

		try {
			const res = await sendAbsenceNotifications(classId, date);
			setResult(res);
		} catch (err) {
			console.error("Failed to send notifications:", err);
			setResult({
				success: false,
				notificationsSent: 0,
				notificationsFailed: 0,
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleClose = () => {
		setClassId("");
		setResult(null);
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={handleClose}>
			<DialogContent className="max-w-md">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Bell className="h-5 w-5" />
						Send Absence Notifications
					</DialogTitle>
					<DialogDescription>
						Notify parents of absent students for a specific class and date.
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4 py-4">
					{/* Class Selection */}
					<div className="space-y-2">
						<Label>Select Class *</Label>
						<Select value={classId} onValueChange={setClassId}>
							<SelectTrigger>
								<SelectValue placeholder="Select a class" />
							</SelectTrigger>
							<SelectContent>
								{classes.map((cls) => (
									<SelectItem key={cls.id} value={cls.id}>
										{cls.name} ({cls.gradeLevel})
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Date Selection */}
					<div className="space-y-2">
						<Label>Attendance Date *</Label>
						<Input
							type="date"
							value={date}
							onChange={(e) => setDate(e.target.value)}
							max={new Date().toISOString().split("T")[0]}
						/>
					</div>

					{/* Info */}
					<div className="flex items-start gap-2 p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg">
						<AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
						<div className="text-sm">
							<p>
								This will send notifications to parents of all students marked
								as &quot;Absent&quot; for the selected class and date.
							</p>
						</div>
					</div>

					{/* Result Message */}
					{result && (
						<div
							className={`flex items-center gap-2 p-3 rounded-lg ${
								result.notificationsSent > 0
									? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
									: "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300"
							}`}
						>
							<CheckCircle className="h-5 w-5" />
							<div>
								<p className="font-medium">
									{result.notificationsSent} notification
									{result.notificationsSent !== 1 ? "s" : ""} queued
								</p>
								{result.notificationsFailed > 0 && (
									<p className="text-sm">
										{result.notificationsFailed} failed (no parent contact info)
									</p>
								)}
							</div>
						</div>
					)}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={handleClose}>
						Close
					</Button>
					<Button
						onClick={handleSend}
						disabled={isLoading || !classId || !date}
					>
						{isLoading ? (
							<Loader2 className="h-4 w-4 mr-2 animate-spin" />
						) : (
							<Send className="h-4 w-4 mr-2" />
						)}
						Send Notifications
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
