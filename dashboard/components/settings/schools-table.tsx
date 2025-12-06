"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { School } from "@/types/school";
import { Building2, Globe, Mail, Phone } from "lucide-react";

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
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading schools...</div>
      </div>
    );
  }

  if (schools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
        <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Schools Yet</h3>
        <p className="text-muted-foreground">
          Create your first school to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>School Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Website</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schools.map((school) => (
            <TableRow
              key={school.id}
              className={selectedSchoolId === school.id ? "bg-muted/50" : ""}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  {school.logoUrl ? (
                    <img
                      src={school.logoUrl}
                      alt={school.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                  )}
                  <div>
                    <p className="font-semibold">{school.name}</p>
                    {selectedSchoolId === school.id && (
                      <Badge variant="secondary" className="mt-1">Selected</Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {school.contactEmail}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {school.contactPhone}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {school.website ? (
                  <a
                    href={school.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <Globe className="h-3 w-3" />
                    Visit
                  </a>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {new Date(school.createdAt).toLocaleDateString()}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant={selectedSchoolId === school.id ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => onSelectSchool(school)}
                >
                  {selectedSchoolId === school.id ? "Selected" : "Select"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
