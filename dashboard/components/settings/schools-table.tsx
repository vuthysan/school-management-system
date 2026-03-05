"use client";

import { Building2, Globe, Mail, Phone, MapPin, Users, GraduationCap, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/language-context";
import { School } from "@/types/school";

interface SchoolsTableProps {
  schools: School[];
  selectedSchoolId?: string;
  onSelectSchool: (school: School) => void;
  loading?: boolean;
}

export function SchoolsTable({
  schools,
  selectedSchoolId,
  onSelectSchool,
  loading = false,
}: SchoolsTableProps) {
  const { language, t } = useLanguage();

  const getLocalizedName = (name: { en: string; km: string } | string): string => {
    if (typeof name === "string") return name;
    return language === "km" ? (name.km || name.en) : (name.en || name.km);
  };

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="liquid-glass-card p-5 animate-pulse">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-2/3" />
                <div className="h-3 bg-muted rounded w-1/3" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded w-full" />
              <div className="h-3 bg-muted rounded w-4/5" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (schools.length === 0) {
    return (
      <div className="liquid-glass-card flex flex-col items-center justify-center py-16 text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center mb-4">
          <Building2 className="h-7 w-7 text-primary/40" />
        </div>
        <h3 className="text-sm font-semibold mb-1">{t("no_schools") || "No Schools Yet"}</h3>
        <p className="text-xs text-muted-foreground max-w-xs">
          {t("no_schools_desc") || "Create your first school to get started."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {schools.map((school, i) => {
        const isSelected = selectedSchoolId === school.idStr;
        const name = getLocalizedName(school.name);
        const province = school.address?.province;

        return (
          <motion.div
            key={school.idStr}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div
              className={`liquid-glass-card p-5 cursor-pointer transition-all duration-200 ${
                isSelected
                  ? "ring-2 ring-primary/30 border-primary/20"
                  : "hover:border-primary/10"
              }`}
              onClick={() => onSelectSchool(school)}
            >
              {/* Header */}
              <div className="flex items-start gap-3 mb-3">
                {school.logoUrl ? (
                  <img
                    alt={name}
                    className="w-11 h-11 rounded-xl object-cover shrink-0 ring-1 ring-border"
                    src={school.logoUrl}
                  />
                ) : (
                  <div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/15 flex items-center justify-center shrink-0">
                    <Building2 className="h-5 w-5 text-primary" strokeWidth={1.8} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-foreground truncate">{name}</h3>
                    {isSelected && (
                      <Badge variant="default" className="text-[10px] px-1.5 py-0">
                        {t("selected") || "Selected"}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {school.code && (
                      <span className="text-xs text-muted-foreground font-mono">{school.code}</span>
                    )}
                    {school.status && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 font-normal"
                      >
                        {school.status}
                      </Badge>
                    )}
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 transition-colors ${isSelected ? "text-primary" : "text-muted-foreground/30"}`} />
              </div>

              {/* Info rows */}
              <div className="space-y-1.5 text-xs text-muted-foreground">
                {province && (
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{province}</span>
                  </div>
                )}
                {school.contact?.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 shrink-0" />
                    <span className="truncate">{school.contact.email}</span>
                  </div>
                )}
                {school.contact?.phone && (
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 shrink-0" />
                    <span>{school.contact.phone}</span>
                  </div>
                )}
                {school.website && (
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-3 h-3 shrink-0" />
                    <span className="truncate text-primary/80">{school.website}</span>
                  </div>
                )}
              </div>

              {/* Stats footer */}
              {school.stats && (
                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/50">
                  {school.stats.totalStudents != null && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <GraduationCap className="w-3 h-3" />
                      <span className="font-medium text-foreground">{school.stats.totalStudents}</span>
                      {t("students").toLowerCase()}
                    </div>
                  )}
                  {school.stats.totalTeachers != null && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" />
                      <span className="font-medium text-foreground">{school.stats.totalTeachers}</span>
                      {t("teachers_staff")?.split("&")[0]?.trim()?.toLowerCase() || "teachers"}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
