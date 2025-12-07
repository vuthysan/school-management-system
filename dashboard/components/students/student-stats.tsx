"use client";

import React, { useMemo } from "react";
import {
  Users,
  UserCheck,
  UserPlus,
  GraduationCap,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { Student } from "@/types/student";
import { cn } from "@/lib/utils";

interface StudentStatsProps {
  students: Student[];
}

export const StudentStats: React.FC<StudentStatsProps> = ({ students }) => {
  const { t } = useLanguage();

  // Calculate statistics
  const stats = useMemo(() => {
    const total = students.length;
    const activeCount = students.filter((s) => s.status === "active").length;

    // Calculate students enrolled in last 30 days
    const thirtyDaysAgo = new Date();

    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newThisMonth = students.filter((s) => {
      if (!s.enrollmentDate) return false;
      const enrollDate = new Date(s.enrollmentDate);

      return enrollDate >= thirtyDaysAgo;
    }).length;

    // Grade distribution
    const grade10 = students.filter((s) => s.gradeLevel === "10").length;
    const grade11 = students.filter((s) => s.gradeLevel === "11").length;
    const grade12 = students.filter((s) => s.gradeLevel === "12").length;

    // Gender distribution
    const maleCount = students.filter((s) => s.gender === "male").length;
    const femaleCount = students.filter((s) => s.gender === "female").length;
    const otherCount = students.filter((s) => s.gender === "other").length;

    // Calculate percentages
    const activePercentage =
      total > 0 ? ((activeCount / total) * 100).toFixed(1) : "0";
    const grade10Percentage =
      total > 0 ? ((grade10 / total) * 100).toFixed(1) : "0";
    const grade11Percentage =
      total > 0 ? ((grade11 / total) * 100).toFixed(1) : "0";
    const grade12Percentage =
      total > 0 ? ((grade12 / total) * 100).toFixed(1) : "0";
    const malePercentage =
      total > 0 ? ((maleCount / total) * 100).toFixed(1) : "0";
    const femalePercentage =
      total > 0 ? ((femaleCount / total) * 100).toFixed(1) : "0";
    const otherPercentage =
      total > 0 ? ((otherCount / total) * 100).toFixed(1) : "0";

    return {
      total,
      activeCount,
      activePercentage,
      newThisMonth,
      grade10,
      grade10Percentage,
      grade11,
      grade11Percentage,
      grade12,
      grade12Percentage,
      maleCount,
      malePercentage,
      femaleCount,
      femalePercentage,
      otherCount,
      otherPercentage,
    };
  }, [students]);

  const StatCard = ({
    title,
    value,
    subtitle,
    icon: Icon,
    color = "default",
    trend,
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ElementType;
    color?: "default" | "primary" | "secondary" | "success" | "warning";
    trend?: { value: number; isPositive: boolean };
  }) => {
    const colorClasses = {
      primary: "bg-primary/10 text-primary",
      secondary: "bg-secondary/10 text-secondary-foreground",
      success: "bg-green-500/10 text-green-600",
      warning: "bg-yellow-500/10 text-yellow-600",
      default: "bg-muted text-muted-foreground",
    };

    return (
      <Card className="border hover:shadow-lg hover:scale-[1.02] transition-all duration-300 group">
        <CardContent className="gap-4 p-6">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-2 flex-1">
              <span className="text-sm font-medium text-muted-foreground">
                {title}
              </span>
              <span className="text-3xl font-bold text-foreground">
                {value}
              </span>
              {subtitle && (
                <span className="text-xs text-muted-foreground">
                  {subtitle}
                </span>
              )}
            </div>
            <div
              className={cn(
                "p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-all duration-300",
                colorClasses[color],
              )}
            >
              <Icon className="w-6 h-6" />
            </div>
          </div>
          {trend && (
            <div className="flex items-center gap-2 mt-4">
              <div
                className={cn(
                  "flex items-center gap-1 px-2 py-1 rounded-lg",
                  trend.isPositive ? "bg-green-500/10" : "bg-red-500/10",
                )}
              >
                {trend.isPositive ? (
                  <TrendingUp className="w-4 h-4 text-green-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-600" />
                )}
                <span
                  className={cn(
                    "text-sm font-semibold",
                    trend.isPositive ? "text-green-600" : "text-red-600",
                  )}
                >
                  {trend.value}%
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                {t("last_30_days")}
              </span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const DistributionCard = ({
    title,
    items,
  }: {
    title: string;
    items: Array<{
      label: string;
      value: number;
      percentage: string;
      color: string;
    }>;
  }) => (
    <Card className="border hover:shadow-lg transition-all duration-300">
      <CardContent className="gap-5 p-6">
        <h3 className="text-base font-bold text-foreground mb-4">{title}</h3>
        <div className="flex flex-col gap-4">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col gap-2 group">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {item.label}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-base font-bold text-foreground">
                    {item.value}
                  </span>
                  <Badge
                    className="font-semibold transition-all duration-200 group-hover:scale-110"
                    variant="secondary"
                  >
                    {item.percentage}%
                  </Badge>
                </div>
              </div>
              <div className="relative w-full bg-muted rounded-full h-2.5 overflow-hidden">
                <div
                  className={cn(
                    "h-2.5 rounded-full transition-all duration-1000 ease-out",
                    item.color,
                  )}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Overview Stats */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
          <h2 className="text-xl font-bold text-foreground">{t("overview")}</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            color="primary"
            icon={Users}
            title={t("total_students_stat")}
            value={stats.total}
          />
          <StatCard
            color="success"
            icon={UserCheck}
            subtitle={`${stats.activePercentage}% ${t("of_total")}`}
            title={t("active_students")}
            value={stats.activeCount}
          />
          <StatCard
            color="warning"
            icon={UserPlus}
            subtitle={t("last_30_days")}
            title={t("new_this_month")}
            trend={{ value: 12, isPositive: true }}
            value={stats.newThisMonth}
          />
          <StatCard
            color="secondary"
            icon={GraduationCap}
            subtitle={`${(stats.total / 3).toFixed(0)} ${t("of_total")}`}
            title={t("grade_distribution")}
            value="3"
          />
        </div>
      </div>

      {/* Distribution Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DistributionCard
          items={[
            {
              label: t("grade_10"),
              value: stats.grade10,
              percentage: stats.grade10Percentage,
              color: "bg-primary",
            },
            {
              label: t("grade_11"),
              value: stats.grade11,
              percentage: stats.grade11Percentage,
              color: "bg-secondary",
            },
            {
              label: t("grade_12"),
              value: stats.grade12,
              percentage: stats.grade12Percentage,
              color: "bg-green-500",
            },
          ]}
          title={t("grade_distribution")}
        />
        <DistributionCard
          items={[
            {
              label: t("male"),
              value: stats.maleCount,
              percentage: stats.malePercentage,
              color: "bg-primary",
            },
            {
              label: t("female"),
              value: stats.femaleCount,
              percentage: stats.femalePercentage,
              color: "bg-secondary",
            },
            {
              label: t("other"),
              value: stats.otherCount,
              percentage: stats.otherPercentage,
              color: "bg-yellow-500",
            },
          ]}
          title={t("gender_distribution")}
        />
      </div>
    </div>
  );
};
