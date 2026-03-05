// School TypeScript types

export interface LocalizedText {
  en: string;
  km: string;
}

export interface SchoolAddress {
  street?: string;
  village?: string;
  commune?: string;
  district?: string;
  province?: string;
  postalCode?: string;
  country?: string;
}

export interface SchoolStats {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  totalBranches?: number;
}

export interface LookupEntry {
  key: string;
  values: string[];
}

export interface School {
  idStr: string;
  name: LocalizedText;
  code?: string;
  schoolType?: string;
  educationLevels?: string[];
  status?: string;
  address?: SchoolAddress;
  contact?: { phone?: string; email?: string };
  website?: string;
  stats?: SchoolStats;
  displayName?: string;
  description?: string;
  logoUrl?: string;
  effectiveLogoUrl?: string;
  primaryColor?: string;
  lookupValues?: LookupEntry[];
}

export interface SchoolFormData {
  ownerId: string;
  name: string;
  banners: string[];
  logoUrl?: string;
  website?: string;
  contactEmail: string;
  contactPhone: string;
}

export interface CreateSchoolInput {
  owner_id: string;
  name: string;
  banners: string[];
  logo_url?: string;
  website?: string;
  contact_email: string;
  contact_phone: string;
}
