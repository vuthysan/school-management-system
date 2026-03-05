"use client";

import { useState } from "react";
import {
	Plus,
	Bus,
	AlertCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import {
	useVehicles,
	useVehicleMutations,
	useTransportRoutes,
	useRouteMutations,
	useTransportAssignments,
	useAssignmentMutations,
} from "@/hooks/useTransport";
import { TransportStats } from "@/components/transport/transport-stats";
import { VehiclesTable } from "@/components/transport/vehicles-table";
import { RoutesTable } from "@/components/transport/routes-table";
import { AssignmentsTable } from "@/components/transport/assignments-table";
import { VehicleForm } from "@/components/transport/vehicle-form";
import { RouteForm } from "@/components/transport/route-form";
import type {
	Vehicle,
	TransportRoute,
	StudentTransportAssignment,
	TransportStatus,
} from "@/types/transport";

export default function TransportPage() {
	const { t } = useTranslation();
	const { currentSchool, isLoading: isDashboardLoading } = useDashboard();
	const schoolId = currentSchool?.idStr || currentSchool?.id || null;

	const [activeTab, setActiveTab] = useState<"vehicles" | "routes" | "assignments">("vehicles");
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [isDeleteOpen, setIsDeleteOpen] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
	const [selectedRoute, setSelectedRoute] = useState<TransportRoute | null>(null);
	const [selectedAssignment, setSelectedAssignment] = useState<StudentTransportAssignment | null>(null);

	// Data hooks
	const { vehicles, isLoading: isVehiclesLoading, error: vehiclesError, refresh: refreshVehicles } = useVehicles(schoolId);
	const { routes, isLoading: isRoutesLoading, error: routesError, refresh: refreshRoutes } = useTransportRoutes(schoolId);
	const { assignments, isLoading: isAssignmentsLoading, error: assignmentsError, refresh: refreshAssignments } = useTransportAssignments(schoolId);

	// Mutation hooks
	const { createVehicle, updateVehicle, deleteVehicle } = useVehicleMutations();
	const { createRoute, updateRoute, deleteRoute } = useRouteMutations();
	const { createAssignment, updateAssignment, deleteAssignment } = useAssignmentMutations();

	// ========================================================================
	// HANDLERS
	// ========================================================================

	const handleAddNew = () => {
		setSelectedVehicle(null);
		setSelectedRoute(null);
		setSelectedAssignment(null);
		setIsFormOpen(true);
	};

	const handleEditVehicle = (item: Vehicle) => {
		setSelectedVehicle(item);
		setIsFormOpen(true);
	};
	const handleEditRoute = (item: TransportRoute) => {
		setSelectedRoute(item);
		setIsFormOpen(true);
	};
	const handleEditAssignment = (item: StudentTransportAssignment) => {
		setSelectedAssignment(item);
		setIsFormOpen(true);
	};

	const handleDeleteVehicle = (item: Vehicle) => {
		setSelectedVehicle(item);
		setIsDeleteOpen(true);
	};
	const handleDeleteRoute = (item: TransportRoute) => {
		setSelectedRoute(item);
		setIsDeleteOpen(true);
	};
	const handleDeleteAssignment = (item: StudentTransportAssignment) => {
		setSelectedAssignment(item);
		setIsDeleteOpen(true);
	};

	const onConfirmDelete = async () => {
		if (!schoolId) return;
		setIsSubmitting(true);
		try {
			if (activeTab === "vehicles" && selectedVehicle) {
				await deleteVehicle(selectedVehicle.id);
				refreshVehicles();
			} else if (activeTab === "routes" && selectedRoute) {
				await deleteRoute(selectedRoute.id);
				refreshRoutes();
			} else if (activeTab === "assignments" && selectedAssignment) {
				await deleteAssignment(selectedAssignment.id);
				refreshAssignments();
			}
			setIsDeleteOpen(false);
		} catch (err) {
			console.error("Delete failed", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const onVehicleSave = async (values: any) => {
		if (!schoolId) return;
		setIsSubmitting(true);
		try {
			if (selectedVehicle) {
				await updateVehicle(selectedVehicle.id, values);
			} else {
				await createVehicle({ ...values, schoolId });
			}
			refreshVehicles();
			setIsFormOpen(false);
		} catch (err) {
			console.error("Vehicle save failed", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const onRouteSave = async (values: any) => {
		if (!schoolId) return;
		setIsSubmitting(true);
		try {
			if (selectedRoute) {
				await updateRoute(selectedRoute.id, values);
			} else {
				await createRoute({ ...values, schoolId });
			}
			refreshRoutes();
			setIsFormOpen(false);
		} catch (err) {
			console.error("Route save failed", err);
		} finally {
			setIsSubmitting(false);
		}
	};

	const onAssignmentSave = async (values: any) => {
		if (!schoolId) return;
		setIsSubmitting(true);
		try {
			if (selectedAssignment) {
				await updateAssignment(selectedAssignment.id, values);
			} else {
				await createAssignment({ ...values, schoolId });
			}
			refreshAssignments();
			setIsFormOpen(false);
		} catch (err) {
			console.error("Assignment save failed", err);
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
				title={t("transport_management") || "Transport Management"}
				subtitle={t("manage_transport_subtitle") || "Manage vehicles, routes, and student assignments"}
				icon={Bus}
			>
				<Button onClick={handleAddNew} size="sm" className="gap-2">
					<Plus className="h-4 w-4" />
					{activeTab === "vehicles"
						? t("add_vehicle") || "Add Vehicle"
						: activeTab === "routes"
							? t("add_route") || "Add Route"
							: t("add_assignment") || "Add Assignment"}
				</Button>
			</PageHeader>

			{/* Stats */}
			<TransportStats
				vehicles={vehicles}
				routes={routes}
				assignments={assignments}
			/>

			{/* Tabs */}
			<Tabs
				value={activeTab}
				onValueChange={(v) => setActiveTab(v as any)}
			>
				<TabsList>
					<TabsTrigger value="vehicles">{t("vehicles") || "Vehicles"}</TabsTrigger>
					<TabsTrigger value="routes">{t("routes") || "Routes"}</TabsTrigger>
					<TabsTrigger value="assignments">{t("assignments") || "Assignments"}</TabsTrigger>
				</TabsList>

				<TabsContent value="vehicles">
					{vehiclesError ? (
						<div className="min-h-[40vh] flex items-center justify-center">
							<div className="text-center space-y-3">
								<p className="text-sm text-destructive">{vehiclesError}</p>
								<Button variant="outline" size="sm" onClick={refreshVehicles}>{t("retry") || "Retry"}</Button>
							</div>
						</div>
					) : (
						<VehiclesTable
							vehicles={vehicles}
							isLoading={isVehiclesLoading}
							onEdit={handleEditVehicle}
							onDelete={handleDeleteVehicle}
						/>
					)}
				</TabsContent>

				<TabsContent value="routes">
					{routesError ? (
						<div className="min-h-[40vh] flex items-center justify-center">
							<div className="text-center space-y-3">
								<p className="text-sm text-destructive">{routesError}</p>
								<Button variant="outline" size="sm" onClick={refreshRoutes}>{t("retry") || "Retry"}</Button>
							</div>
						</div>
					) : (
						<RoutesTable
							routes={routes}
							vehicles={vehicles}
							isLoading={isRoutesLoading}
							onEdit={handleEditRoute}
							onDelete={handleDeleteRoute}
						/>
					)}
				</TabsContent>

				<TabsContent value="assignments">
					{assignmentsError ? (
						<div className="min-h-[40vh] flex items-center justify-center">
							<div className="text-center space-y-3">
								<p className="text-sm text-destructive">{assignmentsError}</p>
								<Button variant="outline" size="sm" onClick={refreshAssignments}>{t("retry") || "Retry"}</Button>
							</div>
						</div>
					) : (
						<AssignmentsTable
							assignments={assignments}
							routes={routes}
							isLoading={isAssignmentsLoading}
							onEdit={handleEditAssignment}
							onDelete={handleDeleteAssignment}
						/>
					)}
				</TabsContent>
			</Tabs>

			{/* Form Modal */}
			<Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>
							{activeTab === "vehicles"
								? (selectedVehicle ? t("edit_vehicle") || "Edit Vehicle" : t("add_vehicle") || "Add Vehicle")
								: activeTab === "routes"
									? (selectedRoute ? t("edit_route") || "Edit Route" : t("add_route") || "Add Route")
									: (selectedAssignment ? t("edit_assignment") || "Edit Assignment" : t("add_assignment") || "Add Assignment")}
						</DialogTitle>
						<DialogDescription>{t("fill_form_details") || "Fill in the details below."}</DialogDescription>
					</DialogHeader>

					{activeTab === "vehicles" ? (
						<VehicleForm
							initialData={selectedVehicle}
							onSave={onVehicleSave}
							onCancel={() => setIsFormOpen(false)}
							isSaving={isSubmitting}
						/>
					) : activeTab === "routes" ? (
						<RouteForm
							initialData={selectedRoute}
							vehicles={vehicles}
							onSave={onRouteSave}
							onCancel={() => setIsFormOpen(false)}
							isSaving={isSubmitting}
						/>
					) : (
						// Assignment form - inline simple form
						<AssignmentInlineForm
							initialData={selectedAssignment}
							routes={routes}
							onSave={onAssignmentSave}
							onCancel={() => setIsFormOpen(false)}
							isSaving={isSubmitting}
						/>
					)}
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

// ============================================================================
// INLINE ASSIGNMENT FORM
// ============================================================================

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

function AssignmentInlineForm({
	initialData,
	routes,
	onSave,
	onCancel,
	isSaving,
}: {
	initialData?: StudentTransportAssignment | null;
	routes: TransportRoute[];
	onSave: (data: any) => Promise<void>;
	onCancel: () => void;
	isSaving: boolean;
}) {
	const { t } = useTranslation();

	const [studentId, setStudentId] = useState(initialData?.studentId || "");
	const [routeId, setRouteId] = useState(initialData?.routeId || "");
	const [pickupStop, setPickupStop] = useState(initialData?.pickupStop || "");
	const [dropoffStop, setDropoffStop] = useState(initialData?.dropoffStop || "");
	const [status, setStatus] = useState(initialData?.status || "Active");
	const [notes, setNotes] = useState(initialData?.notes || "");

	const selectedRouteObj = routes.find((r) => r.id === routeId);
	const stopNames = selectedRouteObj?.stops.map((s) => s.name) || [];

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		await onSave({
			studentId,
			routeId,
			pickupStop: pickupStop || undefined,
			dropoffStop: dropoffStop || undefined,
			status,
			notes: notes || undefined,
		});
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-4">
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="studentId">{t("student_id") || "Student ID"} *</Label>
					<Input
						id="studentId"
						value={studentId}
						onChange={(e) => setStudentId(e.target.value)}
						required
						disabled={!!initialData}
						className="h-9"
					/>
				</div>
				<div className="space-y-2">
					<Label>{t("route") || "Route"} *</Label>
					<Select value={routeId} onValueChange={(v) => { setRouteId(v); setPickupStop(""); setDropoffStop(""); }}>
						<SelectTrigger className="h-9">
							<SelectValue placeholder={t("select_route") || "Select route"} />
						</SelectTrigger>
						<SelectContent>
							{routes.map((r) => (
								<SelectItem key={r.id} value={r.id}>
									{r.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
			</div>

			<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label>{t("pickup_stop") || "Pickup Stop"}</Label>
					<Select value={pickupStop} onValueChange={setPickupStop}>
						<SelectTrigger className="h-9">
							<SelectValue placeholder={t("select_stop") || "Select stop"} />
						</SelectTrigger>
						<SelectContent>
							{stopNames.map((name) => (
								<SelectItem key={name} value={name}>
									{name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="space-y-2">
					<Label>{t("dropoff_stop") || "Dropoff Stop"}</Label>
					<Select value={dropoffStop} onValueChange={setDropoffStop}>
						<SelectTrigger className="h-9">
							<SelectValue placeholder={t("select_stop") || "Select stop"} />
						</SelectTrigger>
						<SelectContent>
							{stopNames.map((name) => (
								<SelectItem key={name} value={name}>
									{name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
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
					<Label htmlFor="assignmentNotes">{t("notes") || "Notes"}</Label>
					<Input
						id="assignmentNotes"
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
				<Button type="submit" disabled={isSaving || !studentId || !routeId}>
					{isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
					{initialData ? t("save_changes") || "Save Changes" : t("add_assignment") || "Add Assignment"}
				</Button>
			</div>
		</form>
	);
}
