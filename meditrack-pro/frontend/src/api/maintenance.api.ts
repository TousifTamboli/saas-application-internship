import api from './axios';
import type { MaintenanceLog, ApiResponse } from '../types';

export const maintenanceApi = {
  getAll: async (filters: { status?: string; equipment?: string } = {}): Promise<ApiResponse<MaintenanceLog[]>> => {
    const params = new URLSearchParams();
    if (filters.status) params.append('status', filters.status);
    if (filters.equipment) params.append('equipment', filters.equipment);
    const { data } = await api.get<ApiResponse<MaintenanceLog[]>>(`/maintenance?${params}`);
    return data;
  },

  getById: async (id: string): Promise<ApiResponse<MaintenanceLog>> => {
    const { data } = await api.get<ApiResponse<MaintenanceLog>>(`/maintenance/${id}`);
    return data;
  },

  create: async (payload: Partial<MaintenanceLog>): Promise<ApiResponse<MaintenanceLog>> => {
    const { data } = await api.post<ApiResponse<MaintenanceLog>>('/maintenance', payload);
    return data;
  },

  update: async (id: string, payload: Partial<MaintenanceLog>): Promise<ApiResponse<MaintenanceLog>> => {
    const { data } = await api.put<ApiResponse<MaintenanceLog>>(`/maintenance/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await api.delete<ApiResponse<null>>(`/maintenance/${id}`);
    return data;
  },
};
