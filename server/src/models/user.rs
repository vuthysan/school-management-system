use async_graphql::{ComplexObject, Enum, SimpleObject};
use mongodb::bson::{oid::ObjectId, DateTime};
use serde::{Deserialize, Serialize};

use crate::utils::common_types::{AuditInfo, Gender, SoftDelete};

// ============================================================================
// SYSTEM ROLE (Platform-level)
// ============================================================================

/// System-level roles for platform administration
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
pub enum SystemRole {
    /// Platform super administrator (full access)
    SuperAdmin,
    /// Platform administrator (limited admin access)
    Admin,
    /// Regular user (gets school roles via Member)
    User,
}

impl Default for SystemRole {
    fn default() -> Self {
        SystemRole::User
    }
}

// Re-export as UserRole for backward compatibility
pub type UserRole = SystemRole;

// ============================================================================
// USER STATUS
// ============================================================================

/// User account status
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
pub enum UserStatus {
    /// Active and can login
    Active,
    /// Temporarily inactive
    Inactive,
    /// Account suspended by admin
    Suspended,
    /// Account banned permanently
    Banned,
    /// Awaiting email/phone verification
    PendingVerification,
}

impl Default for UserStatus {
    fn default() -> Self {
        UserStatus::Active
    }
}

// ============================================================================
// USER MODEL
// ============================================================================

/// User - represents a person who can log into the system
/// A user can be a member of multiple schools with different roles
#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject)]
#[graphql(complex)]
pub struct User {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    #[graphql(skip)]
    pub id: Option<ObjectId>,

    // ========================
    // Authentication
    // ========================
    /// KOOMPI OAuth ID (unique identifier from KOOMPI)
    pub kid: String,
    /// Username (unique)
    pub username: String,
    /// Email address
    #[serde(skip_serializing_if = "Option::is_none")]
    pub email: Option<String>,

    // ========================
    // Profile Information
    // ========================
    #[serde(skip_serializing_if = "Option::is_none")]
    pub first_name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub last_name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub first_name_km: Option<String>, // Khmer first name
    #[serde(skip_serializing_if = "Option::is_none")]
    pub last_name_km: Option<String>, // Khmer last name
    #[serde(skip_serializing_if = "Option::is_none")]
    pub display_name: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub avatar_url: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub phone: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub date_of_birth: Option<String>, // ISO date string
    #[serde(skip_serializing_if = "Option::is_none")]
    pub gender: Option<Gender>,

    // ========================
    // System Role & Status
    // ========================
    /// Platform-level role (SuperAdmin, Admin, User)
    #[serde(default)]
    pub system_role: SystemRole,
    /// Account status
    #[serde(default)]
    pub status: UserStatus,

    // ========================
    // Verification
    // ========================
    #[serde(default)]
    pub is_verified: bool,
    #[graphql(skip)]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub verified_at: Option<DateTime>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub verification_token: Option<String>,

    // ========================
    // Login Tracking
    // ========================
    #[graphql(skip)]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub last_login: Option<DateTime>,
    #[serde(default)]
    pub login_count: i32,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub last_ip: Option<String>,

    // ========================
    // User Preferences
    // ========================
    /// Preferred language ("en" | "km")
    #[serde(default = "default_language")]
    pub language: String,
    /// Timezone
    #[serde(default = "default_timezone")]
    pub timezone: String,
    /// Theme preference ("light" | "dark" | "system")
    #[serde(default = "default_theme")]
    pub theme: String,
    /// Email notification preference
    #[serde(default = "default_true")]
    pub email_notifications: bool,

    // ========================
    // Audit & Soft Delete
    // ========================
    #[serde(default)]
    pub audit: AuditInfo,
    #[serde(default)]
    pub soft_delete: SoftDelete,
}

// Default value functions
fn default_language() -> String {
    "en".to_string()
}

fn default_timezone() -> String {
    "Asia/Phnom_Penh".to_string()
}

fn default_theme() -> String {
    "system".to_string()
}

fn default_true() -> bool {
    true
}

#[ComplexObject]
impl User {
    /// Returns the user's MongoDB ObjectId as a hex string
    async fn id_str(&self) -> Option<String> {
        self.id.as_ref().map(|id| id.to_hex())
    }

    /// Returns the user's full name
    async fn full_name(&self) -> Option<String> {
        match (&self.first_name, &self.last_name) {
            (Some(first), Some(last)) => Some(format!("{} {}", first, last)),
            (Some(first), None) => Some(first.clone()),
            (None, Some(last)) => Some(last.clone()),
            (None, None) => self.display_name.clone(),
        }
    }

    /// Returns the user's full name in Khmer
    async fn full_name_km(&self) -> Option<String> {
        match (&self.first_name_km, &self.last_name_km) {
            (Some(first), Some(last)) => Some(format!("{} {}", first, last)),
            (Some(first), None) => Some(first.clone()),
            (None, Some(last)) => Some(last.clone()),
            (None, None) => None,
        }
    }
}

impl User {
    /// Create a new user from KOOMPI OAuth
    pub fn new(kid: String, username: String, email: Option<String>) -> Self {
        Self {
            id: None,
            kid,
            username,
            email,
            first_name: None,
            last_name: None,
            first_name_km: None,
            last_name_km: None,
            display_name: None,
            avatar_url: None,
            phone: None,
            date_of_birth: None,
            gender: None,
            system_role: SystemRole::User,
            status: UserStatus::Active,
            is_verified: false,
            verified_at: None,
            verification_token: None,
            last_login: None,
            login_count: 0,
            last_ip: None,
            language: default_language(),
            timezone: default_timezone(),
            theme: default_theme(),
            email_notifications: true,
            audit: AuditInfo::default(),
            soft_delete: SoftDelete::default(),
        }
    }

    /// Record a login
    pub fn record_login(&mut self, ip: Option<String>) {
        self.last_login = Some(DateTime::now());
        self.login_count += 1;
        self.last_ip = ip;
    }

    /// Check if user can login
    pub fn can_login(&self) -> bool {
        matches!(self.status, UserStatus::Active) && !self.soft_delete.is_deleted
    }
}
