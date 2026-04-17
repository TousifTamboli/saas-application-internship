import api from './axios';
import type { Staff, ApiResponse } from '../types';

export const staffApi = {
  getAll: async (): Promise<ApiResponse<Staff[]>> => {
    const { data } = await api.get<ApiResponse<Staff[]>>('/staff');
    return data;
  },

  create: async (payload: Partial<Staff>): Promise<ApiResponse<Staff>> => {
    const { data } = await api.post<ApiResponse<Staff>>('/staff', payload);
    return data;
  },

  update: async (id: string, payload: Partial<Staff>): Promise<ApiResponse<Staff>> => {
    const { data } = await api.put<ApiResponse<Staff>>(`/staff/${id}`, payload);
    return data;
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    const { data } = await api.delete<ApiResponse<null>>(`/staff/${id}`);
    return data;
  },
};
