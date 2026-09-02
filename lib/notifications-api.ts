import { apiClient } from "./api-client";

export type AdminNotificationType = "feedback" | "enquiry" | "refresh_job" | "influencer_upgrade";

export interface AdminNotificationItem {
  id: string;
  type: AdminNotificationType;
  title: string;
  message: string;
  createdAt: string;
  link: string;
  isRead: boolean;
}

export interface AdminNotificationFeed {
  items: AdminNotificationItem[];
  unreadCount: number;
}

export const notificationsApi = {
  async feed() {
    const { data } = await apiClient.get<AdminNotificationFeed>("/notifications/feed");
    return data;
  },
  async markAllRead() {
    const { data } = await apiClient.post<{ success: boolean }>("/notifications/mark-all-read");
    return data;
  },
};
