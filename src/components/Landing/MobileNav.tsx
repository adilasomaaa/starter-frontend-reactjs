import { Button } from '@heroui/button';
import { Bell, Compass, Home, Plus, Search } from 'lucide-react';
import React from 'react'

const MobileNav = () => {
  const nav = [
    { key: "home", icon: <Home size={20} /> },
    { key: "search", icon: <Search size={20} /> },
    { key: "compose", icon: <Plus size={20} /> },
    { key: "explore", icon: <Compass size={20} /> },
    { key: "activity", icon: <Bell size={20} /> },
  ];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-default-200 bg-background/80 backdrop-blur lg:hidden">
      <div className="mx-auto grid grid-cols-5">
        {nav.map((n) => (
            <div key={n.key} className='flex items-center justify-center py-2'>
                <Button isIconOnly variant="light" className="py-4">
                    {n.icon}
                </Button>
            </div>
        ))}
      </div>
    </nav>
  );
}

export default MobileNav