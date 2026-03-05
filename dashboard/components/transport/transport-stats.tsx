"use client";

import { Bus, MapPin, Users, Armchair } from "lucide-react";
import { StatsCard } from "@/components/dashboard/stats-card";
import { useLanguage } from "@/contexts/language-context";
import type { Vehicle, TransportRoute, StudentTransportAssignment } from "@/types/transport";

interface TransportStatsProps {
	vehicles: Vehicle[];
	routes: TransportRoute[];
	assignments: StudentTransportAssignment[];
}

export function TransportStats({ vehicles, routes, assignments }: TransportStatsProps) {
	const { t } = useLanguage();

	const activeVehicles = vehicles.filter((v) => v.status === "Active").length;
	const activeRoutes = routes.filter((r) => r.status === "Active").length;
	const totalCapacity = vehicles.reduce((sum, v) => sum + v.capacity, 0);

	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
			<StatsCard
				title={t("total_vehicles") || "Total Vehicles"}
				value={vehicles.length}
				subtitle={`${activeVehicles} ${t("active") || "active"}`}
				icon={Bus}
				color="blue"
				delay={0}
			/>
			<StatsCard
				title={t("active_routes") || "Active Routes"}
				value={activeRoutes}
				subtitle={`${routes.length} ${t("total") || "total"}`}
				icon={MapPin}
				color="emerald"
				delay={0.05}
			/>
			<StatsCard
				title={t("assigned_students") || "Assigned Students"}
				value={assignments.length}
				icon={Users}
				color="violet"
				delay={0.1}
			/>
			<StatsCard
				title={t("total_capacity") || "Total Capacity"}
				value={totalCapacity}
				subtitle={`${vehicles.length} ${t("vehicles") || "vehicles"}`}
				icon={Armchair}
				color="amber"
				delay={0.15}
			/>
		</div>
	);
}
