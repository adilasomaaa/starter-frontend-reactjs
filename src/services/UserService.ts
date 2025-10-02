import { http } from "../lib/fetcher";
import type {
  PaginatedUserResponse,
  UserUpdatePayload,
  User,
  UserCreatePayload,
} from "../models/user";

// Asumsi nama file model mengikuti format [nama].model.ts

export const userService = {
  async index(params?: any) {
    return await http<PaginatedUserResponse>("users", {
      // users untuk endpoint jamak
      method: "GET",
      query: params,
      auth: true,
    });
  },

  async create(payload: UserCreatePayload) {
    return await http<{ data: User }>("users", {
      method: "POST",
      auth: true,
      body: payload,
    });
  },

  async show(id: number) {
    return await http<{ data: User }>(`users/${id}`, {
      method: "GET",
      auth: true,
    });
  },

  async update(id: number, payload: UserUpdatePayload) {
    return await http<{ data: User }>(`users/${id}`, {
      method: "PATCH",
      auth: true,
      body: payload,
    });
  },

  async delete(id: number) {
    return await http<{ data: User }>(`users/${id}`, {
      method: "DELETE",
      auth: true,
    });
  },
};
