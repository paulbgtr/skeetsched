"use client";

import { Button } from "../components/ui/button";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen border-r-[1px] text-gray-800">
      <nav className="p-4 flex flex-col">
        <Button variant="ghost">New Draft</Button>
      </nav>
    </aside>
  );
}
