use actix_web::{get, post, put, delete, web, HttpResponse, Responder};
use mongodb::Database;
use crate::models::class::Class;

const COLL_NAME: &str = "classes";

#[post("/classes")]
#[allow(dead_code)]
pub async fn create_class(db: web::Data<Database>, class: web::Json<Class>) -> impl Responder {
    let collection = db.collection(COLL_NAME);
    let result = ClassService::create_class(&collection, class.into_inner()).await;
    match result {
        Ok(insert_result) => HttpResponse::Created().json(insert_result),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/classes")]
#[allow(dead_code)]
pub async fn get_classes(db: web::Data<Database>) -> impl Responder {
    let collection = db.collection(COLL_NAME);
    let result = ClassService::get_all_classes(&collection).await;
    match result {
        Ok(classes) => HttpResponse::Ok().json(classes),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/classes/{id}")]
#[allow(dead_code)]
pub async fn get_class(db: web::Data<Database>, path: web::Path<String>) -> impl Responder {
    let id = path.into_inner();
    let collection: mongodb::Collection<Class> = db.collection(COLL_NAME);
    let result = ClassService::get_class_by_id(&collection, &id).await;
    match result {
        Ok(Some(class)) => HttpResponse::Ok().json(class),
        Ok(None) => HttpResponse::NotFound().body("Class not found"),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[put("/classes/{id}")]
#[allow(dead_code)]
pub async fn update_class(db: web::Data<Database>, path: web::Path<String>, class: web::Json<Class>) -> impl Responder {
    let id = path.into_inner();
    let collection = db.collection(COLL_NAME);
    let result = ClassService::update_class(&collection, &id, class.into_inner()).await;
    match result {
        Ok(update_result) => HttpResponse::Ok().json(update_result),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[delete("/classes/{id}")]
#[allow(dead_code)]
pub async fn delete_class(db: web::Data<Database>, path: web::Path<String>) -> impl Responder {
    let id = path.into_inner();
    let collection = db.collection(COLL_NAME);
    let result = ClassService::delete_class(&collection, &id).await;
    match result {
        Ok(delete_result) => HttpResponse::Ok().json(delete_result),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[allow(dead_code)]
pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(create_class);
    cfg.service(get_classes);
    cfg.service(get_class);
    cfg.service(update_class);
    cfg.service(delete_class);
}
