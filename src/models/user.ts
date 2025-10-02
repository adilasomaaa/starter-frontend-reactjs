export type User = {
  id: number;
  email: string;
  username: string;
  verifiedAt?: string;
  userRole: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type UserCreatePayload = {
  email: string;
  username: string;
  roles: string[];
};

export type UserUpdatePayload = {
  email: string;
  username: string;
  roles: string[];
};

export interface PaginatedUserResponse {
  data: User[];
  meta: {
    page: number;
    limit: number;
    totalData: number;
    totalPages: number;
  };
}
