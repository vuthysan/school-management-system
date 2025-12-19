# Dashboard Directory Structure

## Final Organized Structure

```
auth/(dashboard)/
├── layout.tsx                    # Shared layout
├── page.tsx                      # Main dashboard
│
├── settings/                     # Shared settings
│   └── profile/                  # Centralized profile
│
├── owner/                        # Owner routes
│   └── schools/                  # School management
│
└── admin/                        # Admin routes
    ├── (academic)/               # Academic group
    │   ├── academic/
    │   ├── attendance/
    │   └── grading/
    ├── (institution)/            # Institution group
    │   ├── branches/
    │   ├── schools/
    │   └── settings/
    ├── (management)/             # Management group
    │   ├── communication/
    │   ├── hr/
    │   ├── members/
    │   └── students/
    ├── (operations)/             # Operations group
    │   ├── inventory/
    │   ├── library/
    │   └── transport/
    └── (finance)/                # Finance group
        └── finance/

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
