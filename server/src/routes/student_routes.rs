use actix_web::{get, post, web, HttpResponse, Responder};
use mongodb::Database;
use crate::models::student::Student;

const COLL_NAME: &str = "students";

#[post("/students")]
#[allow(dead_code)]
pub async fn create_student(db: web::Data<Database>, student: web::Json<Student>) -> impl Responder {
    let collection = db.collection(COLL_NAME);
    let result = StudentService::create_student(&collection, student.into_inner()).await;
    match result {
        Ok(insert_result) => HttpResponse::Created().json(insert_result),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/students")]
#[allow(dead_code)]
pub async fn get_students(db: web::Data<Database>) -> impl Responder {
    let collection = db.collection(COLL_NAME);
    let result = StudentService::get_all_students(&collection).await;
    match result {
        Ok(students) => HttpResponse::Ok().json(students),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/students/{id}")]
#[allow(dead_code)]
pub async fn get_student(db: web::Data<Database>, path: web::Path<String>) -> impl Responder {
    let id = path.into_inner();
    let collection: mongodb::Collection<Student> = db.collection(COLL_NAME);
    let result = StudentService::get_student_by_id(&collection, &id).await;
    match result {
        Ok(Some(student)) => HttpResponse::Ok().json(student),
        Ok(None) => HttpResponse::NotFound().body("Student not found"),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[allow(dead_code)]
pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(create_student);
    cfg.service(get_students);
    cfg.service(get_student);
}
