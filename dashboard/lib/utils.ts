import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ============================================================================
// Buddhist Era (ពុទ្ធសករាជ) Calendar Utilities
// Cambodia uses BE = CE + 543
// ============================================================================

/** Convert Gregorian (CE) year to Buddhist Era (BE) year */
export function toBuddhistEra(ceYear: number): number {
  return ceYear + 543;
}

/** Convert Buddhist Era (BE) year to Gregorian (CE) year */
export function fromBuddhistEra(beYear: number): number {
  return beYear - 543;
}

/** Format year as "CE / ព.ស. BE" — e.g. "2025 / ព.ស. 2568" */
export function formatYearWithBE(ceYear: number): string {
  return `${ceYear} / ព.ស. ${toBuddhistEra(ceYear)}`;
}

/** Format academic year — e.g. "2025-2026 (ព.ស. 2568-2569)" */
export function formatAcademicYearWithBE(
  startYear: number,
  endYear: number
): string {
  return `${startYear}-${endYear} (ព.ស. ${toBuddhistEra(startYear)}-${toBuddhistEra(endYear)})`;
}

/** Get current Buddhist Era year */
export function currentBuddhistEraYear(): number {
  return toBuddhistEra(new Date().getFullYear());
}
