import { http } from "../lib/fetcher"
import type { PaginatedClientResponse, ClientUpdatePayload, Client, ClientQueryParams, ClientUpdateStatusPayload, RegisterPayload } from "../models"

export const clientService = {
    async index(params?: ClientQueryParams){
        return await http<PaginatedClientResponse>('profile', {
            method: 'GET',
            query: params,
            auth:true
        })
    },

    async show(id: number){
        return await http<{data: Client}>('profile/' + id, {
            method: 'GET',
            auth:true
        })
    },

    async create(payload: RegisterPayload){
        return await http<{data: Client}>('auth/register', {
            method: 'POST',
            auth:true,
            body: payload
        })
    },

    async update(id: number, payload: ClientUpdatePayload){
        return await http<{data: Client}>('profile/' + id + '/update-profile', {
            method: 'PATCH',
            auth:true,
            body: payload
        })
    },

    async updateStatus(id:number, payload: ClientUpdateStatusPayload){
        return await http<{data: Client}>('profile/' + id + '/update-status', {
            method: 'PATCH',
            auth:true,
            body: payload
        })
    }, 

    async updatePhoto(id: number, photo: File) {
        const formData = new FormData();

        formData.append('photo', photo);

        return await http<{ data: Client }>(`profile/${id}/photo`, {
            method: "PATCH",
            auth: true,
            body: formData,
            toast: true,
        });
    },

    async delete(id:number){
        return await http<{data: Client}>('profile/' + id, {
            method: 'DELETE',
            auth:true
        })
    }, 


}