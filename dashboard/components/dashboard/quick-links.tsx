import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const links = [
  { href: "#", label: "Admissions", helper: "New Applications" },
  { href: "#", label: "Classes", helper: "Grades & Timetables" },
  { href: "#", label: "Attendance", helper: "Daily Tracking" },
  { href: "#", label: "Assessments", helper: "Marks & Report Cards" },
  { href: "#", label: "Finance", helper: "Fees & Invoices" },
  { href: "#", label: "Announcements", helper: "School-wide Notices" },
];

export function QuickLinks() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-medium">Quick Links</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {links.map((l) => (
            <Link
              key={l.label}
              className="p-3 rounded-md border border-border hover:bg-muted transition-colors"
              href={l.href}
            >
              <div className="font-medium">{l.label}</div>
              <div className="text-xs text-muted-foreground">{l.helper}</div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
