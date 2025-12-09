# School Management System - Data Schemas

This document outlines all data models/schemas for the SMS backend (MongoDB).

---

## Core Modules

### 1. Student Schema

**Collection**: `students`

```rust
{
  _id: ObjectId,
  first_name: String,
  last_name: String,
  email: String,
  date_of_birth: String,        // ISO 8601 format
  gender: String,                // "male" | "female" | "other"
  phone: String,
  address: String,
  grade_level: String,
  guardian_name: String,
  guardian_phone: String,
  enrollment_date: DateTime,
  status: String,                // "active" | "inactive" | "graduated" | "transferred"
  student_id: String,            // Unique student identifier
  profile_photo: Option<String>, // URL or path
  created_at: DateTime,
  updated_at: DateTime
}
```

---

### 2. Academic Schema

**Collection**: `classes`

```rust
{
  _id: ObjectId,
  class_name: String,            // e.g., "Grade 10A"
  grade_level: String,           // e.g., "10"
  section: String,               // e.g., "A"
  academic_year: String,         // e.g., "2024-2025"
  teacher_id: ObjectId,          // Reference to Staff
  room_number: String,
  capacity: i32,
  student_ids: Vec<ObjectId>,    // References to Students
  schedule: Vec<Schedule>,       // See Schedule sub-schema
  created_at: DateTime,
  updated_at: DateTime
}
```

**Sub-schema: Schedule**
```rust
{
  day: String,                   // "Monday" | "Tuesday" | ...
  subject: String,
  start_time: String,            // "08:00"
  end_time: String,              // "09:00"
  teacher_id: ObjectId
}
```

**Collection**: `subjects`

```rust
{
  _id: ObjectId,
  subject_name: String,
  subject_code: String,
  description: String,
  grade_levels: Vec<String>,     // Applicable grades
  credits: i32,
  created_at: DateTime,
  updated_at: DateTime
}
```

---

### 3. Attendance Schema

**Collection**: `attendance`

```rust
{
  _id: ObjectId,
  student_id: ObjectId,
  class_id: ObjectId,
  date: DateTime,
  status: String,                // "present" | "absent" | "late" | "excused"
  remarks: Option<String>,
  marked_by: ObjectId,           // Staff ID
  created_at: DateTime,
  updated_at: DateTime
}
```

---

### 4. Grading Schema

**Collection**: `grades`

```rust
{
  _id: ObjectId,
  student_id: ObjectId,
  class_id: ObjectId,
  subject_id: ObjectId,
  academic_year: String,
  semester: String,              // "1" | "2"
  assessment_type: String,       // "quiz" | "midterm" | "final" | "assignment"
  score: f64,
  max_score: f64,
  percentage: f64,
  grade: String,                 // "A" | "B" | "C" | "D" | "F"
  remarks: Option<String>,
  graded_by: ObjectId,           // Staff ID
  graded_at: DateTime,
  created_at: DateTime,
  updated_at: DateTime
}
```

---

### 5. Finance Schema

**Collection**: `fees`

```rust
{
  _id: ObjectId,
  fee_name: String,              // "Tuition" | "Library" | "Transport"
  amount: f64,
  currency: String,              // "USD" | "KHR"
  grade_level: Option<String>,   // If grade-specific
  academic_year: String,
  due_date: DateTime,
  created_at: DateTime,
  updated_at: DateTime
}
```

**Collection**: `payments`

```rust
{
  _id: ObjectId,
  student_id: ObjectId,
  fee_id: ObjectId,
  amount_paid: f64,
  currency: String,
  payment_method: String,        // "cash" | "bank_transfer" | "card"
  payment_date: DateTime,
  receipt_number: String,
  status: String,                // "pending" | "completed" | "failed"
  remarks: Option<String>,
  processed_by: ObjectId,        // Staff ID
  created_at: DateTime,
  updated_at: DateTime
}
```

**Collection**: `invoices`

```rust
{
  _id: ObjectId,
  invoice_number: String,
  student_id: ObjectId,
  fee_ids: Vec<ObjectId>,
  total_amount: f64,
  amount_paid: f64,
  balance: f64,
  currency: String,
  issue_date: DateTime,
  due_date: DateTime,
  status: String,                // "unpaid" | "partial" | "paid" | "overdue"
  created_at: DateTime,
  updated_at: DateTime
}
```

---

### 6. HR & Staff Schema

**Collection**: `staff`

```rust
{
  _id: ObjectId,
  staff_id: String,              // Unique identifier
  first_name: String,
  last_name: String,
  email: String,
  phone: String,
  date_of_birth: String,
  gender: String,
  address: String,
  role: String,                  // "teacher" | "admin" | "principal" | "librarian"
  department: Option<String>,
  subjects: Vec<String>,         // For teachers
  hire_date: DateTime,
  salary: f64,
  currency: String,
  status: String,                // "active" | "inactive" | "on_leave"
  profile_photo: Option<String>,
  created_at: DateTime,
  updated_at: DateTime
}
```

**Collection**: `payroll`

```rust
{
  _id: ObjectId,
  staff_id: ObjectId,
  month: String,                 // "2024-01"
  base_salary: f64,
  bonuses: f64,
  deductions: f64,
  net_salary: f64,
  currency: String,
  payment_date: DateTime,
  status: String,                // "pending" | "paid"
  created_at: DateTime,
  updated_at: DateTime
}
```

---

## Add-on Modules

### 7. Library Schema

**Collection**: `books`

```rust
{
  _id: ObjectId,
  isbn: String,
  title: String,
  author: String,
  publisher: String,
  publication_year: i32,
  category: String,
  quantity: i32,
  available: i32,
  location: String,              // Shelf/section
  cover_image: Option<String>,
  created_at: DateTime,
  updated_at: DateTime
}
```

**Collection**: `book_loans`

```rust
{
  _id: ObjectId,
  book_id: ObjectId,
  borrower_id: ObjectId,         // Student or Staff ID
  borrower_type: String,         // "student" | "staff"
  loan_date: DateTime,
  due_date: DateTime,
  return_date: Option<DateTime>,
  status: String,                // "active" | "returned" | "overdue"
  fine_amount: Option<f64>,
  created_at: DateTime,
  updated_at: DateTime
}
```

---

### 8. Transport Schema

**Collection**: `buses`

```rust
{
  _id: ObjectId,
  bus_number: String,
  license_plate: String,
  capacity: i32,
  driver_name: String,
  driver_phone: String,
  route_id: ObjectId,
  status: String,                // "active" | "maintenance" | "inactive"
  created_at: DateTime,
  updated_at: DateTime
}
```

**Collection**: `routes`

```rust
{
  _id: ObjectId,
  route_name: String,
  stops: Vec<Stop>,              // See Stop sub-schema
  start_time: String,
  end_time: String,
  created_at: DateTime,
  updated_at: DateTime
}
```

**Sub-schema: Stop**
```rust
{
  stop_name: String,
  arrival_time: String,
  coordinates: Option<Coordinates>
}
```

**Sub-schema: Coordinates**
```rust
{
  latitude: f64,
  longitude: f64
}
```

**Collection**: `transport_assignments`

```rust
{
  _id: ObjectId,
  student_id: ObjectId,
  bus_id: ObjectId,
  route_id: ObjectId,
  pickup_stop: String,
  dropoff_stop: String,
  academic_year: String,
  status: String,                // "active" | "inactive"
  created_at: DateTime,
  updated_at: DateTime
}
```

---

### 9. Inventory Schema

**Collection**: `inventory_items`

```rust
{
  _id: ObjectId,
  item_name: String,
  item_code: String,
  category: String,              // "furniture" | "electronics" | "stationery" | "sports"
  quantity: i32,
  unit: String,                  // "piece" | "box" | "set"
  location: String,
  purchase_date: DateTime,
  purchase_price: f64,
  currency: String,
  condition: String,             // "new" | "good" | "fair" | "poor"
  supplier: Option<String>,
  created_at: DateTime,
  updated_at: DateTime
}
```

**Collection**: `inventory_transactions`

```rust
{
  _id: ObjectId,
  item_id: ObjectId,
  transaction_type: String,      // "purchase" | "issue" | "return" | "damage"
  quantity: i32,
  issued_to: Option<ObjectId>,   // Staff or Department ID
  issued_by: ObjectId,           // Staff ID
  transaction_date: DateTime,
  remarks: Option<String>,
  created_at: DateTime,
  updated_at: DateTime
}
```

---

### 10. Communication Schema

**Collection**: `announcements`

```rust
{
  _id: ObjectId,
  title: String,
  content: String,
  author_id: ObjectId,           // Staff ID
  target_audience: Vec<String>,  // "all" | "students" | "staff" | "parents" | "grade_10"
  priority: String,              // "low" | "medium" | "high"
  publish_date: DateTime,
  expiry_date: Option<DateTime>,
  attachments: Vec<String>,      // URLs
  created_at: DateTime,
  updated_at: DateTime
}
```

**Collection**: `messages`

```rust
{
  _id: ObjectId,
  sender_id: ObjectId,
  sender_type: String,           // "student" | "staff" | "parent"
  recipient_id: ObjectId,
  recipient_type: String,
  subject: String,
  body: String,
  read: bool,
  read_at: Option<DateTime>,
  sent_at: DateTime,
  created_at: DateTime,
  updated_at: DateTime
}
```

---

### 11. Settings & Configuration Schema

**Collection**: `school_settings`

```rust
{
  _id: ObjectId,
  school_name: String,
  school_code: String,
  address: String,
  phone: String,
  email: String,
  website: Option<String>,
  logo: Option<String>,
  academic_year_start: String,   // "2024-09-01"
  academic_year_end: String,     // "2025-06-30"
  currency: String,              // "USD" | "KHR"
  timezone: String,              // "Asia/Phnom_Penh"
  language: String,              // "en" | "km"
  created_at: DateTime,
  updated_at: DateTime
}
```

**Collection**: `users`

```rust
{
  _id: ObjectId,
  username: String,
  email: String,
  password_hash: String,
  role: String,                  // "admin" | "principal" | "teacher" | "student" | "parent"
  linked_id: Option<ObjectId>,   // Reference to Student/Staff
  permissions: Vec<String>,
  last_login: Option<DateTime>,
  status: String,                // "active" | "inactive" | "suspended"
  created_at: DateTime,
  updated_at: DateTime
}
```

---

## Indexes

### Recommended Indexes for Performance

```javascript
// Students
db.students.createIndex({ "student_id": 1 }, { unique: true })
db.students.createIndex({ "email": 1 }, { unique: true })
db.students.createIndex({ "grade_level": 1 })

// Attendance
db.attendance.createIndex({ "student_id": 1, "date": -1 })
db.attendance.createIndex({ "class_id": 1, "date": -1 })

// Grades
db.grades.createIndex({ "student_id": 1, "academic_year": 1 })
db.grades.createIndex({ "class_id": 1, "subject_id": 1 })

// Payments
db.payments.createIndex({ "student_id": 1, "payment_date": -1 })
db.payments.createIndex({ "receipt_number": 1 }, { unique: true })

// Staff
db.staff.createIndex({ "staff_id": 1 }, { unique: true })
db.staff.createIndex({ "email": 1 }, { unique: true })

// Users
db.users.createIndex({ "username": 1 }, { unique: true })
db.users.createIndex({ "email": 1 }, { unique: true })
```

---

## Notes

1. **DateTime Format**: All datetime fields use MongoDB's native DateTime type (BSON Date).
2. **Currency**: Support for both USD and KHR (Cambodian Riel).
3. **Localization**: All user-facing strings should support both English and Khmer.
4. **References**: ObjectId fields ending with `_id` or `_ids` are references to other collections.
5. **Soft Deletes**: Consider adding `deleted_at: Option<DateTime>` for soft delete functionality.
6. **Audit Trail**: `created_at` and `updated_at` are mandatory for all collections.
