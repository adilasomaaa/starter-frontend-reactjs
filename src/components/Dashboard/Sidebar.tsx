// src/layout/AdminSidebar.tsx
import { NavLink } from "react-router-dom";
import { Button, Tooltip, Avatar, Divider, Accordion, AccordionItem, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@heroui/react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { NAV_ITEMS } from "./Nav";
import { useMemo } from "react";
import Logo from '@/assets/logo.png';

export default function Sidebar({
    collapsed,
    onToggle,
    onCloseMobile,
    mobile = false,            // <— tambah prop
}: {
    collapsed: boolean;
    onToggle: () => void;
    onCloseMobile?: () => void;
    mobile?: boolean;          // <— tambah prop
}) {
    const rootClass = [
        "h-dvh border-r border-gray-200 bg-background flex flex-col transition-[width] duration-200",
        mobile
        ? "w-64 md:hidden"     // <— di mobile: TAMPIL (bukan hidden)
        : collapsed
            ? "hidden md:flex w-16"
            : "hidden md:flex w-64",
    ].join(" ");

    const items = useMemo(() => NAV_ITEMS, []);

return (
    <aside className={rootClass}>
        {/* Brand / Toggle */}
        <div className="h-16 px-3 flex items-center justify-between">
            {!collapsed && <img src={Logo} alt="Logo" className="h-10 ml-3" />}
            {!mobile && ( // tombol collapse tak perlu di drawer mobile
            <Button isIconOnly size="sm" variant="light" onPress={onToggle} aria-label="Toggle sidebar">
                {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
            )}
        </div>

        {/* Nav */}
        <nav className={collapsed ? "flex-1 space-y-1 px-1 py-3" : "flex-1 space-y-1 px-3 py-3"}>
        {items.map((item) =>
          item.children && item.children.length > 0 ? (
            mobile || !collapsed ? (
              // Expanded (desktop) & mobile: pakai Accordion
              <Accordion key={item.key} variant="splitted" selectionMode="multiple" className="mb-1">
                <AccordionItem
                  key={`${item.key}-acc`}
                  aria-label={item.label}
                  className="shadow-none border border-gray-200"
                  title={
                    <div className="flex items-center gap-3">
                      <span className="[&>*]:h-6 [&>*]:w-6 text-primary-600">{item.icon}</span>
                      <span className="truncate">{item.label}</span>
                    </div>
                  }
                  indicator={<ChevronDown className="h-4 w-4" />}
                >
                  <div className="flex flex-col gap-1">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.key}
                        to={child.to}
                        className={({ isActive }) =>
                          [
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm",
                            isActive ? "bg-primary-50 text-dark" : "hover:bg-muted",
                          ].join(" ")
                        }
                        onClick={onCloseMobile}
                      >
                        <span className="[&>*]:h-4 [&>*]:w-4 text-primary-600">{child.icon}</span>
                        <span className="truncate">{child.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </AccordionItem>
              </Accordion>
            ) : (
              // Collapsed (desktop): pakai Dropdown (popover) saat klik parent
              <Dropdown key={item.key} placement="right-start" offset={8}>
                <DropdownTrigger>
                  <button
                    className={[
                      "group flex items-center justify-center rounded-lg p-3 w-full",
                      "hover:bg-muted",
                    ].join(" ")}
                    aria-label={item.label}
                  >
                    <span className="[&>*]:h-6 [&>*]:w-6 text-primary-600">{item.icon}</span>
                  </button>
                </DropdownTrigger>
                <DropdownMenu aria-label={`${item.label} submenu`}>
                  {item.children.map((child) => (
                    <DropdownItem
                      key={child.key}
                      onPress={() => onCloseMobile?.()}
                      href={child.to}
                      as="a"
                      startContent={<span className="[&>*]:h-4 [&>*]:w-4 text-primary-600">{child.icon}</span>}
                    >
                      {child.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            )
          ) : (
            (() => {
              const link = (
                <NavLink
                  key={item.key}
                  to={item.to!}
                  end={item.exact}
                  className={({ isActive }) =>
                    [
                      "group flex items-center gap-3 rounded-lg px-4 py-3 text-md mx-2",
                      collapsed && !mobile ? "justify-center" : "",
                      isActive ? "bg-primary-50 text-dark" : "hover:bg-muted",
                    ].join(" ")
                  }
                  onClick={onCloseMobile}
                >
                  <span className="[&>*]:h-6 [&>*]:w-6 text-primary-600">{item.icon}</span>
                  {(!collapsed || mobile) && <span className="truncate">{item.label}</span>}
                </NavLink>
              );

              return collapsed && !mobile ? (
                <Tooltip key={item.key} content={item.label} placement="right">
                  {link}
                </Tooltip>
              ) : (
                <div key={item.key}>{link}</div>
              );
            })()
          )
        )}
      </nav>

    </aside>
  );
}
