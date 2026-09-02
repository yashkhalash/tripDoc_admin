"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Menu, Settings, ChevronDown, UserCircle } from "lucide-react";
import { authApi } from "@/lib/auth-api";
import { tokenStore } from "@/lib/api-client";
import { useToast } from "@/components/ui/toast";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { NotificationsPanel } from "./notifications-panel";
import { GlobalSearch } from "./global-search";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();
  const { showToast } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);

  const { data: admin } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: authApi.me,
  });

  async function handleLogoutConfirm() {
    setLogoutLoading(true);
    const refreshToken = tokenStore.getRefreshToken();
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } catch {
      // ignore — clear local session regardless
    } finally {
      tokenStore.clear();
      setLogoutLoading(false);
      setLogoutOpen(false);
      showToast("Logged out", "success");
      router.push("/login");
    }
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-[var(--color-border)] bg-[var(--color-surface)]/90 px-4 shadow-sm backdrop-blur-sm md:px-6">
      <div className="flex flex-1 items-center gap-3">
        <button
          onClick={onMenuClick}
          aria-label="Open menu"
          className="rounded-md p-2 text-[var(--color-text)] hover:bg-[var(--color-bg)] md:hidden"
        >
          <Menu size={20} />
        </button>
        <GlobalSearch />
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <Link
          href="/settings/general"
          aria-label="Settings"
          className="rounded-md p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-bg)]"
        >
          <Settings size={18} />
        </Link>
        <NotificationsPanel />

        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-2 rounded-md py-1 pl-2 pr-1 hover:bg-[var(--color-bg)]"
          >
            {admin?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={admin.avatarUrl} alt={admin.name} className="h-8 w-8 rounded-full object-cover" />
            ) : (
              <UserCircle size={28} className="text-[var(--color-text-muted)]" />
            )}
            <span className="hidden text-sm font-medium text-[var(--color-text)] sm:block">
              {admin?.name ?? "Admin"}
            </span>
            <ChevronDown size={16} className="hidden text-[var(--color-text-muted)] sm:block" />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] shadow-lg">
                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-bg)]"
                >
                  My Profile
                </Link>
                <Link
                  href="/settings/general"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-sm text-[var(--color-text)] hover:bg-[var(--color-bg)]"
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setLogoutOpen(true);
                  }}
                  className="block w-full px-4 py-2 text-left text-sm text-[var(--color-danger)] hover:bg-[var(--color-bg)]"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <ConfirmModal
        open={logoutOpen}
        title="Log out"
        description="Are you sure you want to log out of the TripDoc admin console?"
        confirmLabel="Logout"
        variant="danger"
        loading={logoutLoading}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setLogoutOpen(false)}
      />
    </header>
  );
}
