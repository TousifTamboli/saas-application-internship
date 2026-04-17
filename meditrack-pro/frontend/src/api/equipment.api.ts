import api from './axios';
import type { Equipment, EquipmentFilters, ApiResponse, PaginatedResponse } from '../types';

export const equipmentApi = {
  getAll: async (filters: EquipmentFilters = {}): Promise<PaginatedResponse<Equipment>> => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.department) params.append('department', filters.department);
    if (filters.type) params.append('type', filters.type);
    if (filters.search) params.append('search', filters.search);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.limit) params.append('limit', filters.limit.toString());
    const { data } = await api.get<PaginatedResponse<Equipment>>(`/equipment?${params}`);
    return data;
  },

  getById: async (id: string): Promise<ApiResponse<Equipment>> => {
    const { data } = await api.get<ApiResponse<Equipment>>(`/equipment/${id}`);
    return data;
  },

  create: async (payload: Partial<Equipment>): Promise<ApiResponse<Equipment>> => {
    const { data } = await api.post<ApiResponse<Equipment>>('/equipment', payload);
    return data;
  },

  update: async (id: string, payload: Partial<Equipment>): Promise<ApiResponse<Equipment>> => {
    const { data } = await api.put<ApiResponse<Equipment>>(`/equipment/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await api.delete<ApiResponse<null>>(`/equipment/${id}`);
    return data;
  },

  updateStatus: async (id: string, status: string): Promise<ApiResponse<Equipment>> => {
    const { data } = await api.patch<ApiResponse<Equipment>>(`/equipment/${id}/status`, { status });
    return data;
  },
};
