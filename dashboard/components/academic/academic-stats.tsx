"use client";

import React, { useMemo } from "react";
import { BookOpen, Users, School, GraduationCap } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Class, Subject } from "@/types/academic";
import { cn } from "@/lib/utils";

interface AcademicStatsProps {
  classes: Class[];
  subjects: Subject[];
  totalClasses?: number;
  totalSubjects?: number;
}

export const AcademicStats: React.FC<AcademicStatsProps> = ({
  classes,
  subjects,
  totalClasses,
  totalSubjects,
}) => {
  const { t } = useTranslation();

  const stats = useMemo(() => {
    // Use provided totals or fallback to array length
    const classCount = totalClasses ?? classes.length;
    const subjectCount = totalSubjects ?? subjects.length;

    // Calculate average class size from current page data
    const totalEnrolled = classes.reduce(
      (acc, cls) => acc + cls.currentEnrollment,
      0,
    );
    const avgClassSize =
      classes.length > 0 ? Math.round(totalEnrolled / classes.length) : 0;

    // Calculate total credits from current page data
    const totalCredits = subjects.reduce((acc, sub) => acc + sub.credits, 0);

    return {
      totalClasses: classCount,
      totalSubjects: subjectCount,
      avgClassSize,
      totalCredits,
    };
  }, [classes, subjects, totalClasses, totalSubjects]);

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color = "default",
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ElementType;
    color?: "default" | "primary" | "secondary" | "success" | "warning";
  }) => {
    const gradients = {
      primary:
        "from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-700 dark:text-blue-300",
      secondary:
        "from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-700 dark:text-purple-300",
      success:
        "from-emerald-500/20 to-emerald-500/5 border-emerald-500/20 text-emerald-700 dark:text-emerald-300",
      warning:
        "from-orange-500/20 to-orange-500/5 border-orange-500/20 text-orange-700 dark:text-orange-300",
      default:
        "from-gray-500/20 to-gray-500/5 border-gray-500/20 text-gray-700 dark:text-gray-300",
    };

    const iconBg = {
      primary: "bg-blue-500/20 text-blue-600 dark:text-blue-400",
      secondary: "bg-purple-500/20 text-purple-600 dark:text-purple-400",
      success: "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400",
      warning: "bg-orange-500/20 text-orange-600 dark:text-orange-400",
      default: "bg-gray-500/20 text-gray-600 dark:text-gray-400",
    };

    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] hover:shadow-lg group",
          "bg-gradient-to-br shadow-sm",
          gradients[color],
        )}
      >
        <div className="absolute inset-0 bg-white/40 dark:bg-black/10 transition-colors" />

        <div className="relative p-6 flex justify-between items-start z-10">
          <div className="flex flex-col gap-1 flex-1">
            <span className="text-sm font-semibold opacity-80 uppercase tracking-wider">
              {title}
            </span>
            <span className="text-3xl font-bold mt-2 tracking-tight">
              {value}
            </span>
            {subtitle && (
              <span className="text-xs font-medium opacity-70 mt-1">
                {subtitle}
              </span>
            )}
          </div>
          <div
            className={cn(
              "p-3 rounded-xl shadow-inner backdrop-blur-md transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3",
              iconBg[color],
            )}
          >
            <Icon className="w-6 h-6" />
          </div>
        </div>

        {/* Decorative gloss effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/20 dark:bg-white/5 rounded-full blur-3xl group-hover:bg-white/30 dark:group-hover:bg-white/10 transition-colors duration-500" />
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatCard
        color="primary"
        icon={School}
        title={t("total_classes")}
        value={stats.totalClasses}
      />
      <StatCard
        color="secondary"
        icon={BookOpen}
        title={t("total_subjects")}
        value={stats.totalSubjects}
      />
      <StatCard
        color="success"
        icon={Users}
        title={t("avg_class_size")}
        value={stats.avgClassSize}
      />
      <StatCard
        color="warning"
        icon={GraduationCap}
        subtitle={t("total_curriculum_credits")}
        title={t("credits")}
        value={stats.totalCredits}
      />
    </div>
  );
};
