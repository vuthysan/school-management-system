"use client";

import { useTranslation } from "react-i18next";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Package, DollarSign, AlertTriangle, Layers } from "lucide-react";
import type { InventoryItem } from "@/types/inventory";

interface InventoryStatsProps {
	items: InventoryItem[];
}

export function InventoryStats({ items }: InventoryStatsProps) {
	const { t } = useTranslation();

	const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
	const totalValue = items.reduce((sum, item) => sum + item.totalValue, 0);
	const lowStockCount = items.filter((item) => item.quantity > 0 && item.quantity <= 5).length;
	const categoryCount = new Set(items.map((item) => item.category)).size;

	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
			<StatsCard
				title={t("total_items") || "Total Items"}
				value={totalItems.toLocaleString()}
				subtitle={`${items.length} ${t("item_types") || "item types"}`}
				icon={Package}
				color="blue"
				delay={0}
			/>
			<StatsCard
				title={t("total_value") || "Total Value"}
				value={`$${totalValue.toLocaleString()}`}
				subtitle={t("combined_asset_value") || "combined asset value"}
				icon={DollarSign}
				color="purple"
				delay={0.05}
			/>
			<StatsCard
				title={t("low_stock") || "Low Stock"}
				value={lowStockCount.toLocaleString()}
				subtitle={t("items_need_restock") || "items need restocking"}
				icon={AlertTriangle}
				color="orange"
				delay={0.1}
			/>
			<StatsCard
				title={t("categories") || "Categories"}
				value={categoryCount.toLocaleString()}
				subtitle={t("active_categories") || "active categories"}
				icon={Layers}
				color="emerald"
				delay={0.15}
			/>
		</div>
	);
}
