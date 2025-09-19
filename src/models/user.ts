export type User = {
  id: string;
  name: string;
  photo: string;
  bio: string;
  userId: number;
  user: {
    username: string;
    email: string;
  };
  username?: string;
  createdAt?: string;
};

export type UserUpdateStatusPayload = {
  status: "active" | "paused" | "vacation";
};

export interface UserQueryParams {
  [key: string]: string | number | undefined;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export type UserUpdatePhotoPayload = {
  photo: string;
};

export type UserUpdatePayload = {
  name: string;
  bio: string;
  username: string;
};

export interface PaginatedUsersResponse {
  data: User[];
  meta: {
    page: number;
    limit: number;
    totalData: number;
    totalPages: number;
  };
}
