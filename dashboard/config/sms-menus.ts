export type UserRole = "admin" | "principal" | "teacher" | "student" | "parent";

export type SupportedLang = "en" | "km";

type LocalizedLabel = {
  en: string;
  km: string;
};

export type MenuItem = {
  key: string;
  label: LocalizedLabel;
  href?: string;
};

export type MenuGroup = {
  key: string;
  title: LocalizedLabel;
  items: MenuItem[];
};

export const roleToMenu: Record<UserRole | "principal", MenuGroup[]> = {
  admin: [
    {
      key: "dashboard_home",
      title: { en: "Dashboard Home", km: "ផ្ទាំងគ្រប់គ្រង" },
      items: [
        {
          key: "overview",
          label: { en: "Overview & Analytics", km: "ទិដ្ឋភាពទូទៅ និងវិភាគ" },
          href: "#",
        },
      ],
    },
    {
      key: "school_setup",
      title: { en: "School Setup", km: "ការកំណត់សាលា" },
      items: [
        {
          key: "academic_terms",
          label: { en: "Academic Year & Terms", km: "ឆ្នាំសិក្សា និងឆមាស" },
          href: "#",
        },
        {
          key: "grades_classes",
          label: { en: "Grades & Classes", km: "ថ្នាក់ និងក្រុម" },
          href: "#",
        },
        {
          key: "subjects_curriculum",
          label: {
            en: "Subjects & Curriculum",
            km: "មុខវិជ្ជា និងមូលដ្ធានវិទ្យាសិក្សា",
          },
          href: "#",
        },
      ],
    },
    {
      key: "user_management",
      title: { en: "User Management", km: "ការគ្រប់គ្រងអ្នកប្រើ" },
      items: [
        {
          key: "staff_directory",
          label: { en: "Staff Directory", km: "បញ្ជីបុគ្គលិក" },
          href: "#",
        },
        {
          key: "student_directory",
          label: { en: "Student Directory", km: "បញ្ជីសិស្ស" },
          href: "#",
        },
        {
          key: "parent_access",
          label: { en: "Parent Access", km: "ការចូលប្រើរបស់ឪពុកម្តាយ" },
          href: "#",
        },
      ],
    },
    {
      key: "admissions",
      title: { en: "Admissions", km: "ការទទួលសិស្ស" },
      items: [
        {
          key: "new_applications",
          label: { en: "New Applications", km: "ពាក្យស្នើថ្មី" },
          href: "#",
        },
        {
          key: "enrollment_history",
          label: { en: "Enrollment History", km: "ប្រវត្តិការចុះឈ្មោះ" },
          href: "#",
        },
      ],
    },
    {
      key: "finance_fees",
      title: { en: "Finance & Fees", km: "ហិរញ្ញវត្ថុ និងថ្លៃសិក្សា" },
      items: [
        {
          key: "fee_structure",
          label: { en: "Fee Structure", km: "រចនាសម្ព័ន្ធថ្លៃសិក្សា" },
          href: "#",
        },
        {
          key: "invoicing_payments",
          label: { en: "Invoicing & Payments", km: "វិក្កយបត្រ និងការទូទាត់" },
          href: "#",
        },
        {
          key: "financial_reports",
          label: { en: "Financial Reports", km: "របាយការណ៍ហិរញ្ញវត្ថុ" },
          href: "#",
        },
      ],
    },
    {
      key: "reports",
      title: { en: "Reports", km: "របាយការណ៍" },
      items: [
        {
          key: "academic_reports",
          label: { en: "Academic Reports", km: "របាយការណ៍សិក្សា" },
          href: "#",
        },
        {
          key: "attendance_reports",
          label: { en: "Attendance Reports", km: "របាយការណ៍វត្តមាន" },
          href: "#",
        },
        {
          key: "moeys_reports",
          label: { en: "MoEYS Compliance", km: "របាយការណ៍តាម MoEYS" },
          href: "#",
        },
      ],
    },
    {
      key: "communication",
      title: { en: "Communication", km: "ការទំនាក់​ទំនង" },
      items: [
        {
          key: "announcements",
          label: { en: "Announcements & Alerts", km: "សេចក្តីជូនដំណឹង" },
          href: "#",
        },
        {
          key: "internal_messaging",
          label: { en: "Internal Messaging", km: "សារ​ខាងក្នុង" },
          href: "#",
        },
      ],
    },
  ],
  principal: [
    // Principals share the same menu as admin in this initial design
    ...([] as MenuGroup[]),
  ],
  teacher: [
    {
      key: "dashboard_home",
      title: { en: "Dashboard Home", km: "ផ្ទាំងគ្រប់គ្រង" },
      items: [
        {
          key: "todays_schedule",
          label: {
            en: "My Workload & Today's Schedule",
            km: "ភារកិច្ច និងកាលវិភាគថ្ងៃនេះ",
          },
          href: "#",
        },
      ],
    },
    {
      key: "my_classes",
      title: { en: "My Classes", km: "ថ្នាក់របស់ខ្ញុំ" },
      items: [
        {
          key: "class_list",
          label: { en: "Class List & Students", km: "បញ្ជីថ្នាក់ និងសិស្ស" },
          href: "#",
        },
        {
          key: "take_attendance",
          label: { en: "Take Attendance", km: "ត្រួតពិនិត្យវត្តមាន" },
          href: "#",
        },
      ],
    },
    {
      key: "academics",
      title: { en: "Academics", km: "វិជ្ជាសិក្សា" },
      items: [
        {
          key: "lesson_plans",
          label: { en: "Lesson Plans", km: "ផែនការមេរៀន" },
          href: "#",
        },
        {
          key: "assignments",
          label: { en: "Assignments & Homework", km: "លំហាត់ និងកិច្ចការផ្ទះ" },
          href: "#",
        },
      ],
    },
    {
      key: "grades_marks",
      title: { en: "Grades & Marks", km: "ពិន្ទុ និងសមិទ្ធិផល" },
      items: [
        {
          key: "mark_entry",
          label: { en: "Mark Entry", km: "បញ្ចូលពិន្ទុ" },
          href: "#",
        },
        {
          key: "gradebook",
          label: { en: "Grade Book View", km: "សៀវភៅពិន្ទុ" },
          href: "#",
        },
      ],
    },
    {
      key: "communication",
      title: { en: "Communication", km: "ការទំនាក់​ទំនង" },
      items: [
        {
          key: "message_parents",
          label: { en: "Message Parents", km: "ផ្ញើសារ​ទៅឪពុកម្តាយ" },
          href: "#",
        },
        {
          key: "school_announcements",
          label: { en: "School Announcements", km: "សេចក្តីជូនដំណឹងសាលា" },
          href: "#",
        },
      ],
    },
    {
      key: "profile",
      title: { en: "My Profile", km: "ប្រវត្តិរូប" },
      items: [
        {
          key: "personal_info",
          label: {
            en: "Personal Info & Leave Request",
            km: "ព័ត៌មានផ្ទាល់ខ្លួន & សុំច្បាប់",
          },
          href: "#",
        },
      ],
    },
  ],
  student: [
    {
      key: "dashboard_home",
      title: { en: "Dashboard Home", km: "ផ្ទាំងគ្រប់គ្រង" },
      items: [
        {
          key: "next_class",
          label: {
            en: "My Next Class & Alerts",
            km: "ថ្នាក់បន្ទាប់ និងការជូនដំណឹង",
          },
          href: "#",
        },
      ],
    },
    {
      key: "timetable",
      title: { en: "My Timetable", km: "កាលវិភាគ" },
      items: [
        {
          key: "weekly_schedule",
          label: { en: "Weekly Schedule", km: "កាលវិភាគប្រចាំសប្តាហ៍" },
          href: "#",
        },
      ],
    },
    {
      key: "academics",
      title: { en: "Academics", km: "វិជ្ជាសិក្សា" },
      items: [
        {
          key: "grades_report_card",
          label: { en: "Grades / Report Card", km: "ពិន្ទុ / សមិទ្ធិផល" },
          href: "#",
        },
        {
          key: "assignments",
          label: { en: "Assignments", km: "កិច្ចការ" },
          href: "#",
        },
        {
          key: "learning_resources",
          label: { en: "Learning Resources", km: "ធនធានសិក្សា" },
          href: "#",
        },
      ],
    },
    {
      key: "attendance",
      title: { en: "Attendance", km: "វត្តមាន" },
      items: [
        {
          key: "my_attendance_history",
          label: { en: "My Attendance History", km: "ប្រវត្តិវត្តមាន" },
          href: "#",
        },
      ],
    },
    {
      key: "communication",
      title: { en: "Communication", km: "ការទំនាក់ទំនង" },
      items: [
        {
          key: "announcements",
          label: { en: "Announcements", km: "សេចក្តីជូនដំណឹង" },
          href: "#",
        },
      ],
    },
    {
      key: "profile",
      title: { en: "My Profile", km: "ប្រវត្តិរូប" },
      items: [
        {
          key: "personal_details",
          label: { en: "Personal Details", km: "ព័ត៌មានផ្ទាល់ខ្លួន" },
          href: "#",
        },
      ],
    },
  ],
  parent: [
    {
      key: "dashboard_home",
      title: { en: "Dashboard Home", km: "ផ្ទាំងគ្រប់គ្រង" },
      items: [
        {
          key: "student_status",
          label: { en: "Student Status Snapshot", km: "ស្ថានភាពសិស្ស" },
          href: "#",
        },
      ],
    },
    {
      key: "child_profile",
      title: { en: "My Child's Profile", km: "ប្រវត្តិរូបកូន" },
      items: [
        {
          key: "academic_progress",
          label: { en: "Academic Progress", km: "វឌ្ឍនភាពសិក្សា" },
          href: "#",
        },
        {
          key: "attendance_log",
          label: { en: "Attendance Log", km: "វត្តមាន" },
          href: "#",
        },
        {
          key: "behavior_notes",
          label: { en: "Behavioral Notes", km: "កំណត់ចំណាំឥរិយាបទ" },
          href: "#",
        },
      ],
    },
    {
      key: "finance_fees",
      title: { en: "Finance & Fees", km: "ហិរញ្ញវត្ថុ និងថ្លៃសិក្សា" },
      items: [
        {
          key: "fee_statement",
          label: { en: "Fee Statement", km: "សេចក្តីថ្លែងការណ៍ថ្លៃសិក្សា" },
          href: "#",
        },
        {
          key: "online_payment",
          label: { en: "Online Payment", km: "ទូទាត់តាមអ៊ីនធឺណិត" },
          href: "#",
        },
      ],
    },
    {
      key: "communication",
      title: { en: "Communication", km: "ការទំនាក់ទំនង" },
      items: [
        {
          key: "message_teachers",
          label: { en: "Message Teachers", km: "ផ្ញើសារទៅគ្រូ" },
          href: "#",
        },
        {
          key: "school_notices",
          label: { en: "School Notices", km: "សេចក្តីជូនដំណឹងសាលា" },
          href: "#",
        },
      ],
    },
    {
      key: "ptm",
      title: {
        en: "Parent-Teacher Meetings",
        km: "ការប្រជុំពិភាក្សា ឪពុកម្តាយ-គ្រូ",
      },
      items: [
        {
          key: "booking",
          label: { en: "Booking System", km: "ការកក់ជួប" },
          href: "#",
        },
      ],
    },
  ],
};

// Use admin menu for principal by default
roleToMenu.principal = roleToMenu.admin;

export function t(label: LocalizedLabel, lang: SupportedLang): string {
  return lang === "km" ? label.km : label.en;
}
