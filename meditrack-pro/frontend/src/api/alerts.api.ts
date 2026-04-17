import api from './axios';
import type { Alert, ApiResponse } from '../types';

export const alertsApi = {
  getAll: async (): Promise<ApiResponse<Alert[]>> => {
    const { data } = await api.get<ApiResponse<Alert[]>>('/alerts');
    return data;
  },

  create: async (payload: Partial<Alert>): Promise<ApiResponse<Alert>> => {
    const { data } = await api.post<ApiResponse<Alert>>('/alerts', payload);
    return data;
  },

  markAsRead: async (id: string): Promise<ApiResponse<Alert>> => {
    const { data } = await api.patch<ApiResponse<Alert>>(`/alerts/${id}/read`);
    return data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await api.delete<ApiResponse<null>>(`/alerts/${id}`);
    return data;
  },

  clearAll: async (): Promise<ApiResponse<null>> => {
    const { data } = await api.delete<ApiResponse<null>>('/alerts/clear-all');
    return data;
  },
};
