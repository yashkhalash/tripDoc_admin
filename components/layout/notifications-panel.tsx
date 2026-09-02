"use client";

import { useState } from "react";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, MessageSquareWarning, Mail, RefreshCw, Gift, X, CheckCheck } from "lucide-react";
import { notificationsApi, AdminNotificationType } from "@/lib/notifications-api";

const TYPE_ICON: Record<AdminNotificationType, typeof MessageSquareWarning> = {
  feedback: MessageSquareWarning,
  enquiry: Mail,
  refresh_job: RefreshCw,
  influencer_upgrade: Gift,
};

function formatRelative(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationsPanel() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["admin-notifications"],
    queryFn: notificationsApi.feed,
    refetchInterval: 60_000,
  });

  const markAllReadMutation = useMutation({
    mutationFn: notificationsApi.markAllRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-notifications"] });
    },
  });

  const unreadCount = data?.unreadCount ?? 0;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Notifications"
        className="relative rounded-md p-2 text-[var(--color-text-muted)] hover:bg-[var(--color-bg)]"
      >
        <Bell size={18} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[var(--color-danger)] px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      <div className={`fixed inset-0 z-40 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div
          onClick={() => setOpen(false)}
          className={`absolute inset-0 bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        />
        <div
          className={`absolute right-0 top-0 flex h-full w-96 max-w-[90vw] flex-col bg-[var(--color-surface)] shadow-xl transition-transform ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-[var(--color-border)] px-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[var(--color-text)]">Notifications</span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-[var(--color-danger)] px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close notifications"
              className="rounded-md p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-bg)]"
            >
              <X size={18} />
            </button>
          </div>

          <div className="flex shrink-0 items-center justify-between border-b border-[var(--color-border)] px-4 py-2">
            <span className="text-xs text-[var(--color-text-muted)]">
              {data ? `${data.items.length} recent` : "Loading…"}
            </span>
            <button
              onClick={() => markAllReadMutation.mutate()}
              disabled={unreadCount === 0 || markAllReadMutation.isPending}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-[var(--color-primary)] hover:bg-[var(--color-bg)] disabled:cursor-not-allowed disabled:text-[var(--color-text-muted)] disabled:hover:bg-transparent"
            >
              <CheckCheck size={14} />
              Mark all as read
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {!data && (
              <p className="px-4 py-6 text-center text-sm text-[var(--color-text-muted)]">Loading…</p>
            )}
            {data && data.items.length === 0 && (
              <p className="px-4 py-6 text-center text-sm text-[var(--color-text-muted)]">You&apos;re all caught up.</p>
            )}
            {data?.items.map((item) => {
              const Icon = TYPE_ICON[item.type];
              return (
                <Link
                  key={item.id}
                  href={item.link}
                  onClick={() => setOpen(false)}
                  className={`flex items-start gap-3 border-b border-[var(--color-border)] px-4 py-3 last:border-b-0 hover:bg-[var(--color-bg)] ${
                    item.isRead === false ? "bg-[color-mix(in_srgb,var(--color-primary)_6%,transparent)]" : ""
                  }`}
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-primary)_12%,transparent)] text-[var(--color-primary)]">
                    <Icon size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[var(--color-text)]">{item.title}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{item.message}</p>
                    <p className="mt-1 text-xs text-[var(--color-text-muted)]">{formatRelative(item.createdAt)}</p>
                  </div>
                  {item.isRead === false && (
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--color-primary)]" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
