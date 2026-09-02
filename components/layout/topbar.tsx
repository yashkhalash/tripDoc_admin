"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/auth-api";
import { tokenStore } from "@/lib/api-client";
import { useToast } from "@/components/ui/toast";
import { Button } from "@/components/ui/button";

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();
  const { showToast } = useToast();

  const { data: admin } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: authApi.me,
  });

  async function handleLogout() {
    const refreshToken = tokenStore.getRefreshToken();
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } catch {
      // ignore — clear local session regardless
    } finally {
      tokenStore.clear();
      showToast("Logged out", "success");
      router.push("/login");
    }
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 md:px-6">
      <button
        onClick={onMenuClick}
        aria-label="Open menu"
        className="rounded-md p-2 text-[var(--color-text)] hover:bg-[var(--color-bg)] md:hidden"
      >
        ☰
      </button>
      <div className="hidden md:block" />
      <div className="flex items-center gap-3">
        {admin && (
          <span className="text-sm text-[var(--color-text-muted)]">
            {admin.name}
          </span>
        )}
        <Button variant="secondary" onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </header>
  );
}
