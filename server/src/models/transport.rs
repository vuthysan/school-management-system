use crate::utils::common_types::{AuditInfo, SoftDelete, Status};
use async_graphql::*;
use mongodb::bson::oid::ObjectId;
use serde::{Deserialize, Serialize};

// ============================================================================
// ENUMS
// ============================================================================

#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
pub enum VehicleType {
    #[graphql(name = "Bus")]
    Bus,
    #[graphql(name = "Van")]
    Van,
    #[graphql(name = "Car")]
    Car,
}

impl Default for VehicleType {
    fn default() -> Self {
        VehicleType::Bus
    }
}

// ============================================================================
// VEHICLE
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject)]
#[graphql(complex)]
pub struct Vehicle {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    #[graphql(skip)]
    pub id: Option<ObjectId>,
    pub school_id: String,
    pub name: String,
    pub license_plate: String,
    pub vehicle_type: VehicleType,
    pub capacity: i32,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub driver_name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub driver_phone: Option<String>,
    pub status: Status,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub notes: Option<String>,
    pub audit: AuditInfo,
    pub soft_delete: SoftDelete,
}

#[async_graphql::ComplexObject]
impl Vehicle {
    async fn id(&self) -> Option<String> {
        self.id.map(|oid| oid.to_hex())
    }
}

impl Vehicle {
    pub fn new(school_id: String, name: String, license_plate: String, capacity: i32) -> Self {
        Self {
            id: None,
            school_id,
            name,
            license_plate,
            vehicle_type: VehicleType::Bus,
            capacity,
            driver_name: None,
            driver_phone: None,
            status: Status::Active,
            notes: None,
            audit: AuditInfo::new(None),
            soft_delete: SoftDelete::default(),
        }
    }
}

// ============================================================================
// ROUTE STOP (embedded sub-document)
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject, InputObject)]
#[graphql(input_name = "RouteStopInput")]
pub struct RouteStop {
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub pickup_time: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub dropoff_time: Option<String>,
    pub order: i32,
}

// ============================================================================
// ROUTE
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject)]
#[graphql(complex)]
pub struct TransportRoute {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    #[graphql(skip)]
    pub id: Option<ObjectId>,
    pub school_id: String,
    pub name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub vehicle_id: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    #[serde(default)]
    pub stops: Vec<RouteStop>,
    pub status: Status,
    pub audit: AuditInfo,
    pub soft_delete: SoftDelete,
}

#[async_graphql::ComplexObject]
impl TransportRoute {
    async fn id(&self) -> Option<String> {
        self.id.map(|oid| oid.to_hex())
    }
}

impl TransportRoute {
    pub fn new(school_id: String, name: String) -> Self {
        Self {
            id: None,
            school_id,
            name,
            vehicle_id: None,
            description: None,
            stops: Vec::new(),
            status: Status::Active,
            audit: AuditInfo::new(None),
            soft_delete: SoftDelete::default(),
        }
    }
}

// ============================================================================
// STUDENT TRANSPORT ASSIGNMENT
// ============================================================================

#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject)]
#[graphql(complex)]
pub struct StudentTransportAssignment {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    #[graphql(skip)]
    pub id: Option<ObjectId>,
    pub school_id: String,
    pub student_id: String,
    pub route_id: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub pickup_stop: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub dropoff_stop: Option<String>,
    pub status: Status,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub notes: Option<String>,
    pub audit: AuditInfo,
    pub soft_delete: SoftDelete,
}

#[async_graphql::ComplexObject]
impl StudentTransportAssignment {
    async fn id(&self) -> Option<String> {
        self.id.map(|oid| oid.to_hex())
    }
}

impl StudentTransportAssignment {
    pub fn new(school_id: String, student_id: String, route_id: String) -> Self {
        Self {
            id: None,
            school_id,
            student_id,
            route_id,
            pickup_stop: None,
            dropoff_stop: None,
            status: Status::Active,
            notes: None,
            audit: AuditInfo::new(None),
            soft_delete: SoftDelete::default(),
        }
    }
}

// ============================================================================
// INPUT TYPES
// ============================================================================

#[derive(InputObject)]
pub struct CreateVehicleInput {
    pub school_id: String,
    pub name: String,
    pub license_plate: String,
    pub vehicle_type: Option<VehicleType>,
    pub capacity: i32,
    pub driver_name: Option<String>,
    pub driver_phone: Option<String>,
    pub status: Option<Status>,
    pub notes: Option<String>,
}

#[derive(InputObject)]
pub struct UpdateVehicleInput {
    pub name: Option<String>,
    pub license_plate: Option<String>,
    pub vehicle_type: Option<VehicleType>,
    pub capacity: Option<i32>,
    pub driver_name: Option<String>,
    pub driver_phone: Option<String>,
    pub status: Option<Status>,
    pub notes: Option<String>,
}

#[derive(InputObject)]
pub struct CreateRouteInput {
    pub school_id: String,
    pub name: String,
    pub vehicle_id: Option<String>,
    pub description: Option<String>,
    pub stops: Option<Vec<RouteStop>>,
    pub status: Option<Status>,
}

#[derive(InputObject)]
pub struct UpdateRouteInput {
    pub name: Option<String>,
    pub vehicle_id: Option<String>,
    pub description: Option<String>,
    pub stops: Option<Vec<RouteStop>>,
    pub status: Option<Status>,
}

#[derive(InputObject)]
pub struct CreateAssignmentInput {
    pub school_id: String,
    pub student_id: String,
    pub route_id: String,
    pub pickup_stop: Option<String>,
    pub dropoff_stop: Option<String>,
    pub status: Option<Status>,
    pub notes: Option<String>,
}

#[derive(InputObject)]
pub struct UpdateAssignmentInput {
    pub route_id: Option<String>,
    pub pickup_stop: Option<String>,
    pub dropoff_stop: Option<String>,
    pub status: Option<Status>,
    pub notes: Option<String>,
}
