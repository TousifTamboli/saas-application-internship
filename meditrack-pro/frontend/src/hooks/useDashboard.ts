import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { dashboardApi } from '../api/dashboard.api';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: () => dashboardApi.getStats(),
    select: (data) => data.data,
  });
}

export function useUtilization() {
  const [range, setRange] = useState<'3m' | '30d' | '7d'>('3m');
  
  const query = useQuery({
    queryKey: ['dashboard-utilization', range],
    queryFn: () => dashboardApi.getUtilization(range),
    select: (data) => data.data,
  });

  return { ...query, range, setRange };
}

export function useMachinesByDepartment() {
  return useQuery({
    queryKey: ['dashboard-departments'],
    queryFn: () => dashboardApi.getMachinesByDepartment(),
    select: (data) => data.data,
  });
}

export function useEnhancedStats() {
  return useQuery({
    queryKey: ['dashboard-enhanced'],
    queryFn: () => dashboardApi.getEnhancedStats(),
    select: (data) => data.data,
  });
}
