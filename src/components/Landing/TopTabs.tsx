import { Divider, Tab, Tabs } from "@heroui/react";
import React from "react";

interface TopTabsProps {
    active: string;
    onChange: (active: string) => void;
}

const TopTabs = ({active, onChange}: TopTabsProps) => {

  return (
    <div className="sticky top-0 z-20 -mx-4 lg:mx-0 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 pt-3">
        <Tabs
            fullWidth
            aria-label="Filter konten"
            variant="solid"
            selectedKey={active}
            onSelectionChange={(k) => onChange(String(k))}
        >
          <Tab key="teman" title="Teman" />
          <Tab key="foryou" title="Untuk Anda" />
          <Tab key="eksplor" title="Eksplor" />
        </Tabs>
      </div>
      <Divider className="mt-3" />
    </div>
  );
}


export default TopTabs