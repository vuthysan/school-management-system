use mongodb::{Client, options::ClientOptions};
use std::env;
use dotenv::dotenv;

pub struct DB {
    pub client: Client,
}

impl DB {
    pub async fn init() -> Self {
        dotenv().ok();
        let uri = env::var("MONGODB_URI").expect("MONGODB_URI must be set");
        let mut client_options = ClientOptions::parse(uri).await.expect("Failed to parse MONGODB_URI");
        client_options.app_name = Some("SMS Backend".to_string());
        
        let client = Client::with_options(client_options).expect("Failed to initialize client");
        
        println!("✅ Connected to MongoDB");
        
        DB { client }
    }
}
