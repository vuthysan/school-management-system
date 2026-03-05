# SMS Improvement Roadmap — Cambodia School Management System

**Date:** 2026-03-04
**Target:** Both private and public Cambodian schools (K-12)
**Current state:** ~70% feature-complete (25 backend modules, 32 pages, 107 components)
**Last audited:** 2026-03-04

---

## Progress Overview

| Phase | Focus | Progress | Status |
|-------|-------|----------|--------|
| 1 | Complete existing modules | **~40%** | In Progress |
| 2 | PDF/Print + Certificates | **~7%** | Not Started |
| 3 | Communication + MoEYS | **~15%** | Not Started |
| 4 | New features | **~3%** | Not Started |

**Overall roadmap: ~20% complete**

---

## System Audit Summary

### Strong (Production-Ready)
- Academic management: classes, subjects, grade levels, exams, timetables
- Student enrollment and management with auto-generated IDs
- Attendance tracking (single + bulk marking)
- MoEYS-aligned grading: Quiz 30%, Midterm 30%, Final 40%
- Finance: fees, payments, invoices with analytics
- Buddhist Era calendar + Cambodian holidays seeding
- Bilingual support (English + Khmer) via i18next
- Role-based access (Owner, Director, Admin, Teacher, Student, Parent)
- Soft delete + audit trail on all entities

### Incomplete
- Inventory management (backend done, frontend uses mock data)
- HR/Payroll (staff CRUD works, no leave/payroll batch/payslip)
- Notification system (read queries only, no frontend UI)
- Parent portal (children listing only)
- Student portal (stub page with hardcoded data)
- Analytics (4 charts working, no export or advanced queries)
- Announcements (no update mutation)
- Teacher dashboard (uses admin routes)

### Missing
- PDF/Print export for any document
- Telegram/SMS parent communication
- MoEYS annual reporting format (Excel export)
- Enrollment/admission workflow
- Scholarship/fee discount management
- Discipline/behavior tracking
- Teacher lesson plan module
- Student transfer system
- School certificates/awards

---

## 4-Phase Improvement Roadmap

### Phase 1: Complete & Polish Existing Modules (~40% done)

#### 1.1 Inventory Management — 70% complete

**Backend:** `server/src/graphql/inventory/` — **DONE**

Model: `InventoryItem`
- school_id, branch_id
- name (LocalizedText), description
- category: Furniture, Electronics, Stationery, Sports, LabEquipment, Books, Other
- quantity, unit_cost, total_value (computed)
- location (room_id or free text)
- supplier, purchase_date, warranty_expiry
- condition: New, Good, Fair, Poor, Damaged
- assigned_to (department or room)
- status, audit, soft_delete

CRUD operations + low-stock alerts query + category summary query.

**Frontend:**
- [x] TypeScript types (`dashboard/types/inventory.ts`)
- [x] GraphQL queries/mutations (`dashboard/app/graphql/inventory.ts`)
- [x] useInventory hook (`dashboard/hooks/useInventory.ts`)
- [x] Page exists at `/admin/(operations)/inventory/`
- [ ] InventoryTable with category filter, condition filter, search
- [ ] InventoryForm (add/edit dialog)
- [ ] InventoryStats (total items, total value, low-stock count, categories breakdown)
- [ ] Wire page to real hooks (currently uses mock data)

#### 1.2 HR/Payroll Completion — 35% complete

**Backend:** `server/src/graphql/hr/` — Staff + basic payroll exist

- [x] Staff CRUD (create, read, update, delete)
- [x] Basic payroll record creation
- [x] Salary storage and display
- [ ] Leave model: staff_id, leave_type (Annual, Sick, Maternity, Personal, Unpaid), start_date, end_date, days, reason, status (Pending, Approved, Rejected), approved_by
- [ ] Leave balance tracking per staff per year
- [ ] Payroll batch processing: generate payroll for all active staff for a given month
- [ ] Payslip detail: base_salary, overtime, allowances, deductions (tax, insurance, leave_without_pay), net_salary

**Frontend:**
- [x] Staff management table with CRUD
- [x] Stats cards (total teachers, active members, avg tenure)
- [x] Tabs UI (Staff, Payroll, Attendance)
- [ ] Leave request form + approval workflow
- [ ] Leave balance display
- [ ] Payroll batch generation page (tab is placeholder)
- [ ] Payslip detail view
- [ ] Staff attendance/leave calendar (tab is placeholder)

#### 1.3 Notification System — 20% complete

**Backend:** `server/src/graphql/notification/`
- [x] Query: myNotifications (for parent users)
- [x] Query: notificationsByStudent
- [x] Mutation: markNotificationAsRead
- [ ] Mutation: createNotification (auto-triggered by events)
- [ ] Mutation: markAllAsRead
- [ ] Event-driven creation: hook into attendance, grade, finance, announcement mutations

**Frontend:**
- [ ] Bell icon in navbar with unread count badge
- [ ] Notification dropdown panel
- [ ] Notification preferences page (toggle per notification type)
- [ ] Mark as read on click

#### 1.4 Parent Portal Enhancement — 27% complete

**Existing:**
- [x] Children listing page with attendance/grade stats
- [x] useParentChildren hook
- [x] Backend: myChildren query with calculated stats

**Add to parent routes (`/auth/parent/`):**
- [ ] Children attendance calendar (visual monthly view with color-coded days)
- [ ] Fee status and payment history per child
- [ ] Upcoming events and exam schedule
- [ ] School announcements feed
- [ ] Child's timetable view

#### 1.5 Student Portal Enhancement — 12% complete

**Existing:**
- [x] Stub page at `/auth/student/academic/` (hardcoded data only)

**Add to student routes (`/auth/student/`):**
- [ ] My timetable (weekly schedule view)
- [ ] My attendance summary (present/absent/late counts, attendance rate)
- [ ] My grades with semester-over-semester comparison chart
- [ ] Upcoming exams and deadlines
- [ ] School announcements relevant to my class/grade
- [ ] Student-specific backend queries (myTimetable, myAttendance, myGrades)

#### 1.6 Analytics Dashboard Enhancement — 75% complete

**Backend queries:**
- [x] getPerformanceAnalytics (class + subject performance, grade distribution)
- [x] getAttendanceAnalytics (weekly trends, average rate)
- [x] getStudentProgress (individual student details)
- [ ] Enrollment trends (students per academic year, growth rate)
- [ ] Fee collection rate (total billed vs collected, by grade/month)
- [ ] Teacher-student ratio (per class, per grade)
- [ ] Attendance rate breakdown (by class, grade, day of week)
- [ ] Top performing students/classes

**Frontend:**
- [x] Academic year + semester selectors
- [x] Stats cards (Overall Average, Total Students, Active Classes, Attendance Rate)
- [x] ClassPerformanceChart, AttendanceTrendChart, GradeDistributionChart, SubjectPerformanceChart
- [x] useAnalytics hook integrated
- [ ] Dashboard selector (overview, academic, financial, operational)
- [ ] Date range picker for all charts
- [ ] Export chart as PNG/CSV

---

### Phase 2: PDF/Print & Certificate Generation (~7% done)

#### 2.1 PDF Generation Infrastructure — Not started

**Backend approach:** Add a PDF generation service using Rust `printpdf` or `genpdf` crate.

New endpoint: `GET /export/{type}/{id}?format=pdf`

Types: report-card, transcript, receipt, attendance-report, class-list, certificate

**Template system:**
- [ ] School branding (logo, name, colors) auto-applied
- [ ] Bilingual layout (Khmer primary, English secondary)
- [ ] Buddhist Era year in headers
- [ ] Signature and stamp placeholders

#### 2.2 Report Cards (MoEYS Format) — 50% complete (display only)

**Existing:**
- [x] Backend query: reportCard, classReportCards with MoEYS grading
- [x] Frontend component: report-card-view.tsx
- [x] MoEYS grading scale (A/B/C/D/F) + weighting (30/30/40)
- [x] Buddhist Era year display
- [ ] PDF export/download

Layout:
- School header: logo, name (km/en), address, phone, registration number
- Student info: photo, full name (km/en), class, student ID, academic year (BE)
- Grades table: Subject | Quiz (30%) | Midterm (30%) | Final (40%) | Average | Grade
- Summary: Overall average, overall grade, rank in class, total students
- Remarks: Teacher comments
- Footer: Teacher signature, Principal signature, School stamp, Date

#### 2.3 Student Transcript — Not started

- [ ] Multi-year layout (all academic years attended)
- [ ] Per-semester grade breakdown
- [ ] Cumulative GPA calculation
- [ ] Official school letterhead
- [ ] Verification stamp area

#### 2.4 Financial Receipts — Not started

- [ ] Receipt number, date
- [ ] Student name, class, student ID
- [ ] Fee breakdown (name, amount)
- [ ] Total paid, payment method
- [ ] Processed by (staff name)
- [ ] School stamp area

#### 2.5 Attendance Reports — Not started

- [ ] Monthly summary per student (days present, absent, late, excused)
- [ ] Class-level summary for teachers
- [ ] Grade-level summary for admin
- [ ] Export to Excel for MoEYS submission

#### 2.6 Class Lists — Not started

- [ ] Student roster with optional photos
- [ ] Parent contact information column
- [ ] Emergency contact column
- [ ] Export to Excel and PDF

#### 2.7 Certificates — Not started

Template types:
- **Completion Certificate**: Student completed [grade/program] at [school]
- **Award Certificate**: Excellence in [subject], Best attendance, etc.
- **Recommendation Letter**: Template with fillable fields
- **Transfer Certificate**: Student [name] has been a student at [school] from [date] to [date]

Each template includes: school branding, bilingual text, Buddhist Era date, signature lines, certificate number.

---

### Phase 3: Telegram Bot + MoEYS Reporting (~15% done)

#### 3.1 Telegram Bot Integration — Not started

**Existing:** Only `telegram_id` field captured from Koompi OAuth.

**Backend:**
- [ ] New module: `server/src/graphql/telegram/`
- [ ] School settings: telegram_bot_token, telegram_enabled
- [ ] Parent linking: generate unique 6-digit code, parent sends code to bot
- [ ] Model: TelegramLink (school_id, user_id, telegram_chat_id, linked_at, is_active)
- [ ] Message queue: store pending messages, process via background task
- [ ] Rate limiting: max 30 messages per second per bot (Telegram API limit)

**Message templates (bilingual):**

| Event | Khmer Template | English Template |
|-------|---------------|-----------------|
| Absence | កូន [name] របស់អ្នកត្រូវបានកត់សម្គាល់ថាអវត្តមានថ្ងៃនេះ ([date]) | Your child [name] was marked absent today ([date]) |
| Late | កូន [name] មកយឺតនៅម៉ោង [time] | Your child [name] arrived late at [time] |
| Grade | ពិន្ទុថ្មីសម្រាប់មុខវិជ្ជា [subject]: [score]/[max] | New grade for [subject]: [score]/[max] |
| Fee due | ការរំលឹកបង់ថ្លៃ: [fee] ចំនួន $[amount] ផុតកំណត់ [date] | Fee reminder: [fee] of $[amount] due [date] |
| Payment | ទទួលបានការបង់ប្រាក់ $[amount]។ វិក្កយបត្រ #[number] | Payment of $[amount] received. Receipt #[number] |
| Announcement | [school]: [title] | [school]: [title] |
| Exam | ការប្រឡង [subject] នៅ [date] ម៉ោង [time] | Exam: [subject] on [date] at [time] |

**Two-way messaging:**
- [ ] Parent replies to bot → stored as ParentMessage
- [ ] Teacher sees messages in dashboard inbox
- [ ] Teacher replies from dashboard → sent via bot to parent
- [ ] Message history stored per conversation (parent ↔ teacher)

**Frontend:**
- [ ] School settings: Telegram bot configuration page
- [ ] Parent linking: QR code display + manual code entry
- [ ] Teacher inbox: conversation list, message thread view
- [ ] Admin: broadcast message to all parents or filtered group
- [ ] Notification log: sent/failed/pending message tracking

#### 3.2 MoEYS Annual Reporting — 30% complete

**Existing:**
- [x] MoEYS grading format (A-F scale, 30/30/40 weighting)
- [x] MoEYS school ID field in School model
- [x] Buddhist Era date formatting

**Report types:**
1. [ ] **School Statistics Report**: Total students by gender per grade, total teachers by qualification, student-teacher ratio
2. [ ] **Attendance Summary Report**: Monthly/yearly attendance rates, dropout rates
3. [ ] **Infrastructure Report**: Number of classrooms, labs, libraries, condition status
4. [ ] **Financial Report**: Fee collection summary, outstanding payments

**Export format:** Excel (.xlsx) matching MoEYS template structure
- [ ] Add Excel export crate to backend
- [ ] Backend query endpoints for aggregated school data
- [ ] Frontend export UI

---

### Phase 4: New Cambodia-Specific Features (~3% done)

#### 4.1 Enrollment/Admission Workflow — 15% complete

**Existing:**
- [x] EnrollmentType enum (New, Transfer, Returning) in Student model
- [x] EnrollmentInfo struct (enrollment_date, entry_grade, previous_school, admission_number)
- [x] StudentStatus includes Graduated, Transferred, Expelled states

**Models needed:**
- [ ] Application: student_info, guardian_info, documents, previous_school, applied_grade, status (Submitted, UnderReview, TestScheduled, Accepted, Rejected, Waitlisted, Enrolled)
- [ ] EntranceTest: application_id, test_date, score, max_score, examiner_id

**Flow:** Parent submits application → Admin reviews → Schedule entrance test (optional) → Accept/Reject → Auto-create student record on acceptance

**Frontend:**
- [ ] Application form (public-facing)
- [ ] Admin review dashboard
- [ ] Status tracking

#### 4.2 Scholarship/Fee Discount Management — Not started

**Model:**
- [ ] Scholarship: school_id, name, type (Merit, NeedBased, Sibling, StaffChild, EarlyBird, Custom), discount_type (Percentage, FixedAmount), discount_value, applicable_fees, academic_year, max_recipients
- [ ] StudentScholarship: student_id, scholarship_id, awarded_date, valid_until

**Integration:** Auto-apply discounts when generating invoices.

#### 4.3 Discipline/Behavior Tracking — Not started

**Model:**
- [ ] Incident: school_id, student_id, reported_by, date, category (AcademicDishonesty, Bullying, Tardiness, UniformViolation, Disrespect, PropertyDamage, Other), severity (Minor, Moderate, Major, Critical), description, action_taken, parent_notified, follow_up_date

**Features:** Incident log per student, pattern detection, auto-notify parents on major incidents.

#### 4.4 Teacher Lesson Plans — Not started

**Model:**
- [ ] LessonPlan: school_id, teacher_id, subject_id, class_id, week_number, academic_year, term, topic, objectives, activities, materials, homework, status (Draft, Submitted, Approved, Revised)

**Features:** Weekly plan entry, head teacher review, curriculum alignment tracking.

#### 4.5 Student Transfer System — Not started

**Flow:** Source school initiates transfer → generates transfer certificate + academic records → Target school receives and creates student record.

**Model:**
- [ ] TransferRequest: student_id, source_school_id, target_school_id, reason, status (Pending, Approved, Completed, Rejected), academic_records_attached

#### 4.6 School Certificates — Not started

**Template-based system:**
- [ ] Admin selects template type
- [ ] Fill in student name, achievement, date
- [ ] Auto-apply school branding, Buddhist Era date
- [ ] Generate PDF with certificate number
- [ ] Track all issued certificates

---

## Technical Debt to Address

| # | Issue | Severity | Status |
|---|-------|----------|--------|
| 1 | **Standardize ID types**: Mix of ObjectId and String across models | HIGH | Not fixed |
| 2 | **Standardize DateTime handling**: Some fields use `#[graphql(skip)]`, no consistent ISO 8601 | MEDIUM | Not fixed |
| 3 | **Standardize Status fields**: 5+ different status enums (Status, StudentStatus, UserStatus, MemberStatus, SchoolStatus) | MEDIUM | Not fixed |
| 4 | **Add input validation**: No format/range checks on GraphQL inputs | HIGH | Not fixed |
| 5 | **Permission enforcement**: Exists in utils but not applied to all resolvers | MEDIUM | Not fixed |
| 6 | **Error handling**: No error codes, inconsistent error messages | HIGH | Not fixed |

---

## Summary

| Phase | Focus | Key Deliverables | Progress |
|-------|-------|-----------------|----------|
| 1 | Complete existing modules | Inventory, HR/Payroll, Notifications, Parent/Student portals, Analytics | **~40%** |
| 2 | PDF/Print + Certificates | Report cards, transcripts, receipts, attendance reports, certificates | **~7%** |
| 3 | Communication + MoEYS | Telegram bot, two-way messaging, MoEYS annual reports | **~15%** |
| 4 | New features | Enrollment, scholarships, discipline, lesson plans, transfers, certificates | **~3%** |
