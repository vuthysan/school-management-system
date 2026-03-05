"use client";

import { useState } from "react";
import { Package, Plus, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/dashboard/page-header";
import { DeleteConfirmDialog } from "@/components/shared/delete-confirm-dialog";
import { useDashboard } from "@/hooks/useDashboard";
import { useInventoryItems, useInventoryMutations } from "@/hooks/useInventory";
import { InventoryStats } from "@/components/inventory/inventory-stats";
import { InventoryTable } from "@/components/inventory/inventory-table";
import { InventoryForm } from "@/components/inventory/inventory-form";
import type { InventoryItem } from "@/types/inventory";

export default function InventoryPage() {
	const { t } = useTranslation();
	const { currentSchool, isLoading: isDashboardLoading } = useDashboard();
	const schoolId = currentSchool?.idStr || currentSchool?.id || null;

	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

	const { items, isLoading: isItemsLoading, error: itemsError, refresh: refreshItems } = useInventoryItems(schoolId);
	const { createItem, updateItem, deleteItem } = useInventoryMutations();

	// ========================================================================
	// HANDLERS
	// ========================================================================

	const handleAddNew = () => {
		setSelectedItem(null);
		setIsFormOpen(true);
	};

	const handleEdit = (item: InventoryItem) => {
		setSelectedItem(item);
		setIsFormOpen(true);
	};

	const handleDelete = (item: InventoryItem) => {
		setSelectedItem(item);
		setIsDeleteOpen(true);
	};

	const onConfirmDelete = async () => {
		if (!schoolId || !selectedItem) return;
		setIsSubmitting(true);
		try {
			await deleteItem(selectedItem.id);
			refreshItems();
			setIsDeleteOpen(false);
		} catch (err) {
			console.error("Delete failed", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const onSave = async (values: Record<string, unknown>) => {
		if (!schoolId) return;
		setIsSubmitting(true);
		try {
			if (selectedItem) {
				await updateItem(selectedItem.id, values as any);
			} else {
				await createItem({ ...values, schoolId } as any);
			}
			refreshItems();
			setIsFormOpen(false);
		} catch (err) {
			console.error("Save failed", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	// ========================================================================
	// GUARDS
	// ========================================================================

	if (isDashboardLoading) {
		return (
			<div className="min-h-[60vh] flex items-center justify-center">
				<div className="text-center space-y-3">
					<div className="h-8 w-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin mx-auto" />
					<p className="text-sm text-muted-foreground">{t("loading") || "Loading..."}</p>
				</div>
			</div>
		);
	}

	if (!schoolId) {
		return (
			<div className="min-h-[60vh] flex items-center justify-center">
				<div className="text-center space-y-3">
					<div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 flex items-center justify-center mx-auto">
						<AlertCircle className="h-5 w-5 text-amber-500" />
					</div>
					<p className="text-sm text-muted-foreground">{t("no_school_selected") || "No school selected"}</p>
				</div>
			</div>
		);
	}

	// ========================================================================
	// RENDER
	// ========================================================================

	return (
		<div className="space-y-6 pb-10">
			<PageHeader
				title={t("inventory_management") || "Inventory Management"}
				subtitle={t("manage_inventory_subtitle") || "Track assets, stock levels, and school supplies"}
				icon={Package}
			>
				<Button onClick={handleAddNew} size="sm" className="gap-2">
					<Plus className="h-4 w-4" />
					{t("add_item") || "Add Item"}
				</Button>
			</PageHeader>

			{/* Stats */}
			<InventoryStats items={items} />

			{/* Table */}
			{itemsError ? (
				<div className="min-h-[40vh] flex items-center justify-center">
					<div className="text-center space-y-3">
						<p className="text-sm text-destructive">{itemsError}</p>
						<Button variant="outline" size="sm" onClick={refreshItems}>
							{t("retry") || "Retry"}
						</Button>
					</div>
				</div>
			) : (
				<InventoryTable
					items={items}
					isLoading={isItemsLoading}
					onEdit={handleEdit}
					onDelete={handleDelete}
				/>
			)}

			{/* Form Modal */}
			<Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							{selectedItem ? t("edit_item") || "Edit Item" : t("add_item") || "Add Item"}
						</DialogTitle>
						<DialogDescription>
							{t("fill_form_details") || "Fill in the details below."}
						</DialogDescription>
					</DialogHeader>
					<InventoryForm
						initialData={selectedItem}
						onSave={onSave}
						onCancel={() => setIsFormOpen(false)}
						isSaving={isSubmitting}
					/>
				</DialogContent>
			</Dialog>

			{/* Delete Confirmation */}
			<DeleteConfirmDialog
				open={isDeleteOpen}
				onOpenChange={setIsDeleteOpen}
				title={t("confirm_delete") || "Confirm Delete"}
				description={t("delete_item_warning") || "This action cannot be undone."}
				onConfirm={onConfirmDelete}
				isLoading={isSubmitting}
				cancelLabel={t("cancel") || "Cancel"}
				confirmLabel={t("delete") || "Delete"}
			/>
		</div>
	);
}
