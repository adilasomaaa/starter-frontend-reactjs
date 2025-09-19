// src/context/AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import type { AuthUser } from "../models";
import { authService } from "../services/AuthService";

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(
        localStorage.getItem("token")
    );
    const [isLoading, setIsLoading] = useState(true);

    // ketika refresh, kalau ada token → ambil /me
    useEffect(() => {
        const fetchUser = async () => {
            if (!token) { setIsLoading(false); return; }
            try {
                const me = await authService.me();
                setUser(me.data);
            } catch (e) {
                localStorage.removeItem("token");
                setUser(null);
                setToken(null);
            } finally {
                setIsLoading(false);
            }
        };
        fetchUser();
    }, [token]);

    const login = (token: string) => {
        localStorage.setItem("token", token);
        setToken(token);
        // user akan di-fetch otomatis lewat effect
    };

    const logout = async () => {
        try {
            await authService.logout(); // panggil dulu endpoint (kalau ada)
        } finally {
            // apapun hasilnya, bersihkan state lokal TERAKHIR
            localStorage.removeItem("access_token");
            setUser(null);
            setToken(null);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
        {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
