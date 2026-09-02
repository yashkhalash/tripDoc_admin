import { apiClient } from "./api-client";

export type EnquiryStatus = "NEW" | "IN_PROGRESS" | "CLOSED";

export interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Paginated<T> {
  data: T[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export const enquiriesApi = {
  async list(params: { page?: number; limit?: number; search?: string; status?: EnquiryStatus }) {
    const { data } = await apiClient.get<Paginated<ContactEnquiry>>("/enquiries", { params });
    return data;
  },
  async update(id: string, status: EnquiryStatus) {
    const { data } = await apiClient.patch<ContactEnquiry>(`/enquiries/${id}`, { status });
    return data;
  },
  async remove(id: string) {
    const { data } = await apiClient.delete<{ message: string }>(`/enquiries/${id}`);
    return data;
  },
};
