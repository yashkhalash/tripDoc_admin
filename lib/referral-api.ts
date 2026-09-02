import { apiClient } from "./api-client";

export type ReferralStatus = "PENDING" | "CONVERTED" | "EXPIRED";

export interface PersonSummary {
  id: string;
  name: string;
  email: string;
}

export interface Referral {
  id: string;
  code: string;
  status: ReferralStatus;
  rewardAmount: string;
  createdAt: string;
  convertedAt: string | null;
  sender: PersonSummary;
  receiver: PersonSummary | null;
}

export interface InfluencerUpgrade {
  id: string;
  userId: string;
  tier: string;
  approved: boolean;
  approvedAt: string | null;
  createdAt: string;
  user: PersonSummary;
}

export interface Paginated<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export const referralApi = {
  async listReferrals(params: { page?: number; limit?: number; search?: string; status?: ReferralStatus }) {
    const { data } = await apiClient.get<Paginated<Referral>>("/referrals", { params });
    return data;
  },
  async updateReferral(id: string, status: ReferralStatus) {
    const { data } = await apiClient.patch<Referral>(`/referrals/${id}`, { status });
    return data;
  },
  async listInfluencerUpgrades(params: { page?: number; limit?: number; approved?: boolean }) {
    const { data } = await apiClient.get<Paginated<InfluencerUpgrade>>("/referrals/influencer-upgrades/list", {
      params,
    });
    return data;
  },
  async updateInfluencerUpgrade(id: string, approved: boolean) {
    const { data } = await apiClient.patch<InfluencerUpgrade>(`/referrals/influencer-upgrades/${id}`, {
      approved,
    });
    return data;
  },
};
