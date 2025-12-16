use super::inputs::{AddMemberInput, RemoveMemberInput, UpdateMemberRoleInput};
use crate::models::member::{Member, SchoolRole};
use crate::utils::permissions::can_manage_members;
use async_graphql::*;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Database,
};

#[derive(Default)]
pub struct MemberMutation;

#[Object]
impl MemberMutation {
    /// Add a member to a school (Owner, Director, or DeputyDirector)
    async fn add_member(&self, ctx: &Context<'_>, input: AddMemberInput) -> Result<Member> {
        use crate::graphql::graphql_context::get_graphql_context;

        let graphql_ctx = get_graphql_context(ctx)?;
        let auth_user = graphql_ctx.require_auth()?;

        let db = ctx.data::<Database>()?;
        let members_collection = db.collection::<Member>("members");

        // Check if authenticated user has management rights for the school
        let auth_member = members_collection
            .find_one(
                doc! {
                    "user_id": &auth_user.id,
                    "school_id": &input.school_id,
                    "status": "Active",
                    "soft_delete.is_deleted": false
                },
                None,
            )
            .await
            .map_err(|e| Error::new(format!("Failed to check permissions: {}", e)))?
            .ok_or_else(|| Error::new("You are not a member of this school"))?;

        // Verify user can manage members
        if !can_manage_members(&auth_member.role) {
            return Err(Error::new(
                "You don't have permission to add members. Only owners and directors can add members.",
            ));
        }

        // Parse role string to SchoolRole
        let school_role: SchoolRole = serde_json::from_str(&format!("\"{}\"", input.role))
            .map_err(|_| Error::new("Invalid role"))?;

        // Check if member already exists
        let existing = members_collection
            .find_one(
                doc! {
                    "user_id": &input.user_id,
                    "school_id": &input.school_id
                },
                None,
            )
            .await
            .map_err(|e| Error::new(format!("Database error: {}", e)))?;

        if existing.is_some() {
            return Err(Error::new("User is already a member of this school"));
        }

        // Create new member
        let member = Member::new(input.user_id, input.school_id, school_role);

        members_collection
            .insert_one(&member, None)
            .await
            .map_err(|e| Error::new(format!("Failed to add member: {}", e)))?;

        Ok(member)
    }

    /// Update a member's role (Owner, Director, or DeputyDirector)
    async fn update_member_role(
        &self,
        ctx: &Context<'_>,
        input: UpdateMemberRoleInput,
    ) -> Result<Member> {
        use crate::graphql::graphql_context::get_graphql_context;

        let graphql_ctx = get_graphql_context(ctx)?;
        let auth_user = graphql_ctx.require_auth()?;

        let db = ctx.data::<Database>()?;
        let members_collection = db.collection::<Member>("members");

        let member_id =
            ObjectId::parse_str(&input.member_id).map_err(|_| Error::new("Invalid member ID"))?;

        // Get the member to update
        let member = members_collection
            .find_one(doc! { "_id": member_id }, None)
            .await
            .map_err(|e| Error::new(format!("Database error: {}", e)))?
            .ok_or_else(|| Error::new("Member not found"))?;

        // Check if authenticated user has management rights for the school
        let auth_member = members_collection
            .find_one(
                doc! {
                    "user_id": &auth_user.id,
                    "school_id": &member.school_id,
                    "status": "Active",
                    "soft_delete.is_deleted": false
                },
                None,
            )
            .await
            .map_err(|e| Error::new(format!("Failed to check permissions: {}", e)))?
            .ok_or_else(|| Error::new("You are not a member of this school"))?;

        // Verify user can manage members
        if !can_manage_members(&auth_member.role) {
            return Err(Error::new(
                "You don't have permission to update member roles. Only owners and directors can update member roles.",
            ));
        }

        // Parse new role
        let new_role: SchoolRole = serde_json::from_str(&format!("\"{}\"", input.role))
            .map_err(|_| Error::new("Invalid role"))?;

        let now = chrono::Utc::now().to_rfc3339();

        // Update member role
        let update = doc! {
            "$set": {
                "role": mongodb::bson::to_bson(&new_role).unwrap(),
                "updated_at": now,
            }
        };

        members_collection
            .update_one(doc! { "_id": member_id }, update, None)
            .await
            .map_err(|e| Error::new(format!("Failed to update member: {}", e)))?;

        // Fetch updated member
        let updated_member = members_collection
            .find_one(doc! { "_id": member_id }, None)
            .await
            .map_err(|e| Error::new(format!("Failed to retrieve member: {}", e)))?
            .ok_or_else(|| Error::new("Member not found"))?;

        Ok(updated_member)
    }

    /// Remove a member from a school (Owner, Director, or DeputyDirector)
    async fn remove_member(&self, ctx: &Context<'_>, input: RemoveMemberInput) -> Result<bool> {
        use crate::graphql::graphql_context::get_graphql_context;

        let graphql_ctx = get_graphql_context(ctx)?;
        let auth_user = graphql_ctx.require_auth()?;

        let db = ctx.data::<Database>()?;
        let members_collection = db.collection::<Member>("members");

        let member_id =
            ObjectId::parse_str(&input.member_id).map_err(|_| Error::new("Invalid member ID"))?;

        // Get the member to remove
        let member = members_collection
            .find_one(doc! { "_id": member_id }, None)
            .await
            .map_err(|e| Error::new(format!("Database error: {}", e)))?
            .ok_or_else(|| Error::new("Member not found"))?;

        // Check if authenticated user has management rights for the school
        let auth_member = members_collection
            .find_one(
                doc! {
                    "user_id": &auth_user.id,
                    "school_id": &member.school_id,
                    "status": "Active",
                    "soft_delete.is_deleted": false
                },
                None,
            )
            .await
            .map_err(|e| Error::new(format!("Failed to check permissions: {}", e)))?
            .ok_or_else(|| Error::new("You are not a member of this school"))?;

        // Verify user can manage members
        if !can_manage_members(&auth_member.role) {
            return Err(Error::new(
                "You don't have permission to remove members. Only owners and directors can remove members.",
            ));
        }

        // Soft delete by setting is_active to false
        let now = chrono::Utc::now().to_rfc3339();
        let update = doc! {
            "$set": {
                "status": "Inactive",
                "soft_delete.is_deleted": true,
                "soft_delete.deleted_at": &now,
                "updated_at": now,
            }
        };

        members_collection
            .update_one(doc! { "_id": member_id }, update, None)
            .await
            .map_err(|e| Error::new(format!("Failed to remove member: {}", e)))?;

        Ok(true)
    }
}
