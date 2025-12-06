"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Branch } from "@/types/branch";
import { MapPin, Mail, Phone, Building } from "lucide-react";

interface BranchesTableProps {
  branches: Branch[];
  loading?: boolean;
}

export function BranchesTable({ branches, loading = false }: BranchesTableProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-muted-foreground">Loading branches...</div>
      </div>
    );
  }

  if (branches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center border rounded-lg">
        <Building className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Branches Yet</h3>
        <p className="text-muted-foreground">
          Create your first branch for this school.
        </p>
      </div>
    );
  }

  const formatAddress = (branch: Branch) => {
    const parts = [
      branch.address.village,
      branch.address.commune,
      branch.address.district,
      branch.address.province,
    ].filter(Boolean);
    return parts.join(", ");
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Branch Name</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {branches.map((branch) => (
            <TableRow key={branch.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-secondary/50 flex items-center justify-center">
                    <Building className="h-5 w-5 text-secondary-foreground" />
                  </div>
                  <p className="font-semibold">{branch.name}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-start gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                  <span>{formatAddress(branch)}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-col gap-1 text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {branch.contactEmail}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Phone className="h-3 w-3" />
                    {branch.contactPhone}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {new Date(branch.createdAt).toLocaleDateString()}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
