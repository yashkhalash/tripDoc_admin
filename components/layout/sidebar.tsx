"use client";

import { ChevronLeft } from "lucide-react";
import { SidebarNav } from "./sidebar-nav";
import { LogoutButton } from "./logout-button";
import { SidebarProfile } from "./sidebar-profile";
import { Logo } from "./logo";

export function Sidebar({
  collapsed,
  onToggleCollapsed,
}: {
  collapsed: boolean;
  onToggleCollapsed: () => void;
}) {
  return (
    <aside
      className={`hidden md:fixed md:inset-y-0 md:left-0 md:z-30 md:flex md:flex-col md:bg-[var(--sidebar-bg)] md:transition-[width] md:duration-200 ${
        collapsed ? "md:w-20" : "md:w-64"
      } md:flex`}
    >
      <div className="relative flex h-16 shrink-0 items-center border-b border-[var(--sidebar-border)] px-4">
        {!collapsed ? <Logo variant="sidebar" /> : <Logo variant="sidebar" withLabel={false} />}
        <button
          onClick={onToggleCollapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="absolute -right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--color-primary)] text-white shadow-md transition-transform hover:bg-[var(--color-primary-hover)]"
        >
          <ChevronLeft size={14} className={`transition-transform ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>
      <div className="no-scrollbar flex-1 overflow-y-auto overflow-x-hidden py-4">
        <SidebarNav collapsed={collapsed} />
      </div>
      <div className="shrink-0 border-t border-[var(--sidebar-border)] p-3">
        <SidebarProfile collapsed={collapsed} />
        <div className={collapsed ? "mt-1" : "mt-2"}>
          <LogoutButton dark collapsed={collapsed} />
        </div>
      </div>
    </aside>
  );
}
