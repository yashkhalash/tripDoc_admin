"use client";

import { X } from "lucide-react";
import { SidebarNav } from "./sidebar-nav";
import { LogoutButton } from "./logout-button";
import { SidebarProfile } from "./sidebar-profile";
import { Logo } from "./logo";

export function MobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <div
      className={`fixed inset-0 z-40 md:hidden ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`absolute left-0 top-0 flex h-full w-72 max-w-[80%] flex-col bg-[var(--sidebar-bg)] shadow-xl transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--sidebar-border)] px-4">
          <Logo variant="sidebar" />
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-md p-1 text-[var(--sidebar-text-muted)] hover:bg-[var(--sidebar-surface)]"
          >
            <X size={18} />
          </button>
        </div>
        <div className="no-scrollbar flex-1 overflow-y-auto py-4">
          <SidebarNav onNavigate={onClose} />
        </div>
        <div className="shrink-0 border-t border-[var(--sidebar-border)] p-3">
          <SidebarProfile />
          <div className="mt-2">
            <LogoutButton onNavigate={onClose} dark />
          </div>
        </div>
      </div>
    </div>
  );
}
