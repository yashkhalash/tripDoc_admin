import { apiClient } from "./api-client";
import { AdminProfile } from "./auth-api";

export const profileApi = {
  async get() {
    const { data } = await apiClient.get<AdminProfile>("/profile");
    return data;
  },
  async update(input: { name?: string; avatarUrl?: string | null }) {
    const { data } = await apiClient.patch<AdminProfile>("/profile", input);
    return data;
  },
  async changePassword(currentPassword: string, newPassword: string) {
    const { data } = await apiClient.post<{ message: string }>("/profile/change-password", {
      currentPassword,
      newPassword,
    });
    return data;
  },
};
