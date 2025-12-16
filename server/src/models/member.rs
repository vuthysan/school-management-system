use async_graphql::{ComplexObject, Enum, SimpleObject};
use mongodb::bson::{oid::ObjectId, DateTime};
use serde::{Deserialize, Serialize};

use crate::utils::common_types::{AuditInfo, SoftDelete};

// ============================================================================
// SCHOOL ROLE
// ============================================================================

/// Role within a specific school
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
pub enum SchoolRole {
    /// School owner (business owner, full access including billing)
    Owner,
    /// School Director/Principal (full school management, no billing)
    Director,
    /// Deputy Director/Vice Principal (full school management, no billing)
    DeputyDirector,
    /// School administrator (operational access)
    Admin,
    /// Department head teacher
    HeadTeacher,
    /// Teacher
    Teacher,
    /// Student
    Student,
    /// Parent/Guardian
    Parent,
    /// Non-teaching staff (janitor, security, etc.)
    Staff,
    /// Finance/Accounting staff
    Accountant,
    /// Library staff
    Librarian,
}

impl Default for SchoolRole {
    fn default() -> Self {
        SchoolRole::Student
    }
}

// ============================================================================
// MEMBER STATUS
// ============================================================================

/// Member account status within a school
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
pub enum MemberStatus {
    /// Active member
    Active,
    /// Temporarily inactive
    Inactive,
    /// Awaiting invitation acceptance
    Pending,
    /// Suspended by admin
    Suspended,
}

impl Default for MemberStatus {
    fn default() -> Self {
        MemberStatus::Active
    }
}

// ============================================================================
// PERMISSIONS
// ============================================================================

/// Fine-grained permissions for school operations
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
pub enum Permission {
    // Dashboard
    ViewDashboard,

    // Student management
    ViewStudents,
    CreateStudents,
    UpdateStudents,
    DeleteStudents,
    ImportStudents,
    ExportStudents,

    // Class management
    ViewClasses,
    ManageClasses,

    // Attendance
    ViewAttendance,
    MarkAttendance,
    EditAttendance,
    ViewAttendanceReports,

    // Grades
    ViewGrades,
    EnterGrades,
    ApproveGrades,
    ViewGradeReports,

    // Finance
    ViewFinance,
    RecordPayments,
    ManageFeesStructure,
    GenerateInvoices,
    ViewFinanceReports,

    // HR / Staff
    ViewStaff,
    ManageStaff,
    ManagePayroll,

    // Communication
    SendAnnouncements,
    SendMessages,
    ViewMessages,

    // Events
    ViewEvents,
    ManageEvents,

    // Library
    ViewLibrary,
    ManageLibrary,

    // Transport
    ViewTransport,
    ManageTransport,

    // Settings
    ViewSettings,
    ManageSettings,
    ManageUsers,
    ManageRoles,
}

// ============================================================================
// MEMBER MODEL
// ============================================================================

/// Member - represents a user's membership in a specific school
/// A user can have different roles in different schools
#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject)]
#[graphql(complex)]
pub struct Member {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    #[graphql(skip)]
    pub id: Option<ObjectId>,

    // ========================
    // Core References
    // ========================
    /// User ID (reference to users collection)
    pub user_id: String,
    /// School ID (reference to schools collection)
    pub school_id: String,
    /// Branch ID (optional, for multi-branch schools)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub branch_id: Option<String>,

    // ========================
    // Role & Permissions
    // ========================
    /// Role in this school
    pub role: SchoolRole,
    /// Additional permissions beyond role defaults
    #[serde(default)]
    pub permissions: Vec<Permission>,
    /// Custom title (e.g., "Principal", "Head of Math Dept")
    #[serde(skip_serializing_if = "Option::is_none")]
    pub title: Option<String>,

    // ========================
    // Role-Specific Links
    // ========================
    /// If role is Student, link to student record
    #[serde(skip_serializing_if = "Option::is_none")]
    pub student_id: Option<String>,
    /// If role is Teacher/Admin/Staff, link to staff record
    #[serde(skip_serializing_if = "Option::is_none")]
    pub staff_id: Option<String>,
    /// If role is Parent, list of student IDs (children)
    #[serde(default)]
    pub parent_of: Vec<String>,

    // ========================
    // Status & Tracking
    // ========================
    /// Member status
    #[serde(default)]
    pub status: MemberStatus,
    /// When joined the school
    #[graphql(skip)]
    pub joined_at: DateTime,
    /// Who invited this member
    #[serde(skip_serializing_if = "Option::is_none")]
    pub invited_by: Option<String>,
    /// Invitation code used (for tracking)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub invitation_code: Option<String>,
    /// Primary contact for this school role
    #[serde(default)]
    pub is_primary_contact: bool,

    // ========================
    // Audit & Soft Delete
    // ========================
    #[serde(default)]
    pub audit: AuditInfo,
    #[serde(default)]
    pub soft_delete: SoftDelete,
}

#[ComplexObject]
impl Member {
    /// Returns the member's MongoDB ObjectId as a hex string
    async fn id_str(&self) -> Option<String> {
        self.id.as_ref().map(|id| id.to_hex())
    }

    /// Returns the associated user's information
    async fn user(
        &self,
        ctx: &async_graphql::Context<'_>,
    ) -> async_graphql::Result<Option<crate::models::user::User>> {
        let db = ctx.data::<mongodb::Database>()?;
        let users_collection = db.collection::<crate::models::user::User>("users");

        // user_id is the user's ObjectId hex string, parse it
        let user_oid = match mongodb::bson::oid::ObjectId::parse_str(&self.user_id) {
            Ok(oid) => oid,
            Err(_) => return Ok(None), // Invalid ObjectId, return None
        };

        // Find user by _id
        let user = users_collection
            .find_one(mongodb::bson::doc! { "_id": user_oid }, None)
            .await
            .map_err(|e| async_graphql::Error::new(format!("Failed to fetch user: {}", e)))?;

        Ok(user)
    }
}

impl Member {
    /// Create a new member
    pub fn new(user_id: String, school_id: String, role: SchoolRole) -> Self {
        Self {
            id: None,
            user_id,
            school_id,
            branch_id: None,
            role,
            permissions: Vec::new(),
            title: None,
            student_id: None,
            staff_id: None,
            parent_of: Vec::new(),
            status: MemberStatus::Active,
            joined_at: DateTime::now(),
            invited_by: None,
            invitation_code: None,
            is_primary_contact: false,
            audit: AuditInfo::default(),
            soft_delete: SoftDelete::default(),
        }
    }

    /// Create a new owner member
    pub fn new_owner(user_id: String, school_id: String) -> Self {
        let mut member = Self::new(user_id, school_id, SchoolRole::Owner);
        member.is_primary_contact = true;
        member
    }

    /// Get default permissions for a role
    pub fn default_permissions(role: SchoolRole) -> Vec<Permission> {
        match role {
            SchoolRole::Owner => vec![
                // Owners get all permissions
                Permission::ViewDashboard,
                Permission::ViewStudents,
                Permission::CreateStudents,
                Permission::UpdateStudents,
                Permission::DeleteStudents,
                Permission::ImportStudents,
                Permission::ExportStudents,
                Permission::ViewClasses,
                Permission::ManageClasses,
                Permission::ViewAttendance,
                Permission::MarkAttendance,
                Permission::EditAttendance,
                Permission::ViewAttendanceReports,
                Permission::ViewGrades,
                Permission::EnterGrades,
                Permission::ApproveGrades,
                Permission::ViewGradeReports,
                Permission::ViewFinance,
                Permission::RecordPayments,
                Permission::ManageFeesStructure,
                Permission::GenerateInvoices,
                Permission::ViewFinanceReports,
                Permission::ViewStaff,
                Permission::ManageStaff,
                Permission::ManagePayroll,
                Permission::SendAnnouncements,
                Permission::SendMessages,
                Permission::ViewMessages,
                Permission::ViewEvents,
                Permission::ManageEvents,
                Permission::ViewSettings,
                Permission::ManageSettings,
                Permission::ManageUsers,
                Permission::ManageRoles,
            ],
            // Director and Deputy Director have same access as Owner (except billing)
            SchoolRole::Director | SchoolRole::DeputyDirector => vec![
                Permission::ViewDashboard,
                Permission::ViewStudents,
                Permission::CreateStudents,
                Permission::UpdateStudents,
                Permission::DeleteStudents,
                Permission::ImportStudents,
                Permission::ExportStudents,
                Permission::ViewClasses,
                Permission::ManageClasses,
                Permission::ViewAttendance,
                Permission::MarkAttendance,
                Permission::EditAttendance,
                Permission::ViewAttendanceReports,
                Permission::ViewGrades,
                Permission::EnterGrades,
                Permission::ApproveGrades,
                Permission::ViewGradeReports,
                Permission::ViewFinance,
                Permission::RecordPayments,
                Permission::ManageFeesStructure,
                Permission::GenerateInvoices,
                Permission::ViewFinanceReports,
                Permission::ViewStaff,
                Permission::ManageStaff,
                Permission::ManagePayroll,
                Permission::SendAnnouncements,
                Permission::SendMessages,
                Permission::ViewMessages,
                Permission::ViewEvents,
                Permission::ManageEvents,
                Permission::ViewSettings,
                Permission::ManageSettings,
                Permission::ManageUsers,
                Permission::ManageRoles,
            ],
            // HeadTeacher has admin-like access
            SchoolRole::HeadTeacher => vec![
                Permission::ViewDashboard,
                Permission::ViewStudents,
                Permission::CreateStudents,
                Permission::UpdateStudents,
                Permission::ViewClasses,
                Permission::ManageClasses,
                Permission::ViewAttendance,
                Permission::MarkAttendance,
                Permission::EditAttendance,
                Permission::ViewAttendanceReports,
                Permission::ViewGrades,
                Permission::EnterGrades,
                Permission::ApproveGrades,
                Permission::ViewGradeReports,
                Permission::ViewStaff,
                Permission::SendAnnouncements,
                Permission::SendMessages,
                Permission::ViewMessages,
                Permission::ViewEvents,
                Permission::ManageEvents,
            ],
            SchoolRole::Admin => vec![
                Permission::ViewDashboard,
                Permission::ViewStudents,
                Permission::CreateStudents,
                Permission::UpdateStudents,
                Permission::ImportStudents,
                Permission::ExportStudents,
                Permission::ViewClasses,
                Permission::ManageClasses,
                Permission::ViewAttendance,
                Permission::EditAttendance,
                Permission::ViewAttendanceReports,
                Permission::ViewGrades,
                Permission::ViewGradeReports,
                Permission::ViewFinance,
                Permission::RecordPayments,
                Permission::GenerateInvoices,
                Permission::ViewFinanceReports,
                Permission::ViewStaff,
                Permission::ManageStaff,
                Permission::SendAnnouncements,
                Permission::SendMessages,
                Permission::ViewMessages,
                Permission::ViewEvents,
                Permission::ManageEvents,
                Permission::ViewSettings,
                Permission::ManageUsers,
            ],
            SchoolRole::Teacher => vec![
                Permission::ViewDashboard,
                Permission::ViewStudents,
                Permission::ViewClasses,
                Permission::ViewAttendance,
                Permission::MarkAttendance,
                Permission::ViewAttendanceReports,
                Permission::ViewGrades,
                Permission::EnterGrades,
                Permission::ViewGradeReports,
                Permission::SendMessages,
                Permission::ViewMessages,
                Permission::ViewEvents,
            ],
            SchoolRole::Student => vec![
                Permission::ViewDashboard,
                Permission::ViewAttendance,
                Permission::ViewGrades,
                Permission::ViewMessages,
                Permission::ViewEvents,
            ],
            SchoolRole::Parent => vec![
                Permission::ViewDashboard,
                Permission::ViewAttendance,
                Permission::ViewGrades,
                Permission::ViewFinance,
                Permission::SendMessages,
                Permission::ViewMessages,
                Permission::ViewEvents,
            ],
            _ => vec![Permission::ViewDashboard],
        }
    }

    /// Check if member has a specific permission
    pub fn has_permission(&self, permission: Permission) -> bool {
        // Check explicitly assigned permissions first
        if self.permissions.contains(&permission) {
            return true;
        }
        // Check default permissions for role
        Self::default_permissions(self.role).contains(&permission)
    }

    /// Check if member is active
    pub fn is_active(&self) -> bool {
        matches!(self.status, MemberStatus::Active) && !self.soft_delete.is_deleted
    }
}
