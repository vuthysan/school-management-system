use crate::graphql::transport::inputs::{AssignmentFilterInput, RouteFilterInput, VehicleFilterInput};
use crate::graphql::transport::types::{
    AssignmentGqlType, PaginatedAssignmentsResult, PaginatedRoutesResult, PaginatedVehiclesResult,
    RouteGqlType, VehicleGqlType,
};
use crate::models::transport::{StudentTransportAssignment, TransportRoute, Vehicle};
use async_graphql::*;
use mongodb::{
    bson::{doc, oid::ObjectId},
    options::FindOptions,
    Database,
};

#[derive(Default)]
pub struct TransportQuery;

#[Object]
impl TransportQuery {
    // ========================================================================
    // VEHICLES
    // ========================================================================

    async fn vehicles(
        &self,
        ctx: &Context<'_>,
        school_id: String,
        page: Option<u64>,
        page_size: Option<u64>,
        filter: Option<VehicleFilterInput>,
    ) -> Result<PaginatedVehiclesResult> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Vehicle>("vehicles");

        let mut query = doc! {
            "school_id": &school_id,
            "soft_delete.is_deleted": false
        };

        if let Some(f) = filter {
            if let Some(search) = f.search {
                query.insert("name", doc! { "$regex": search, "$options": "i" });
            }
            if let Some(vehicle_type) = f.vehicle_type {
                query.insert("vehicle_type", mongodb::bson::to_bson(&vehicle_type)?);
            }
            if let Some(status) = f.status {
                query.insert("status", mongodb::bson::to_bson(&status)?);
            }
        }

        let page = page.unwrap_or(1);
        let page_size = page_size.unwrap_or(10);
        let skip = (page - 1) * page_size;

        let total = collection.count_documents(query.clone(), None).await?;
        let total_pages = (total as f64 / page_size as f64).ceil() as u64;

        let find_options = FindOptions::builder()
            .skip(skip)
            .limit(page_size as i64)
            .sort(doc! { "name": 1 })
            .build();

        let mut cursor = collection.find(query, find_options).await?;
        let mut items = Vec::new();

        while cursor.advance().await? {
            items.push(VehicleGqlType::from(cursor.deserialize_current()?));
        }

        Ok(PaginatedVehiclesResult {
            items,
            total,
            page,
            total_pages,
        })
    }

    async fn vehicle(&self, ctx: &Context<'_>, id: String) -> Result<Option<VehicleGqlType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Vehicle>("vehicles");

        let obj_id = ObjectId::parse_str(&id)?;
        let vehicle = collection
            .find_one(
                doc! { "_id": obj_id, "soft_delete.is_deleted": false },
                None,
            )
            .await?;

        Ok(vehicle.map(VehicleGqlType::from))
    }

    // ========================================================================
    // ROUTES
    // ========================================================================

    async fn transport_routes(
        &self,
        ctx: &Context<'_>,
        school_id: String,
        page: Option<u64>,
        page_size: Option<u64>,
        filter: Option<RouteFilterInput>,
    ) -> Result<PaginatedRoutesResult> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<TransportRoute>("transport_routes");

        let mut query = doc! {
            "school_id": &school_id,
            "soft_delete.is_deleted": false
        };

        if let Some(f) = filter {
            if let Some(search) = f.search {
                query.insert("name", doc! { "$regex": search, "$options": "i" });
            }
            if let Some(vehicle_id) = f.vehicle_id {
                query.insert("vehicle_id", vehicle_id);
            }
            if let Some(status) = f.status {
                query.insert("status", mongodb::bson::to_bson(&status)?);
            }
        }

        let page = page.unwrap_or(1);
        let page_size = page_size.unwrap_or(10);
        let skip = (page - 1) * page_size;

        let total = collection.count_documents(query.clone(), None).await?;
        let total_pages = (total as f64 / page_size as f64).ceil() as u64;

        let find_options = FindOptions::builder()
            .skip(skip)
            .limit(page_size as i64)
            .sort(doc! { "name": 1 })
            .build();

        let mut cursor = collection.find(query, find_options).await?;
        let mut items = Vec::new();

        while cursor.advance().await? {
            items.push(RouteGqlType::from(cursor.deserialize_current()?));
        }

        Ok(PaginatedRoutesResult {
            items,
            total,
            page,
            total_pages,
        })
    }

    async fn transport_route(
        &self,
        ctx: &Context<'_>,
        id: String,
    ) -> Result<Option<RouteGqlType>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<TransportRoute>("transport_routes");

        let obj_id = ObjectId::parse_str(&id)?;
        let route = collection
            .find_one(
                doc! { "_id": obj_id, "soft_delete.is_deleted": false },
                None,
            )
            .await?;

        Ok(route.map(RouteGqlType::from))
    }

    // ========================================================================
    // ASSIGNMENTS
    // ========================================================================

    async fn transport_assignments(
        &self,
        ctx: &Context<'_>,
        school_id: String,
        page: Option<u64>,
        page_size: Option<u64>,
        filter: Option<AssignmentFilterInput>,
    ) -> Result<PaginatedAssignmentsResult> {
        let db = ctx.data::<Database>()?;
        let collection =
            db.collection::<StudentTransportAssignment>("transport_assignments");

        let mut query = doc! {
            "school_id": &school_id,
            "soft_delete.is_deleted": false
        };

        if let Some(f) = filter {
            if let Some(route_id) = f.route_id {
                query.insert("route_id", route_id);
            }
            if let Some(student_id) = f.student_id {
                query.insert("student_id", student_id);
            }
            if let Some(status) = f.status {
                query.insert("status", mongodb::bson::to_bson(&status)?);
            }
        }

        let page = page.unwrap_or(1);
        let page_size = page_size.unwrap_or(10);
        let skip = (page - 1) * page_size;

        let total = collection.count_documents(query.clone(), None).await?;
        let total_pages = (total as f64 / page_size as f64).ceil() as u64;

        let find_options = FindOptions::builder()
            .skip(skip)
            .limit(page_size as i64)
            .sort(doc! { "audit.created_at": -1 })
            .build();

        let mut cursor = collection.find(query, find_options).await?;
        let mut items = Vec::new();

        while cursor.advance().await? {
            items.push(AssignmentGqlType::from(cursor.deserialize_current()?));
        }

        Ok(PaginatedAssignmentsResult {
            items,
            total,
            page,
            total_pages,
        })
    }

    async fn transport_assignment(
        &self,
        ctx: &Context<'_>,
        id: String,
    ) -> Result<Option<AssignmentGqlType>> {
        let db = ctx.data::<Database>()?;
        let collection =
            db.collection::<StudentTransportAssignment>("transport_assignments");

        let obj_id = ObjectId::parse_str(&id)?;
        let assignment = collection
            .find_one(
                doc! { "_id": obj_id, "soft_delete.is_deleted": false },
                None,
            )
            .await?;

        Ok(assignment.map(AssignmentGqlType::from))
    }
}
