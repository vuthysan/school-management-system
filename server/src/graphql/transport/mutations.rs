use crate::graphql::transport::types::{AssignmentGqlType, RouteGqlType, VehicleGqlType};
use crate::models::transport::{
    CreateAssignmentInput, CreateRouteInput, CreateVehicleInput, StudentTransportAssignment,
    TransportRoute, UpdateAssignmentInput, UpdateRouteInput, UpdateVehicleInput, Vehicle,
};
use async_graphql::*;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Database,
};

#[derive(Default)]
pub struct TransportMutation;

#[Object]
impl TransportMutation {
    // ========================================================================
    // VEHICLES
    // ========================================================================

    async fn create_vehicle(
        &self,
        ctx: &Context<'_>,
        input: CreateVehicleInput,
    ) -> Result<VehicleGqlType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Vehicle>("vehicles");

        let mut vehicle = Vehicle::new(
            input.school_id,
            input.name,
            input.license_plate,
            input.capacity,
        );

        if let Some(vt) = input.vehicle_type {
            vehicle.vehicle_type = vt;
        }
        vehicle.driver_name = input.driver_name;
        vehicle.driver_phone = input.driver_phone;
        if let Some(status) = input.status {
            vehicle.status = status;
        }
        vehicle.notes = input.notes;

        let result = collection.insert_one(vehicle.clone(), None).await?;
        vehicle.id = Some(result.inserted_id.as_object_id().unwrap());

        Ok(VehicleGqlType::from(vehicle))
    }

    async fn update_vehicle(
        &self,
        ctx: &Context<'_>,
        id: String,
        input: UpdateVehicleInput,
    ) -> Result<VehicleGqlType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Vehicle>("vehicles");

        let obj_id = ObjectId::parse_str(&id)?;

        let mut update_doc = doc! {};

        if let Some(name) = input.name {
            update_doc.insert("name", name);
        }
        if let Some(lp) = input.license_plate {
            update_doc.insert("license_plate", lp);
        }
        if let Some(vt) = input.vehicle_type {
            update_doc.insert("vehicle_type", mongodb::bson::to_bson(&vt)?);
        }
        if let Some(cap) = input.capacity {
            update_doc.insert("capacity", cap);
        }
        if let Some(dn) = input.driver_name {
            update_doc.insert("driver_name", dn);
        }
        if let Some(dp) = input.driver_phone {
            update_doc.insert("driver_phone", dp);
        }
        if let Some(status) = input.status {
            update_doc.insert("status", mongodb::bson::to_bson(&status)?);
        }
        if let Some(notes) = input.notes {
            update_doc.insert("notes", notes);
        }

        update_doc.insert("audit.updated_at", mongodb::bson::DateTime::now());

        collection
            .find_one_and_update(doc! { "_id": obj_id }, doc! { "$set": update_doc }, None)
            .await?;

        let updated = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await?
            .ok_or_else(|| Error::new("Vehicle not found"))?;

        Ok(VehicleGqlType::from(updated))
    }

    async fn delete_vehicle(&self, ctx: &Context<'_>, id: String) -> Result<bool> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Vehicle>("vehicles");

        let obj_id = ObjectId::parse_str(&id)?;

        collection
            .update_one(
                doc! { "_id": obj_id },
                doc! {
                    "$set": {
                        "soft_delete.is_deleted": true,
                        "soft_delete.deleted_at": mongodb::bson::DateTime::now()
                    }
                },
                None,
            )
            .await?;

        Ok(true)
    }

    // ========================================================================
    // ROUTES
    // ========================================================================

    async fn create_transport_route(
        &self,
        ctx: &Context<'_>,
        input: CreateRouteInput,
    ) -> Result<RouteGqlType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<TransportRoute>("transport_routes");

        let mut route = TransportRoute::new(input.school_id, input.name);

        route.vehicle_id = input.vehicle_id;
        route.description = input.description;
        if let Some(stops) = input.stops {
            route.stops = stops;
        }
        if let Some(status) = input.status {
            route.status = status;
        }

        let result = collection.insert_one(route.clone(), None).await?;
        route.id = Some(result.inserted_id.as_object_id().unwrap());

        Ok(RouteGqlType::from(route))
    }

    async fn update_transport_route(
        &self,
        ctx: &Context<'_>,
        id: String,
        input: UpdateRouteInput,
    ) -> Result<RouteGqlType> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<TransportRoute>("transport_routes");

        let obj_id = ObjectId::parse_str(&id)?;

        let mut update_doc = doc! {};

        if let Some(name) = input.name {
            update_doc.insert("name", name);
        }
        if let Some(vid) = input.vehicle_id {
            update_doc.insert("vehicle_id", vid);
        }
        if let Some(desc) = input.description {
            update_doc.insert("description", desc);
        }
        if let Some(stops) = input.stops {
            let stops_bson = mongodb::bson::to_bson(&stops)?;
            update_doc.insert("stops", stops_bson);
        }
        if let Some(status) = input.status {
            update_doc.insert("status", mongodb::bson::to_bson(&status)?);
        }

        update_doc.insert("audit.updated_at", mongodb::bson::DateTime::now());

        collection
            .find_one_and_update(doc! { "_id": obj_id }, doc! { "$set": update_doc }, None)
            .await?;

        let updated = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await?
            .ok_or_else(|| Error::new("Route not found"))?;

        Ok(RouteGqlType::from(updated))
    }

    async fn delete_transport_route(&self, ctx: &Context<'_>, id: String) -> Result<bool> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<TransportRoute>("transport_routes");

        let obj_id = ObjectId::parse_str(&id)?;

        collection
            .update_one(
                doc! { "_id": obj_id },
                doc! {
                    "$set": {
                        "soft_delete.is_deleted": true,
                        "soft_delete.deleted_at": mongodb::bson::DateTime::now()
                    }
                },
                None,
            )
            .await?;

        Ok(true)
    }

    // ========================================================================
    // ASSIGNMENTS
    // ========================================================================

    async fn create_transport_assignment(
        &self,
        ctx: &Context<'_>,
        input: CreateAssignmentInput,
    ) -> Result<AssignmentGqlType> {
        let db = ctx.data::<Database>()?;
        let collection =
            db.collection::<StudentTransportAssignment>("transport_assignments");

        let mut assignment =
            StudentTransportAssignment::new(input.school_id, input.student_id, input.route_id);

        assignment.pickup_stop = input.pickup_stop;
        assignment.dropoff_stop = input.dropoff_stop;
        if let Some(status) = input.status {
            assignment.status = status;
        }
        assignment.notes = input.notes;

        let result = collection.insert_one(assignment.clone(), None).await?;
        assignment.id = Some(result.inserted_id.as_object_id().unwrap());

        Ok(AssignmentGqlType::from(assignment))
    }

    async fn update_transport_assignment(
        &self,
        ctx: &Context<'_>,
        id: String,
        input: UpdateAssignmentInput,
    ) -> Result<AssignmentGqlType> {
        let db = ctx.data::<Database>()?;
        let collection =
            db.collection::<StudentTransportAssignment>("transport_assignments");

        let obj_id = ObjectId::parse_str(&id)?;

        let mut update_doc = doc! {};

        if let Some(route_id) = input.route_id {
            update_doc.insert("route_id", route_id);
        }
        if let Some(ps) = input.pickup_stop {
            update_doc.insert("pickup_stop", ps);
        }
        if let Some(ds) = input.dropoff_stop {
            update_doc.insert("dropoff_stop", ds);
        }
        if let Some(status) = input.status {
            update_doc.insert("status", mongodb::bson::to_bson(&status)?);
        }
        if let Some(notes) = input.notes {
            update_doc.insert("notes", notes);
        }

        update_doc.insert("audit.updated_at", mongodb::bson::DateTime::now());

        collection
            .find_one_and_update(doc! { "_id": obj_id }, doc! { "$set": update_doc }, None)
            .await?;

        let updated = collection
            .find_one(doc! { "_id": obj_id }, None)
            .await?
            .ok_or_else(|| Error::new("Assignment not found"))?;

        Ok(AssignmentGqlType::from(updated))
    }

    async fn delete_transport_assignment(&self, ctx: &Context<'_>, id: String) -> Result<bool> {
        let db = ctx.data::<Database>()?;
        let collection =
            db.collection::<StudentTransportAssignment>("transport_assignments");

        let obj_id = ObjectId::parse_str(&id)?;

        collection
            .update_one(
                doc! { "_id": obj_id },
                doc! {
                    "$set": {
                        "soft_delete.is_deleted": true,
                        "soft_delete.deleted_at": mongodb::bson::DateTime::now()
                    }
                },
                None,
            )
            .await?;

        Ok(true)
    }
}
