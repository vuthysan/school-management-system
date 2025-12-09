use actix_web::{get, post, web, HttpResponse, Responder};
use mongodb::Database;
use crate::models::branch::{NewBranch, Branch};

const COLL_NAME: &str = "branches";

#[post("/branches")]
#[allow(dead_code)]
pub async fn create_branch(db: web::Data<Database>, branch: web::Json<NewBranch>) -> impl Responder {
    let collection = db.collection(COLL_NAME);

    let new_branch = branch.into_inner();
    let branch = Branch::new(
        new_branch.school_id,
        new_branch.name,
        new_branch.address,
        new_branch.contact_email,
        new_branch.contact_phone,
    );

    let result = BranchService::create_branch(&collection, branch).await;

    match result {
        Ok(insert_result) => HttpResponse::Created().json(insert_result),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/branches")]
#[allow(dead_code)]
pub async fn get_branches(db: web::Data<Database>) -> impl Responder {
    let collection = db.collection(COLL_NAME);
    let result = BranchService::get_all_branches(&collection).await;
    match result {
        Ok(branches) => HttpResponse::Ok().json(branches),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/branches/{id}")]
#[allow(dead_code)]
pub async fn get_branch(db: web::Data<Database>, path: web::Path<String>) -> impl Responder {
    let id = path.into_inner();
    let collection = db.collection(COLL_NAME);
    let result = BranchService::get_branch_by_id(&collection, &id).await;
    match result {
        Ok(Some(branch)) => HttpResponse::Ok().json(branch),
        Ok(None) => HttpResponse::NotFound().body("Branch not found"),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[get("/branches/school/{school_id}")]
#[allow(dead_code)]
pub async fn get_branches_by_school(db: web::Data<Database>, path: web::Path<String>) -> impl Responder {
    let school_id = path.into_inner();
    let collection = db.collection(COLL_NAME);
    let result = BranchService::get_branches_by_school(&collection, &school_id).await;
    match result {
        Ok(branches) => HttpResponse::Ok().json(branches),
        Err(err) => HttpResponse::InternalServerError().body(err.to_string()),
    }
}

#[allow(dead_code)]
pub fn config(cfg: &mut web::ServiceConfig) {
    cfg.service(create_branch);
    cfg.service(get_branches);
    cfg.service(get_branch);
    cfg.service(get_branches_by_school);
}
