import { Avatar, Button, Divider, Popover, PopoverTrigger, PopoverContent, Tooltip } from "@heroui/react";
import { Bell, Compass, Home, Plus, Search } from "lucide-react";
import Logo from '@/assets/logo2.png'
import AvatarPhoto from '@/assets/avatar.jpg'
import React from "react";
import { NavLink } from "react-router-dom";

const LeftNav = () => {
   const [active, setActive] = React.useState("home");
  const items = [
    { key: "home", label: "Home", icon: <Home size={22} />, to: "/" },
    { key: "search", label: "Search", icon: <Search size={22} />, to: "/search" },
    { key: "explore", label: "Explore", icon: <Compass size={22} />, to: "/search" },
    { key: "activity", label: "Activity", icon: <Bell size={22} />, to: "/search" },
  ];
  return (
    <div className="hidden lg:flex fixed top-0 left-0 h-screen w-28 flex-col items-center border-r border-divider bg-background py-8">
      {/* Top: Brand */}
      <div className="pt-1">
        <Button isIconOnly variant="light" radius="full" aria-label="Mojies">
          <img src={Logo} alt="Mojies" />
        </Button>
      </div>

      {/* Middle: Menu */}
      <div className="mt-8 flex-1 flex flex-col items-center gap-5">
        {items.map((i) => (
          <Tooltip key={i.key} content={i.label} placement="right" className="text-sm">
            <Button
                as={NavLink}
                to={i.to}
                isIconOnly
                radius="lg"
                variant={active === i.key ? "solid" : "flat"}
                color={active === i.key ? "default" : "default"}
                className={`h-12 w-12 ${active === i.key ? "bg-foreground text-background" : "bg-content1"}`}
                onPress={() => setActive(i.key)}
                aria-label={i.label}
            >
            {i.icon}
            </Button>
          </Tooltip>
        ))}

        {/* Compose: Plus button emphasized */}
        <Tooltip content="Buat Post" placement="right" className="text-sm">
          <Button
            isIconOnly
            radius="lg"
            variant="flat"
            className="h-14 w-14 bg-content2"
            aria-label="Buat Post"
          >
            <Plus size={22} />
          </Button>
        </Tooltip>
      </div>

      {/* Bottom: Account (hover to show Logout) */}
      <div className="pb-2">
        <Tooltip
            placement="right"
            content={
                <>
                 <div className="flex items-center gap-3">
                    <Avatar size="sm" src="/avatar.png" />
                    <div className="text-sm">
                        <div className="font-medium">Yasdil</div>
                        <div className="text-foreground-500">@yasdil</div>
                    </div>
                    </div>
                    <Divider className="my-2" />
                    <Button size="sm" variant="light" color="danger" className="w-full">
                        Logout
                    </Button>
                </>
            }
            >
           <Button isIconOnly variant="flat" radius="lg" aria-label="Akun" className="h-12 w-12 bg-content1">
              <Avatar size="sm" src={AvatarPhoto} />
            </Button>
        </Tooltip>
      </div>
    </div>
  );
}

export default LeftNav