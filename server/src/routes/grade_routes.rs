use actix_web::{get, post, put, delete, web, HttpResponse, Responder};
use mongodb::Database;
use crate::models::grade::Grade;

const COLL_NAME: &str = "grades";

#[post("/grades")]
#[allow(dead_code)]
pub async fn create_grade(db: web::Data<Database>, grade: web::Json<Grade>) -> impl Responder {
    let collection = db.collection(COLL_NAME);
    let result = GradeService::create_grade(&collection, grade.into_inner()).await;
    match result {
        Ok(insert_result) => HttpResponse::Created().json(insert_result),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/grades")]
#[allow(dead_code)]
pub async fn get_grades(db: web::Data<Database>) -> impl Responder {
    let collection = db.collection(COLL_NAME);
    let result = GradeService::get_all_grades(&collection).await;
    match result {
        Ok(grades) => HttpResponse::Ok().json(grades),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/grades/student/{student_id}")]
#[allow(dead_code)]
pub async fn get_grades_by_student(db: web::Data<Database>, path: web::Path<String>) -> impl Responder {
    let student_id = path.into_inner();
    let collection = db.collection(COLL_NAME);
    let result = GradeService::get_grades_by_student(&collection, &student_id).await;
    match result {
        Ok(grades) => HttpResponse::Ok().json(grades),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[put("/grades/{id}")]
#[allow(dead_code)]
pub async fn update_grade(db: web::Data<Database>, path: web::Path<String>, grade: web::Json<Grade>) -> impl Responder {
    let id = path.into_inner();
    let collection = db.collection(COLL_NAME);
    let result = GradeService::update_grade(&collection, &id, grade.into_inner()).await;
    match result {
        Ok(update_result) => HttpResponse::Ok().json(update_result),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[delete("/grades/{id}")]
#[allow(dead_code)]
pub async fn delete_grade(db: web::Data<Database>, path: web::Path<String>) -> impl Responder {
    let id = path.into_inner();
    let collection = db.collection(COLL_NAME);
    let result = GradeService::delete_grade(&collection, &id).await;
    match result {
        Ok(delete_result) => HttpResponse::Ok().json(delete_result),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[allow(dead_code)]
pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(create_grade);
    cfg.service(get_grades);
    cfg.service(get_grades_by_student);
    cfg.service(update_grade);
    cfg.service(delete_grade);
}
