export type VehicleType = "Bus" | "Van" | "Car";
export type TransportStatus = "Active" | "Inactive" | "Pending";

export interface Vehicle {
	id: string;
	schoolId: string;
	name: string;
	licensePlate: string;
	vehicleType: VehicleType;
	capacity: number;
	driverName?: string;
	driverPhone?: string;
	status: TransportStatus;
	notes?: string;
	createdAt: string;
	updatedAt: string;
}

export interface RouteStop {
	name: string;
	pickupTime?: string;
	dropoffTime?: string;
	order: number;
}

export interface TransportRoute {
	id: string;
	schoolId: string;
	name: string;
	vehicleId?: string;
	description?: string;
	stops: RouteStop[];
	status: TransportStatus;
	createdAt: string;
	updatedAt: string;
}

export interface StudentTransportAssignment {
	id: string;
	schoolId: string;
	studentId: string;
	routeId: string;
	pickupStop?: string;
	dropoffStop?: string;
	status: TransportStatus;
	notes?: string;
	createdAt: string;
	updatedAt: string;
}

export interface CreateVehicleInput {
	schoolId: string;
	name: string;
	licensePlate: string;
	vehicleType?: VehicleType;
	capacity: number;
	driverName?: string;
	driverPhone?: string;
	status?: TransportStatus;
	notes?: string;
}

export interface UpdateVehicleInput {
	name?: string;
	licensePlate?: string;
	vehicleType?: VehicleType;
	capacity?: number;
	driverName?: string;
	driverPhone?: string;
	status?: TransportStatus;
	notes?: string;
}

export interface CreateRouteInput {
	schoolId: string;
	name: string;
	vehicleId?: string;
	description?: string;
	stops?: RouteStop[];
	status?: TransportStatus;
}

export interface UpdateRouteInput {
	name?: string;
	vehicleId?: string;
	description?: string;
	stops?: RouteStop[];
	status?: TransportStatus;
}

export interface CreateAssignmentInput {
	schoolId: string;
	studentId: string;
	routeId: string;
	pickupStop?: string;
	dropoffStop?: string;
	status?: TransportStatus;
	notes?: string;
}

export interface UpdateAssignmentInput {
	routeId?: string;
	pickupStop?: string;
	dropoffStop?: string;
	status?: TransportStatus;
	notes?: string;
}
