"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { authApi } from "@/lib/auth-api";
import { tokenStore } from "@/lib/api-client";
import { useToast } from "@/components/ui/toast";
import { ConfirmModal } from "@/components/ui/confirm-modal";

export function LogoutButton({
  onNavigate,
  dark = false,
  collapsed = false,
}: {
  onNavigate?: () => void;
  dark?: boolean;
  collapsed?: boolean;
}) {
  const router = useRouter();
  const { showToast } = useToast();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleConfirm() {
    setLoading(true);
    const refreshToken = tokenStore.getRefreshToken();
    try {
      if (refreshToken) await authApi.logout(refreshToken);
    } catch {
      // ignore — clear local session regardless
    } finally {
      tokenStore.clear();
      setLoading(false);
      setOpen(false);
      onNavigate?.();
      showToast("Logged out", "success");
      router.push("/login");
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title={collapsed ? "Logout" : undefined}
        className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-[var(--color-danger)] transition-colors hover:bg-[color-mix(in_srgb,var(--color-danger)_14%,transparent)] ${
          dark ? "hover:bg-[color-mix(in_srgb,var(--color-danger)_20%,transparent)]" : ""
        } ${collapsed ? "justify-center px-0" : ""}`}
      >
        <LogOut size={18} strokeWidth={2} />
        {!collapsed && "Logout"}
      </button>
      <ConfirmModal
        open={open}
        title="Log out"
        description="Are you sure you want to log out of the TripDoc admin console?"
        confirmLabel="Logout"
        variant="danger"
        loading={loading}
        onConfirm={handleConfirm}
        onCancel={() => setOpen(false)}
      />
    </>
  );
}
