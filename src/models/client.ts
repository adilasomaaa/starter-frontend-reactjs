export type Client = {
  id: number;
  name: string;
  photo: string;
  bio: string;
  userId: number;
  user: {
    email: string;
    createdAt: string;
  };
  status: "active" | "inactive" | "banned";
  username?: string;
  createdAt?: string;
};

export type ClientUpdateStatusPayload = {
  status: "active" | "paused" | "vacation";
};

export interface ClientQueryParams {
  [key: string]: string | number | undefined;
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export type ClientUpdatePhotoPayload = {
  photo: string;
};

export type ClientUpdatePayload = {
  name: string;
  bio: string;
  username: string;
};

export interface PaginatedClientResponse {
  data: Client[];
  meta: {
    page: number;
    limit: number;
    totalData: number;
    totalPages: number;
  };
}
