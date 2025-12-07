"use client";

import React from "react";
import { CalendarCheck, UserCheck, UserX, Clock } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { AttendanceStats as AttendanceStatsType } from "@/types/attendance";
import { cn } from "@/lib/utils";

interface AttendanceStatsProps {
  stats: AttendanceStatsType;
}

export const AttendanceStats: React.FC<AttendanceStatsProps> = ({ stats }) => {
  const { t } = useLanguage();

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
    color?: "default" | "primary" | "success" | "warning" | "danger";
  }) => {
    const colorClasses = {
      primary: "bg-primary/10 text-primary",
      success: "bg-green-500/10 text-green-600",
      warning: "bg-yellow-500/10 text-yellow-600",
      danger: "bg-red-500/10 text-red-600",
      default: "bg-muted text-muted-foreground",
    };

    return (
      <Card className="border hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
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
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatCard
        color="primary"
        icon={CalendarCheck}
        title={t("todays_rate")}
        value={`${stats.attendanceRate}%`}
      />
      <StatCard
        color="success"
        icon={UserCheck}
        title={t("total_present")}
        value={stats.totalPresent}
      />
      <StatCard
        color="danger"
        icon={UserX}
        title={t("total_absent")}
        value={stats.totalAbsent}
      />
      <StatCard
        color="warning"
        icon={Clock}
        title={t("total_late")}
        value={stats.totalLate}
      />
    </div>
  );
};
