"use client";

import React from "react";
import { Building, ChevronDown, Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Branch } from "@/types/branch";

interface BranchSidebarProps {
  branches: Branch[];
  selectedBranch?: Branch | null;
  onSelectBranch: (branch: Branch) => void;
  onAddBranch?: () => void;
  loading?: boolean;
  schoolName?: string;
}

export function BranchSidebar({
  branches,
  selectedBranch,
  onSelectBranch,
  onAddBranch,
  loading = false,
  schoolName,
}: BranchSidebarProps) {
  return (
    <div className="border-b p-3 bg-muted/30">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full justify-between h-auto py-2"
            disabled={loading}
          >
            <div className="flex items-center gap-2 text-left">
              <Building className="h-4 w-4 text-primary flex-shrink-0" />
              <div className="flex flex-col items-start min-w-0">
                <span className="text-xs text-muted-foreground truncate">
                  {schoolName || "Select School"}
                </span>
                <span className="text-sm font-medium truncate">
                  {loading
                    ? "Loading..."
                    : selectedBranch?.name || "Select Branch"}
                </span>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 flex-shrink-0 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>Branches</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {branches.length === 0 ? (
            <DropdownMenuItem disabled>
              No branches available
            </DropdownMenuItem>
          ) : (
            branches.map((branch) => (
              <DropdownMenuItem
                key={branch.id}
                onClick={() => onSelectBranch(branch)}
                className="gap-2"
              >
                <Building className="h-4 w-4" />
                <span className="flex-1">{branch.name}</span>
                {selectedBranch?.id === branch.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))
          )}
          {onAddBranch && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onAddBranch} className="gap-2">
                <Plus className="h-4 w-4" />
                Add New Branch
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

// Compact version for use in navbar or smaller spaces
export function BranchSelector({
  branches,
  selectedBranch,
  onSelectBranch,
  loading = false,
}: Omit<BranchSidebarProps, "onAddBranch" | "schoolName">) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          disabled={loading || branches.length === 0}
        >
          <Building className="h-4 w-4" />
          <span className="max-w-[120px] truncate">
            {loading ? "Loading..." : selectedBranch?.name || "Select Branch"}
          </span>
          <ChevronDown className="h-3 w-3 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>Switch Branch</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {branches.map((branch) => (
          <DropdownMenuItem
            key={branch.id}
            onClick={() => onSelectBranch(branch)}
            className={cn(
              "gap-2",
              selectedBranch?.id === branch.id && "bg-primary/10"
            )}
          >
            <Building className="h-4 w-4" />
            <span className="flex-1">{branch.name}</span>
            {selectedBranch?.id === branch.id && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
