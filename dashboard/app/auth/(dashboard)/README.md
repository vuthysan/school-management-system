# Dashboard Directory Structure

## Final Organized Structure

```
auth/(dashboard)/
├── layout.tsx                    # Shared layout
├── page.tsx                      # Main dashboard
│
├── ministry/                     # Ministry routes → /auth/ministry
│   ├── page.tsx                  # /auth/ministry
│   ├── schools/
│   │   └── page.tsx             # /auth/ministry/schools
│   ├── analytics/
│   ├── compliance/
│   ├── reports/
│   └── settings/
│
├── owner/                        # Owner routes → /auth/owner
│   ├── page.tsx                  # /auth/owner
│   ├── schools/
│   ├── analytics/
│   └── reports/
│
├── admin/                        # Admin routes → /auth/admin
│   ├── students/
│   │   └── page.tsx             # /auth/admin/students
│   ├── academic/
│   ├── attendance/
│   ├── grading/
│   ├── finance/
│   ├── hr/
│   ├── library/
│   ├── transport/
│   ├── inventory/
│   ├── communication/
│   └── settings/
│
├── teacher/                      # Teacher routes → /auth/teacher
│   ├── classes/
│   ├── attendance/
│   ├── grading/
│   ├── students/
│   ├── messages/
│   ├── schedule/
│   └── profile/
│
├── parent/                       # Parent routes → /auth/parent
│   ├── children/
│   ├── grades/
│   ├── attendance/
│   ├── payments/
│   ├── messages/
│   ├── announcements/
│   └── profile/
│
└── student/                      # Student routes → /auth/student
    ├── schedule/
    ├── grades/
    ├── attendance/
    ├── library/
    ├── announcements/
    └── profile/
```

## URL Mapping

All routes are organized by role prefix:
- `/auth/ministry` → Ministry dashboard
- `/auth/ministry/schools` → Schools management
- `/auth/admin/students` → Students page
- `/auth/teacher/classes` → Classes page
- `/auth/parent/children` → Children page
- `/auth/student/schedule` → Schedule page

## Benefits

✅ Clear role-based organization with URL prefixes
✅ No duplicate directories
✅ Easy to find and maintain pages
✅ Scalable for future features
✅ Clear URL structure showing user role

