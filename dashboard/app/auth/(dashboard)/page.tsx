"use client";

import { motion } from "framer-motion";
import {
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Calendar,
  DollarSign,
  UserCheck,
  AlertCircle,
  Award,
  Building,
  BarChart3,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { useDashboard } from "@/hooks/useDashboard";

// Mock data - in production, this would come from your API
const stats = {
  admin: [
    {
      title: "Total Students",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Total Teachers",
      value: "89",
      change: "+3%",
      trend: "up",
      icon: GraduationCap,
      color: "bg-green-500",
    },
    {
      title: "Active Classes",
      value: "42",
      change: "0%",
      trend: "neutral",
      icon: BookOpen,
      color: "bg-purple-500",
    },
    {
      title: "Attendance Rate",
      value: "94.5%",
      change: "+2.3%",
      trend: "up",
      icon: UserCheck,
      color: "bg-orange-500",
    },
  ],
  teacher: [
    {
      title: "My Classes",
      value: "6",
      change: "",
      trend: "neutral",
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      title: "Total Students",
      value: "187",
      change: "",
      trend: "neutral",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Avg. Attendance",
      value: "92%",
      change: "+1.5%",
      trend: "up",
      icon: UserCheck,
      color: "bg-purple-500",
    },
    {
      title: "Pending Grades",
      value: "23",
      change: "",
      trend: "neutral",
      icon: AlertCircle,
      color: "bg-orange-500",
    },
  ],
  parent: [
    {
      title: "Children",
      value: "2",
      change: "",
      trend: "neutral",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Attendance",
      value: "96%",
      change: "+2%",
      trend: "up",
      icon: Calendar,
      color: "bg-green-500",
    },
    {
      title: "Avg. Grade",
      value: "A-",
      change: "",
      trend: "neutral",
      icon: Award,
      color: "bg-purple-500",
    },
    {
      title: "Outstanding Fees",
      value: "$450",
      change: "",
      trend: "neutral",
      icon: DollarSign,
      color: "bg-orange-500",
    },
  ],
  student: [
    {
      title: "My Classes",
      value: "8",
      change: "",
      trend: "neutral",
      icon: BookOpen,
      color: "bg-blue-500",
    },
    {
      title: "Attendance",
      value: "95%",
      change: "+3%",
      trend: "up",
      icon: Calendar,
      color: "bg-green-500",
    },
    {
      title: "Current GPA",
      value: "3.7",
      change: "+0.2",
      trend: "up",
      icon: Award,
      color: "bg-purple-500",
    },
    {
      title: "Assignments Due",
      value: "4",
      change: "",
      trend: "neutral",
      icon: AlertCircle,
      color: "bg-orange-500",
    },
  ],
  owner: [
    {
      title: "Total Revenue",
      value: "$125K",
      change: "+15%",
      trend: "up",
      icon: DollarSign,
      color: "bg-blue-500",
    },
    {
      title: "Total Students",
      value: "2,456",
      change: "+8%",
      trend: "up",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Active Branches",
      value: "3",
      change: "",
      trend: "neutral",
      icon: Building,
      color: "bg-purple-500",
    },
    {
      title: "Staff Count",
      value: "156",
      change: "+5%",
      trend: "up",
      icon: GraduationCap,
      color: "bg-orange-500",
    },
  ],
  ministry: [
    {
      title: "Total Schools",
      value: "1,234",
      change: "+45",
      trend: "up",
      icon: Building,
      color: "bg-blue-500",
    },
    {
      title: "Total Students",
      value: "456K",
      change: "+12K",
      trend: "up",
      icon: Users,
      color: "bg-green-500",
    },
    {
      title: "Total Teachers",
      value: "23K",
      change: "+890",
      trend: "up",
      icon: GraduationCap,
      color: "bg-purple-500",
    },
    {
      title: "Compliance Rate",
      value: "87%",
      change: "+3%",
      trend: "up",
      icon: BarChart3,
      color: "bg-orange-500",
    },
  ],
};

const recentActivities = {
  admin: [
    {
      title: "New student enrollment",
      description: "John Doe enrolled in Grade 10A",
      time: "5 minutes ago",
      icon: Users,
      color: "text-blue-500",
    },
    {
      title: "Attendance submitted",
      description: "Grade 9B attendance marked by Ms. Smith",
      time: "1 hour ago",
      icon: CheckCircle2,
      color: "text-green-500",
    },
    {
      title: "Fee payment received",
      description: "$500 payment from Sarah Johnson",
      time: "2 hours ago",
      icon: DollarSign,
      color: "text-purple-500",
    },
    {
      title: "New teacher added",
      description: "Mr. Brown joined as Math teacher",
      time: "3 hours ago",
      icon: GraduationCap,
      color: "text-orange-500",
    },
  ],
  teacher: [
    {
      title: "Assignment submitted",
      description: "Math homework from Grade 10A",
      time: "10 minutes ago",
      icon: BookOpen,
      color: "text-blue-500",
    },
    {
      title: "Parent message",
      description: "Message from Mrs. Johnson about exam",
      time: "1 hour ago",
      icon: Users,
      color: "text-green-500",
    },
    {
      title: "Attendance reminder",
      description: "Mark attendance for Grade 9B",
      time: "2 hours ago",
      icon: AlertCircle,
      color: "text-orange-500",
    },
  ],
  parent: [
    {
      title: "Grade updated",
      description: "Math test score: A (95%)",
      time: "30 minutes ago",
      icon: Award,
      color: "text-green-500",
    },
    {
      title: "Fee reminder",
      description: "Tuition fee due in 5 days",
      time: "2 hours ago",
      icon: DollarSign,
      color: "text-orange-500",
    },
    {
      title: "School announcement",
      description: "Parent-teacher meeting on Friday",
      time: "1 day ago",
      icon: Calendar,
      color: "text-blue-500",
    },
  ],
  student: [
    {
      title: "New assignment",
      description: "Physics homework due Friday",
      time: "1 hour ago",
      icon: BookOpen,
      color: "text-blue-500",
    },
    {
      title: "Grade posted",
      description: "Chemistry quiz: B+ (88%)",
      time: "3 hours ago",
      icon: Award,
      color: "text-green-500",
    },
    {
      title: "Library reminder",
      description: "Return 'Physics Fundamentals' by tomorrow",
      time: "1 day ago",
      icon: AlertCircle,
      color: "text-orange-500",
    },
  ],
  owner: [
    {
      title: "Revenue milestone",
      description: "Monthly revenue exceeded target by 15%",
      time: "2 hours ago",
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      title: "New branch proposal",
      description: "Siem Reap branch feasibility study completed",
      time: "5 hours ago",
      icon: Building,
      color: "text-blue-500",
    },
    {
      title: "Compliance report",
      description: "Q4 MoEYS report submitted successfully",
      time: "1 day ago",
      icon: CheckCircle2,
      color: "text-purple-500",
    },
  ],
  ministry: [
    {
      title: "New school registered",
      description: "International School of Phnom Penh",
      time: "1 hour ago",
      icon: Building,
      color: "text-blue-500",
    },
    {
      title: "Compliance alert",
      description: "3 schools pending accreditation review",
      time: "3 hours ago",
      icon: AlertCircle,
      color: "text-orange-500",
    },
    {
      title: "National report",
      description: "Q4 education statistics published",
      time: "1 day ago",
      icon: BarChart3,
      color: "text-green-500",
    },
  ],
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function DashboardPage() {
  // Use real data from API
  const {
    currentSchool,
    currentRole,
    memberships,
    isLoading,
    error,
    hasSchools,
    user,
  } = useDashboard();

  // Map API role to UI role
  const uiRole = currentRole?.toLowerCase() || "admin";
  const roleForStats =
    uiRole === "owner"
      ? "owner"
      : uiRole === "teacher"
        ? "teacher"
        : uiRole === "student"
          ? "student"
          : uiRole === "parent"
            ? "parent"
            : "admin";

  const currentStats =
    hasSchools && currentSchool?.stats
      ? [
          {
            title: "Total Students",
            value: currentSchool.stats.totalStudents?.toString() || "0",
            change: "",
            trend: "neutral" as const,
            icon: Users,
            color: "bg-blue-500",
          },
          {
            title: "Total Teachers",
            value: currentSchool.stats.totalTeachers?.toString() || "0",
            change: "",
            trend: "neutral" as const,
            icon: GraduationCap,
            color: "bg-green-500",
          },
          {
            title: "Active Classes",
            value: currentSchool.stats.totalClasses?.toString() || "0",
            change: "",
            trend: "neutral" as const,
            icon: BookOpen,
            color: "bg-purple-500",
          },
          {
            title: "Branches",
            value: currentSchool.stats.totalBranches?.toString() || "0",
            change: "",
            trend: "neutral" as const,
            icon: Building,
            color: "bg-orange-500",
          },
        ]
      : stats[roleForStats as keyof typeof stats] || stats.admin;

  const currentActivities =
    recentActivities[roleForStats as keyof typeof recentActivities] ||
    recentActivities.admin;

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="h-12 w-12 text-red-500 mx-auto" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800">
      <motion.div
        animate="visible"
        className="space-y-6"
        initial="hidden"
        variants={containerVariants}
      >
        {/* Header with School Info */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {currentSchool ? currentSchool.name.en : "Dashboard"}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                {currentRole && (
                  <span className="capitalize font-medium">{currentRole}</span>
                )}
                {currentRole && " • "}
                Welcome back{user?.name ? `, ${user.name}` : ""}! Here&apos;s
                what&apos;s happening today.
              </p>
            </div>
            {memberships.length > 1 && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {memberships.length} schools
              </div>
            )}
          </div>
          {!hasSchools && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-blue-700 dark:text-blue-300">
                You are not a member of any school yet. Contact your school
                administrator to get added.
              </p>
            </div>
          )}
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
        >
          {currentStats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <motion.div
                key={index}
                className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-neutral-700"
                variants={itemVariants}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                      {stat.title}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                      {stat.value}
                    </p>
                    {stat.change && (
                      <p
                        className={`text-sm mt-2 flex items-center gap-1 ${
                          stat.trend === "up"
                            ? "text-green-600"
                            : stat.trend === "down"
                              ? "text-red-600"
                              : "text-gray-600"
                        }`}
                      >
                        {stat.trend === "up" && (
                          <TrendingUp className="h-4 w-4" />
                        )}
                        {stat.change}
                        {stat.trend === "up" && " from last month"}
                      </p>
                    )}
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg bg-opacity-10`}>
                    <Icon
                      className={`h-6 w-6 ${stat.color.replace("bg-", "text-")}`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <motion.div
            className="lg:col-span-2 bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-neutral-700"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Recent Activity
              </h2>
              <button className="text-sm text-primary hover:text-primary/80 font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {currentActivities.map((activity, index) => {
                const Icon = activity.icon;

                return (
                  <motion.div
                    key={index}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors"
                    initial={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div
                      className={`${activity.color} bg-opacity-10 p-2 rounded-lg`}
                    >
                      <Icon className={`h-5 w-5 ${activity.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-neutral-700"
            variants={itemVariants}
          >
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <QuickActionButton
                color="bg-blue-500"
                icon={Users}
                label="Add Student"
              />
              <QuickActionButton
                color="bg-green-500"
                icon={Calendar}
                label="Mark Attendance"
              />
              <QuickActionButton
                color="bg-purple-500"
                icon={BookOpen}
                label="Create Class"
              />
              <QuickActionButton
                color="bg-orange-500"
                icon={DollarSign}
                label="Record Payment"
              />
            </div>

            {/* Upcoming Events */}
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Upcoming Events
              </h3>
              <div className="space-y-3">
                <EventItem
                  color="bg-blue-500"
                  date="Dec 10, 2025"
                  title="Parent-Teacher Meeting"
                />
                <EventItem
                  color="bg-red-500"
                  date="Dec 15-20, 2025"
                  title="Final Exams"
                />
                <EventItem
                  color="bg-green-500"
                  date="Dec 25, 2025"
                  title="Winter Break"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Additional Charts/Graphs Section */}
        <motion.div
          className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-neutral-700"
          variants={itemVariants}
        >
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
            Performance Overview
          </h2>
          <div className="h-64 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p>Charts and graphs will be displayed here</p>
              <p className="text-sm mt-2">
                Integration with Chart.js or Recharts coming soon
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

// Quick Action Button Component
function QuickActionButton({
  icon: Icon,
  label,
  color,
}: {
  icon: any;
  label: string;
  color: string;
}) {
  return (
    <motion.button
      className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-neutral-700/50 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors text-left"
      whileHover={{ scale: 1.02, x: 5 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`${color} p-2 rounded-lg`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <span className="font-medium text-gray-900 dark:text-white">{label}</span>
    </motion.button>
  );
}

// Event Item Component
function EventItem({
  title,
  date,
  color,
}: {
  title: string;
  date: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-neutral-700/50">
      <div className={`w-2 h-2 rounded-full ${color}`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {title}
        </p>
        <p className="text-xs text-gray-600 dark:text-gray-400">{date}</p>
      </div>
    </div>
  );
}
