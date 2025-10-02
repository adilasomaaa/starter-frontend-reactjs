import { http } from "../lib/fetcher";
import type {
  PaginatedRoleResponse,
  RoleCreatePayload,
  RoleUpdatePayload,
  Role,
} from "../models/role";

// Asumsi nama file model mengikuti format [nama].model.ts

export const roleService = {
  async index(params?: any) {
    return await http<PaginatedRoleResponse>("roles", {
      // roles untuk endpoint jamak
      method: "GET",
      query: params,
      auth: true,
    });
  },

  async create(payload: RoleCreatePayload) {
    return await http<{ data: Role }>("roles", {
      method: "POST",
      auth: true,
      body: payload,
    });
  },

  async show(id: number) {
    return await http<{ data: Role }>(`roles/${id}`, {
      method: "GET",
      auth: true,
    });
  },

  async update(id: number, payload: RoleUpdatePayload) {
    return await http<{ data: Role }>(`roles/${id}`, {
      method: "PATCH",
      auth: true,
      body: payload,
    });
  },

  async delete(id: number) {
    return await http<{ data: Role }>(`roles/${id}`, {
      method: "DELETE",
      auth: true,
    });
  },
};
