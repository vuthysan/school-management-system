// Role-based permission utilities
use crate::models::member::SchoolRole;

// ============================================================================
// ROLE PERMISSION CHECKS
// ============================================================================

/// Check if role can manage school-level operations (branches, settings)
pub fn can_manage_school(role: &SchoolRole) -> bool {
    matches!(
        role,
        SchoolRole::Owner | SchoolRole::Director | SchoolRole::DeputyDirector
    )
}

/// Check if role can manage members (add, edit, remove)
pub fn can_manage_members(role: &SchoolRole) -> bool {
    matches!(
        role,
        SchoolRole::Owner | SchoolRole::Director | SchoolRole::DeputyDirector
    )
}

/// Check if role can manage finance (fees, payments, payroll)
pub fn can_manage_finance(role: &SchoolRole) -> bool {
    matches!(
        role,
        SchoolRole::Owner
            | SchoolRole::Director
            | SchoolRole::DeputyDirector
            | SchoolRole::Accountant
    )
}

/// Check if role can manage academics (classes, curriculum, grades)
pub fn can_manage_academics(role: &SchoolRole) -> bool {
    matches!(
        role,
        SchoolRole::Owner
            | SchoolRole::Director
            | SchoolRole::DeputyDirector
            | SchoolRole::Admin
            | SchoolRole::HeadTeacher
    )
}

/// Check if role can manage students
pub fn can_manage_students(role: &SchoolRole) -> bool {
    matches!(
        role,
        SchoolRole::Owner
            | SchoolRole::Director
            | SchoolRole::DeputyDirector
            | SchoolRole::Admin
            | SchoolRole::HeadTeacher
            | SchoolRole::Teacher
    )
}

/// Check if role can view finance reports
pub fn can_view_finance(role: &SchoolRole) -> bool {
    matches!(
        role,
        SchoolRole::Owner
            | SchoolRole::Director
            | SchoolRole::DeputyDirector
            | SchoolRole::Admin
            | SchoolRole::Accountant
    )
}

/// Check if role can send announcements
pub fn can_send_announcements(role: &SchoolRole) -> bool {
    matches!(
        role,
        SchoolRole::Owner
            | SchoolRole::Director
            | SchoolRole::DeputyDirector
            | SchoolRole::Admin
            | SchoolRole::HeadTeacher
    )
}

/// Check if role is a school leader (Owner, Director, DeputyDirector)
pub fn is_school_leader(role: &SchoolRole) -> bool {
    matches!(
        role,
        SchoolRole::Owner | SchoolRole::Director | SchoolRole::DeputyDirector
    )
}

/// Check if role is staff (not student or parent)
pub fn is_staff(role: &SchoolRole) -> bool {
    !matches!(role, SchoolRole::Student | SchoolRole::Parent)
}

/// Check if user can manage a specific branch
/// Owners can manage all branches
/// Directors/DeputyDirectors can only manage their assigned branch
/// Returns true if user has permission to manage the target branch
pub fn can_manage_branch(
    role: &SchoolRole,
    user_branch_id: Option<&str>,
    target_branch_id: Option<&str>,
) -> bool {
    // Owners can always manage all branches
    if matches!(role, SchoolRole::Owner) {
        return true;
    }

    // For Directors/DeputyDirectors, check branch match
    match (user_branch_id, target_branch_id) {
        // User has a branch, target has a branch - must match
        (Some(user_b), Some(target_b)) => user_b == target_b,
        // User has no branch assigned - can manage school-wide members only
        (None, None) => true,
        // Mismatched scope - deny access
        _ => false,
    }
}

/// Check if user can view members in a branch
/// Similar to can_manage_branch but for read access
pub fn can_view_branch_members(
    role: &SchoolRole,
    user_branch_id: Option<&str>,
    target_branch_id: Option<&str>,
) -> bool {
    // Same logic as manage - Owners see all, others see their branch
    can_manage_branch(role, user_branch_id, target_branch_id)
}
