"use client";

import { useState, useEffect } from "react";
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
import { Loader2 } from "lucide-react";
import type { InventoryItem, InventoryCategory, ItemCondition } from "@/types/inventory";

interface InventoryFormProps {
	initialData?: InventoryItem | null;
	onSave: (data: Record<string, unknown>) => Promise<void>;
	onCancel: () => void;
	isSaving: boolean;
}

export function InventoryForm({ initialData, onSave, onCancel, isSaving }: InventoryFormProps) {
	const { t } = useTranslation();

	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [category, setCategory] = useState<InventoryCategory>("Other");
	const [quantity, setQuantity] = useState(1);
	const [unitCost, setUnitCost] = useState(0);
	const [currency, setCurrency] = useState("USD");
	const [location, setLocation] = useState("");
	const [supplier, setSupplier] = useState("");
	const [purchaseDate, setPurchaseDate] = useState("");
	const [warrantyExpiry, setWarrantyExpiry] = useState("");
	const [condition, setCondition] = useState<ItemCondition>("Good");
	const [assignedTo, setAssignedTo] = useState("");
	const [status, setStatus] = useState("Active");

	useEffect(() => {
		if (initialData) {
			setName(initialData.name);
			setDescription(initialData.description || "");
			setCategory(initialData.category);
			setQuantity(initialData.quantity);
			setUnitCost(initialData.unitCost);
			setCurrency(initialData.currency || "USD");
			setLocation(initialData.location || "");
			setSupplier(initialData.supplier || "");
			setPurchaseDate(initialData.purchaseDate || "");
			setWarrantyExpiry(initialData.warrantyExpiry || "");
			setCondition(initialData.condition);
			setAssignedTo(initialData.assignedTo || "");
			setStatus(initialData.status);
		} else {
			setName("");
			setDescription("");
			setCategory("Other");
			setQuantity(1);
			setUnitCost(0);
			setCurrency("USD");
			setLocation("");
			setSupplier("");
			setPurchaseDate("");
			setWarrantyExpiry("");
			setCondition("Good");
			setAssignedTo("");
			setStatus("Active");
		}
	}, [initialData]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await onSave({
			name,
			description: description || undefined,
			category,
			quantity,
			unitCost,
			currency,
			location: location || undefined,
			supplier: supplier || undefined,
			purchaseDate: purchaseDate || undefined,
			warrantyExpiry: warrantyExpiry || undefined,
			condition,
			assignedTo: assignedTo || undefined,
			status,
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			{/* Name + Category */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="name">{t("item_name") || "Item Name"} *</Label>
					<Input
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder={t("item_name_placeholder") || "e.g. Classroom Desk"}
						required
						className="h-9"
					/>
				</div>
				<div className="space-y-2">
					<Label>{t("category") || "Category"}</Label>
					<Select value={category} onValueChange={(v) => setCategory(v as InventoryCategory)}>
						<SelectTrigger className="h-9">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Furniture">{t("furniture") || "Furniture"}</SelectItem>
							<SelectItem value="Electronics">{t("electronics") || "Electronics"}</SelectItem>
							<SelectItem value="Stationery">{t("stationery") || "Stationery"}</SelectItem>
							<SelectItem value="Sports">{t("sports") || "Sports"}</SelectItem>
							<SelectItem value="LabEquipment">{t("lab_equipment") || "Lab Equipment"}</SelectItem>
							<SelectItem value="Books">{t("books") || "Books"}</SelectItem>
							<SelectItem value="Other">{t("other") || "Other"}</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Quantity + Unit Cost + Currency */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
				<div className="space-y-2">
					<Label htmlFor="quantity">{t("quantity") || "Quantity"} *</Label>
					<Input
						id="quantity"
						type="number"
						value={quantity}
						onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
						min={0}
						required
						className="h-9"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="unitCost">{t("unit_cost") || "Unit Cost"} *</Label>
					<Input
						id="unitCost"
						type="number"
						value={unitCost}
						onChange={(e) => setUnitCost(parseFloat(e.target.value) || 0)}
						min={0}
						step="0.01"
						required
						className="h-9"
					/>
				</div>
				<div className="space-y-2">
					<Label>{t("currency") || "Currency"}</Label>
					<Select value={currency} onValueChange={setCurrency}>
						<SelectTrigger className="h-9">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="USD">USD ($)</SelectItem>
							<SelectItem value="KHR">KHR (៛)</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Condition + Status */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label>{t("condition") || "Condition"}</Label>
					<Select value={condition} onValueChange={(v) => setCondition(v as ItemCondition)}>
						<SelectTrigger className="h-9">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="New">{t("new") || "New"}</SelectItem>
							<SelectItem value="Good">{t("good") || "Good"}</SelectItem>
							<SelectItem value="Fair">{t("fair") || "Fair"}</SelectItem>
							<SelectItem value="Poor">{t("poor") || "Poor"}</SelectItem>
							<SelectItem value="Damaged">{t("damaged") || "Damaged"}</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label>{t("status") || "Status"}</Label>
					<Select value={status} onValueChange={setStatus}>
						<SelectTrigger className="h-9">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Active">{t("active") || "Active"}</SelectItem>
							<SelectItem value="Inactive">{t("inactive") || "Inactive"}</SelectItem>
							<SelectItem value="Pending">{t("pending") || "Pending"}</SelectItem>
							<SelectItem value="Archived">{t("archived") || "Archived"}</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Location + Supplier */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="location">{t("location") || "Location"}</Label>
					<Input
						id="location"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
						placeholder={t("location_placeholder") || "e.g. Room B-12"}
						className="h-9"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="supplier">{t("supplier") || "Supplier"}</Label>
					<Input
						id="supplier"
						value={supplier}
						onChange={(e) => setSupplier(e.target.value)}
						placeholder={t("supplier_placeholder") || "e.g. ABC Supplies Co."}
						className="h-9"
					/>
				</div>
			</div>

			{/* Purchase Date + Warranty Expiry */}
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="purchaseDate">{t("purchase_date") || "Purchase Date"}</Label>
					<Input
						id="purchaseDate"
						type="date"
						value={purchaseDate}
						onChange={(e) => setPurchaseDate(e.target.value)}
						className="h-9"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="warrantyExpiry">{t("warranty_expiry") || "Warranty Expiry"}</Label>
					<Input
						id="warrantyExpiry"
						type="date"
						value={warrantyExpiry}
						onChange={(e) => setWarrantyExpiry(e.target.value)}
						className="h-9"
					/>
				</div>
			</div>

			{/* Assigned To */}
			<div className="space-y-2">
				<Label htmlFor="assignedTo">{t("assigned_to") || "Assigned To"}</Label>
				<Input
					id="assignedTo"
					value={assignedTo}
					onChange={(e) => setAssignedTo(e.target.value)}
					placeholder={t("assigned_to_placeholder") || "e.g. Science Department"}
					className="h-9"
				/>
			</div>

			{/* Description */}
			<div className="space-y-2">
				<Label htmlFor="description">{t("description") || "Description"}</Label>
				<Input
					id="description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					placeholder={t("description_placeholder") || "Optional description..."}
					className="h-9"
				/>
			</div>

			<div className="flex justify-end gap-2 pt-2">
				<Button type="button" variant="ghost" onClick={onCancel} disabled={isSaving}>
					{t("cancel") || "Cancel"}
				</Button>
				<Button type="submit" disabled={isSaving || !name || quantity < 0 || unitCost < 0}>
					{isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					{initialData ? t("save_changes") || "Save Changes" : t("add_item") || "Add Item"}
				</Button>
			</div>
		</form>
	);
}
