import { apiClient } from "./api-client";

export interface SnapshotSummary {
  id: string;
  summary: string;
  isOverridden: boolean;
  fetchedAt: string;
  trip: { id: string; title: string; destination: string };
  category: { id: string; name: string };
}

export interface ContentOverride {
  id: string;
  snapshotId: string;
  adminId: string;
  overrideText: string;
  reason: string | null;
  createdAt: string;
  updatedAt: string;
  snapshot: SnapshotSummary;
}

export interface PaginatedOverrides {
  data: ContentOverride[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface ListOverridesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export const contentOverridesApi = {
  async list(params: ListOverridesParams) {
    const { data } = await apiClient.get<PaginatedOverrides>("/content-overrides", { params });
    return data;
  },
  async listAvailableSnapshots(search?: string) {
    const { data } = await apiClient.get<SnapshotSummary[]>("/content-overrides/snapshots", {
      params: { search, onlyNonOverridden: true },
    });
    return data;
  },
  async create(input: { snapshotId: string; overrideText: string; reason?: string }) {
    const { data } = await apiClient.post<ContentOverride>("/content-overrides", input);
    return data;
  },
  async update(id: string, input: { overrideText?: string; reason?: string | null }) {
    const { data } = await apiClient.patch<ContentOverride>(`/content-overrides/${id}`, input);
    return data;
  },
  async remove(id: string) {
    const { data } = await apiClient.delete<{ message: string }>(`/content-overrides/${id}`);
    return data;
  },
};
