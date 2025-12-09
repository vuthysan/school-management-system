use actix_web::{get, post, put, delete, web, HttpResponse, Responder};
use mongodb::Database;
use crate::models::attendance::Attendance;

const COLL_NAME: &str = "attendance";

#[post("/attendance")]
#[allow(dead_code)]
pub async fn create_attendance(db: web::Data<Database>, attendance: web::Json<Attendance>) -> impl Responder {
    let collection = db.collection(COLL_NAME);
    let result = AttendanceService::create_attendance(&collection, attendance.into_inner()).await;
    match result {
        Ok(insert_result) => HttpResponse::Created().json(insert_result),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/attendance")]
#[allow(dead_code)]
pub async fn get_attendance(db: web::Data<Database>) -> impl Responder {
    let collection = db.collection(COLL_NAME);
    let result = AttendanceService::get_all_attendance(&collection).await;
    match result {
        Ok(records) => HttpResponse::Ok().json(records),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/attendance/student/{student_id}")]
#[allow(dead_code)]
pub async fn get_attendance_by_student(db: web::Data<Database>, path: web::Path<String>) -> impl Responder {
    let student_id = path.into_inner();
    let collection = db.collection(COLL_NAME);
    let result = AttendanceService::get_attendance_by_student(&collection, &student_id).await;
    match result {
        Ok(records) => HttpResponse::Ok().json(records),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[put("/attendance/{id}")]
#[allow(dead_code)]
pub async fn update_attendance(db: web::Data<Database>, path: web::Path<String>, attendance: web::Json<Attendance>) -> impl Responder {
    let id = path.into_inner();
    let collection = db.collection(COLL_NAME);
    let result = AttendanceService::update_attendance(&collection, &id, attendance.into_inner()).await;
    match result {
        Ok(update_result) => HttpResponse::Ok().json(update_result),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[delete("/attendance/{id}")]
#[allow(dead_code)]
pub async fn delete_attendance(db: web::Data<Database>, path: web::Path<String>) -> impl Responder {
    let id = path.into_inner();
    let collection = db.collection(COLL_NAME);
    let result = AttendanceService::delete_attendance(&collection, &id).await;
    match result {
        Ok(delete_result) => HttpResponse::Ok().json(delete_result),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[allow(dead_code)]
pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(create_attendance);
    cfg.service(get_attendance);
    cfg.service(get_attendance_by_student);
    cfg.service(update_attendance);
    cfg.service(delete_attendance);
}
