import api from './axios';
import type { ApiResponse, DashboardStats, UtilizationDataPoint, MachinesByDepartmentResponse, EnhancedStats } from '../types';

export const dashboardApi = {
  getStats: async (): Promise<ApiResponse<DashboardStats>> => {
    const { data } = await api.get<ApiResponse<DashboardStats>>('/dashboard/stats');
    return data;
  },

  getUtilization: async (range: '3m' | '30d' | '7d' = '3m'): Promise<ApiResponse<UtilizationDataPoint[]>> => {
    const { data } = await api.get<ApiResponse<UtilizationDataPoint[]>>(`/dashboard/utilization?range=${range}`);
    return data;
  },

  getMachinesByDepartment: async (): Promise<ApiResponse<MachinesByDepartmentResponse>> => {
    const { data } = await api.get<ApiResponse<MachinesByDepartmentResponse>>('/dashboard/machines-by-department');
    return data;
  },

  getEnhancedStats: async (): Promise<ApiResponse<EnhancedStats>> => {
    const { data } = await api.get<ApiResponse<EnhancedStats>>('/dashboard/enhanced-stats');
    return data;
  },
};
