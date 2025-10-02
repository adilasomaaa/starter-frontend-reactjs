import { http } from "../lib/fetcher";
import type {
  PaginatedPermissionsResponse,
  PermissionsCreatePayload,
  PermissionsUpdatePayload,
  Permissions,
} from "../models/permissions";

// Asumsi nama file model mengikuti format [nama].model.ts

export const permissionsService = {
  async index(params?: any) {
    return await http<PaginatedPermissionsResponse>("permissions", {
      // permissions untuk endpoint jamak
      method: "GET",
      query: params,
      auth: true,
    });
  },

  async create(payload: PermissionsCreatePayload) {
    return await http<{ data: Permissions }>("permissions", {
      method: "POST",
      auth: true,
      body: payload,
    });
  },

  async show(id: number) {
    return await http<{ data: Permissions }>(`permissions/${id}`, {
      method: "GET",
      auth: true,
    });
  },

  async update(id: number, payload: PermissionsUpdatePayload) {
    return await http<{ data: Permissions }>(`permissions/${id}`, {
      method: "PATCH",
      auth: true,
      body: payload,
    });
  },

  async delete(id: number) {
    return await http<{ data: Permissions }>(`permissions/${id}`, {
      method: "DELETE",
      auth: true,
    });
  },
};
