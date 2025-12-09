use async_graphql::{Enum, InputObject, SimpleObject};
use mongodb::bson::DateTime;
use serde::{Deserialize, Serialize};

// ============================================================================
// STATUS ENUMS
// ============================================================================

/// Generic status for most entities
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
pub enum Status {
    Active,
    Inactive,
    Pending,
    Archived,
}

impl Default for Status {
    fn default() -> Self {
        Status::Active
    }
}

// ============================================================================
// AUDIT & SOFT DELETE
// ============================================================================

/// Audit trail embedded in all models
#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject, InputObject)]
#[graphql(input_name = "AuditInfoInput")]
pub struct AuditInfo {
    #[graphql(skip)]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub created_at: Option<DateTime>,
    #[graphql(skip)]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub updated_at: Option<DateTime>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub created_by: Option<String>, // User ID as string
    #[serde(skip_serializing_if = "Option::is_none")]
    pub updated_by: Option<String>,
}

impl Default for AuditInfo {
    fn default() -> Self {
        let now = DateTime::now();
        Self {
            created_at: Some(now),
            updated_at: Some(now),
            created_by: None,
            updated_by: None,
        }
    }
}

impl AuditInfo {
    pub fn new(user_id: Option<String>) -> Self {
        let now = DateTime::now();
        Self {
            created_at: Some(now),
            updated_at: Some(now),
            created_by: user_id.clone(),
            updated_by: user_id,
        }
    }

    pub fn touch(&mut self, user_id: Option<String>) {
        self.updated_at = Some(DateTime::now());
        self.updated_by = user_id;
    }

    /// Get created_at as ISO string for GraphQL
    pub fn created_at_str(&self) -> Option<String> {
        self.created_at
            .map(|dt| dt.try_to_rfc3339_string().unwrap_or_default())
    }

    /// Get updated_at as ISO string for GraphQL
    pub fn updated_at_str(&self) -> Option<String> {
        self.updated_at
            .map(|dt| dt.try_to_rfc3339_string().unwrap_or_default())
    }
}

/// Soft delete support for all models
#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject, InputObject)]
#[graphql(input_name = "SoftDeleteInput")]
pub struct SoftDelete {
    #[serde(default)]
    pub is_deleted: bool,
    #[graphql(skip)]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub deleted_at: Option<DateTime>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub deleted_by: Option<String>,
}

impl Default for SoftDelete {
    fn default() -> Self {
        Self {
            is_deleted: false,
            deleted_at: None,
            deleted_by: None,
        }
    }
}

impl SoftDelete {
    pub fn mark_deleted(&mut self, user_id: Option<String>) {
        self.is_deleted = true;
        self.deleted_at = Some(DateTime::now());
        self.deleted_by = user_id;
    }

    pub fn restore(&mut self) {
        self.is_deleted = false;
        self.deleted_at = None;
        self.deleted_by = None;
    }
}

// ============================================================================
// LOCALIZATION
// ============================================================================

/// Localized text for Khmer/English support
#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject, InputObject)]
#[graphql(input_name = "LocalizedTextInput")]
pub struct LocalizedText {
    pub en: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub km: Option<String>,
}

impl LocalizedText {
    pub fn new(en: impl Into<String>) -> Self {
        Self {
            en: en.into(),
            km: None,
        }
    }

    pub fn with_khmer(en: impl Into<String>, km: impl Into<String>) -> Self {
        Self {
            en: en.into(),
            km: Some(km.into()),
        }
    }

    /// Get text based on language preference
    pub fn get(&self, lang: &str) -> &str {
        match lang {
            "km" => self.km.as_deref().unwrap_or(&self.en),
            _ => &self.en,
        }
    }
}

impl From<String> for LocalizedText {
    fn from(s: String) -> Self {
        Self::new(s)
    }
}

impl From<&str> for LocalizedText {
    fn from(s: &str) -> Self {
        Self::new(s)
    }
}

// ============================================================================
// CONTACT & LOCATION
// ============================================================================

/// Address structure for Cambodia
#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject, InputObject)]
#[graphql(input_name = "AddressDataInput")]
pub struct Address {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub street: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub village: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub commune: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub district: Option<String>,
    pub province: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub postal_code: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub country: Option<String>,
}

impl Default for Address {
    fn default() -> Self {
        Self {
            street: None,
            village: None,
            commune: None,
            district: None,
            province: String::new(),
            postal_code: None,
            country: Some("Cambodia".to_string()),
        }
    }
}

/// GPS coordinates for mapping
#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject, InputObject)]
#[graphql(input_name = "GpsCoordinatesInput")]
pub struct GpsCoordinates {
    pub latitude: f64,
    pub longitude: f64,
}

/// Contact information (reusable)
#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject, InputObject)]
#[graphql(input_name = "ContactInfoInput")]
pub struct ContactInfo {
    #[serde(skip_serializing_if = "Option::is_none")]
    pub phone: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub phone_secondary: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub email: Option<String>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub address: Option<Address>,
}

impl Default for ContactInfo {
    fn default() -> Self {
        Self {
            phone: None,
            phone_secondary: None,
            email: None,
            address: None,
        }
    }
}

// ============================================================================
// FILE ATTACHMENTS
// ============================================================================

/// Photo/Document attachment
#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject)]
pub struct Attachment {
    pub url: String,
    pub file_name: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub file_type: Option<String>, // MIME type
    #[serde(skip_serializing_if = "Option::is_none")]
    pub file_size: Option<i64>, // bytes
    #[graphql(skip)]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub uploaded_at: Option<DateTime>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub uploaded_by: Option<String>,
}

impl Attachment {
    pub fn new(url: impl Into<String>, file_name: impl Into<String>) -> Self {
        Self {
            url: url.into(),
            file_name: file_name.into(),
            file_type: None,
            file_size: None,
            uploaded_at: Some(DateTime::now()),
            uploaded_by: None,
        }
    }
}

// ============================================================================
// PERSONAL INFO
// ============================================================================

/// Gender enum
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum, Default)]
pub enum Gender {
    #[default]
    Male,
    Female,
    Other,
    PreferNotToSay,
}

/// Date of birth structure
#[derive(Debug, Clone, Serialize, Deserialize, SimpleObject, InputObject)]
#[graphql(input_name = "DateOfBirthInput")]
pub struct DateOfBirth {
    pub day: i32,
    pub month: i32,
    pub year: i32,
}

impl DateOfBirth {
    pub fn new(day: i32, month: i32, year: i32) -> Self {
        Self { day, month, year }
    }

    /// Format as ISO date string (YYYY-MM-DD)
    pub fn to_iso_string(&self) -> String {
        format!("{:04}-{:02}-{:02}", self.year, self.month, self.day)
    }

    /// Calculate age from date of birth
    pub fn age(&self) -> i32 {
        let now = chrono::Utc::now();
        let birth_year = self.year;
        let current_year = now.format("%Y").to_string().parse::<i32>().unwrap_or(0);
        current_year - birth_year
    }
}

// ============================================================================
// DAY OF WEEK
// ============================================================================

/// Day of week for scheduling
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize, Enum)]
pub enum DayOfWeek {
    Monday,
    Tuesday,
    Wednesday,
    Thursday,
    Friday,
    Saturday,
    Sunday,
}

impl DayOfWeek {
    pub fn all() -> Vec<DayOfWeek> {
        vec![
            DayOfWeek::Monday,
            DayOfWeek::Tuesday,
            DayOfWeek::Wednesday,
            DayOfWeek::Thursday,
            DayOfWeek::Friday,
            DayOfWeek::Saturday,
            DayOfWeek::Sunday,
        ]
    }

    pub fn weekdays() -> Vec<DayOfWeek> {
        vec![
            DayOfWeek::Monday,
            DayOfWeek::Tuesday,
            DayOfWeek::Wednesday,
            DayOfWeek::Thursday,
            DayOfWeek::Friday,
        ]
    }
}
