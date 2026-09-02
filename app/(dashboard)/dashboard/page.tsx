"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Map,
  MessageSquareWarning,
  Gift,
  Mail,
  RefreshCw,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { dashboardApi } from "@/lib/dashboard-api";
import { analyticsApi } from "@/lib/analytics-api";
import { StatCard } from "@/components/ui/stat-card";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const PIE_COLORS = ["#0b5394", "#f2994a", "#22c55e", "#ef4444", "#a855f7"];

export default function DashboardPage() {
  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: dashboardApi.summary,
  });

  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ["dashboard-recent-activity"],
    queryFn: () => dashboardApi.recentActivity(5),
  });

  const { data: analytics } = useQuery({
    queryKey: ["dashboard-analytics"],
    queryFn: () => analyticsApi.summary({}),
  });

  const trendData = summary
    ? [
        { label: "Active", users: summary.users.active },
        { label: "Suspended", users: summary.users.suspended },
        { label: "Total", users: summary.users.total },
      ]
    : [];

  const enquiryPieData = analytics?.enquiriesByStatus.map((e) => ({ name: e.status, value: e.count })) ?? [];
  const destinationBarData = analytics?.topDestinations.map((d) => ({ name: d.destination, trips: d.count })) ?? [];

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
          <StatCard href="/users" icon={Users} label="Total Users" value={summary.users.total} hint={`${summary.users.active} active`} />
          <StatCard icon={Map} label="Total Trips" value={summary.trips.total} hint={`${summary.trips.upcoming} upcoming`} />
          <StatCard href="/reports" icon={MessageSquareWarning} label="Open Feedback" value={summary.feedback.open} />
          <StatCard href="/referrals" icon={Gift} label="Referrals" value={summary.referrals.total} hint={`${summary.referrals.converted} converted`} />
          <StatCard href="/enquiries" icon={Mail} label="New Enquiries" value={summary.enquiries.new} />
          <StatCard href="/refresh-jobs" icon={RefreshCw} label="Active Refresh Jobs" value={summary.refreshJobs.active} hint={`${summary.refreshJobs.failed} failed`} />
          <StatCard href="/users" icon={Users} label="Suspended Users" value={summary.users.suspended} />
          <StatCard href="/cms" icon={Map} label="Published CMS Pages" value={summary.cms.published} />
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm lg:col-span-2">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">User Base Breakdown</h2>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="usersFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="label" stroke="var(--color-text-muted)" fontSize={12} />
                <YAxis stroke="var(--color-text-muted)" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="users" stroke="var(--color-primary)" fill="url(#usersFill)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
          <h2 className="text-sm font-semibold text-[var(--color-text)]">Enquiries by Status</h2>
          <div className="mt-4 h-64">
            {enquiryPieData.length === 0 ? (
              <p className="text-sm text-[var(--color-text-muted)]">No data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={enquiryPieData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {enquiryPieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend verticalAlign="bottom" height={24} wrapperStyle={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-sm">
        <h2 className="text-sm font-semibold text-[var(--color-text)]">Top Destinations</h2>
        <div className="mt-4 h-64">
          {destinationBarData.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)]">No trip data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={destinationBarData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-text-muted)" fontSize={12} />
                <YAxis stroke="var(--color-text-muted)" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-surface)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="trips" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

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
