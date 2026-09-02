"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav-items";

export function SidebarNav({
  onNavigate,
  collapsed = false,
}: {
  onNavigate?: () => void;
  collapsed?: boolean;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-0.5 px-3">
      {NAV_ITEMS.map((item) => {
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              collapsed ? "justify-center px-0" : ""
            } ${
              active
                ? "bg-[var(--sidebar-active-bg)] text-white"
                : "text-[var(--sidebar-text-muted)] hover:bg-[var(--sidebar-surface)] hover:text-[var(--sidebar-text)]"
            }`}
          >
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                active
                  ? "bg-[var(--color-primary)] text-white"
                  : "bg-transparent text-[var(--sidebar-text-muted)] group-hover:text-[var(--sidebar-text)]"
              }`}
            >
              <Icon size={16} strokeWidth={2} />
            </span>
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
