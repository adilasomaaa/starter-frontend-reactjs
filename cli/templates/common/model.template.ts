export type __Name__ = {
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

export type __Name__UpdatePayload = {
  name: string;
  bio: string;
  username: string;
};

export type __Name__CreatePayload = {
  name: string;
  bio: string;
  username: string;
};

export interface Paginated__Name__Response {
  data: __Name__[];
  meta: {
    page: number;
    limit: number;
    totalData: number;
    totalPages: number;
  };
}
