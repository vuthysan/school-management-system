use actix_web::{get, post, web, HttpResponse, Responder};
use mongodb::{Database, bson::oid::ObjectId};
use serde::Deserialize;
use crate::models::school::School;

const COLL_NAME: &str = "schools";

#[derive(Debug, Deserialize)]
pub struct CreateSchoolRequest {
    pub owner_id: String,
    pub name: String,
    pub banners: Vec<String>,
    pub logo_url: Option<String>,
    pub website: Option<String>,
    pub contact_email: String,
    pub contact_phone: String,
}

#[post("/schools")]
#[allow(dead_code)]
pub async fn create_school(db: web::Data<Database>, req: web::Json<CreateSchoolRequest>) -> impl Responder {
    let collection = db.collection(COLL_NAME);
    
    // Parse owner_id from string to ObjectId
    let owner_id = match ObjectId::parse_str(&req.owner_id) {
        Ok(id) => id,
        Err(_) => return HttpResponse::BadRequest().body("Invalid owner_id format"),
    };
    
    // Use School::new() constructor
    let school = School::new(
        owner_id,
        req.name.clone(),
        req.banners.clone(),
        req.logo_url.clone(),
        req.website.clone(),
        req.contact_email.clone(),
        req.contact_phone.clone(),
    );
    
    let result = SchoolService::create_school(&collection, school).await;
    match result {
        Ok(insert_result) => HttpResponse::Created().json(insert_result),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/schools")]
#[allow(dead_code)]
pub async fn get_schools(db: web::Data<Database>) -> impl Responder {
    let collection = db.collection(COLL_NAME);
    let result = SchoolService::get_all_schools(&collection).await;
    match result {
        Ok(schools) => HttpResponse::Ok().json(schools),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/schools/{id}")]
#[allow(dead_code)]
pub async fn get_school(db: web::Data<Database>, path: web::Path<String>) -> impl Responder {
    let id = path.into_inner();
    let collection = db.collection(COLL_NAME);
    let result = SchoolService::get_school_by_id(&collection, &id).await;
    match result {
        Ok(Some(school)) => HttpResponse::Ok().json(school),
        Ok(None) => HttpResponse::NotFound().body("School not found"),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/schools/owner/{owner_id}")]
#[allow(dead_code)]
pub async fn get_schools_by_owner(db: web::Data<Database>, path: web::Path<String>) -> impl Responder {
    let owner_id = path.into_inner();
    let collection = db.collection(COLL_NAME);
    let result = SchoolService::get_schools_by_owner(&collection, &owner_id).await;
    match result {
        Ok(schools) => HttpResponse::Ok().json(schools),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[allow(dead_code)]
pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(create_school);
    cfg.service(get_schools);
    cfg.service(get_school);
    cfg.service(get_schools_by_owner);
}
