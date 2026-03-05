export type InventoryCategory = "Furniture" | "Electronics" | "Stationery" | "Sports" | "LabEquipment" | "Books" | "Other";
export type ItemCondition = "New" | "Good" | "Fair" | "Poor" | "Damaged";

export interface InventoryItem {
	id: string;
	schoolId: string;
	branchId?: string;
	name: string;
	description?: string;
	category: InventoryCategory;
	quantity: number;
	unitCost: number;
	currency: string;
	totalValue: number;
	location?: string;
	supplier?: string;
	purchaseDate?: string;
	warrantyExpiry?: string;
	condition: ItemCondition;
	assignedTo?: string;
	status: "Active" | "Inactive" | "Pending" | "Archived";
	createdAt: string;
	updatedAt: string;
}

export interface CreateInventoryItemInput {
	schoolId: string;
	branchId?: string;
	name: string;
	description?: string;
	category?: InventoryCategory;
	quantity: number;
	unitCost: number;
	currency?: string;
	location?: string;
	supplier?: string;
	purchaseDate?: string;
	warrantyExpiry?: string;
	condition?: ItemCondition;
	assignedTo?: string;
	status?: string;
}

export interface UpdateInventoryItemInput {
	name?: string;
	description?: string;
	category?: InventoryCategory;
	quantity?: number;
	unitCost?: number;
	currency?: string;
	location?: string;
	supplier?: string;
	purchaseDate?: string;
	warrantyExpiry?: string;
	condition?: ItemCondition;
	assignedTo?: string;
	status?: string;
}

export interface CategorySummary {
	category: string;
	count: number;
	totalValue: number;
}

export interface InventoryStats {
	totalItems: number;
	totalValue: number;
	lowStockCount: number;
	categories: CategorySummary[];
}
