// Common shared types (Address)
use crate::utils::common_types::Address;
use async_graphql::*;

// NOTE: The common_types::Address now has SimpleObject + InputObject derives
// These legacy types are kept for backward compatibility but may be removed

// Address output type
#[derive(SimpleObject, Clone)]
pub struct AddressType {
    pub street: Option<String>,
    pub village: Option<String>,
    pub commune: Option<String>,
    pub district: Option<String>,
    pub province: String,
    pub postal_code: Option<String>,
    pub country: Option<String>,
}

impl From<Address> for AddressType {
    fn from(addr: Address) -> Self {
        AddressType {
            street: addr.street,
            village: addr.village,
            commune: addr.commune,
            district: addr.district,
            province: addr.province,
            postal_code: addr.postal_code,
            country: addr.country,
        }
    }
}

impl From<AddressType> for Address {
    fn from(addr: AddressType) -> Self {
        Address {
            street: addr.street,
            village: addr.village,
            commune: addr.commune,
            district: addr.district,
            province: addr.province,
            postal_code: addr.postal_code,
            country: addr.country,
        }
    }
}

// Legacy Address input type - prefer using common_types::Address directly
#[derive(InputObject)]
pub struct AddressInput {
    pub street: Option<String>,
    pub village: Option<String>,
    pub commune: Option<String>,
    pub district: Option<String>,
    pub province: String,
    pub postal_code: Option<String>,
    pub country: Option<String>,
}

impl From<AddressInput> for Address {
    fn from(addr: AddressInput) -> Self {
        Address {
            street: addr.street,
            village: addr.village,
            commune: addr.commune,
            district: addr.district,
            province: addr.province,
            postal_code: addr.postal_code,
            country: addr.country,
        }
    }
}
