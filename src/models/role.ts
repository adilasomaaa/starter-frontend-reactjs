export type Role = {
  id: number;
  name: string;
  permissions: string[];
  createdAt?: string;
};

export type RoleUpdatePayload = {
  name: string;
  permissions: string[];
};

export type RoleCreatePayload = {
  name: string;
  permissions: string[];
};

export interface PaginatedRoleResponse {
  data: Role[];
  meta: {
    page: number;
    limit: number;
    totalData: number;
    totalPages: number;
  };
}
