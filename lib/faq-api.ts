import { apiClient } from "./api-client";

export interface Faq {
  id: string;
  question: string;
  answer: string;
  category: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Paginated<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface FaqFormInput {
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
}

export const faqApi = {
  async list(params: { page?: number; limit?: number; search?: string; category?: string; isActive?: boolean }) {
    const { data } = await apiClient.get<Paginated<Faq>>("/faqs", { params });
    return data;
  },
  async create(input: FaqFormInput) {
    const { data } = await apiClient.post<Faq>("/faqs", { ...input, category: input.category || undefined });
    return data;
  },
  async update(id: string, input: Partial<FaqFormInput>) {
    const { data } = await apiClient.patch<Faq>(`/faqs/${id}`, input);
    return data;
  },
  async remove(id: string) {
    const { data } = await apiClient.delete<{ message: string }>(`/faqs/${id}`);
    return data;
  },
};
