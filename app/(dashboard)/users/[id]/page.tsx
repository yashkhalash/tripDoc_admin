"use client";

import { use } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/lib/user-api";
import { Badge } from "@/components/ui/badge";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: user, isLoading } = useQuery({
    queryKey: ["user", id],
    queryFn: () => userApi.getById(id),
  });

  return (
    <div className="flex flex-col gap-4">
      <Link href="/users" className="text-sm text-[var(--color-primary)] hover:underline">
        ← Back to users
      </Link>

      {isLoading && <p className="text-sm text-[var(--color-text-muted)]">Loading user…</p>}

      {user && (
        <>
          <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-semibold text-[var(--color-text)]">{user.name}</h1>
                <p className="text-sm text-[var(--color-text-muted)]">{user.email}</p>
                {user.phone && <p className="text-sm text-[var(--color-text-muted)]">{user.phone}</p>}
              </div>
              <Badge status={user.status} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm sm:grid-cols-4">
              <div>
                <p className="text-[var(--color-text-muted)]">Joined</p>
                <p>{formatDate(user.createdAt)}</p>
              </div>
              <div>
                <p className="text-[var(--color-text-muted)]">Trips</p>
                <p>{user.tripCount ?? 0}</p>
              </div>
              <div>
                <p className="text-[var(--color-text-muted)]">Saved Destinations</p>
                <p>{user.savedDestinationCount ?? 0}</p>
              </div>
              <div>
                <p className="text-[var(--color-text-muted)]">Influencer</p>
                <p>{user.isInfluencer ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-[var(--color-text)]">Recent Trips</h2>
              <div className="mt-3 flex flex-col divide-y divide-[var(--color-border)]">
                {user.recentTrips.length === 0 && (
                  <p className="py-2 text-sm text-[var(--color-text-muted)]">No trips yet.</p>
                )}
                {user.recentTrips.map((trip) => (
                  <div key={trip.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm text-[var(--color-text)]">{trip.title}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{trip.destination}</p>
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)]">{formatDate(trip.createdAt)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
              <h2 className="text-sm font-semibold text-[var(--color-text)]">Saved Destinations</h2>
              <div className="mt-3 flex flex-col divide-y divide-[var(--color-border)]">
                {user.recentSavedDestinations.length === 0 && (
                  <p className="py-2 text-sm text-[var(--color-text-muted)]">None saved yet.</p>
                )}
                {user.recentSavedDestinations.map((dest) => (
                  <div key={dest.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm text-[var(--color-text)]">{dest.name}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{dest.country}</p>
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)]">{formatDate(dest.createdAt)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
