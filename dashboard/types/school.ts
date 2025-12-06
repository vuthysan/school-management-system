// School TypeScript types

export interface School {
  id: string;
  ownerId: string;
  name: string;
  banners: string[];
  logoUrl?: string;
  website?: string;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
  updatedAt: string;
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
