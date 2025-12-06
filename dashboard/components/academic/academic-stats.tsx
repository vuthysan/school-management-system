"use client";

import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/language-context";
import { Class, Subject } from "@/types/academic";
import {
  BookOpen,
  Users,
  School,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AcademicStatsProps {
  classes: Class[];
  subjects: Subject[];
}

export const AcademicStats: React.FC<AcademicStatsProps> = ({ classes, subjects }) => {
  const { t } = useLanguage();

  const stats = useMemo(() => {
    const totalClasses = classes.length;
    const totalSubjects = subjects.length;
    
    // Calculate average class size
    const totalEnrolled = classes.reduce((acc, cls) => acc + cls.enrolledCount, 0);
    const avgClassSize = totalClasses > 0 ? Math.round(totalEnrolled / totalClasses) : 0;

    // Calculate total credits
    const totalCredits = subjects.reduce((acc, sub) => acc + sub.credits, 0);

    return {
      totalClasses,
      totalSubjects,
      avgClassSize,
      totalCredits,
    };
  }, [classes, subjects]);

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
    const colorClasses = {
      primary: "bg-primary/10 text-primary",
      secondary: "bg-secondary/10 text-secondary-foreground",
      success: "bg-green-500/10 text-green-600",
      warning: "bg-yellow-500/10 text-yellow-600",
      default: "bg-muted text-muted-foreground",
    };

    return (
      <Card className="border hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group">
        <CardContent className="gap-4 p-6">
          <div className="flex justify-between items-start">
            <div className="flex flex-col gap-2 flex-1">
              <span className="text-sm font-medium text-muted-foreground">{title}</span>
              <span className="text-3xl font-bold text-foreground">
                {value}
              </span>
              {subtitle && (
                <span className="text-xs text-muted-foreground">{subtitle}</span>
              )}
            </div>
            <div
              className={cn(
                "p-4 rounded-2xl shadow-lg group-hover:scale-110 transition-all duration-300",
                colorClasses[color]
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
        subtitle="Total Curriculum Credits"
        title={t("credits")}
        value={stats.totalCredits}
      />
    </div>
  );
};
