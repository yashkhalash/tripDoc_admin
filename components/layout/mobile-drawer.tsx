"use client";

import { SidebarNav } from "./sidebar-nav";

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
        className={`absolute left-0 top-0 h-full w-72 max-w-[80%] bg-[var(--color-surface)] shadow-xl transition-transform ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-[var(--color-border)] px-6">
          <span className="text-lg font-bold text-[var(--color-primary)]">TripDoc Admin</span>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="rounded-md p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-bg)]"
          >
            ✕
          </button>
        </div>
        <div className="overflow-y-auto py-4">
          <SidebarNav onNavigate={onClose} />
        </div>
      </div>
    </div>
  );
}
