use actix_web::{get, post, put, delete, web, HttpResponse, Responder};
use mongodb::Database;
use crate::models::subject::Subject;

const COLL_NAME: &str = "subjects";

#[post("/subjects")]
#[allow(dead_code)]
pub async fn create_subject(db: web::Data<Database>, subject: web::Json<Subject>) -> impl Responder {
    let collection = db.collection(COLL_NAME);
    let result = SubjectService::create_subject(&collection, subject.into_inner()).await;
    match result {
        Ok(insert_result) => HttpResponse::Created().json(insert_result),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/subjects")]
#[allow(dead_code)]
pub async fn get_subjects(db: web::Data<Database>) -> impl Responder {
    let collection = db.collection(COLL_NAME);
    let result = SubjectService::get_all_subjects(&collection).await;
    match result {
        Ok(subjects) => HttpResponse::Ok().json(subjects),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/subjects/{id}")]
#[allow(dead_code)]
pub async fn get_subject(db: web::Data<Database>, path: web::Path<String>) -> impl Responder {
    let id = path.into_inner();
    let collection: mongodb::Collection<Subject> = db.collection(COLL_NAME);
    let result = SubjectService::get_subject_by_id(&collection, &id).await;
    match result {
        Ok(Some(subject)) => HttpResponse::Ok().json(subject),
        Ok(None) => HttpResponse::NotFound().body("Subject not found"),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[put("/subjects/{id}")]
#[allow(dead_code)]
pub async fn update_subject(db: web::Data<Database>, path: web::Path<String>, subject: web::Json<Subject>) -> impl Responder {
    let id = path.into_inner();
    let collection = db.collection(COLL_NAME);
    let result = SubjectService::update_subject(&collection, &id, subject.into_inner()).await;
    match result {
        Ok(update_result) => HttpResponse::Ok().json(update_result),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[delete("/subjects/{id}")]
#[allow(dead_code)]
pub async fn delete_subject(db: web::Data<Database>, path: web::Path<String>) -> impl Responder {
    let id = path.into_inner();
    let collection = db.collection(COLL_NAME);
    let result = SubjectService::delete_subject(&collection, &id).await;
    match result {
        Ok(delete_result) => HttpResponse::Ok().json(delete_result),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[allow(dead_code)]
pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(create_subject);
    cfg.service(get_subjects);
    cfg.service(get_subject);
    cfg.service(update_subject);
    cfg.service(delete_subject);
}
