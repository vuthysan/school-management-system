use async_graphql::InputObject;

#[derive(InputObject)]
pub struct AddMemberInput {
    pub school_id: String,
    pub user_id: String,
    pub role: String, // "Owner", "Teacher", "Student", "Parent"
    /// Optional branch ID for branch-level member assignment
    pub branch_id: Option<String>,
}

#[derive(InputObject)]
pub struct UpdateMemberRoleInput {
    pub member_id: String,
    pub role: String,
}

#[derive(InputObject)]
pub struct RemoveMemberInput {
    pub member_id: String,
}
