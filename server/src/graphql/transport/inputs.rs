use crate::models::transport::VehicleType;
use crate::utils::common_types::Status;
use async_graphql::*;

#[derive(InputObject)]
pub struct VehicleFilterInput {
    pub search: Option<String>,
    pub vehicle_type: Option<VehicleType>,
    pub status: Option<Status>,
}

#[derive(InputObject)]
pub struct RouteFilterInput {
    pub search: Option<String>,
    pub vehicle_id: Option<String>,
    pub status: Option<Status>,
}

#[derive(InputObject)]
pub struct AssignmentFilterInput {
    pub search: Option<String>,
    pub route_id: Option<String>,
    pub student_id: Option<String>,
    pub status: Option<Status>,
}
