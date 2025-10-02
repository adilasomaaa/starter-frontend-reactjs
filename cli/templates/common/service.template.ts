import { http } from "../lib/fetcher";
import type {
  Paginated__Name__Response,
  __Name__CreatePayload,
  __Name__UpdatePayload,
  __Name__,
} from "../models/__name__";

// Asumsi nama file model mengikuti format [nama].model.ts

export const __name__Service = {
  async index(params?: any) {
    return await http<Paginated__Name__Response>("__names__", {
      // __names__ untuk endpoint jamak
      method: "GET",
      query: params,
      auth: true,
    });
  },

  async create(payload: __Name__CreatePayload) {
    return await http<{ data: __Name__ }>("__names__", {
      method: "POST",
      auth: true,
      body: payload,
    });
  },

  async show(id: number) {
    return await http<{ data: __Name__ }>(`__names__/${id}`, {
      method: "GET",
      auth: true,
    });
  },

  async update(id: number, payload: __Name__UpdatePayload) {
    return await http<{ data: __Name__ }>(`__names__/${id}`, {
      method: "PATCH",
      auth: true,
      body: payload,
    });
  },

  async delete(id: number) {
    return await http<{ data: __Name__ }>(`__names__/${id}`, {
      method: "DELETE",
      auth: true,
    });
  },
};
