"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/analytics-api";
import { DatePicker } from "@/components/ui/date-picker";
import { StatCard } from "@/components/ui/stat-card";

export default function AnalyticsPage() {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["analytics-summary", { dateFrom, dateTo }],
    queryFn: () => analyticsApi.summary({ dateFrom: dateFrom || undefined, dateTo: dateTo || undefined }),
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-[var(--color-text)]">Analytics &amp; Revenue Reporting</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Platform growth, referral revenue, and engagement trends.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <DatePicker label="From date" value={dateFrom} onChange={setDateFrom} />
        <DatePicker label="To date" value={dateTo} onChange={setDateTo} />
      </div>

      {isLoading || !data ? (
        <p className="text-sm text-[var(--color-text-muted)]">Loading analytics…</p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="New Users" value={data.newUsers} />
            <StatCard label="New Trips" value={data.newTrips} />
            <StatCard label="Converted Referrals" value={data.referrals.converted} />
            <StatCard label="Referral Rewards Paid" value={`$${data.referrals.totalRewardPaid.toFixed(2)}`} />
            <StatCard label="Active Influencers" value={data.influencerCount} />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <BreakdownCard title="Feedback by Status" rows={data.feedbackByStatus} />
            <BreakdownCard title="Enquiries by Status" rows={data.enquiriesByStatus} />
            <BreakdownCard
              title="Top Destinations"
              rows={data.topDestinations.map((d) => ({ status: d.destination, count: d.count }))}
            />
          </div>
        </>
      )}
    </div>
  );
}

function BreakdownCard({ title, rows }: { title: string; rows: { status: string; count: number }[] }) {
  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-[var(--color-text)]">{title}</h2>
      <div className="mt-3 flex flex-col divide-y divide-[var(--color-border)]">
        {rows.length === 0 && <p className="py-2 text-sm text-[var(--color-text-muted)]">No data yet.</p>}
        {rows.map((row) => (
          <div key={row.status} className="flex items-center justify-between py-2 text-sm">
            <span className="capitalize text-[var(--color-text)]">{row.status.toLowerCase().replace(/_/g, " ")}</span>
            <span className="text-[var(--color-text-muted)]">{row.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
