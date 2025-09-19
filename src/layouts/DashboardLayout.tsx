// src/layout/AdminLayout.tsx
import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import { Button, Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { LogOut, Mail, Menu } from "lucide-react";
import { useLocalStorage } from "../context/LocalStorageContext";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Dashboard/Sidebar";

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useLocalStorage<boolean>("admin.sidebar.collapsed", false);
  const [openMobile, setOpenMobile] = useState(false);
  const { user, logout } = useAuth();

  return (
        <div className="min-h-dvh w-full flex bg-background">
        <Sidebar
            collapsed={collapsed}
            onToggle={() => setCollapsed((v) => !v)}
        />

        {/* Right content */}
        <div className="flex-1 flex flex-col">
            {/* Topbar */}
            <header className="h-16 border-b border-gray-200 flex items-center px-4 gap-3">
            <Button
                isIconOnly
                variant="light"
                className="md:hidden"
                onPress={() => setOpenMobile(true)}
                aria-label="Open menu"
            >
                <Menu className="h-5 w-5" />
            </Button>

            <Link to="/dashboard" className="font-semibold hidden md:inline">
                Dashboard
            </Link>

            <div className="ml-auto flex items-center gap-2">
                <Dropdown>
                <DropdownTrigger>
                    <Avatar
                    as="button"
                    isBordered
                    size="sm"
                    name={user?.username ?? user?.email}
                    />
                </DropdownTrigger>
                <DropdownMenu aria-label="User menu">
                    <DropdownItem 
                        startContent={<Mail />}
                        key="email" 
                        isReadOnly 
                        className="text-xs flex items-center gap-2">
                        {user?.email}
                    </DropdownItem>
                    <DropdownItem 
                        startContent={<LogOut />}
                        key="logout" 
                        color="primary" 
                        onPress={() => logout()} 
                        className="flex items-center gap-2">
                        Logout
                    </DropdownItem>
                </DropdownMenu>
                </Dropdown>
            </div>
            </header>

            {/* Page content */}
            <main className="p-4">
            <Outlet />
            </main>
        </div>

        {/* Mobile drawer */}
        {openMobile && (
            <div className="fixed inset-0 z-50 md:hidden">
                <div className="absolute inset-0 bg-black/30" onClick={() => setOpenMobile(false)} />
                <div className="absolute inset-y-0 left-0">
                <Sidebar
                    mobile         // <— aktifkan mode mobile
                    collapsed={false}
                    onToggle={() => {}}
                    onCloseMobile={() => setOpenMobile(false)}
                />
                </div>
            </div>
            )}
        </div>
  );
}
