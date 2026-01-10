// Term GraphQL queries
use crate::models::term::Term;
use async_graphql::*;
use futures::stream::TryStreamExt;
use mongodb::{
    bson::{doc, oid::ObjectId},
    Database,
};

#[derive(Default)]
pub struct TermQuery;

#[Object]
impl TermQuery {
    /// Get all terms for a school
    async fn terms(&self, ctx: &Context<'_>, school_id: String) -> Result<Vec<Term>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Term>("terms");

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

    /// Get terms for a specific academic year
    async fn terms_by_academic_year(
        &self,
        ctx: &Context<'_>,
        academic_year_id: String,
    ) -> Result<Vec<Term>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Term>("terms");

        let year_oid = ObjectId::parse_str(&academic_year_id)
            .map_err(|_| Error::new("Invalid academic year ID format"))?;

        let filter = doc! {
            "academic_year_id": year_oid,
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

    /// Get term by ID
    async fn term(&self, ctx: &Context<'_>, id: String) -> Result<Option<Term>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Term>("terms");

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

    /// Get current term for a school
    async fn current_term(&self, ctx: &Context<'_>, school_id: String) -> Result<Option<Term>> {
        let db = ctx.data::<Database>()?;
        let collection = db.collection::<Term>("terms");

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
