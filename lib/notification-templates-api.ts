import { apiClient } from "./api-client";

export type NotificationChannel = "PUSH" | "EMAIL" | "SMS";

export interface NotificationTemplate {
  id: string;
  name: string;
  channel: NotificationChannel;
  subject: string | null;
  body: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Paginated<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface TemplateFormInput {
  name: string;
  channel: NotificationChannel;
  subject: string;
  body: string;
  isActive: boolean;
}

export const notificationTemplatesApi = {
  async list(params: {
    page?: number;
    limit?: number;
    search?: string;
    channel?: NotificationChannel;
    isActive?: boolean;
  }) {
    const { data } = await apiClient.get<Paginated<NotificationTemplate>>("/notification-templates", {
      params,
    });
    return data;
  },
  async create(input: TemplateFormInput) {
    const { data } = await apiClient.post<NotificationTemplate>("/notification-templates", {
      ...input,
      subject: input.subject || undefined,
    });
    return data;
  },
  async update(id: string, input: Partial<TemplateFormInput>) {
    const { data } = await apiClient.patch<NotificationTemplate>(`/notification-templates/${id}`, input);
    return data;
  },
  async remove(id: string) {
    const { data } = await apiClient.delete<{ message: string }>(`/notification-templates/${id}`);
    return data;
  },
};
