import { apiClient } from "./api-client";

export interface DashboardSummary {
  users: { total: number; active: number; suspended: number };
  trips: { total: number; upcoming: number };
  feedback: { open: number };
  referrals: { total: number; converted: number };
  enquiries: { new: number };
  refreshJobs: { active: number; failed: number };
  cms: { published: number };
  faqs: { active: number };
}

export interface RecentActivity {
  recentUsers: { id: string; name: string; email: string; createdAt: string }[];
  recentTrips: { id: string; title: string; destination: string; createdAt: string }[];
  recentFeedback: { id: string; subject: string; status: string; createdAt: string }[];
  recentEnquiries: {
    id: string;
    name: string;
    subject: string;
    status: string;
    createdAt: string;
  }[];
  recentReferrals: { id: string; code: string; status: string; createdAt: string }[];
}

export const dashboardApi = {
  async summary() {
    const { data } = await apiClient.get<DashboardSummary>("/dashboard/summary");
    return data;
  },
  async recentActivity(limit = 5) {
    const { data } = await apiClient.get<RecentActivity>("/dashboard/recent-activity", {
      params: { limit },
    });
    return data;
  },
};
