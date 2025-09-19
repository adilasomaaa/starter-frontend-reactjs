import { http } from "../lib/fetcher"
import type { PaginatedUsersResponse, UserUpdatePayload, User, UserQueryParams, UserUpdateStatusPayload, RegisterPayload } from "../models"

export const userService = {
    async index(params?: UserQueryParams){
        return await http<PaginatedUsersResponse>('profile', {
            method: 'GET',
            query: params,
            auth:true
        })
    },

    async show(id: number){
        return await http<{data: User}>('profile/' + id, {
            method: 'GET',
            auth:true
        })
    },

    async create(payload: RegisterPayload){
        return await http<{data: User}>('auth/register', {
            method: 'POST',
            auth:true,
            body: payload
        })
    },

    async update(id: number, payload: UserUpdatePayload){
        return await http<{data: User}>('profile/' + id + '/update-profile', {
            method: 'PATCH',
            auth:true,
            body: payload
        })
    },

    async updateStatus(id:number, payload: UserUpdateStatusPayload){
        return await http<{data: User}>('profile/' + id + '/update-status', {
            method: 'PATCH',
            auth:true,
            body: payload
        })
    }, 

    async updatePhoto(id: number, photo: File) {
        const formData = new FormData();

        formData.append('photo', photo);

        return await http<{ data: User }>(`profile/${id}/photo`, {
            method: "PATCH",
            auth: true,
            body: formData,
            toast: true,
        });
    },

    async delete(id:number){
        return await http<{data: User}>('profile/' + id, {
            method: 'DELETE',
            auth:true
        })
    }, 


}