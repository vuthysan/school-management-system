// Transport GraphQL Queries and Mutations

export const VEHICLE_FIELDS = `
	id
	schoolId
	name
	licensePlate
	vehicleType
	capacity
	driverName
	driverPhone
	status
	notes
	createdAt
	updatedAt
`;

export const ROUTE_FIELDS = `
	id
	schoolId
	name
	vehicleId
	description
	stops {
		name
		pickupTime
		dropoffTime
		order
	}
	status
	createdAt
	updatedAt
`;

export const ASSIGNMENT_FIELDS = `
	id
	schoolId
	studentId
	routeId
	pickupStop
	dropoffStop
	status
	notes
	createdAt
	updatedAt
`;

export const TRANSPORT_QUERIES = {
	GET_VEHICLES: `
		query GetVehicles($schoolId: String!, $page: Int, $pageSize: Int, $filter: VehicleFilterInput) {
			vehicles(schoolId: $schoolId, page: $page, pageSize: $pageSize, filter: $filter) {
				items {
					${VEHICLE_FIELDS}
				}
				total
				page
				totalPages
			}
		}
	`,

	GET_VEHICLE: `
		query GetVehicle($id: String!) {
			vehicle(id: $id) {
				${VEHICLE_FIELDS}
			}
		}
	`,

	GET_ROUTES: `
		query GetTransportRoutes($schoolId: String!, $page: Int, $pageSize: Int, $filter: RouteFilterInput) {
			transportRoutes(schoolId: $schoolId, page: $page, pageSize: $pageSize, filter: $filter) {
				items {
					${ROUTE_FIELDS}
				}
				total
				page
				totalPages
			}
		}
	`,

	GET_ROUTE: `
		query GetTransportRoute($id: String!) {
			transportRoute(id: $id) {
				${ROUTE_FIELDS}
			}
		}
	`,

	GET_ASSIGNMENTS: `
		query GetTransportAssignments($schoolId: String!, $page: Int, $pageSize: Int, $filter: AssignmentFilterInput) {
			transportAssignments(schoolId: $schoolId, page: $page, pageSize: $pageSize, filter: $filter) {
				items {
					${ASSIGNMENT_FIELDS}
				}
				total
				page
				totalPages
			}
		}
	`,
};

export const TRANSPORT_MUTATIONS = {
	CREATE_VEHICLE: `
		mutation CreateVehicle($input: CreateVehicleInput!) {
			createVehicle(input: $input) {
				${VEHICLE_FIELDS}
			}
		}
	`,

	UPDATE_VEHICLE: `
		mutation UpdateVehicle($id: String!, $input: UpdateVehicleInput!) {
			updateVehicle(id: $id, input: $input) {
				${VEHICLE_FIELDS}
			}
		}
	`,

	DELETE_VEHICLE: `
		mutation DeleteVehicle($id: String!) {
			deleteVehicle(id: $id)
		}
	`,

	CREATE_ROUTE: `
		mutation CreateTransportRoute($input: CreateRouteInput!) {
			createTransportRoute(input: $input) {
				${ROUTE_FIELDS}
			}
		}
	`,

	UPDATE_ROUTE: `
		mutation UpdateTransportRoute($id: String!, $input: UpdateRouteInput!) {
			updateTransportRoute(id: $id, input: $input) {
				${ROUTE_FIELDS}
			}
		}
	`,

	DELETE_ROUTE: `
		mutation DeleteTransportRoute($id: String!) {
			deleteTransportRoute(id: $id)
		}
	`,

	CREATE_ASSIGNMENT: `
		mutation CreateTransportAssignment($input: CreateAssignmentInput!) {
			createTransportAssignment(input: $input) {
				${ASSIGNMENT_FIELDS}
			}
		}
	`,

	UPDATE_ASSIGNMENT: `
		mutation UpdateTransportAssignment($id: String!, $input: UpdateAssignmentInput!) {
			updateTransportAssignment(id: $id, input: $input) {
				${ASSIGNMENT_FIELDS}
			}
		}
	`,

	DELETE_ASSIGNMENT: `
		mutation DeleteTransportAssignment($id: String!) {
			deleteTransportAssignment(id: $id)
		}
	`,
};
