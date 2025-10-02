export type Permissions = {
  id: number;
  name: string;
  createdAt: string;
};

export type PermissionsUpdatePayload = {
  name: string;
};

export type PermissionsCreatePayload = {
  name: string;
};

export interface PaginatedPermissionsResponse {
  data: Permissions[];
  meta: {
    page: number;
    limit: number;
    totalData: number;
    totalPages: number;
  };
}
