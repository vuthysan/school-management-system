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
import type { Vehicle, VehicleType, TransportStatus } from "@/types/transport";

interface VehicleFormProps {
	initialData?: Vehicle | null;
	onSave: (data: {
		name: string;
		licensePlate: string;
		vehicleType: VehicleType;
		capacity: number;
		driverName?: string;
		driverPhone?: string;
		status: TransportStatus;
		notes?: string;
	}) => Promise<void>;
	onCancel: () => void;
	isSaving: boolean;
}

export function VehicleForm({ initialData, onSave, onCancel, isSaving }: VehicleFormProps) {
	const { t } = useTranslation();

	const [name, setName] = useState("");
	const [licensePlate, setLicensePlate] = useState("");
	const [vehicleType, setVehicleType] = useState<VehicleType>("Bus");
	const [capacity, setCapacity] = useState(40);
	const [driverName, setDriverName] = useState("");
	const [driverPhone, setDriverPhone] = useState("");
	const [status, setStatus] = useState<TransportStatus>("Active");
	const [notes, setNotes] = useState("");

	useEffect(() => {
		if (initialData) {
			setName(initialData.name);
			setLicensePlate(initialData.licensePlate);
			setVehicleType(initialData.vehicleType);
			setCapacity(initialData.capacity);
			setDriverName(initialData.driverName || "");
			setDriverPhone(initialData.driverPhone || "");
			setStatus(initialData.status);
			setNotes(initialData.notes || "");
		} else {
			setName("");
			setLicensePlate("");
			setVehicleType("Bus");
			setCapacity(40);
			setDriverName("");
			setDriverPhone("");
			setStatus("Active");
			setNotes("");
		}
	}, [initialData]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await onSave({
			name,
			licensePlate,
			vehicleType,
			capacity,
			driverName: driverName || undefined,
			driverPhone: driverPhone || undefined,
			status,
			notes: notes || undefined,
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="name">{t("vehicle_name") || "Vehicle Name"} *</Label>
					<Input
						id="name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder={t("vehicle_name_placeholder") || "e.g. Bus 1"}
						required
						className="h-9"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="licensePlate">{t("license_plate") || "License Plate"} *</Label>
					<Input
						id="licensePlate"
						value={licensePlate}
						onChange={(e) => setLicensePlate(e.target.value)}
						placeholder={t("license_plate_placeholder") || "e.g. PP-1234"}
						required
						className="h-9"
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label>{t("vehicle_type") || "Vehicle Type"}</Label>
					<Select value={vehicleType} onValueChange={(v) => setVehicleType(v as VehicleType)}>
						<SelectTrigger className="h-9">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="Bus">{t("bus") || "Bus"}</SelectItem>
							<SelectItem value="Van">{t("van") || "Van"}</SelectItem>
							<SelectItem value="Car">{t("car") || "Car"}</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label htmlFor="capacity">{t("capacity") || "Capacity"} *</Label>
					<Input
						id="capacity"
						type="number"
						value={capacity}
						onChange={(e) => setCapacity(parseInt(e.target.value) || 0)}
						min={1}
						required
						className="h-9"
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="driverName">{t("driver_name") || "Driver Name"}</Label>
					<Input
						id="driverName"
						value={driverName}
						onChange={(e) => setDriverName(e.target.value)}
						className="h-9"
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="driverPhone">{t("driver_phone") || "Driver Phone"}</Label>
					<Input
						id="driverPhone"
						value={driverPhone}
						onChange={(e) => setDriverPhone(e.target.value)}
						className="h-9"
					/>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
				<div className="space-y-2">
					<Label htmlFor="notes">{t("notes") || "Notes"}</Label>
					<Input
						id="notes"
						value={notes}
						onChange={(e) => setNotes(e.target.value)}
						className="h-9"
					/>
				</div>
			</div>

			<div className="flex justify-end gap-2 pt-2">
				<Button type="button" variant="ghost" onClick={onCancel} disabled={isSaving}>
					{t("cancel")}
				</Button>
				<Button type="submit" disabled={isSaving || !name || !licensePlate}>
					{isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					{initialData ? t("save_changes") || "Save Changes" : t("add_vehicle") || "Add Vehicle"}
				</Button>
			</div>
		</form>
	);
}
