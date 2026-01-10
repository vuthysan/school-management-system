// GraphQL module - modular domain-based structure
pub mod academic_year;
pub mod attendance;
pub mod branch;
pub mod calendar;
pub mod class;
pub mod common;
pub mod finance;
pub mod grade;
pub mod grade_level;
pub mod graphql_context;
pub mod hr;
pub mod member;
pub mod schema;
pub mod school;
pub mod student;
pub mod subject;
pub mod term;
pub mod user;

use async_graphql::MergedObject;

// Re-export common types for convenience
pub use common::*;

// Merged Query combining all domain queries
#[derive(MergedObject, Default)]
pub struct QueryRoot(
    school::SchoolQuery,
    branch::BranchQuery,
    student::StudentQuery,
    class::ClassQuery,
    subject::SubjectQuery,
    attendance::AttendanceQuery,
    grade::GradeQuery,
    grade_level::GradeLevelQuery,
    member::MemberQuery,
    user::UserQuery,
    hr::HRQuery,
    academic_year::AcademicYearQuery,
    term::TermQuery,
    calendar::CalendarQuery,
    finance::FinanceQuery,
);

// Merged Mutation combining all domain mutations
#[derive(MergedObject, Default)]
pub struct MutationRoot(
    school::SchoolMutation,
    branch::BranchMutation,
    student::StudentMutation,
    class::ClassMutation,
    subject::SubjectMutation,
    attendance::AttendanceMutation,
    grade::GradeMutation,
    grade_level::GradeLevelMutation,
    member::MemberMutation,
    hr::HRMutation,
    academic_year::AcademicYearMutation,
    term::TermMutation,
    calendar::CalendarMutation,
    finance::FinanceMutation,
);
