use async_graphql::{ComplexObject, Enum, InputObject, SimpleObject};
use mongodb::bson::{oid::ObjectId, DateTime};
use serde::{Deserialize, Serialize};

use crate::utils::common_types::{
    Address, Attachment, AuditInfo, ContactInfo, GpsCoordinates, LocalizedText, SoftDelete,
};

// ============================================================================
// SCHOOL TYPE
// ============================================================================

/// Type of school
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
pub enum SchoolType {
    Private,
    Public,
    International,
    NGO,
    Religious,
    Vocational,
}

impl Default for SchoolType {
    fn default() -> Self {
        SchoolType::Private
    }
}

// ============================================================================
// EDUCATION LEVEL
// ============================================================================

/// Education levels offered
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
pub enum EducationLevel {
    Preschool,
    Primary,
    Secondary,
    HighSchool,
    Vocational,
    University,
}

// ============================================================================
// SCHOOL STATUS
// ============================================================================

/// School registration status
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
pub enum SchoolStatus {
    /// Awaiting approval
    Pending,
    /// Approved and active
    Approved,
    /// Registration rejected
    Rejected,
    /// Temporarily suspended
    Suspended,
    /// Permanently closed
    Closed,
}

impl Default for SchoolStatus {
    fn default() -> Self {
        SchoolStatus::Pending
    }
}

// ============================================================================
// GRADING SYSTEM
// ============================================================================

/// Grading system used by school
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
pub enum GradingSystem {
    /// Letter grades (A, B, C, D, F)
    LetterGrade,
    /// Percentage (0-100%)
    Percentage,
    /// GPA (0.0 - 4.0)
    GPA,
    /// Custom grading scale
    Custom,
}

impl Default for GradingSystem {
    fn default() -> Self {
        GradingSystem::LetterGrade
    }
}

// ============================================================================
// SCHOOL FEATURES
// ============================================================================

/// Features/modules enabled for school
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
pub enum SchoolFeature {
    Attendance,
    Grading,
    Finance,
    HR,
    Library,
    Transport,
    Inventory,
    Messaging,
    Events,
    Reports,
    ParentPortal,
    StudentPortal,
}

// ============================================================================
// SCHOOL STATISTICS
// ============================================================================

/// Denormalized statistics for quick dashboard access
#[derive(Debug, Clone, Default, Serialize, Deserialize, SimpleObject, InputObject)]
#[graphql(input_name = "SchoolStatsInput")]
pub struct SchoolStats {
    pub total_students: i32,
    pub total_teachers: i32,
    pub total_staff: i32,
    pub total_classes: i32,
    pub total_branches: i32,
    #[graphql(skip)]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub last_updated: Option<DateTime>,
}

// ============================================================================
// SCHOOL SETTINGS
// ============================================================================

/// School configuration settings
#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject, InputObject)]
#[graphql(input_name = "SchoolSettingsInput")]
pub struct SchoolSettings {
    /// Month when academic year starts (1-12)
    #[serde(default = "default_academic_start_month")]
    pub academic_year_start_month: i32,
    /// Grading system
    #[serde(default)]
    pub grading_system: GradingSystem,
    /// Primary currency
    #[serde(default = "default_currency")]
    pub currency: String,
    /// Default language
    #[serde(default = "default_language")]
    pub language: String,
    /// Timezone
    #[serde(default = "default_timezone")]
    pub timezone: String,
    /// Minimum attendance percentage required
    #[serde(default = "default_attendance_percent")]
    pub attendance_required_percent: f64,
    /// Number of terms/semesters per year
    #[serde(default = "default_terms")]
    pub terms_per_year: i32,
    /// Working days
    #[serde(default = "default_working_days")]
    pub working_days: Vec<String>,
}

fn default_academic_start_month() -> i32 {
    9 // September
}
fn default_currency() -> String {
    "USD".to_string()
}
fn default_language() -> String {
    "en".to_string()
}
fn default_timezone() -> String {
    "Asia/Phnom_Penh".to_string()
}
fn default_attendance_percent() -> f64 {
    80.0
}
fn default_terms() -> i32 {
    2
}
fn default_working_days() -> Vec<String> {
    vec![
        "Monday".to_string(),
        "Tuesday".to_string(),
        "Wednesday".to_string(),
        "Thursday".to_string(),
        "Friday".to_string(),
    ]
}

impl Default for SchoolSettings {
    fn default() -> Self {
        Self {
            academic_year_start_month: default_academic_start_month(),
            grading_system: GradingSystem::default(),
            currency: default_currency(),
            language: default_language(),
            timezone: default_timezone(),
            attendance_required_percent: default_attendance_percent(),
            terms_per_year: default_terms(),
            working_days: default_working_days(),
        }
    }
}

// ============================================================================
// SUBSCRIPTION (for SaaS model)
// ============================================================================

/// Subscription plan for school
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
pub enum SubscriptionPlan {
    Free,
    Basic,
    Standard,
    Premium,
    Enterprise,
}

/// Subscription information
#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject, InputObject)]
#[graphql(input_name = "SubscriptionInput")]
pub struct Subscription {
    pub plan: SubscriptionPlan,
    #[graphql(skip)]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub started_at: Option<DateTime>,
    #[graphql(skip)]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub expires_at: Option<DateTime>,
    #[serde(default)]
    pub max_students: i32,
    #[serde(default)]
    pub max_staff: i32,
    #[serde(default)]
    pub is_active: bool,
}

// ============================================================================
// SCHOOL MODEL
// ============================================================================

/// School - represents an educational institution
#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject)]
#[graphql(complex)]
pub struct School {
    #[serde(rename = "_id", skip_serializing_if = "Option::is_none")]
    #[graphql(skip)]
    pub id: Option<ObjectId>,

    // ========================
    // Basic Information
    // ========================
    /// School name (English and Khmer)
    pub name: LocalizedText,
    /// Unique school code (e.g., "ISP-001")
    #[serde(skip_serializing_if = "Option::is_none")]
    pub code: Option<String>,
    /// Type of school
    #[serde(default)]
    pub school_type: SchoolType,
    /// Education levels offered
    #[serde(default)]
    pub education_levels: Vec<EducationLevel>,
    /// School description
    #[serde(skip_serializing_if = "Option::is_none")]
    pub description: Option<String>,
    /// School motto
    #[serde(skip_serializing_if = "Option::is_none")]
    pub motto: Option<LocalizedText>,

    // ========================
    // Contact & Location
    // ========================
    /// Main address
    pub address: Address,
    /// GPS coordinates for mapping
    #[serde(skip_serializing_if = "Option::is_none")]
    pub gps_coordinates: Option<GpsCoordinates>,
    /// Contact information
    #[serde(default)]
    pub contact: ContactInfo,
    /// Website URL
    #[serde(skip_serializing_if = "Option::is_none")]
    pub website: Option<String>,

    // ========================
    // Branding
    // ========================
    /// School logo
    #[serde(skip_serializing_if = "Option::is_none")]
    pub logo: Option<Attachment>,
    /// Banner image
    #[serde(skip_serializing_if = "Option::is_none")]
    pub banner: Option<Attachment>,
    /// Primary brand color (hex)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub primary_color: Option<String>,

    // ========================
    // Registration & Compliance
    // ========================
    /// Ministry of Education registration number
    #[serde(skip_serializing_if = "Option::is_none")]
    pub registration_number: Option<String>,
    /// MoEYS ID for compliance reporting
    #[serde(skip_serializing_if = "Option::is_none")]
    pub moeys_id: Option<String>,
    /// Date school was established
    #[serde(skip_serializing_if = "Option::is_none")]
    pub establishment_date: Option<String>,
    /// License expiry date
    #[graphql(skip)]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub license_expiry: Option<DateTime>,

    // ========================
    // Statistics (Denormalized)
    // ========================
    #[serde(default)]
    pub stats: SchoolStats,

    // ========================
    // Status & Approval
    // ========================
    /// Registration status
    #[serde(default)]
    pub status: SchoolStatus,
    /// Who approved the registration
    #[serde(skip_serializing_if = "Option::is_none")]
    pub approved_by: Option<String>,
    /// When approved
    #[graphql(skip)]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub approved_at: Option<DateTime>,
    /// Rejection reason (if rejected)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub rejection_reason: Option<String>,

    // ========================
    // Configuration
    // ========================
    /// School settings
    #[serde(default)]
    pub settings: SchoolSettings,
    /// Enabled features/modules
    #[serde(default)]
    pub features: Vec<SchoolFeature>,

    // ========================
    // Subscription (SaaS)
    // ========================
    #[serde(skip_serializing_if = "Option::is_none")]
    pub subscription: Option<Subscription>,

    // ========================
    // Audit & Soft Delete
    // ========================
    #[serde(default)]
    pub audit: AuditInfo,
    #[serde(default)]
    pub soft_delete: SoftDelete,
}

#[ComplexObject]
impl School {
    /// Returns the school's MongoDB ObjectId as a hex string
    async fn id_str(&self) -> Option<String> {
        self.id.as_ref().map(|id| id.to_hex())
    }

    /// Get school name in specified language
    async fn display_name(&self, lang: Option<String>) -> String {
        let language = lang.unwrap_or_else(|| "en".to_string());
        self.name.get(&language).to_string()
    }

    /// Check if school is approved and active
    async fn is_active(&self) -> bool {
        matches!(self.status, SchoolStatus::Approved) && !self.soft_delete.is_deleted
    }
}

impl School {
    /// Create a new school with minimal required fields
    pub fn new(name: impl Into<String>, address: Address) -> Self {
        Self {
            id: None,
            name: LocalizedText::new(name),
            code: None,
            school_type: SchoolType::default(),
            education_levels: Vec::new(),
            description: None,
            motto: None,
            address,
            gps_coordinates: None,
            contact: ContactInfo::default(),
            website: None,
            logo: None,
            banner: None,
            primary_color: None,
            registration_number: None,
            moeys_id: None,
            establishment_date: None,
            license_expiry: None,
            stats: SchoolStats::default(),
            status: SchoolStatus::Pending,
            approved_by: None,
            approved_at: None,
            rejection_reason: None,
            settings: SchoolSettings::default(),
            features: vec![SchoolFeature::Attendance, SchoolFeature::Grading],
            subscription: None,
            audit: AuditInfo::default(),
            soft_delete: SoftDelete::default(),
        }
    }

    /// Approve the school registration
    pub fn approve(&mut self, approved_by: String) {
        self.status = SchoolStatus::Approved;
        self.approved_by = Some(approved_by);
        self.approved_at = Some(DateTime::now());
        self.rejection_reason = None;
    }

    /// Reject the school registration
    pub fn reject(&mut self, reason: String) {
        self.status = SchoolStatus::Rejected;
        self.rejection_reason = Some(reason);
    }

    /// Update statistics
    pub fn update_stats(&mut self, stats: SchoolStats) {
        self.stats = stats;
        self.stats.last_updated = Some(DateTime::now());
    }

    /// Check if a feature is enabled
    pub fn has_feature(&self, feature: SchoolFeature) -> bool {
        self.features.contains(&feature)
    }

    /// Enable a feature
    pub fn enable_feature(&mut self, feature: SchoolFeature) {
        if !self.features.contains(&feature) {
            self.features.push(feature);
        }
    }
}
