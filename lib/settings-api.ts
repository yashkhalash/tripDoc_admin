import { apiClient } from "./api-client";

export interface ApiVersionConfig {
  version: string;
  updatedBy: string | null;
  updatedAt: string | null;
}

export const settingsApi = {
  async getApiVersion() {
    const { data } = await apiClient.get<ApiVersionConfig>("/settings/api-version");
    return data;
  },
  async updateApiVersion(version: string) {
    const { data } = await apiClient.put<ApiVersionConfig>("/settings/api-version", { version });
    return data;
  },
};
