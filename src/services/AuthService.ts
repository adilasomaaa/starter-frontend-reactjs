import { http } from "../lib/fetcher";
import type { AuthResponse, AuthUser, LoginPayload, RegisterPayload, ResendCode, VerificationCode } from "../models";

export const authService = {
    async login(payload: LoginPayload) {
        return await http<{ data: AuthResponse }>("auth/login", {
            method: "POST",
            auth: false,
            body: payload,
        }).then((res) => {
            const { data } = res;
            if (data.token) {
                localStorage.setItem("token", data.token);
            }
            return data;
        })
    },

    async register(payload: RegisterPayload) {
        return await http<{ success: boolean }>("auth/register", {
            method: "POST",
            auth: false,
            body: payload,
        }).then((res) => {
            return { status: res.success };
        })
    },

    async verifyCode(payload: VerificationCode) {
        return await http<{ success: boolean }>("auth/verify", {
            method: "POST",
            auth: false,
            body: payload,
        }).then((res) => {
            return { status: res.success };
        })
    },

    async resendCode(payload: ResendCode) {
        return await http<{ success: boolean }>("auth/resend-code", {
            method: "POST",
            auth: false,
            body: payload,
        }).then((res) => {
            return { status: res.success };
        })
    },

    me(tokenOverride?: string) {
        return http<{data :AuthUser}>("auth/me", {
            auth: true,
            headers: tokenOverride ? { Authorization: `Bearer ${tokenOverride}` } : undefined,
        });
    },

    async logout() {
        try {
            await http<void>("auth/logout", {
                method: "POST",
                auth: true,
            });
        } catch {
            // ignore error
        } finally {
            localStorage.removeItem("access_token");
        }
    },
};
