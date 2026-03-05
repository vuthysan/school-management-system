use crate::models::transport::{RouteStop, StudentTransportAssignment, TransportRoute, Vehicle, VehicleType};
use crate::utils::common_types::Status;
use async_graphql::*;

// ============================================================================
// VEHICLE
// ============================================================================

#[derive(SimpleObject)]
pub struct VehicleGqlType {
    pub id: String,
    pub school_id: String,
    pub name: String,
    pub license_plate: String,
    pub vehicle_type: VehicleType,
    pub capacity: i32,
    pub driver_name: Option<String>,
    pub driver_phone: Option<String>,
    pub status: Status,
    pub notes: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

impl From<Vehicle> for VehicleGqlType {
    fn from(v: Vehicle) -> Self {
        Self {
            id: v.id.map(|id| id.to_hex()).unwrap_or_default(),
            school_id: v.school_id,
            name: v.name,
            license_plate: v.license_plate,
            vehicle_type: v.vehicle_type,
            capacity: v.capacity,
            driver_name: v.driver_name,
            driver_phone: v.driver_phone,
            status: v.status,
            notes: v.notes,
            created_at: v.audit.created_at_str().unwrap_or_default(),
            updated_at: v.audit.updated_at_str().unwrap_or_default(),
        }
    }
}

#[derive(SimpleObject)]
pub struct PaginatedVehiclesResult {
    pub items: Vec<VehicleGqlType>,
    pub total: u64,
    pub page: u64,
    pub total_pages: u64,
}

// ============================================================================
// ROUTE
// ============================================================================

#[derive(SimpleObject)]
pub struct RouteGqlType {
    pub id: String,
    pub school_id: String,
    pub name: String,
    pub vehicle_id: Option<String>,
    pub description: Option<String>,
    pub stops: Vec<RouteStop>,
    pub status: Status,
    pub created_at: String,
    pub updated_at: String,
}

impl From<TransportRoute> for RouteGqlType {
    fn from(r: TransportRoute) -> Self {
        Self {
            id: r.id.map(|id| id.to_hex()).unwrap_or_default(),
            school_id: r.school_id,
            name: r.name,
            vehicle_id: r.vehicle_id,
            description: r.description,
            stops: r.stops,
            status: r.status,
            created_at: r.audit.created_at_str().unwrap_or_default(),
            updated_at: r.audit.updated_at_str().unwrap_or_default(),
        }
    }
}

#[derive(SimpleObject)]
pub struct PaginatedRoutesResult {
    pub items: Vec<RouteGqlType>,
    pub total: u64,
    pub page: u64,
    pub total_pages: u64,
}

// ============================================================================
// ASSIGNMENT
// ============================================================================

#[derive(SimpleObject)]
pub struct AssignmentGqlType {
    pub id: String,
    pub school_id: String,
    pub student_id: String,
    pub route_id: String,
    pub pickup_stop: Option<String>,
    pub dropoff_stop: Option<String>,
    pub status: Status,
    pub notes: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

impl From<StudentTransportAssignment> for AssignmentGqlType {
    fn from(a: StudentTransportAssignment) -> Self {
        Self {
            id: a.id.map(|id| id.to_hex()).unwrap_or_default(),
            school_id: a.school_id,
            student_id: a.student_id,
            route_id: a.route_id,
            pickup_stop: a.pickup_stop,
            dropoff_stop: a.dropoff_stop,
            status: a.status,
            notes: a.notes,
            created_at: a.audit.created_at_str().unwrap_or_default(),
            updated_at: a.audit.updated_at_str().unwrap_or_default(),
        }
    }
}

#[derive(SimpleObject)]
pub struct PaginatedAssignmentsResult {
    pub items: Vec<AssignmentGqlType>,
    pub total: u64,
    pub page: u64,
    pub total_pages: u64,
}
