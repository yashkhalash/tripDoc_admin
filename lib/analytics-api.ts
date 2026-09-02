import { apiClient } from "./api-client";

export interface AnalyticsSummary {
  newUsers: number;
  newTrips: number;
  referrals: { converted: number; totalRewardPaid: number };
  influencerCount: number;
  feedbackByStatus: { status: string; count: number }[];
  enquiriesByStatus: { status: string; count: number }[];
  topDestinations: { destination: string; count: number }[];
}

export const analyticsApi = {
  async summary(params: { dateFrom?: string; dateTo?: string }) {
    const { data } = await apiClient.get<AnalyticsSummary>("/analytics/summary", { params });
    return data;
  },
};
