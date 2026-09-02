import { apiClient } from "./api-client";

export type RefreshJobStatus = "ACTIVE" | "PAUSED" | "FAILED";

export interface RefreshJob {
  id: string;
  name: string;
  sourceName: string;
  cronSchedule: string;
  status: RefreshJobStatus;
  lastRunAt: string | null;
  nextRunAt: string | null;
  lastRunStatus: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedRefreshJobs {
  data: RefreshJob[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface RefreshJobFormInput {
  name: string;
  sourceName: string;
  cronSchedule: string;
  status: RefreshJobStatus;
}

export const refreshJobsApi = {
  async list(params: { page?: number; limit?: number; search?: string; status?: RefreshJobStatus }) {
    const { data } = await apiClient.get<PaginatedRefreshJobs>("/refresh-jobs", { params });
    return data;
  },
  async create(input: RefreshJobFormInput) {
    const { data } = await apiClient.post<RefreshJob>("/refresh-jobs", input);
    return data;
  },
  async update(id: string, input: Partial<RefreshJobFormInput>) {
    const { data } = await apiClient.patch<RefreshJob>(`/refresh-jobs/${id}`, input);
    return data;
  },
  async remove(id: string) {
    const { data } = await apiClient.delete<{ message: string }>(`/refresh-jobs/${id}`);
    return data;
  },
  async runNow(id: string) {
    const { data } = await apiClient.post<RefreshJob>(`/refresh-jobs/${id}/run`);
    return data;
  },
};
