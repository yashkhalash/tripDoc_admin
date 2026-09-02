import { SidebarNav } from "./sidebar-nav";

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-[var(--color-border)] md:bg-[var(--color-surface)]">
      <div className="flex h-16 items-center border-b border-[var(--color-border)] px-6">
        <span className="text-lg font-bold text-[var(--color-primary)]">TripDoc Admin</span>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <SidebarNav />
      </div>
    </aside>
  );
}
