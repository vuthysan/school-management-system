// GraphQL schema creation
use async_graphql::{Schema, EmptySubscription};
use mongodb::Database;
use super::{QueryRoot, MutationRoot};

pub type AppSchema = Schema<QueryRoot, MutationRoot, EmptySubscription>;

pub fn create_schema(db: Database) -> AppSchema {
    Schema::build(QueryRoot::default(), MutationRoot::default(), EmptySubscription)
        .data(db)
        .finish()
}
