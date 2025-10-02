// src/layout/nav.tsx
import { type ReactNode } from "react";
import { LayoutDashboard, Users, Settings, Home, BarChart3, TagIcon } from "lucide-react";

export type Role = "admin" | "client" | string;


export type NavChild = {
    key: string,
    label: string;
    to?: string;
    icon?: ReactNode;
    roles?: Role[];
}
export type NavItem = {
    key: string;
    label: string;
    to?: string;
    icon?: ReactNode;
    exact?: boolean;
    children?: NavChild[];
    roles?: Role[]; // jika diisi → hanya role tsb yang melihat
};

export const NAV_ITEMS: NavItem[] = [
  { key: "home",    label: "Overview", to: "/dashboard", icon: <Home className="h-4 w-4" />, exact: true  },
  {
    key: "management",
    label: "Management",
    icon: <Users className="h-4 w-4" />,
    children: [
      { key: "clients",   label: "Clients",   to: "/dashboard/manage-clients",   icon: <Users className="h-4 w-4" /> },
      { key: "users", label: "Users", to: "/dashboard/manage-users", icon: <Users className="h-4 w-4" /> },
      { key: "roles", label: "Roles", to: "/dashboard/manage-roles", icon: <TagIcon className="h-4 w-4" /> },
      { key: "permissions", label: "Permissions", to: "/dashboard/manage-permissions", icon: <TagIcon className="h-4 w-4" /> },
    ],
  },
  { key: "reports", label: "Reports",  to: "/reports",   icon: <BarChart3 className="h-4 w-4" /> },
  { key: "settings",label: "Settings", to: "/settings",  icon: <Settings className="h-4 w-4" /> },
];

export function filterByRole(items: NavItem[], role?: Role | null) {
  if (!role) return [];
  return items.filter(i => !i.roles || i.roles.includes(role));
}
