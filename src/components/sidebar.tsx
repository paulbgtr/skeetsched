import { Button } from "./ui/button";

export default function Sidebar() {
  return (
    <aside className="w-64 min-h-screen border-r-[1px] text-gray-800">
      <nav className="p-4 flex flex-col">
        <Button variant="ghost">New Draft</Button>
        <ul className="border-t-[1px] space-y-2">
          <li>{/* todo: fetch user drafts */}</li>
        </ul>
      </nav>
    </aside>
  );
}
