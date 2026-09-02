import { apiClient } from "./api-client";

export type CmsPageStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface CmsPage {
  id: string;
  title: string;
  slug: string;
  content: string;
  status: CmsPageStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Paginated<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface CmsPageFormInput {
  title: string;
  slug: string;
  content: string;
  status: CmsPageStatus;
}

export const cmsApi = {
  async list(params: { page?: number; limit?: number; search?: string; status?: CmsPageStatus }) {
    const { data } = await apiClient.get<Paginated<CmsPage>>("/cms-pages", { params });
    return data;
  },
  async create(input: CmsPageFormInput) {
    const { data } = await apiClient.post<CmsPage>("/cms-pages", input);
    return data;
  },
  async update(id: string, input: Partial<CmsPageFormInput>) {
    const { data } = await apiClient.patch<CmsPage>(`/cms-pages/${id}`, input);
    return data;
  },
  async remove(id: string) {
    const { data } = await apiClient.delete<{ message: string }>(`/cms-pages/${id}`);
    return data;
  },
};
