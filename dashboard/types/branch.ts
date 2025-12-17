// Branch TypeScript types

export interface Address {
  street?: string;
  village?: string;
  commune?: string;
  district?: string;
  province?: string;
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

// GraphQL input - uses camelCase to match async-graphql default naming
export interface CreateBranchInput {
  schoolId: string;
  name: string;
  address: {
    street?: string;
    village?: string;
    commune?: string;
    district?: string;
    province?: string;
  };
  contactEmail: string;
  contactPhone: string;
}

export interface UpdateBranchInput {
  name?: string;
  address?: {
    street?: string;
    village?: string;
    commune?: string;
    district?: string;
    province?: string;
  };
  contactEmail?: string;
  contactPhone?: string;
}
