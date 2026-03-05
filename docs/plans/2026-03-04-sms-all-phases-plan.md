# SMS Cambodia — Full Improvement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete and extend the Cambodia SMS to production-ready status across 4 phases: polish existing modules, PDF/print capabilities, Telegram communication, and new Cambodia-specific features.

**Architecture:** Rust/async-graphql backend with MongoDB, Next.js 16 App Router frontend with Tailwind CSS. Each domain module follows the same pattern: model → GraphQL types/inputs/queries/mutations → frontend types → GraphQL operations → hook → components → page → translations.

**Tech Stack:** Rust + Actix-web + async-graphql + MongoDB (backend), Next.js 16 + TypeScript + Tailwind CSS + Radix UI + Framer Motion (frontend), i18next for en/km bilingual support.

**Reference design:** `docs/plans/2026-03-04-sms-improvement-roadmap-design.md`

---

## Phase 1: Complete & Polish Existing Modules

### Task 1: Inventory Management — Backend Model

**Files:**
- Create: `server/src/models/inventory.rs`
- Modify: `server/src/models/mod.rs` (add `pub mod inventory;`)

**What to build:**
- `InventoryCategory` enum: `Furniture`, `Electronics`, `Stationery`, `Sports`, `LabEquipment`, `Books`, `Other` (with `#[derive(Enum, Serialize, Deserialize)]` and `#[graphql(name = "...")]`)
- `ItemCondition` enum: `New`, `Good`, `Fair`, `Poor`, `Damaged`
- `InventoryItem` struct with fields: `id` (Option<ObjectId>), `school_id`, `branch_id` (Option), `name` (String), `description` (Option), `category` (InventoryCategory), `quantity` (i32), `unit_cost` (f64), `currency` (String, default "USD"), `location` (Option), `supplier` (Option), `purchase_date` (Option<String>), `warranty_expiry` (Option<String>), `condition` (ItemCondition), `assigned_to` (Option), `status` (Status), `audit` (AuditInfo), `soft_delete` (SoftDelete)
- Follow exact pattern from `server/src/models/library.rs`: derive `SimpleObject` with `#[graphql(complex)]`, implement `ComplexObject` for id conversion, add `new()` constructor, `CreateInventoryItemInput` and `UpdateInventoryItemInput`
- Register in `server/src/models/mod.rs`

**Commit:** `feat(inventory): add inventory model with category and condition enums`

---

### Task 2: Inventory Management — Backend GraphQL Module

**Files:**
- Create: `server/src/graphql/inventory/mod.rs`
- Create: `server/src/graphql/inventory/types.rs`
- Create: `server/src/graphql/inventory/inputs.rs`
- Create: `server/src/graphql/inventory/queries.rs`
- Create: `server/src/graphql/inventory/mutations.rs`
- Modify: `server/src/graphql/mod.rs` (add `pub mod inventory;`, add to `QueryRoot` and `MutationRoot`)

**What to build:**
- **types.rs**: `InventoryItemGqlType` with `From<InventoryItem>`, `PaginatedInventoryResult` with `items`, `total`, `page`, `total_pages`. Also `InventoryStats` type with `total_items` (i32), `total_value` (f64), `low_stock_count` (i32), `categories` (Vec<CategorySummary>)
- **inputs.rs**: `InventoryFilterInput` with `search`, `category`, `condition`, `status` (all Optional). Also `CreateInventoryItemInput` and `UpdateInventoryItemInput`
- **queries.rs**: `InventoryQuery` with:
  - `inventory_items(school_id, page, page_size, filter)` → paginated list with soft_delete filter
  - `inventory_item(id)` → single item
  - `inventory_stats(school_id)` → aggregation query for stats
  - `low_stock_items(school_id, threshold)` → items where `quantity < threshold`
- **mutations.rs**: `InventoryMutation` with `create_inventory_item`, `update_inventory_item`, `delete_inventory_item` (soft delete)
- **mod.rs**: re-export queries and mutations
- Register in `QueryRoot` and `MutationRoot` in `server/src/graphql/mod.rs`

**Follow patterns from:** `server/src/graphql/library/` (exact same structure)

**Commit:** `feat(inventory): add GraphQL module with CRUD, stats, and low-stock queries`

---

### Task 3: Inventory Management — Frontend Types + GraphQL Operations

**Files:**
- Create: `dashboard/types/inventory.ts`
- Create: `dashboard/app/graphql/inventory.ts`
- Modify: `dashboard/app/graphql/index.ts` (add `export * from "./inventory";`)

**What to build:**
- **types/inventory.ts**: `InventoryCategory` type union, `ItemCondition` type union, `InventoryItem` interface, `CreateInventoryItemInput`, `UpdateInventoryItemInput`, `InventoryStats` interface
- **graphql/inventory.ts**: `INVENTORY_FIELDS` fragment, `INVENTORY_QUERIES` object with `GET_INVENTORY_ITEMS`, `GET_INVENTORY_ITEM`, `GET_INVENTORY_STATS`, `GET_LOW_STOCK_ITEMS`. `INVENTORY_MUTATIONS` object with `CREATE_INVENTORY_ITEM`, `UPDATE_INVENTORY_ITEM`, `DELETE_INVENTORY_ITEM`
- Re-export from index.ts

**Follow patterns from:** `dashboard/types/library.ts` and `dashboard/app/graphql/library.ts`

**Commit:** `feat(inventory): add frontend types and GraphQL operations`

---

### Task 4: Inventory Management — Frontend Hook

**Files:**
- Create: `dashboard/hooks/useInventory.ts`

**What to build:**
- `useInventoryItems(schoolId)` → `{ items, total, isLoading, error, refresh }`
- `useInventoryStats(schoolId)` → `{ stats, isLoading, error, refresh }`
- `useInventoryMutations()` → `{ createItem, updateItem, deleteItem }`
- Follow exact pattern from `dashboard/hooks/useLibrary.ts`

**Commit:** `feat(inventory): add useInventory hook with CRUD operations`

---

### Task 5: Inventory Management — Frontend Components + Page

**Files:**
- Create: `dashboard/components/inventory/inventory-stats.tsx`
- Create: `dashboard/components/inventory/inventory-table.tsx`
- Create: `dashboard/components/inventory/inventory-form.tsx`
- Modify: `dashboard/app/auth/(dashboard)/admin/(operations)/inventory/page.tsx` (replace placeholder)

**What to build:**
- **inventory-stats.tsx**: 4 StatsCards (total items, total value, low stock count, categories count). Follow `dashboard/components/library/library-stats.tsx` pattern
- **inventory-table.tsx**: Table with columns: Name, Category, Quantity, Unit Cost, Condition, Location, Status, Actions. Include search, category filter, condition filter. Follow `dashboard/components/library/books-table.tsx` pattern
- **inventory-form.tsx**: Dialog form with fields for all InventoryItem properties. Follow `dashboard/components/library/book-form.tsx` pattern
- **page.tsx**: Full page with PageHeader, InventoryStats, InventoryTable, Dialog for form, DeleteConfirmDialog. Follow `dashboard/app/auth/(dashboard)/admin/(operations)/library/page.tsx` pattern

**Commit:** `feat(inventory): add inventory page with stats, table, and form components`

---

### Task 6: Inventory Management — Translations

**Files:**
- Modify: `dashboard/public/locales/en/translation.json`
- Modify: `dashboard/public/locales/km/translation.json`

**What to add (both languages):**
- Keys: `inventory_management`, `manage_inventory_subtitle`, `add_item`, `edit_item`, `delete_item`, `item_name`, `category`, `quantity`, `unit_cost`, `total_value`, `condition`, `location`, `supplier`, `purchase_date`, `warranty_expiry`, `assigned_to`, `low_stock`, `low_stock_alert`, `no_items`, `no_items_desc`, `furniture`, `electronics`, `stationery`, `sports`, `lab_equipment`, `item_condition_new`, `item_condition_good`, `item_condition_fair`, `item_condition_poor`, `item_condition_damaged`

**Commit:** `feat(inventory): add en/km translations for inventory module`

---

### Task 7: HR/Payroll — Backend Leave Model + Queries

**Files:**
- Modify: `server/src/models/hr.rs` (add `Leave` and `LeaveBalance` structs)
- Modify: `server/src/graphql/hr/types.rs` (add `LeaveType`, `LeaveBalanceType`, `PayslipType`)
- Modify: `server/src/graphql/hr/inputs.rs` (add `CreateLeaveInput`, `UpdateLeaveStatusInput`, `GeneratePayrollInput`)
- Modify: `server/src/graphql/hr/queries.rs` (add `staff_leaves`, `leave_balances`, `payroll_history`)
- Modify: `server/src/graphql/hr/mutations.rs` (add `create_leave`, `update_leave_status`, `generate_monthly_payroll`)

**What to build:**
- `LeaveType` enum: `Annual`, `Sick`, `Maternity`, `Personal`, `Unpaid`
- `LeaveStatus` enum: `Pending`, `Approved`, `Rejected`
- `Leave` model: `id`, `school_id`, `staff_id`, `leave_type`, `start_date`, `end_date`, `days` (i32), `reason`, `status` (LeaveStatus), `approved_by` (Option), `created_at`, `updated_at`
- `LeaveBalance` model: `id`, `school_id`, `staff_id`, `academic_year`, `annual_total` (i32), `annual_used` (i32), `sick_total`, `sick_used`, etc.
- Payroll batch mutation: iterate all active staff for given month, compute net_salary = base_salary + bonuses - deductions
- Payslip detail type with breakdown

**Commit:** `feat(hr): add leave management and payroll batch processing`

---

### Task 8: HR/Payroll — Frontend Leave + Payroll UI

**Files:**
- Create: `dashboard/types/hr.ts` (Leave, LeaveBalance, Payslip types)
- Modify: `dashboard/app/graphql/hr.ts` (add leave/payroll queries and mutations, currently exists but check what's there)
- Create: `dashboard/hooks/useLeaves.ts`
- Create: `dashboard/hooks/usePayroll.ts` (or extend useStaff)
- Create: `dashboard/components/hr/leave-request-form.tsx`
- Create: `dashboard/components/hr/leaves-table.tsx`
- Create: `dashboard/components/hr/payroll-table.tsx`
- Create: `dashboard/components/hr/payslip-view.tsx`
- Modify: `dashboard/app/auth/(dashboard)/admin/(management)/hr/page.tsx` (add Leave and Payroll tabs)

**What to build:**
- HR page gets 3 tabs: Staff, Leaves, Payroll
- Leaves tab: table of leave requests with status, approve/reject buttons for managers
- Payroll tab: month selector, "Generate Payroll" button, payroll table with staff name/base/bonuses/deductions/net/status
- Leave request form: staff selector, leave type, date range, reason
- Payslip view: detailed breakdown in a dialog
- Add translations for all new keys (en + km)

**Commit:** `feat(hr): add leave management and payroll UI with approval workflow`

---

### Task 9: Notification System — Backend Enhancement

**Files:**
- Modify: `server/src/graphql/notification/queries.rs` (add `my_notifications` with pagination, `unread_count`)
- Modify: `server/src/graphql/notification/mutations.rs` (add `create_notification`, `mark_all_as_read`, `delete_notification`)
- Modify: `server/src/graphql/notification/types.rs` (add `PaginatedNotificationsResult`, `NotificationPreference`)
- Modify: `server/src/models/notification.rs` (add `NotificationPreference` model)

**What to build:**
- `my_notifications(page, pageSize, type_filter, is_read)` → paginated, sorted by created_at desc
- `unread_count()` → integer count for badge
- `create_notification(input)` → create new notification (used internally by other mutations)
- `mark_all_as_read()` → bulk update for current user
- `NotificationPreference` model: `user_id`, `school_id`, `attendance_enabled` (bool), `grade_enabled`, `finance_enabled`, `announcement_enabled` — all default true

**Commit:** `feat(notifications): add pagination, unread count, and bulk mark as read`

---

### Task 10: Notification System — Frontend Bell + Dropdown

**Files:**
- Create: `dashboard/hooks/useNotifications.ts`
- Create: `dashboard/app/graphql/notification.ts`
- Create: `dashboard/components/notifications/notification-bell.tsx`
- Create: `dashboard/components/notifications/notification-panel.tsx`
- Modify: `dashboard/components/navbar.tsx` (add NotificationBell to navbar)
- Add translations (en + km)

**What to build:**
- `useNotifications()` hook: fetches notifications, unread count, provides markAsRead, markAllAsRead
- `NotificationBell`: bell icon with red badge showing unread count, click opens panel
- `NotificationPanel`: dropdown popover with scrollable list of notifications, each clickable to mark as read. Group by today/earlier. "Mark all as read" button at top
- Notification item: icon by type (attendance=clock, grade=star, finance=dollar, announcement=megaphone), title, message preview, relative time ("2 hours ago")
- Add to navbar next to language/theme toggles

**Commit:** `feat(notifications): add notification bell with dropdown panel in navbar`

---

### Task 11: Parent Portal Enhancement

**Files:**
- Create: `dashboard/app/auth/(dashboard)/parent/attendance/page.tsx`
- Create: `dashboard/app/auth/(dashboard)/parent/fees/page.tsx`
- Create: `dashboard/app/auth/(dashboard)/parent/events/page.tsx`
- Create: `dashboard/app/auth/(dashboard)/parent/timetable/page.tsx`
- Create: `dashboard/components/parent/attendance-calendar.tsx`
- Create: `dashboard/components/parent/fee-status-card.tsx`
- Create: `dashboard/components/parent/child-timetable.tsx`
- Modify: `dashboard/config/sidebar-modules.ts` (add new parent routes)
- Add translations (en + km)

**What to build:**
- **Attendance calendar**: Monthly calendar grid with color-coded days (green=present, red=absent, yellow=late, gray=excused). Uses existing attendance queries filtered by student_id
- **Fee status page**: Cards per child showing: total fees, paid, outstanding, overdue. Payment history table. Uses existing finance queries filtered by student_id
- **Events page**: Upcoming school events and exam schedule for child's class. Uses existing calendar queries
- **Timetable page**: Weekly schedule view showing child's class timetable. Uses existing class schedule data
- Update sidebar config to add these routes under Parent role

**Commit:** `feat(parent): add attendance calendar, fee status, events, and timetable pages`

---

### Task 12: Student Portal Enhancement

**Files:**
- Create: `dashboard/app/auth/(dashboard)/student/timetable/page.tsx`
- Create: `dashboard/app/auth/(dashboard)/student/attendance/page.tsx`
- Create: `dashboard/app/auth/(dashboard)/student/grades/page.tsx`
- Create: `dashboard/app/auth/(dashboard)/student/exams/page.tsx`
- Create: `dashboard/components/student/weekly-timetable.tsx`
- Create: `dashboard/components/student/attendance-summary.tsx`
- Create: `dashboard/components/student/grade-comparison-chart.tsx`
- Modify: `dashboard/config/sidebar-modules.ts` (add new student routes)
- Add translations (en + km)

**What to build:**
- **Timetable page**: Weekly schedule grid (Mon-Fri rows, period columns). Show subject, teacher, room for each slot. Data from class schedule where student is enrolled
- **Attendance page**: Summary stats (present/absent/late counts, attendance rate %), monthly breakdown chart
- **Grades page**: Current semester grades table + semester-over-semester comparison chart (bar chart or line chart). Show per-subject improvement/decline
- **Exams page**: Upcoming exams list with subject, date, time, room. Past exam results
- Update sidebar config for Student role

**Commit:** `feat(student): add timetable, attendance, grades, and exams portal pages`

---

### Task 13: Analytics Dashboard Enhancement — Backend

**Files:**
- Modify: `server/src/graphql/analytics/queries.rs` (add new aggregation queries)
- Modify: `server/src/graphql/analytics/types.rs` (add new result types)

**What to build (new queries):**
- `enrollment_trends(school_id, years: Vec<String>)` → Vec<YearEnrollment> with `year`, `total_students`, `male_count`, `female_count`, `growth_rate`
- `fee_collection_summary(school_id, academic_year)` → `total_billed`, `total_collected`, `collection_rate`, `outstanding`, `overdue`, `by_grade: Vec<GradeCollectionSummary>`
- `teacher_student_ratios(school_id)` → Vec<ClassRatio> with `class_name`, `student_count`, `teacher_count`, `ratio`
- `attendance_breakdown(school_id, academic_year, month)` → `by_class: Vec<ClassAttendance>`, `by_grade: Vec<GradeAttendance>`, `by_day: Vec<DayAttendance>`
- `top_performers(school_id, academic_year, semester, limit)` → Vec<TopStudent> with `student_name`, `class_name`, `average`, `rank`

All use MongoDB aggregation pipelines following existing analytics pattern.

**Commit:** `feat(analytics): add enrollment trends, fee collection, ratios, and breakdown queries`

---

### Task 14: Analytics Dashboard Enhancement — Frontend

**Files:**
- Create: `dashboard/components/analytics/enrollment-trend-chart.tsx`
- Create: `dashboard/components/analytics/fee-collection-chart.tsx`
- Create: `dashboard/components/analytics/teacher-ratio-chart.tsx`
- Create: `dashboard/components/analytics/top-performers-table.tsx`
- Modify: `dashboard/hooks/useAnalytics.ts` (add new query calls)
- Modify: `dashboard/app/graphql/analytics.ts` (add new queries)
- Modify: `dashboard/app/auth/(dashboard)/admin/(operations)/analytics/page.tsx` (add dashboard tabs: Overview, Academic, Financial, Operational)
- Add translations (en + km)

**What to build:**
- 4-tab analytics dashboard: Overview (existing charts), Academic (grades, attendance breakdown), Financial (fee collection, outstanding), Operational (enrollment trends, ratios)
- Each tab has relevant charts and a date range or year selector
- Use recharts or existing chart library for bar charts, line charts, pie charts
- Add "Export as CSV" button per chart section

**Commit:** `feat(analytics): add multi-tab analytics dashboard with new charts and export`

---

## Phase 2: PDF/Print & Certificate Generation

### Task 15: PDF Generation Infrastructure — Backend

**Files:**
- Add `genpdf` or `printpdf` crate to `server/Cargo.toml`
- Create: `server/src/utils/pdf.rs` (PDF generation utilities)
- Create: `server/src/routes/export.rs` (HTTP endpoints for PDF download)
- Modify: `server/src/main.rs` (register export routes)

**What to build:**
- PDF utility module with helpers: `create_pdf_document(title, school)`, `add_school_header(doc, school)`, `add_table(doc, headers, rows)`, `add_signature_area(doc)`, `add_buddhist_era_date(doc, year)`
- School branding: auto-insert logo, school name (km/en), address, registration number
- Export route: `GET /export/{type}/{id}?format=pdf&lang=km` where type = `report-card`, `transcript`, `receipt`, `attendance-report`, `class-list`, `certificate`
- Route handler: authenticate via JWT, fetch data, generate PDF, return as `Content-Type: application/pdf`

**Commit:** `feat(export): add PDF generation infrastructure with school branding`

---

### Task 16: PDF Report Card (MoEYS Format)

**Files:**
- Create: `server/src/utils/pdf_templates/report_card.rs`
- Modify: `server/src/routes/export.rs` (add report card handler)

**What to build:**
- MoEYS-format report card PDF with:
  - School header block: logo (left), school name km/en (center), address + phone (right)
  - Student info: photo placeholder, full name (km/en), student ID, class, academic year (BE format "ព.ស. 2568")
  - Grades table: Subject | Quiz (30%) | Midterm (30%) | Final (40%) | Average | Grade (A-F)
  - Summary row: Overall Average, Overall Grade, Rank in Class (e.g., "3/45")
  - Teacher remarks section
  - Footer: Teacher signature line (left), Principal signature line (right), School stamp circle (center), Date
- Data source: existing `report_card` query + school data

**Commit:** `feat(export): add MoEYS-format PDF report card generation`

---

### Task 17: PDF Transcript + Financial Receipt

**Files:**
- Create: `server/src/utils/pdf_templates/transcript.rs`
- Create: `server/src/utils/pdf_templates/receipt.rs`
- Modify: `server/src/routes/export.rs`

**What to build:**
- **Transcript**: Multi-year layout, per-semester grades, cumulative GPA, school letterhead, verification stamp area
- **Receipt**: Receipt number, student info, fee breakdown table, total, payment method, processed by, stamp area

**Commit:** `feat(export): add transcript and financial receipt PDF templates`

---

### Task 18: PDF Attendance Report + Class List

**Files:**
- Create: `server/src/utils/pdf_templates/attendance_report.rs`
- Create: `server/src/utils/pdf_templates/class_list.rs`
- Modify: `server/src/routes/export.rs`

**What to build:**
- **Attendance report**: Student monthly summary (days present/absent/late/excused), class summary, grade summary. Also generate as Excel (.xlsx) for MoEYS submission using `rust_xlsxwriter` crate
- **Class list**: Student roster table with: #, Student ID, Name (km/en), Gender, DOB, Guardian Name, Guardian Phone. Also as Excel

**Commit:** `feat(export): add attendance report and class list with PDF and Excel export`

---

### Task 19: Certificate Templates

**Files:**
- Create: `server/src/utils/pdf_templates/certificate.rs`
- Create: `server/src/models/certificate.rs` (track issued certificates)
- Create: `server/src/graphql/certificate/` (mod.rs, types.rs, inputs.rs, queries.rs, mutations.rs)
- Modify: `server/src/graphql/mod.rs` and `server/src/models/mod.rs`

**What to build:**
- Certificate model: `id`, `school_id`, `student_id`, `certificate_number` (auto-generated: CERT-YYYY-XXXXX), `type` (Completion, Award, Recommendation, Transfer), `title`, `description`, `issued_date`, `issued_by`, `status`, `audit`, `soft_delete`
- 4 PDF templates: Completion, Award, Recommendation, Transfer — each with school branding, bilingual text, Buddhist Era date, signature lines, certificate number, decorative border
- CRUD mutations for tracking issued certificates
- Frontend: Certificate management page under admin, "Issue Certificate" form, certificate history table

**Commit:** `feat(certificates): add certificate model, templates, and tracking system`

---

### Task 20: Export Buttons — Frontend Integration

**Files:**
- Create: `dashboard/components/shared/export-button.tsx`
- Modify: `dashboard/app/auth/(dashboard)/admin/(academic)/grading/page.tsx` (add "Export Report Card" button)
- Modify: `dashboard/app/auth/(dashboard)/admin/(academic)/attendance/page.tsx` (add "Export Attendance Report" button)
- Modify: `dashboard/app/auth/(dashboard)/admin/(finance)/finance/page.tsx` (add "Export Receipt" button)
- Modify: `dashboard/app/auth/(dashboard)/admin/(management)/students/page.tsx` (add "Export Class List" button)
- Add translations (en + km)

**What to build:**
- `ExportButton` component: accepts `type`, `id`, `format` (pdf/xlsx), calls `/export/{type}/{id}?format={format}` with auth token, triggers browser download
- Add export buttons to relevant pages
- Show loading spinner during PDF generation
- Handle errors (show toast)

**Commit:** `feat(export): add export buttons to grading, attendance, finance, and student pages`

---

## Phase 3: Telegram Bot + MoEYS Reporting

### Task 21: Telegram Bot — Backend Infrastructure

**Files:**
- Add `teloxide` or `reqwest` to `server/Cargo.toml` (for Telegram Bot API calls)
- Create: `server/src/models/telegram.rs` (TelegramLink, MessageQueue models)
- Create: `server/src/graphql/telegram/` (mod.rs, types.rs, inputs.rs, queries.rs, mutations.rs)
- Modify: `server/src/models/school.rs` (add `telegram_bot_token` and `telegram_enabled` to SchoolSettings)
- Modify: `server/src/graphql/mod.rs` and `server/src/models/mod.rs`

**What to build:**
- `TelegramLink` model: `school_id`, `user_id`, `student_id`, `telegram_chat_id` (i64), `linking_code` (6-digit), `code_expires_at`, `linked_at`, `is_active`
- `MessageQueue` model: `school_id`, `telegram_chat_id`, `message_text`, `notification_type`, `status` (Pending, Sent, Failed), `error_message`, `created_at`, `sent_at`, `retry_count`
- Mutations: `configure_telegram_bot(school_id, bot_token)`, `generate_linking_code(school_id, student_id)`, `verify_linking_code(code, chat_id)`, `send_telegram_message(chat_id, message)`, `unlink_telegram(link_id)`
- Queries: `telegram_links(school_id)`, `message_queue(school_id, status)`
- Background task: process message queue, send via Telegram Bot API, handle rate limiting (30 msg/sec)

**Commit:** `feat(telegram): add Telegram bot infrastructure with linking and message queue`

---

### Task 22: Telegram Bot — Event-Driven Notifications

**Files:**
- Modify: `server/src/graphql/attendance/mutations.rs` (trigger notification on absence/late)
- Modify: `server/src/graphql/grade/mutations.rs` (trigger on new grade)
- Modify: `server/src/graphql/finance/mutations.rs` (trigger on fee due/payment received)
- Modify: `server/src/graphql/announcement/mutations.rs` (trigger on new announcement)
- Create: `server/src/utils/telegram_sender.rs` (helper to queue Telegram messages)

**What to build:**
- `queue_telegram_notification(db, school_id, student_id, notification_type, title, message)` helper function that:
  1. Finds TelegramLinks for the student's parents
  2. Creates MessageQueue entries
  3. Creates Notification entries (for in-app display too)
- Hook into existing mutations:
  - `mark_attendance` → if absent or late, queue notification to parents
  - `add_grade` → queue grade notification to parents
  - `create_payment` / fee due date check → queue finance notification
  - `create_announcement` → queue to all linked parents in target group
- Bilingual message templates: check parent's language preference, send in km or en

**Commit:** `feat(telegram): add event-driven notification triggers for attendance, grades, finance, and announcements`

---

### Task 23: Telegram Bot — Two-Way Messaging

**Files:**
- Create: `server/src/models/message.rs` (ParentMessage, TeacherReply)
- Create: `server/src/graphql/messaging/` (mod.rs, types.rs, inputs.rs, queries.rs, mutations.rs)
- Create: `server/src/routes/telegram_webhook.rs` (webhook endpoint for bot incoming messages)
- Modify: `server/src/main.rs` (register webhook route)

**What to build:**
- Telegram webhook: `POST /telegram/webhook/{school_id}` receives incoming messages from parents
- `ParentMessage` model: `school_id`, `parent_user_id`, `student_id`, `teacher_user_id` (assigned homeroom teacher), `telegram_chat_id`, `message_text`, `sent_at`, `is_read`
- `TeacherReply` model: `parent_message_id`, `teacher_user_id`, `reply_text`, `sent_at`, `telegram_sent` (bool)
- Queries: `parent_messages(school_id, teacher_id)` for teacher inbox, `conversation(parent_id, teacher_id)`
- Mutations: `reply_to_parent(message_id, reply_text)` → saves reply + sends via Telegram bot
- Auto-assign messages to homeroom teacher of the student's class

**Commit:** `feat(telegram): add two-way parent-teacher messaging via Telegram`

---

### Task 24: Telegram Bot — Frontend Configuration + Inbox

**Files:**
- Create: `dashboard/components/settings/telegram-settings.tsx`
- Create: `dashboard/components/messaging/teacher-inbox.tsx`
- Create: `dashboard/components/messaging/conversation-thread.tsx`
- Create: `dashboard/components/messaging/broadcast-form.tsx`
- Create: `dashboard/app/auth/(dashboard)/admin/(management)/communication/messaging/page.tsx`
- Modify: `dashboard/app/auth/(dashboard)/admin/(institution)/settings/page.tsx` (add Telegram settings tab)
- Create: `dashboard/hooks/useMessaging.ts`
- Create: `dashboard/hooks/useTelegram.ts`
- Create: `dashboard/app/graphql/telegram.ts`
- Create: `dashboard/app/graphql/messaging.ts`
- Add translations (en + km)

**What to build:**
- **Telegram settings**: Bot token input, enable/disable toggle, test connection button, QR code generator for parent linking, linked parents list with unlink option
- **Teacher inbox**: List of conversations grouped by student/parent, unread count per conversation, click to open thread
- **Conversation thread**: Message bubbles (left=parent, right=teacher), reply text input, send button
- **Broadcast form**: Select recipients (all, specific grade, specific class), compose message (km/en), preview, send
- **Notification log page**: Table of sent/pending/failed messages with filters

**Commit:** `feat(telegram): add Telegram configuration UI, teacher inbox, and broadcast messaging`

---

### Task 25: MoEYS Annual Reporting — Backend

**Files:**
- Create: `server/src/graphql/moeys_report/` (mod.rs, types.rs, queries.rs)
- Modify: `server/src/graphql/mod.rs`
- Add `rust_xlsxwriter` crate to `server/Cargo.toml`
- Create: `server/src/utils/excel_templates/moeys_report.rs`

**What to build:**
- **School Statistics query**: Aggregate students by gender per grade level, total teachers by qualification/subject, student-teacher ratios, new enrollments vs dropouts
- **Attendance Summary query**: Monthly attendance rates per grade, yearly average, comparison with previous year
- **Infrastructure query**: Count rooms by type (classroom, lab, library), condition summary, capacity utilization
- **Financial Summary query**: Total fees billed/collected, collection rate, outstanding by grade
- Excel export endpoint: `GET /export/moeys-report/{school_id}?year={year}` generates multi-sheet Excel file matching MoEYS template format

**Commit:** `feat(moeys): add MoEYS annual reporting queries and Excel export`

---

### Task 26: MoEYS Reporting — Frontend

**Files:**
- Create: `dashboard/app/auth/(dashboard)/admin/(operations)/reports/moeys/page.tsx`
- Create: `dashboard/components/reports/moeys-report-preview.tsx`
- Create: `dashboard/hooks/useMoeysReport.ts`
- Create: `dashboard/app/graphql/moeys-report.ts`
- Modify: `dashboard/app/auth/(dashboard)/admin/(operations)/reports/page.tsx` (add MoEYS Reports tab)
- Add translations (en + km)

**What to build:**
- MoEYS report page: select academic year, preview report data in tables, "Download Excel" button
- 4 report sections matching MoEYS format: School Statistics, Attendance, Infrastructure, Financial
- Each section shows data in preview tables before export
- One-click export generates the complete Excel file

**Commit:** `feat(moeys): add MoEYS report preview page with Excel download`

---

## Phase 4: New Cambodia-Specific Features

### Task 27: Enrollment/Admission — Backend

**Files:**
- Create: `server/src/models/admission.rs` (Application, EntranceTest)
- Create: `server/src/graphql/admission/` (mod.rs, types.rs, inputs.rs, queries.rs, mutations.rs)
- Modify: `server/src/graphql/mod.rs` and `server/src/models/mod.rs`

**What to build:**
- `Application` model: `school_id`, `academic_year`, `applied_grade`, `student_info` (embedded: name, dob, gender, nationality), `guardian_info` (embedded: name, phone, email, relationship), `previous_school` (Option), `documents` (Vec<Attachment>), `status` (Submitted, UnderReview, TestScheduled, Accepted, Rejected, Waitlisted, Enrolled), `submitted_at`, `reviewed_by`, `review_notes`, `audit`, `soft_delete`
- `EntranceTest` model: `application_id`, `school_id`, `test_date`, `subjects` (Vec with subject_name, score, max_score), `total_score`, `max_total`, `examiner_id`, `remarks`
- CRUD mutations + status transitions: `submit_application`, `review_application`, `schedule_test`, `record_test_result`, `accept_application` (auto-creates Student record), `reject_application`, `waitlist_application`
- Queries: `applications(school_id, status, academic_year, page, pageSize)`, `application(id)`, `admission_stats(school_id, academic_year)`

**Commit:** `feat(admission): add enrollment/admission workflow with application and entrance test`

---

### Task 28: Enrollment/Admission — Frontend

**Files:**
- Create: `dashboard/types/admission.ts`
- Create: `dashboard/app/graphql/admission.ts`
- Create: `dashboard/hooks/useAdmissions.ts`
- Create: `dashboard/components/admission/application-form.tsx`
- Create: `dashboard/components/admission/applications-table.tsx`
- Create: `dashboard/components/admission/admission-stats.tsx`
- Create: `dashboard/components/admission/review-dialog.tsx`
- Create: `dashboard/components/admission/test-result-form.tsx`
- Create: `dashboard/app/auth/(dashboard)/admin/(management)/admission/page.tsx`
- Modify: `dashboard/config/sidebar-modules.ts` (add Admission under Management)
- Add translations (en + km)

**What to build:**
- Admin dashboard: applications table with status filters (Submitted, Under Review, Accepted, etc.), bulk actions
- Application review dialog: view all submitted info, documents, add notes, change status
- Test scheduling and result entry form
- Stats: total applications, acceptance rate, pending review count, by grade level
- Application form (for parents): step-by-step wizard with student info, guardian info, document upload

**Commit:** `feat(admission): add enrollment management UI with review workflow`

---

### Task 29: Scholarship/Fee Discount — Backend + Frontend

**Files:**
- Create: `server/src/models/scholarship.rs`
- Create: `server/src/graphql/scholarship/` (full module)
- Create: `dashboard/types/scholarship.ts`
- Create: `dashboard/app/graphql/scholarship.ts`
- Create: `dashboard/hooks/useScholarships.ts`
- Create: `dashboard/components/finance/scholarship-form.tsx`
- Create: `dashboard/components/finance/scholarships-table.tsx`
- Create: `dashboard/components/finance/student-scholarship-assign.tsx`
- Modify: `dashboard/app/auth/(dashboard)/admin/(finance)/finance/page.tsx` (add Scholarships tab)
- Modify: `server/src/graphql/finance/mutations.rs` (auto-apply discounts in invoice generation)
- Add translations (en + km)

**What to build:**
- `Scholarship` model: `school_id`, `name`, `type` (Merit, NeedBased, Sibling, StaffChild, EarlyBird, Custom), `discount_type` (Percentage, FixedAmount), `discount_value` (f64), `applicable_fees` (Vec<String> of fee IDs, empty = all), `academic_year`, `max_recipients` (Option<i32>), `current_recipients` (i32), `status`, `audit`, `soft_delete`
- `StudentScholarship` model: `student_id`, `scholarship_id`, `school_id`, `awarded_date`, `valid_until` (Option), `status`, `audit`
- Scholarship CRUD, assign/unassign to students
- Modify invoice generation: when creating invoice, check student's active scholarships, apply discount to applicable fees
- Frontend: Scholarships tab in Finance page with table, form, and student assignment dialog

**Commit:** `feat(scholarship): add scholarship management with auto-apply to invoices`

---

### Task 30: Discipline/Behavior Tracking — Backend + Frontend

**Files:**
- Create: `server/src/models/discipline.rs`
- Create: `server/src/graphql/discipline/` (full module)
- Create: `dashboard/types/discipline.ts`
- Create: `dashboard/app/graphql/discipline.ts`
- Create: `dashboard/hooks/useDiscipline.ts`
- Create: `dashboard/components/discipline/incident-form.tsx`
- Create: `dashboard/components/discipline/incidents-table.tsx`
- Create: `dashboard/components/discipline/student-behavior-summary.tsx`
- Create: `dashboard/app/auth/(dashboard)/admin/(management)/discipline/page.tsx`
- Modify: `dashboard/config/sidebar-modules.ts` (add Discipline under Management)
- Add translations (en + km)

**What to build:**
- `Incident` model: `school_id`, `student_id`, `reported_by`, `date`, `category` (AcademicDishonesty, Bullying, Tardiness, UniformViolation, Disrespect, PropertyDamage, Fighting, Other), `severity` (Minor, Moderate, Major, Critical), `description`, `action_taken`, `parent_notified` (bool), `follow_up_date` (Option), `follow_up_notes` (Option), `witnesses` (Vec<String>), `status` (Open, Resolved, Escalated), `audit`, `soft_delete`
- Queries: `incidents(school_id, student_id, category, severity, page, pageSize)`, `student_behavior_summary(student_id)` → counts by category/severity
- Mutations: CRUD + `notify_parent(incident_id)` (triggers Telegram notification if Phase 3 is complete)
- Frontend: Incidents table with filters, incident form, student behavior summary card
- Integration: show behavior summary on student profile view

**Commit:** `feat(discipline): add incident tracking with parent notification integration`

---

### Task 31: Teacher Lesson Plans — Backend + Frontend

**Files:**
- Create: `server/src/models/lesson_plan.rs`
- Create: `server/src/graphql/lesson_plan/` (full module)
- Create: `dashboard/types/lesson-plan.ts`
- Create: `dashboard/app/graphql/lesson-plan.ts`
- Create: `dashboard/hooks/useLessonPlans.ts`
- Create: `dashboard/components/lesson-plan/lesson-plan-form.tsx`
- Create: `dashboard/components/lesson-plan/lesson-plans-table.tsx`
- Create: `dashboard/components/lesson-plan/lesson-plan-review.tsx`
- Create: `dashboard/app/auth/(dashboard)/admin/(academic)/lesson-plans/page.tsx`
- Modify: `dashboard/config/sidebar-modules.ts` (add Lesson Plans under Academic)
- Add translations (en + km)

**What to build:**
- `LessonPlan` model: `school_id`, `teacher_id`, `subject_id`, `class_id`, `academic_year`, `term`, `week_number` (i32), `date` (String), `topic`, `objectives` (Vec<String>), `activities` (Vec<String>), `materials` (Vec<String>), `homework` (Option), `assessment_method` (Option), `reflections` (Option, filled after lesson), `status` (Draft, Submitted, Approved, Revised, Rejected), `reviewed_by` (Option), `review_notes` (Option), `audit`, `soft_delete`
- Teacher view: create/edit lesson plans, see review status
- Head teacher/admin view: review submitted plans, approve/reject with notes
- Calendar-like view: weekly grid showing planned vs unplanned lessons
- Filter by teacher, subject, class, week, status

**Commit:** `feat(lesson-plans): add lesson plan creation and approval workflow`

---

### Task 32: Student Transfer System — Backend + Frontend

**Files:**
- Create: `server/src/models/transfer.rs`
- Create: `server/src/graphql/transfer/` (full module)
- Create: `dashboard/types/transfer.ts`
- Create: `dashboard/app/graphql/transfer.ts`
- Create: `dashboard/hooks/useTransfers.ts`
- Create: `dashboard/components/transfer/transfer-form.tsx`
- Create: `dashboard/components/transfer/transfers-table.tsx`
- Create: `dashboard/components/transfer/transfer-certificate-preview.tsx`
- Create: `dashboard/app/auth/(dashboard)/admin/(management)/transfers/page.tsx`
- Modify: `dashboard/config/sidebar-modules.ts`
- Add translations (en + km)

**What to build:**
- `TransferRequest` model: `school_id` (source), `student_id`, `target_school_name`, `target_school_id` (Option, if also on the platform), `reason`, `transfer_date`, `academic_records` (embedded summary of grades, attendance), `status` (Pending, Approved, Completed, Rejected), `approved_by`, `transfer_certificate_number`, `audit`, `soft_delete`
- Flow: Admin initiates transfer → system generates academic records summary → admin approves → transfer certificate generated (uses Phase 2 PDF system) → student status changed to "Transferred"
- Queries: `transfer_requests(school_id, status)`, `transfer_request(id)`
- Mutations: `initiate_transfer`, `approve_transfer` (generates certificate, marks student as Transferred), `reject_transfer`
- Frontend: Transfer management page, initiation form, certificate preview

**Commit:** `feat(transfers): add student transfer workflow with certificate generation`

---

### Task 33: School Certificates — Frontend Integration

**Files:**
- Create: `dashboard/components/certificates/certificate-form.tsx`
- Create: `dashboard/components/certificates/certificates-table.tsx`
- Create: `dashboard/components/certificates/certificate-preview.tsx`
- Create: `dashboard/app/auth/(dashboard)/admin/(operations)/certificates/page.tsx`
- Create: `dashboard/hooks/useCertificates.ts`
- Create: `dashboard/app/graphql/certificate.ts`
- Create: `dashboard/types/certificate.ts`
- Modify: `dashboard/config/sidebar-modules.ts` (add Certificates under Operations)
- Add translations (en + km)

**What to build:**
- Certificate management page: issue new certificates, view history, search by student
- Certificate form: select type (Completion, Award, Recommendation, Transfer), select student, fill details (achievement, description), preview PDF
- Certificate table: list all issued certificates with filters by type, date, student
- Preview component: shows PDF preview before issuing
- Download/print button that calls Phase 2 PDF endpoint

**Commit:** `feat(certificates): add certificate management UI with PDF preview and download`

---

## Technical Debt Tasks (Run in Parallel with Any Phase)

### Task 34: Standardize ID Types and DateTime Handling

**Files:**
- Modify: `server/src/models/attendance.rs` (change ObjectId refs to String)
- Modify: `server/src/models/grade.rs` (change ObjectId refs to String)
- Modify: `server/src/models/hr.rs` (add AuditInfo and SoftDelete, replace raw DateTime)
- Modify: `server/src/models/finance.rs` (add AuditInfo and SoftDelete where missing)

**What to do:**
- Replace raw `ObjectId` references with `String` for school_id, student_id, class_id in attendance and grade models
- Add `AuditInfo` and `SoftDelete` to hr.rs models (Staff, Payroll) replacing raw `created_at`/`updated_at`
- Add `AuditInfo` and `SoftDelete` to finance.rs models (Fee, Payment, Invoice)
- Ensure all queries filter `"soft_delete.is_deleted": false`

**Commit:** `refactor: standardize ID types, DateTime handling, and soft delete across all models`

---

### Task 35: Permission Enforcement Audit

**Files:**
- Modify: all `queries.rs` and `mutations.rs` files in `server/src/graphql/`

**What to do:**
- Audit every resolver: ensure mutations check appropriate permission before executing
- Add `let gql_ctx = get_graphql_context(ctx)?; let auth_user = gql_ctx.require_auth()?;` to all mutation resolvers
- Add `member.has_permission(Permission::ManageStudents)` checks using existing permission system
- Document which permissions each resolver requires

**Commit:** `security: enforce role-based permissions across all GraphQL resolvers`

---

## Summary

| Phase | Tasks | Estimated Scope |
|-------|-------|----------------|
| Phase 1 | Tasks 1-14 | 6 modules: Inventory, HR/Payroll, Notifications, Parent Portal, Student Portal, Analytics |
| Phase 2 | Tasks 15-20 | PDF infrastructure + 6 templates + export buttons |
| Phase 3 | Tasks 21-26 | Telegram bot + two-way messaging + MoEYS reports |
| Phase 4 | Tasks 27-33 | 6 new features: Admission, Scholarship, Discipline, Lesson Plans, Transfers, Certificates |
| Tech Debt | Tasks 34-35 | Standardization + security audit |

**Total: 35 tasks across 4 phases + tech debt**

Each task is independently committable and follows the established patterns documented in this plan. Tasks within a phase should be done in order (backend before frontend for each feature). Tech debt tasks can run in parallel with any phase.
