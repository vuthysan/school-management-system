// Branch TypeScript types

export interface Address {
  village?: string;
  commune?: string;
  district?: string;
  province: string;
}

export interface Branch {
  id: string;
  schoolId: string;
  name: string;
  address: Address;
  contactEmail: string;
  contactPhone: string;
  createdAt: string;
  updatedAt: string;
}

export interface BranchFormData {
  schoolId: string;
  name: string;
  address: Address;
  contactEmail: string;
  contactPhone: string;
}

export interface CreateBranchInput {
  school_id: string;
  name: string;
  address: {
    village?: string;
    commune?: string;
    district?: string;
    province: string;
  };
  contact_email: string;
  contact_phone: string;
}
