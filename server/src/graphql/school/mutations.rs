// School GraphQL mutations
use super::inputs::{ApproveSchoolInput, RegisterSchoolInput, RejectSchoolInput};
use crate::models::school::{School, SchoolFeature, SchoolStatus};
use crate::utils::common_types::{AuditInfo, LocalizedText, SoftDelete};
use async_graphql::*;
use mongodb::bson::DateTime;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Database,
};

#[derive(Default)]
pub struct SchoolMutation;

#[Object]
impl SchoolMutation {
    /// Authenticated users only - register a school
    async fn register_school(
        &self,
        ctx: &Context<'_>,
        input: RegisterSchoolInput,
    ) -> Result<School> {
        use crate::graphql::graphql_context::get_graphql_context;

        // Require authentication
        let graphql_ctx = get_graphql_context(ctx)?;
        let auth_user = graphql_ctx.require_auth()?;

        let db = ctx.data::<Database>()?;
        let collection = db.collection::<School>("schools");

        // Create localized name
        let name = match input.name_km {
            Some(km) => LocalizedText::with_khmer(input.name, km),
            None => LocalizedText::new(input.name),
        };

        // Create audit info with current user
        let audit = AuditInfo::new(Some(auth_user.id.clone()));

        let school = School {
            id: None,
            name,
            code: None,
            school_type: input.school_type,
            education_levels: input.education_levels,
            description: input.description,
            motto: None,
            address: input.address,
            gps_coordinates: None,
            contact: input.contact,
            website: input.website,
            logo: None,
            banner: None,
            primary_color: None,
            registration_number: None,
            moeys_id: None,
            establishment_date: None,
            license_expiry: None,
            stats: Default::default(),
            status: SchoolStatus::Pending,
            approved_by: None,
            approved_at: None,
            rejection_reason: None,
            settings: Default::default(),
            features: vec![SchoolFeature::Attendance, SchoolFeature::Grading],
            subscription: None,
            audit,
            soft_delete: SoftDelete::default(),
        };

        let insert_result = collection
            .insert_one(&school, None)
            .await
            .map_err(|e| Error::new(format!("Failed to register school: {}", e)))?;

        // Get the inserted school with ID
        let school_id = insert_result
            .inserted_id
            .as_object_id()
            .ok_or_else(|| Error::new("Failed to get inserted school ID"))?;

        // Create owner as a Member
        {
            use crate::models::member::Member;
            let members_collection = db.collection::<Member>("members");

            let owner_member = Member::new_owner(auth_user.id.clone(), school_id.to_hex());

            members_collection
                .insert_one(&owner_member, None)
                .await
                .map_err(|e| Error::new(format!("Failed to create owner member: {}", e)))?;
        }

        // Retrieve and return the created school
        let created_school = collection
            .find_one(doc! { "_id": school_id }, None)
            .await
            .map_err(|e| Error::new(format!("Failed to retrieve school: {}", e)))?
            .ok_or_else(|| Error::new("School not found after creation"))?;

        Ok(created_school)
    }

    /// Admin only - approve a pending school
    async fn approve_school(&self, ctx: &Context<'_>, input: ApproveSchoolInput) -> Result<School> {
        use crate::{graphql::graphql_context::get_graphql_context, models::user::SystemRole};

        // Check if user is authenticated and has SuperAdmin role
        let graphql_ctx = get_graphql_context(ctx)?;
        let auth_user = graphql_ctx.require_role(SystemRole::SuperAdmin)?;

        let db = ctx.data::<Database>()?;
        let collection = db.collection::<School>("schools");

        let school_id =
            ObjectId::parse_str(&input.school_id).map_err(|_| Error::new("Invalid school ID"))?;

        let now = DateTime::now();

        let update = doc! {
            "$set": {
                "status": "Approved",
                "approved_by": &auth_user.id,
                "approved_at": now,
                "audit.updated_at": now,
                "audit.updated_by": &auth_user.id,
            }
        };

        collection
            .update_one(doc! { "_id": school_id }, update, None)
            .await
            .map_err(|e| Error::new(format!("Failed to approve school: {}", e)))?;

        let school = collection
            .find_one(doc! { "_id": school_id }, None)
            .await
            .map_err(|e| Error::new(format!("Failed to retrieve school: {}", e)))?
            .ok_or_else(|| Error::new("School not found"))?;

        Ok(school)
    }

    /// Admin only - reject a pending school
    async fn reject_school(&self, ctx: &Context<'_>, input: RejectSchoolInput) -> Result<School> {
        use crate::{graphql::graphql_context::get_graphql_context, models::user::SystemRole};

        // Check if user is authenticated and has SuperAdmin role
        let graphql_ctx = get_graphql_context(ctx)?;
        let auth_user = graphql_ctx.require_role(SystemRole::SuperAdmin)?;

        let db = ctx.data::<Database>()?;
        let collection = db.collection::<School>("schools");

        let school_id =
            ObjectId::parse_str(&input.school_id).map_err(|_| Error::new("Invalid school ID"))?;

        let now = DateTime::now();

        let update = doc! {
            "$set": {
                "status": "Rejected",
                "rejection_reason": input.rejection_reason,
                "audit.updated_at": now,
                "audit.updated_by": &auth_user.id,
            }
        };

        collection
            .update_one(doc! { "_id": school_id }, update, None)
            .await
            .map_err(|e| Error::new(format!("Failed to reject school: {}", e)))?;

        let school = collection
            .find_one(doc! { "_id": school_id }, None)
            .await
            .map_err(|e| Error::new(format!("Failed to retrieve school: {}", e)))?
            .ok_or_else(|| Error::new("School not found"))?;

        Ok(school)
    }
}
