use async_graphql::InputObject;

#[derive(InputObject)]
pub struct AddMemberInput {
    pub school_id: String,
    pub user_id: String,
    pub role: String, // "Owner", "Teacher", "Student", "Parent"
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
