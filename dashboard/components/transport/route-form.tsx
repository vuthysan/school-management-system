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
import { Loader2, Plus, X } from "lucide-react";
import type { TransportRoute, Vehicle, RouteStop, TransportStatus } from "@/types/transport";

interface RouteFormProps {
	initialData?: TransportRoute | null;
	vehicles: Vehicle[];
	onSave: (data: {
		name: string;
		vehicleId?: string;
		description?: string;
		stops: RouteStop[];
		status: TransportStatus;
	}) => Promise<void>;
	onCancel: () => void;
	isSaving: boolean;
}

export function RouteForm({ initialData, vehicles, onSave, onCancel, isSaving }: RouteFormProps) {
	const { t } = useTranslation();

	const [name, setName] = useState("");
	const [vehicleId, setVehicleId] = useState("");
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState<TransportStatus>("Active");
	const [stops, setStops] = useState<RouteStop[]>([]);

	useEffect(() => {
		if (initialData) {
			setName(initialData.name);
			setVehicleId(initialData.vehicleId || "");
			setDescription(initialData.description || "");
			setStatus(initialData.status);
			setStops(initialData.stops.length > 0 ? initialData.stops : []);
		} else {
			setName("");
			setVehicleId("");
			setDescription("");
			setStatus("Active");
			setStops([]);
		}
	}, [initialData]);

	const addStop = () => {
		setStops((prev) => [
			...prev,
			{ name: "", pickupTime: "", dropoffTime: "", order: prev.length + 1 },
		]);
	};

	const removeStop = (index: number) => {
		setStops((prev) => prev.filter((_, i) => i !== index).map((s, i) => ({ ...s, order: i + 1 })));
	};

	const updateStop = (index: number, field: keyof RouteStop, value: string | number) => {
		setStops((prev) =>
			prev.map((s, i) => (i === index ? { ...s, [field]: value } : s))
		);
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await onSave({
			name,
			vehicleId: vehicleId || undefined,
			description: description || undefined,
			stops: stops.map((s) => ({
				...s,
				pickupTime: s.pickupTime || undefined,
				dropoffTime: s.dropoffTime || undefined,
			})),
			status,
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="routeName">{t("route_name") || "Route Name"} *</Label>
					<Input
						id="routeName"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder={t("route_name_placeholder") || "e.g. Route A - North"}
						required
						className="h-9"
					/>
				</div>
				<div className="space-y-2">
					<Label>{t("vehicle") || "Vehicle"}</Label>
					<Select value={vehicleId} onValueChange={setVehicleId}>
						<SelectTrigger className="h-9">
							<SelectValue placeholder={t("select_vehicle") || "Select vehicle"} />
						</SelectTrigger>
						<SelectContent>
							{vehicles.map((v) => (
								<SelectItem key={v.id} value={v.id}>
									{v.name} ({v.licensePlate})
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="description">{t("description") || "Description"}</Label>
					<Input
						id="description"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="h-9"
					/>
				</div>
				<div className="space-y-2">
					<Label>{t("status") || "Status"}</Label>
					<Select value={status} onValueChange={(v) => setStatus(v as TransportStatus)}>
						<SelectTrigger className="h-9">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Active">{t("active") || "Active"}</SelectItem>
							<SelectItem value="Inactive">{t("inactive") || "Inactive"}</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>

			{/* Stops */}
			<div className="space-y-3">
				<div className="flex items-center justify-between">
					<Label>{t("stops") || "Stops"}</Label>
					<Button type="button" variant="outline" size="sm" onClick={addStop} className="gap-1.5 h-7 text-xs">
						<Plus className="h-3 w-3" />
						{t("add_stop") || "Add Stop"}
					</Button>
				</div>

				{stops.length > 0 && (
					<div className="space-y-2">
						{stops.map((stop, index) => (
							<div
								key={index}
								className="flex items-center gap-2 p-2.5 rounded-lg border border-black/6 dark:border-white/6 bg-muted/20"
							>
								<span className="text-xs text-muted-foreground font-medium w-5 shrink-0 text-center">
									{stop.order}
								</span>
								<Input
									value={stop.name}
									onChange={(e) => updateStop(index, "name", e.target.value)}
									placeholder={t("stop_name") || "Stop name"}
									className="h-8 flex-1"
								/>
								<Input
									type="time"
									value={stop.pickupTime || ""}
									onChange={(e) => updateStop(index, "pickupTime", e.target.value)}
									className="h-8 w-28"
									title={t("pickup_time") || "Pickup time"}
								/>
								<Input
									type="time"
									value={stop.dropoffTime || ""}
									onChange={(e) => updateStop(index, "dropoffTime", e.target.value)}
									className="h-8 w-28"
									title={t("dropoff_time") || "Dropoff time"}
								/>
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="h-7 w-7 p-0 shrink-0 text-muted-foreground hover:text-destructive"
									onClick={() => removeStop(index)}
								>
									<X className="h-3.5 w-3.5" />
								</Button>
							</div>
						))}
					</div>
				)}
			</div>

			<div className="flex justify-end gap-2 pt-2">
				<Button type="button" variant="ghost" onClick={onCancel} disabled={isSaving}>
					{t("cancel")}
				</Button>
				<Button type="submit" disabled={isSaving || !name}>
					{isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					{initialData ? t("save_changes") || "Save Changes" : t("add_route") || "Add Route"}
				</Button>
			</div>
		</form>
	);
}
