import { apiClient } from "./api-client";

export interface AdminProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  avatarUrl: string | null;
  lastLoginAt: string | null;
}

export const authApi = {
  async login(email: string, password: string) {
    const { data } = await apiClient.post<{ adminId: string; otpRequired: boolean; message: string }>(
      "/auth/login",
      { email, password }
    );
    return data;
  },

  async verifyOtp(adminId: string, otp: string) {
    const { data } = await apiClient.post<{
      accessToken: string;
      refreshToken: string;
      admin: AdminProfile;
    }>("/auth/verify-otp", { adminId, otp });
    return data;
  },

  async forgotPassword(email: string) {
    const { data } = await apiClient.post<{ message: string }>("/auth/forgot-password", { email });
    return data;
  },

  async resetPassword(token: string, newPassword: string) {
    const { data } = await apiClient.post<{ message: string }>("/auth/reset-password", {
      token,
      newPassword,
    });
    return data;
  },

  async me() {
    const { data } = await apiClient.get<AdminProfile>("/auth/me");
    return data;
  },

  async logout(refreshToken: string) {
    const { data } = await apiClient.post<{ message: string }>("/auth/logout", { refreshToken });
    return data;
  },
};
