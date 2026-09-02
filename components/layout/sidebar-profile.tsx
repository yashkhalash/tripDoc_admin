"use client";

import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/auth-api";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function SidebarProfile({ collapsed = false }: { collapsed?: boolean }) {
  const { data: admin } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: authApi.me,
  });

  const name = admin?.name ?? "Admin";
  const email = admin?.email ?? "";

  return (
    <div
      className={`flex items-center gap-3 rounded-xl bg-[var(--sidebar-surface)] p-3 ${
        collapsed ? "justify-center" : ""
      }`}
    >
      {admin?.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={admin.avatarUrl} alt={name} className="h-9 w-9 shrink-0 rounded-full object-cover" />
      ) : (
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-semibold text-white">
          {initials(name)}
        </span>
      )}
      {!collapsed && (
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-[var(--sidebar-text)]">{name}</p>
          <p className="truncate text-xs text-[var(--sidebar-text-muted)]">{email}</p>
        </div>
      )}
    </div>
  );
}
