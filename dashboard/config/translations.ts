export type SupportedLang = "en" | "km";

export const translations = {
  en: {
    // Academic Management
    academic_management: "Academic Management",
    manage_academic: "Manage curriculum, classes, subjects, and timetables.",
    classes: "Classes",
    subjects: "Subjects",
    add_class: "Add Class",
    add_subject: "Add Subject",
    edit_class: "Edit Class",
    edit_subject: "Edit Subject",
    total_classes: "Total Classes",
    total_subjects: "Total Subjects",
    avg_class_size: "Avg Class Size",

    // Class Fields
    class_name: "Class Name",
    section: "Section",
    room: "Room",
    capacity: "Capacity",
    enrolled: "Enrolled",
    teacher: "Teacher",
    academic_year: "Academic Year",

    // Subject Fields
    subject_name: "Subject Name",
    subject_code: "Subject Code",
    credits: "Credits",
    department: "Department",
    description: "Description",

    // Attendance Management
    attendance_management: "Attendance Management",
    track_attendance: "Track daily attendance for students and staff.",
    mark_attendance: "Mark Attendance",
    attendance_history: "Attendance History",
    save_attendance: "Save Attendance",
    view_report: "View Report",

    // Attendance Status
    present: "Present",
    absent: "Absent",
    late: "Late",
    excused: "Excused",

    // Attendance Stats
    todays_rate: "Today's Rate",
    total_present: "Total Present",
    total_absent: "Total Absent",
    total_late: "Total Late",

    // Fields
    select_class: "Select Class",
    remarks: "Remarks",

    // Grading Management
    grading_management: "Grading & Reports",
    manage_grading: "Manage exams, scores, and generate report cards.",
    grade_entry: "Grade Entry",
    report_cards: "Report Cards",
    publish_grades: "Publish Grades",
    download_report: "Download Report",

    // Grading Terms
    score: "Score",
    max_score: "Max Score",
    weight: "Weight",
    gpa: "GPA",
    grade_letter: "Grade",
    pass_rate: "Pass Rate",
    top_performers: "Top Performers",
    average_gpa: "Average GPA",

    // Assessment Types
    exam: "Exam",
    quiz: "Quiz",
    assignment: "Assignment",
    project: "Project",

    // Fields
    assessment_type: "Assessment Type",
    subject: "Subject",

    // Sidebar
    dashboard: "Dashboard",
    students: "Students",
    academic: "Academic",
    attendance: "Attendance",
    grading: "Grading",
    finance: "Finance",
    hr: "HR & Staff",
    library: "Library",
    transport: "Transport",
    inventory: "Inventory",
    communication: "Communication",
    settings: "Settings",

    // Dashboard Home
    welcome: "Welcome back!",
    welcome_subtitle: "Here's what's happening in your school today.",
    total_students: "Total Students",
    total_teachers: "Total Teachers",
    attendance_rate: "Attendance Rate",
    revenue: "Revenue",

    // Student Management
    student_management: "Student Management",
    manage_student_records:
      "Manage student records, enrollments, and information.",
    add_student: "Add Student",
    edit_student: "Edit Student",
    view_student: "View Student",
    delete_student: "Delete Student",
    add_new_student: "Add New Student",
    update_student: "Update Student",

    // Student Statistics
    statistics: "Statistics",
    overview: "Overview",
    total_students_stat: "Total Students",
    active_students: "Active Students",
    new_this_month: "New This Month",
    grade_distribution: "Grade Distribution",
    gender_distribution: "Gender Distribution",
    student_status: "Student Status",
    grade_10: "Grade 10",
    grade_11: "Grade 11",
    grade_12: "Grade 12",
    last_30_days: "Last 30 Days",
    students_enrolled: "Students Enrolled",
    of_total: "of total",

    // Student Form
    student_registration: "Student Registration",
    enter_details: "Enter student details below",
    personal_info: "Personal Information",
    first_name: "First Name",
    last_name: "Last Name",
    email: "Email",
    dob: "Date of Birth",
    gender: "Gender",
    select_gender: "Select gender",
    male: "Male",
    female: "Female",
    other: "Other",
    phone: "Phone Number",
    academic_contact: "Academic & Contact",
    grade_level: "Grade Level",
    select_grade: "Select grade",
    address: "Address",
    guardian_info: "Guardian Information",
    guardian_name: "Guardian Name",
    guardian_phone: "Guardian Phone",
    reset: "Reset",
    register_student: "Register Student",
    save_changes: "Save Changes",

    // Placeholders
    enter_first_name: "Enter first name",
    enter_last_name: "Enter last name",
    enter_email: "Enter email",
    select_date: "Select date",
    enter_phone: "Enter phone number",
    enter_address: "Enter full address",
    enter_guardian_name: "Enter guardian name",
    enter_guardian_phone: "Enter guardian phone",

    // Table
    name: "Name",
    grade: "Grade",
    status: "Status",
    actions: "Actions",
    search_placeholder: "Search by name, email, or phone...",
    showing_results: "Showing {count} of {total} students",
    clear_filters: "Clear Filters",
    rows_per_page: "Rows per page:",
    total_count: "Total: {count} students",
    no_students: "No students registered yet.",
    no_results: "No students found matching your search criteria.",

    // Student Details
    student_details: "Student Details",
    academic_info: "Academic Information",
    enrollment_date: "Enrollment Date",
    active: "Active",
    inactive: "Inactive",
    graduated: "Graduated",

    // Actions
    view_details: "View Details",
    edit_record: "Edit Record",
    delete_record: "Delete Student",
    close: "Close",
    cancel: "Cancel",
    confirm: "Confirm",

    // Delete Confirmation
    delete_confirmation: "Are you sure you want to delete",
    delete_warning:
      "This action cannot be undone. All student records and associated data will be permanently removed.",

    // Success Messages
    student_registered: "Student registered successfully!",
    student_updated: "Student updated successfully!",
    student_deleted: "Student deleted successfully!",

    // Validation Messages
    required_field: "This field is required",
    invalid_email: "Invalid email address",
    select_option: "Please select an option",

    // Member Management
    member_management: "Member Management",
    manage_members: "Manage staff and members for your school",
    add_member: "Add Member",
    edit_member: "Edit Member",
    remove_member: "Remove Member",
    add_new_member: "Add New Member",
    add_first_member: "Add First Member",
    search_user: "Search User",
    search_user_placeholder: "Enter email or username",
    search_user_label: "Search User by Email or Username",
    user_found: "Found",
    user_not_found:
      "User not found. Make sure they have an account in the system.",
    select_branch: "Select a branch...",
    school_wide: "School-wide",
    school_wide_access: "School-wide (No branch)",
    branch_required: "Members must be assigned to a branch",
    branch_optional: "Leave empty for school-wide access",
    no_members: "No Members Yet",
    no_members_desc: "Start by adding staff and members to your school",
    select_school_first: "Please select a school to manage members",
    all_members: "All Members",
    primary_contact: "Primary",
    user: "User",
    role: "Role",
    branch: "Branch",
    confirm_remove_member: "Remove Member",
    confirm_remove_desc:
      "Are you sure you want to remove this member? They will lose access to the school.",
    remove: "Remove",
    update_role: "Update Role",
    new_role: "New Role",
    member: "Member",
    min_search_chars: "Please enter at least {count} characters to search",

    // Roles
    role_owner: "Owner",
    role_director: "Director",
    role_deputy_director: "Deputy Director",
    role_admin: "Administrator",
    role_head_teacher: "Head Teacher",
    role_teacher: "Teacher",
    role_student: "Student",
    role_parent: "Parent",
    role_staff: "Staff",
    role_accountant: "Accountant",
    role_librarian: "Librarian",

    // Member Status
    status_active: "Active",
    status_inactive: "Inactive",
    status_pending: "Pending",
    status_suspended: "Suspended",
  },
  km: {
    // Academic Management
    academic_management: "ការគ្រប់គ្រងការសិក្សា",
    manage_academic: "គ្រប់គ្រងកម្មវិធីសិក្សា ថ្នាក់រៀន មុខវិជ្ជា និងកាលវិភាគ។",
    classes: "ថ្នាក់រៀន",
    subjects: "មុខវិជ្ជា",
    add_class: "បន្ថែមថ្នាក់",
    add_subject: "បន្ថែមមុខវិជ្ជា",
    edit_class: "កែសម្រួលថ្នាក់",
    edit_subject: "កែសម្រួលមុខវិជ្ជា",
    total_classes: "ថ្នាក់សរុប",
    total_subjects: "មុខវិជ្ជាសរុប",
    avg_class_size: "ទំហំថ្នាក់មធ្យម",

    // Class Fields
    class_name: "ឈ្មោះថ្នាក់",
    section: "ផ្នែក",
    room: "បន្ទប់",
    capacity: "ចំណុះ",
    enrolled: "បានចុះឈ្មោះ",
    teacher: "គ្រូបង្រៀន",
    academic_year: "ឆ្នាំសិក្សា",

    // Subject Fields
    subject_name: "ឈ្មោះមុខវិជ្ជា",
    subject_code: "កូដមុខវិជ្ជា",
    credits: "ក្រេឌីត",
    department: "ដេប៉ាតឺម៉ង់",
    description: "ការពិពណ៌នា",

    // Attendance Management
    attendance_management: "ការគ្រប់គ្រងវត្តមាន",
    track_attendance: "តាមដានវត្តមានប្រចាំថ្ងៃសម្រាប់សិស្ស និងបុគ្គលិក។",
    mark_attendance: "កត់ត្រាវត្តមាន",
    attendance_history: "ប្រវត្តាវត្តមាន",
    save_attendance: "រក្សាទុកវត្តមាន",
    view_report: "មើលរបាយការណ៍",

    // Attendance Status
    present: "វត្តមាន",
    absent: "អវត្តមាន",
    late: "យឺត",
    excused: "ច្បាប់",

    // Attendance Stats
    todays_rate: "អត្រាថ្ងៃនេះ",
    total_present: "វត្តមានសរុប",
    total_absent: "អវត្តមានសរុប",
    total_late: "យឺតសរុប",

    // Fields
    select_class: "ជ្រើសរើសថ្នាក់",
    remarks: "សម្គាល់",

    // Grading Management
    grading_management: "ការដាក់ពិន្ទុ & របាយការណ៍",
    manage_grading: "គ្រប់គ្រងការប្រឡង ពិន្ទុ និងបង្កើតព្រឹត្តិបត្រពិន្ទុ។",
    grade_entry: "បញ្ចូលពិន្ទុ",
    report_cards: "ព្រឹត្តិបត្រពិន្ទុ",
    publish_grades: "ផ្សព្វផ្សាយពិន្ទុ",
    download_report: "ទាញយករបាយការណ៍",

    // Grading Terms
    score: "ពិន្ទុ",
    max_score: "ពិន្ទុអតិបរមា",
    weight: "ទម្ងន់",
    gpa: "មធ្យមភាគ (GPA)",
    grade_letter: "និទ្ទេស",
    pass_rate: "អត្រាជាប់",
    top_performers: "សិស្សឆ្នើម",
    average_gpa: "មធ្យមភាគរួម",

    // Assessment Types
    exam: "ការប្រឡង",
    quiz: "សំណួរខ្លី",
    assignment: "កិច្ចការ",
    project: "គម្រោង",

    // Fields
    assessment_type: "ប្រភេទការវាយតម្លៃ",
    subject: "មុខវិជ្ជា",

    // Sidebar
    dashboard: "ផ្ទាំងគ្រប់គ្រង",
    students: "សិស្ស",
    academic: "សិក្សាធិការ",
    attendance: "វត្តមាន",
    grading: "ពិន្ទុ",
    finance: "ហិរញ្ញវត្ថុ",
    hr: "ធនធានមនុស្ស",
    library: "បណ្ណាល័យ",
    transport: "ការដឹកជញ្ជូន",
    inventory: "សារពើភ័ណ្ឌ",
    communication: "ទំនាក់ទំនង",
    settings: "ការកំណត់",

    // Dashboard Home
    welcome: "សូមស្វាគមន៍!",
    welcome_subtitle: "នេះគឺជាអ្វីដែលកំពុងកើតឡើងនៅក្នុងសាលារបស់អ្នកនៅថ្ងៃនេះ។",
    total_students: "សិស្សសរុប",
    total_teachers: "គ្រូបង្រៀនសរុប",
    attendance_rate: "អត្រាវត្តមាន",
    revenue: "ចំណូល",

    // Student Management
    student_management: "ការគ្រប់គ្រងសិស្ស",
    manage_student_records: "គ្រប់គ្រងកំណត់ត្រាសិស្ស ការចុះឈ្មោះ និងព័ត៌មាន។",
    add_student: "បន្ថែមសិស្ស",
    edit_student: "កែសម្រួលសិស្ស",
    view_student: "មើលសិស្ស",
    delete_student: "លុបសិស្ស",
    add_new_student: "បន្ថែមសិស្សថ្មី",
    update_student: "ធ្វើបច្ចុប្បន្នភាពសិស្ស",

    // Student Statistics
    statistics: "ស្ថិតិ",
    overview: "ទិដ្ឋភាពទូទៅ",
    total_students_stat: "សិស្សសរុប",
    active_students: "សិស្សសកម្ម",
    new_this_month: "ថ្មីខែនេះ",
    grade_distribution: "ការចែកចាយតាមថ្នាក់",
    gender_distribution: "ការចែកចាយតាមភេទ",
    student_status: "ស្ថានភាពសិស្ស",
    grade_10: "ថ្នាក់ទី ១០",
    grade_11: "ថ្នាក់ទី ១១",
    grade_12: "ថ្នាក់ទី ១២",
    last_30_days: "៣០ ថ្ងៃចុងក្រោយ",
    students_enrolled: "សិស្សបានចុះឈ្មោះ",
    of_total: "នៃសរុប",

    // Student Form
    student_registration: "ការចុះឈ្មោះសិស្ស",
    enter_details: "បញ្ចូលព័ត៌មានលម្អិតរបស់សិស្សខាងក្រោម",
    personal_info: "ព័ត៌មានផ្ទាល់ខ្លួន",
    first_name: "នាមត្រកូល",
    last_name: "នាមខ្លួន",
    email: "អ៊ីមែល",
    dob: "ថ្ងៃខែឆ្នាំកំណើត",
    gender: "ភេទ",
    select_gender: "ជ្រើសរើសភេទ",
    male: "ប្រុស",
    female: "ស្រី",
    other: "ផ្សេងៗ",
    phone: "លេខទូរស័ព្ទ",
    academic_contact: "សិក្សា & ទំនាក់ទំនង",
    grade_level: "កម្រិតថ្នាក់",
    select_grade: "ជ្រើសរើសថ្នាក់",
    address: "អាសយដ្ឋាន",
    guardian_info: "ព័ត៌មានអាណាព្យាបាល",
    guardian_name: "ឈ្មោះអាណាព្យាបាល",
    guardian_phone: "លេខទូរស័ព្ទអាណាព្យាបាល",
    reset: "កំណត់ឡើងវិញ",
    register_student: "ចុះឈ្មោះសិស្ស",
    save_changes: "រក្សាទុកការផ្លាស់ប្តូរ",

    // Placeholders
    enter_first_name: "បញ្ចូលនាមត្រកូល",
    enter_last_name: "បញ្ចូលនាមខ្លួន",
    enter_email: "បញ្ចូលអ៊ីមែល",
    select_date: "ជ្រើសរើសកាលបរិច្ឆេទ",
    enter_phone: "បញ្ចូលលេខទូរស័ព្ទ",
    enter_address: "បញ្ចូលអាសយដ្ឋានពេញលេញ",
    enter_guardian_name: "បញ្ចូលឈ្មោះអាណាព្យាបាល",
    enter_guardian_phone: "បញ្ចូលលេខទូរស័ព្ទអាណាព្យាបាល",

    // Table
    name: "ឈ្មោះ",
    grade: "ថ្នាក់",
    status: "ស្ថានភាព",
    actions: "សកម្មភាព",
    search_placeholder: "ស្វែងរកតាមឈ្មោះ អ៊ីមែល ឬទូរស័ព្ទ...",
    showing_results: "បង្ហាញ {count} នៃ {total} សិស្ស",
    clear_filters: "សម្អាតតម្រង",
    rows_per_page: "ជួរក្នុងមួយទំព័រ:",
    total_count: "សរុប: {count} សិស្ស",
    no_students: "មិនទាន់មានសិស្សចុះឈ្មោះនៅឡើយទេ។",
    no_results: "រកមិនឃើញសិស្សដែលត្រូវគ្នានឹងលក្ខណៈវិនិច្ឆ័យស្វែងរករបស់អ្នក។",

    // Student Details
    student_details: "ព័ត៌មានលម្អិតសិស្ស",
    academic_info: "ព័ត៌មានសិក្សា",
    enrollment_date: "កាលបរិច្ឆេទចុះឈ្មោះ",
    active: "សកម្ម",
    inactive: "អសកម្ម",
    graduated: "បានបញ្ចប់ការសិក្សា",

    // Actions
    view_details: "មើលព័ត៌មានលម្អិត",
    edit_record: "កែសម្រួលកំណត់ត្រា",
    delete_record: "លុបសិស្ស",
    close: "បិទ",
    cancel: "បោះបង់",
    confirm: "បញ្ជាក់",

    // Delete Confirmation
    delete_confirmation: "តើអ្នកប្រាកដថាចង់លុប",
    delete_warning:
      "សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។ កំណត់ត្រាសិស្សទាំងអស់ និងទិន្នន័យដែលពាក់ព័ន្ធនឹងត្រូវបានលុបចោលជាអចិន្ត្រៃយ៍។",

    // Success Messages
    student_registered: "ចុះឈ្មោះសិស្សបានជោគជ័យ!",
    student_updated: "ធ្វើបច្ចុប្បន្នភាពសិស្សបានជោគជ័យ!",
    student_deleted: "លុបសិស្សបានជោគជ័យ!",

    // Validation Messages
    required_field: "វាលនេះត្រូវបានទាមទារ",
    invalid_email: "អាសយដ្ឋានអ៊ីមែលមិនត្រឹមត្រូវ",
    select_option: "សូមជ្រើសរើសជម្រើសមួយ",

    // Member Management
    member_management: "ការគ្រប់គ្រងសមាជិក",
    manage_members: "គ្រប់គ្រងបុគ្គលិក និងសមាជិកសម្រាប់សាលារបស់អ្នក",
    add_member: "បន្ថែមសមាជិក",
    edit_member: "កែសម្រួលសមាជិក",
    remove_member: "ដកសមាជិក",
    add_new_member: "បន្ថែមសមាជិកថ្មី",
    add_first_member: "បន្ថែមសមាជិកដំបូង",
    search_user: "ស្វែងរកអ្នកប្រើប្រាស់",
    search_user_placeholder: "បញ្ចូលអ៊ីមែល ឬឈ្មោះអ្នកប្រើ",
    search_user_label: "ស្វែងរកអ្នកប្រើប្រាស់តាមអ៊ីមែល ឬឈ្មោះ",
    user_found: "រកឃើញ",
    user_not_found:
      "រកមិនឃើញអ្នកប្រើប្រាស់។ សូមប្រាកដថាពួកគេមានគណនីក្នុងប្រព័ន្ធ។",
    select_branch: "ជ្រើសរើសសាខា...",
    school_wide: "ទូទាំងសាលា",
    school_wide_access: "ទូទាំងសាលា (គ្មានសាខា)",
    branch_required: "សមាជិកត្រូវតែចាត់តាំងទៅសាខាមួយ",
    branch_optional: "ទុកចោលសម្រាប់ចូលប្រើទូទាំងសាលា",
    no_members: "មិនទាន់មានសមាជិកទេ",
    no_members_desc: "ចាប់ផ្តើមដោយបន្ថែមបុគ្គលិក និងសមាជិកទៅសាលារបស់អ្នក",
    select_school_first: "សូមជ្រើសរើសសាលាដើម្បីគ្រប់គ្រងសមាជិក",
    all_members: "សមាជិកទាំងអស់",
    primary_contact: "ទំនាក់ទំនងចម្បង",
    user: "អ្នកប្រើប្រាស់",
    role: "តួនាទី",
    branch: "សាខា",
    confirm_remove_member: "ដកសមាជិក",
    confirm_remove_desc:
      "តើអ្នកប្រាកដថាចង់ដកសមាជិកនេះ? ពួកគេនឹងបាត់បង់ការចូលប្រើសាលា។",
    remove: "ដក",
    update_role: "ធ្វើបច្ចុប្បន្នភាពតួនាទី",
    new_role: "តួនាទីថ្មី",
    member: "សមាជិក",
    min_search_chars: "សូមបញ្ចូលយ៉ាងហោចណាស់ {count} តួអក្សរដើម្បីស្វែងរក",

    // Roles
    role_owner: "ម្ចាស់",
    role_director: "នាយក",
    role_deputy_director: "អនុនាយក",
    role_admin: "អ្នកគ្រប់គ្រង",
    role_head_teacher: "គ្រូប្រធាន",
    role_teacher: "គ្រូបង្រៀន",
    role_student: "សិស្ស",
    role_parent: "មាតាបិតា",
    role_staff: "បុគ្គលិក",
    role_accountant: "គណនេយ្យករ",
    role_librarian: "បណ្ណារក្ស",

    // Member Status
    status_active: "សកម្ម",
    status_inactive: "អសកម្ម",
    status_pending: "រង់ចាំ",
    status_suspended: "ផ្អាក",
  },
};
