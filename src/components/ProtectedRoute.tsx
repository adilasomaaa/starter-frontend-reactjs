// src/components/ProtectedRoute.tsx
import { Navigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { hasAllPerms, hasAnyRole } from "../lib/rbac";

type Props = {
  children: React.ReactNode;
  roles?: string[];          // contoh: ["admin"]
  permissions?: string[];    // contoh: ["create_post"]
  redirectTo?: string;       // default: "/landing"
};

export default function ProtectedRoute({
  children,
  roles,
  permissions,
  redirectTo = "/landing",
}: Props) {
  const { user, token, isLoading } = useAuth();

  if (isLoading) return null; // bisa ganti spinner

  if (!token || !user) return <Navigate to="/login" replace />;

  // role check
  if (!hasAnyRole(user, roles)) {
    return <Navigate to={redirectTo} replace />;
  }

  // permission check (opsional)
  if (!hasAllPerms(user, permissions)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
}
