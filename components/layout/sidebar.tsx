import { SidebarNav } from "./sidebar-nav";
import { LogoutButton } from "./logout-button";
import { Logo } from "./logo";

export function Sidebar() {
  return (
    <aside className="hidden md:fixed md:inset-y-0 md:left-0 md:z-30 md:flex md:w-64 md:flex-col md:border-r md:border-[var(--color-border)] md:bg-[var(--color-surface)]">
      <div className="flex h-16 shrink-0 items-center border-b border-[var(--color-border)] px-6">
        <Logo />
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <SidebarNav />
      </div>
      <div className="shrink-0 border-t border-[var(--color-border)] p-3">
        <LogoutButton />
      </div>
    </aside>
  );
}
