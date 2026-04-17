import api from './axios';
import type { ServiceRequest, ApiResponse } from '../types';

export const serviceRequestApi = {
  getAll: async (filters: { priority?: string; status?: string } = {}): Promise<ApiResponse<ServiceRequest[]>> => {
    const params = new URLSearchParams();
    if (filters.priority) params.append('priority', filters.priority);
    if (filters.status) params.append('status', filters.status);
    const { data } = await api.get<ApiResponse<ServiceRequest[]>>(`/service-requests?${params}`);
    return data;
  },

  create: async (payload: Partial<ServiceRequest>): Promise<ApiResponse<ServiceRequest>> => {
    const { data } = await api.post<ApiResponse<ServiceRequest>>('/service-requests', payload);
    return data;
  },

  update: async (id: string, payload: Partial<ServiceRequest>): Promise<ApiResponse<ServiceRequest>> => {
    const { data } = await api.put<ApiResponse<ServiceRequest>>(`/service-requests/${id}`, payload);
    return data;
  },

  updateStatus: async (id: string, status: string): Promise<ApiResponse<ServiceRequest>> => {
    const { data } = await api.patch<ApiResponse<ServiceRequest>>(`/service-requests/${id}/status`, { status });
    return data;
  },
};
