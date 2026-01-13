"use client";

import { PageHeader } from "@/components/dashboard/page-header";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import {
	Package,
	Search,
	Plus,
	Filter,
	ArrowUpRight,
	AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function InventoryPage() {
	return (
		<div className="p-6 space-y-10 max-w-[1600px] mx-auto bg-background/50">
			<PageHeader
				title="Inventory System"
				subtitle="Manage assets, track stock levels, and optimize school supplies."
				icon={Package}
				gradient="orange"
			>
				<div className="flex items-center gap-3">
					<Button className="rounded-2xl h-12 px-6 font-black uppercase tracking-widest shadow-xl shadow-orange-500/20 bg-orange-500 hover:bg-orange-600 border-none transition-all hover:scale-105 active:scale-95">
						<Plus className="w-5 h-5 mr-2" strokeWidth={3} />
						Receive Stock
					</Button>
				</div>
			</PageHeader>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<DashboardCard
					delay={0.1}
					className="bg-gradient-to-br from-white to-blue-50/30 dark:from-neutral-900 dark:to-blue-900/10 border-blue-500/10"
				>
					<div className="space-y-2 text-center">
						<p className="text-[10px] font-black uppercase tracking-widest text-blue-500/60">
							Total Assets
						</p>
						<p className="text-4xl font-black text-foreground tracking-tighter">
							1,284
						</p>
					</div>
				</DashboardCard>
				<DashboardCard
					delay={0.2}
					className="bg-gradient-to-br from-white to-orange-50/30 dark:from-neutral-900 dark:to-orange-900/10 border-orange-500/10"
				>
					<div className="space-y-2 text-center">
						<p className="text-[10px] font-black uppercase tracking-widest text-orange-500/60">
							Low Stock Items
						</p>
						<p className="text-4xl font-black tracking-tighter text-orange-600">
							12
						</p>
					</div>
				</DashboardCard>
				<DashboardCard
					delay={0.3}
					className="bg-gradient-to-br from-white to-purple-50/30 dark:from-neutral-900 dark:to-purple-900/10 border-purple-500/10"
				>
					<div className="space-y-2 text-center">
						<p className="text-[10px] font-black uppercase tracking-widest text-purple-500/60">
							Total Value
						</p>
						<p className="text-4xl font-black text-foreground tracking-tighter">
							$42,500
						</p>
					</div>
				</DashboardCard>
			</div>

			<DashboardCard delay={0.4} title="Stock Inventory">
				<div className="space-y-6">
					<div className="flex flex-col md:flex-row gap-4 justify-between">
						<div className="relative flex-1 max-w-md">
							<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
							<Input
								placeholder="Search items, categories, or serial numbers..."
								className="pl-12 h-12 rounded-2xl bg-black/5 border-none focus-visible:ring-primary/20"
							/>
						</div>
						<div className="flex items-center gap-3">
							<Button
								variant="outline"
								className="h-12 rounded-2xl border-black/5 hover:bg-black/5 px-6 font-bold text-xs uppercase tracking-widest"
							>
								<Filter className="w-4 h-4 mr-2" />
								Category
							</Button>
						</div>
					</div>

					<div className="rounded-[2rem] border border-black/5 overflow-hidden">
						<div className="bg-black/5 p-4 grid grid-cols-4 font-black uppercase tracking-widest text-[10px] text-muted-foreground">
							<div>Item Name</div>
							<div>Category</div>
							<div>Quantity</div>
							<div>Status</div>
						</div>
						<div className="divide-y divide-black/5">
							{[
								{
									name: "MacBook Air M2",
									cat: "Electronics",
									qty: "24 Units",
									status: "In Stock",
									color: "text-green-500",
								},
								{
									name: "Whiteboard Markers",
									cat: "Stationery",
									qty: "5 Units",
									status: "Low Stock",
									color: "text-orange-500",
								},
								{
									name: "Classroom Desks",
									cat: "Furniture",
									qty: "120 Units",
									status: "In Stock",
									color: "text-green-500",
								},
								{
									name: "Physics Lab Kit",
									cat: "Lab Equipment",
									qty: "12 Units",
									status: "In Stock",
									color: "text-green-500",
								},
							].map((item, i) => (
								<div
									key={i}
									className="p-5 grid grid-cols-4 items-center hover:bg-black/5 smooth-transition cursor-pointer group"
								>
									<div className="font-bold text-foreground group-hover:text-primary transition-colors">
										{item.name}
									</div>
									<div className="text-sm text-muted-foreground">
										{item.cat}
									</div>
									<div className="text-sm font-bold">{item.qty}</div>
									<div className="flex items-center gap-2">
										<div
											className={`w-2 h-2 rounded-full ${item.color.replace("text-", "bg-")}`}
										/>
										<span
											className={`text-[10px] font-black uppercase tracking-widest ${item.color}`}
										>
											{item.status}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</DashboardCard>
		</div>
	);
}
