use async_graphql::InputObject;

use crate::models::school::{EducationLevel, SchoolType};
use crate::utils::common_types::{Address, ContactInfo, LocalizedText};

/// Input for school registration
#[derive(InputObject)]
pub struct RegisterSchoolInput {
    /// School name in English
    pub name: String,
    /// School name in Khmer (optional)
    pub name_km: Option<String>,
    /// Type of school
    pub school_type: SchoolType,
    /// Education levels offered
    pub education_levels: Vec<EducationLevel>,

    /// Address
    pub address: Address,
    /// Contact information
    pub contact: ContactInfo,
    /// Website URL
    pub website: Option<String>,

    /// Description
    pub description: Option<String>,
}

/// Input for approving a school
#[derive(InputObject)]
pub struct ApproveSchoolInput {
    pub school_id: String,
}

/// Input for rejecting a school
#[derive(InputObject)]
pub struct RejectSchoolInput {
    pub school_id: String,
    pub rejection_reason: String,
}

/// Input for updating school details
#[derive(InputObject)]
pub struct UpdateSchoolInput {
    pub name: Option<LocalizedText>,
    pub school_type: Option<SchoolType>,
    pub education_levels: Option<Vec<EducationLevel>>,
    pub address: Option<Address>,
    pub contact: Option<ContactInfo>,
    pub website: Option<String>,
    pub description: Option<String>,
}
