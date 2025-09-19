import type { AuthUser } from "../models";

export function getRole(user?: AuthUser | null) {
  return user?.roles?.name ?? null;
}

export function hasAnyRole(user: AuthUser | null | undefined, allow?: string[]) {
  if (!allow || allow.length === 0) return true;      // jika tidak diset, lolos
  const role = getRole(user);
  return !!role && allow.includes(role);
}

export function hasAllPerms(user: AuthUser | null | undefined, perms?: string[]) {
  if (!perms || perms.length === 0) return true;
  const list = user?.roles?.rolePermissions ?? [];
  return perms.every((p) => list.includes(p));
}
