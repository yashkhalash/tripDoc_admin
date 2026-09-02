import { apiClient } from "./api-client";

export type FeedbackStatus = "OPEN" | "IN_REVIEW" | "RESOLVED" | "DISMISSED";

export interface FeedbackReport {
  id: string;
  subject: string;
  message: string;
  status: FeedbackStatus;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
  user: { id: string; name: string; email: string };
}

export interface PaginatedFeedback {
  data: FeedbackReport[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export const feedbackApi = {
  async list(params: { page?: number; limit?: number; search?: string; status?: FeedbackStatus }) {
    const { data } = await apiClient.get<PaginatedFeedback>("/feedback-reports", { params });
    return data;
  },
  async update(id: string, input: { status?: FeedbackStatus; adminNotes?: string | null }) {
    const { data } = await apiClient.patch<FeedbackReport>(`/feedback-reports/${id}`, input);
    return data;
  },
  async remove(id: string) {
    const { data } = await apiClient.delete<{ message: string }>(`/feedback-reports/${id}`);
    return data;
  },
};
