import Sidebar from "@/features/sidebar/sidebar";
import { UserActions } from "@/features/user-actions";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <UserActions />
      <main className="flex-1 overflow-auto p-4">{children}</main>
    </div>
  );
}
