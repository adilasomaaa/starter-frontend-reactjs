// src/layout/nav.tsx
import { type ReactNode } from "react";
import { LayoutDashboard, Users, Settings, Home, BarChart3 } from "lucide-react";

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
      { key: "users",   label: "Users",   to: "/dashboard/manage-users",   icon: <Users className="h-4 w-4" /> },
      { key: "reports", label: "Reports", to: "/reports", icon: <BarChart3 className="h-4 w-4" /> },
    ],
  },
  { key: "reports", label: "Reports",  to: "/reports",   icon: <BarChart3 className="h-4 w-4" /> },
  { key: "settings",label: "Settings", to: "/settings",  icon: <Settings className="h-4 w-4" /> },
];

export function filterByRole(items: NavItem[], role?: Role | null) {
  if (!role) return [];
  return items.filter(i => !i.roles || i.roles.includes(role));
}
