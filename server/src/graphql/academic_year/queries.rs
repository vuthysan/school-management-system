// Academic Year GraphQL queries
use crate::models::academic_year::AcademicYear;
use async_graphql::*;
use futures::stream::TryStreamExt;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Database,
};

#[derive(Default)]
pub struct AcademicYearQuery;

#[Object]
impl AcademicYearQuery {
    /// Get all academic years for a school
    async fn academic_years(
        &self,
        ctx: &Context<'_>,
        school_id: String,
    ) -> Result<Vec<AcademicYear>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<AcademicYear>("academic_years");

        let school_oid =
            ObjectId::parse_str(&school_id).map_err(|_| Error::new("Invalid school ID format"))?;

        let filter = doc! {
            "school_id": school_oid,
            "soft_delete.is_deleted": { "$ne": true }
        };

        let mut cursor = collection
            .find(filter, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        let mut items = Vec::new();
        while let Some(item) = cursor
            .try_next()
            .await
            .map_err(|e| Error::new(e.to_string()))?
        {
            items.push(item);
        }

        Ok(items)
    }

    /// Get academic year by ID
    async fn academic_year(&self, ctx: &Context<'_>, id: String) -> Result<Option<AcademicYear>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<AcademicYear>("academic_years");

        let obj_id = ObjectId::parse_str(&id).map_err(|_| Error::new("Invalid ID format"))?;

        let item = collection
            .find_one(
                doc! { "_id": obj_id, "soft_delete.is_deleted": { "$ne": true } },
                None,
            )
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        Ok(item)
    }

    /// Get current academic year for a school
    async fn current_academic_year(
        &self,
        ctx: &Context<'_>,
        school_id: String,
    ) -> Result<Option<AcademicYear>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<AcademicYear>("academic_years");

        let school_oid =
            ObjectId::parse_str(&school_id).map_err(|_| Error::new("Invalid school ID format"))?;

        let filter = doc! {
            "school_id": school_oid,
            "is_current": true,
            "soft_delete.is_deleted": { "$ne": true }
        };

        let item = collection
            .find_one(filter, None)
            .await
            .map_err(|e| Error::new(e.to_string()))?;

        Ok(item)
    }
}
