import { apiClient } from "./api-client";

export type UserStatus = "ACTIVE" | "SUSPENDED" | "DELETED";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  status: UserStatus;
  isInfluencer: boolean;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
  tripCount?: number;
  savedDestinationCount?: number;
}

export interface UserDetail extends AdminUser {
  recentTrips: { id: string; title: string; destination: string; status: string; createdAt: string }[];
  recentSavedDestinations: { id: string; name: string; country: string; createdAt: string }[];
}

export interface PaginatedUsers {
  data: AdminUser[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export interface ListUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: UserStatus;
}

export const userApi = {
  async list(params: ListUsersParams) {
    const { data } = await apiClient.get<PaginatedUsers>("/users", { params });
    return data;
  },
  async getById(id: string) {
    const { data } = await apiClient.get<UserDetail>(`/users/${id}`);
    return data;
  },
  async updateStatus(id: string, status: UserStatus) {
    const { data } = await apiClient.patch<AdminUser>(`/users/${id}/status`, { status });
    return data;
  },
  async remove(id: string) {
    const { data } = await apiClient.delete<{ message: string }>(`/users/${id}`);
    return data;
  },
};
