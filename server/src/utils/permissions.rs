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
