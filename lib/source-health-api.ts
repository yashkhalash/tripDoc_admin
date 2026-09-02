import { apiClient } from "./api-client";

export type SourceHealthStatus = "HEALTHY" | "DEGRADED" | "DOWN";

export interface SourceHealth {
  id: string;
  sourceName: string;
  category: string;
  status: SourceHealthStatus;
  lastCheckedAt: string;
  responseTimeMs: number | null;
  message: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedSourceHealth {
  data: SourceHealth[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface ListSourceHealthParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: SourceHealthStatus;
  category?: string;
}

export interface SourceHealthFormInput {
  sourceName: string;
  category: string;
  status: SourceHealthStatus;
  responseTimeMs: number | null;
  message: string | null;
}

export const sourceHealthApi = {
  async list(params: ListSourceHealthParams) {
    const { data } = await apiClient.get<PaginatedSourceHealth>("/source-health", { params });
    return data;
  },
  async create(input: SourceHealthFormInput) {
    const { data } = await apiClient.post<SourceHealth>("/source-health", input);
    return data;
  },
  async update(id: string, input: Partial<SourceHealthFormInput>) {
    const { data } = await apiClient.patch<SourceHealth>(`/source-health/${id}`, input);
    return data;
  },
  async remove(id: string) {
    const { data } = await apiClient.delete<{ message: string }>(`/source-health/${id}`);
    return data;
  },
};
