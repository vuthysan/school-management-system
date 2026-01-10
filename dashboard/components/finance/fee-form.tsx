"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Fee, FeeFormData, CURRENCIES } from "@/types/finance";
import { useLanguage } from "@/contexts/language-context";
import { useGradeLevels } from "@/hooks/useGradeLevels";
import { useAcademicYears } from "@/hooks/useAcademicYears";
import { useDashboard } from "@/hooks/useDashboard";

interface FeeFormProps {
	fee?: Fee | null;
	onSubmit: (data: FeeFormData) => Promise<void>;
	onCancel: () => void;
}

const initialFormData: FeeFormData = {
	feeName: "",
	description: "",
	amount: "",
	currency: "USD",
	gradeLevel: "",
	academicYear: "",
	dueDate: "",
	isMandatory: true,
};

export function FeeForm({ fee, onSubmit, onCancel }: FeeFormProps) {
	const { t } = useLanguage();
	const { currentSchool } = useDashboard();
	const schoolId = currentSchool?.idStr || currentSchool?.id || null;

	const { gradeLevels } = useGradeLevels({ schoolId });
	const { academicYears } = useAcademicYears(schoolId || "");

	const [formData, setFormData] = useState<FeeFormData>(initialFormData);
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Populate form data when editing
	useEffect(() => {
		if (fee) {
			setFormData({
				feeName: fee.feeName,
				description: fee.description || "",
				amount: fee.amount.toString(),
				currency: fee.currency as "USD" | "KHR",
				gradeLevel: fee.gradeLevel || "",
				academicYear: fee.academicYear,
				dueDate: fee.dueDate.split("T")[0], // Convert to YYYY-MM-DD
				isMandatory: fee.isMandatory,
			});
		}
	}, [fee]);

	const handleChange = (field: keyof FeeFormData, value: string | boolean) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		try {
			await onSubmit(formData);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid gap-4">
				{/* Fee Name */}
				<div className="space-y-2">
					<Label htmlFor="feeName">{t("fee_name") || "Fee Name"} *</Label>
					<Input
						id="feeName"
						value={formData.feeName}
						onChange={(e) => handleChange("feeName", e.target.value)}
						placeholder={
							t("fee_name_placeholder") || "e.g., Tuition Fee, Registration Fee"
						}
						required
					/>
				</div>

				{/* Description */}
				<div className="space-y-2">
					<Label htmlFor="description">
						{t("description") || "Description"}
					</Label>
					<Textarea
						id="description"
						value={formData.description}
						onChange={(e) => handleChange("description", e.target.value)}
						placeholder={
							t("description_placeholder") || "Optional description..."
						}
						rows={2}
					/>
				</div>

				{/* Amount and Currency */}
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="amount">{t("amount") || "Amount"} *</Label>
						<Input
							id="amount"
							type="number"
							step="0.01"
							min="0"
							value={formData.amount}
							onChange={(e) => handleChange("amount", e.target.value)}
							placeholder="0.00"
							required
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="currency">{t("currency") || "Currency"} *</Label>
						<Select
							value={formData.currency}
							onValueChange={(v) => handleChange("currency", v)}
						>
							<SelectTrigger>
								<SelectValue
									placeholder={t("select_currency") || "Select currency"}
								/>
							</SelectTrigger>
							<SelectContent>
								{CURRENCIES.map((c) => (
									<SelectItem key={c.value} value={c.value}>
										{c.symbol} {t(c.value) || c.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				{/* Grade Level */}
				<div className="space-y-2">
					<Label htmlFor="gradeLevel">
						{t("grade_level") || "Grade Level"}
					</Label>
					<Select
						value={formData.gradeLevel || "__all__"}
						onValueChange={(v) =>
							handleChange("gradeLevel", v === "__all__" ? "" : v)
						}
					>
						<SelectTrigger>
							<SelectValue
								placeholder={
									t("all_grades") || "All Grades (leave empty for all)"
								}
							/>
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="__all__">
								{t("all_grades") || "All Grades"}
							</SelectItem>
							{gradeLevels.map((gl) => (
								<SelectItem key={gl.id} value={gl.name}>
									{gl.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				{/* Academic Year */}
				<div className="space-y-2">
					<Label htmlFor="academicYear">
						{t("academic_year") || "Academic Year"} *
					</Label>
					<Select
						value={formData.academicYear}
						onValueChange={(v) => handleChange("academicYear", v)}
					>
						<SelectTrigger>
							<SelectValue
								placeholder={
									t("select_academic_year") || "Select academic year"
								}
							/>
						</SelectTrigger>
						<SelectContent>
							{academicYears.map((ay) => (
								<SelectItem key={ay.idStr} value={ay.name || ""}>
									{ay.label || ay.name}
								</SelectItem>
							))}
							{academicYears.length === 0 && (
								<SelectItem value="2024-2025">2024-2025</SelectItem>
							)}
						</SelectContent>
					</Select>
				</div>

				{/* Due Date */}
				<div className="space-y-2">
					<Label htmlFor="dueDate">{t("due_date") || "Due Date"} *</Label>
					<Input
						id="dueDate"
						type="date"
						value={formData.dueDate}
						onChange={(e) => handleChange("dueDate", e.target.value)}
						required
					/>
				</div>

				{/* Mandatory Switch */}
				<div className="flex items-center justify-between rounded-lg border p-4">
					<div className="space-y-0.5">
						<Label htmlFor="isMandatory">
							{t("mandatory_fee") || "Mandatory Fee"}
						</Label>
						<p className="text-sm text-muted-foreground">
							{t("mandatory_fee_desc") || "Students must pay this fee"}
						</p>
					</div>
					<Switch
						id="isMandatory"
						checked={formData.isMandatory}
						onCheckedChange={(checked) => handleChange("isMandatory", checked)}
					/>
				</div>
			</div>

			{/* Actions */}
			<div className="flex justify-end gap-3 pt-4 border-t">
				<Button type="button" variant="outline" onClick={onCancel}>
					{t("cancel") || "Cancel"}
				</Button>
				<Button type="submit" disabled={isSubmitting}>
					{isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
					{fee
						? t("update_fee") || "Update Fee"
						: t("create_fee") || "Create Fee"}
				</Button>
			</div>
		</form>
	);
}
