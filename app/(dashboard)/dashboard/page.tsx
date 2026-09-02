"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/dashboard-api";
import { StatCard } from "@/components/ui/stat-card";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: dashboardApi.summary,
  });

  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ["dashboard-recent-activity"],
    queryFn: () => dashboardApi.recentActivity(5),
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-xl font-semibold text-[var(--color-text)]">Dashboard</h1>
        <p className="text-sm text-[var(--color-text-muted)]">
          Overview of TripDoc platform activity.
        </p>
      </div>

      {summaryLoading || !summary ? (
        <div className="text-sm text-[var(--color-text-muted)]">Loading metrics…</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Users" value={summary.users.total} hint={`${summary.users.active} active`} />
          <StatCard label="Suspended Users" value={summary.users.suspended} />
          <StatCard label="Total Trips" value={summary.trips.total} hint={`${summary.trips.upcoming} upcoming`} />
          <StatCard label="Open Feedback" value={summary.feedback.open} />
          <StatCard
            label="Referrals"
            value={summary.referrals.total}
            hint={`${summary.referrals.converted} converted`}
          />
          <StatCard label="New Enquiries" value={summary.enquiries.new} />
          <StatCard
            label="Refresh Jobs"
            value={summary.refreshJobs.active}
            hint={`${summary.refreshJobs.failed} failed`}
          />
          <StatCard label="Published CMS Pages" value={summary.cms.published} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ActivityCard
          title="Recent Feedback"
          loading={activityLoading}
          items={activity?.recentFeedback.map((f) => ({
            id: f.id,
            primary: f.subject,
            secondary: f.status,
            date: f.createdAt,
          }))}
        />
        <ActivityCard
          title="Recent Enquiries"
          loading={activityLoading}
          items={activity?.recentEnquiries.map((e) => ({
            id: e.id,
            primary: e.subject,
            secondary: `${e.name} · ${e.status}`,
            date: e.createdAt,
          }))}
        />
        <ActivityCard
          title="Recent Users"
          loading={activityLoading}
          items={activity?.recentUsers.map((u) => ({
            id: u.id,
            primary: u.name,
            secondary: u.email,
            date: u.createdAt,
          }))}
        />
        <ActivityCard
          title="Recent Referrals"
          loading={activityLoading}
          items={activity?.recentReferrals.map((r) => ({
            id: r.id,
            primary: r.code,
            secondary: r.status,
            date: r.createdAt,
          }))}
        />
      </div>
    </div>
  );
}

function ActivityCard({
  title,
  loading,
  items,
}: {
  title: string;
  loading: boolean;
  items?: { id: string; primary: string; secondary: string; date: string }[];
}) {
  return (
    <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
      <h2 className="text-sm font-semibold text-[var(--color-text)]">{title}</h2>
      <div className="mt-3 flex flex-col divide-y divide-[var(--color-border)]">
        {loading && <p className="py-2 text-sm text-[var(--color-text-muted)]">Loading…</p>}
        {!loading && (!items || items.length === 0) && (
          <p className="py-2 text-sm text-[var(--color-text-muted)]">Nothing to show yet.</p>
        )}
        {items?.map((item) => (
          <div key={item.id} className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm text-[var(--color-text)]">{item.primary}</p>
              <p className="text-xs text-[var(--color-text-muted)]">{item.secondary}</p>
            </div>
            <span className="text-xs text-[var(--color-text-muted)]">{formatDate(item.date)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
