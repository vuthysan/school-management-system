import { Card, CardContent, CardHeader } from "@/components/ui/card";

type Stat = {
  label: string;
  value: string | number;
  helper?: string;
};

const defaultStats: Stat[] = [
  { label: "Total Students", value: 1240, helper: "Active, all grades" },
  { label: "Teachers", value: 82, helper: "Full-time & part-time" },
  { label: "Attendance Today", value: "94%", helper: "Across all classes" },
  { label: "Fees Due", value: "$12,430", helper: "Current month" },
];

export function StatsCards({ stats = defaultStats }: { stats?: Stat[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardHeader className="pb-0">
            <div className="text-sm text-muted-foreground">{s.label}</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{s.value}</div>
            {s.helper ? (
              <div className="text-xs text-muted-foreground">{s.helper}</div>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
