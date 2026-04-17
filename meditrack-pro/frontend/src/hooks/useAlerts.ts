import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertsApi } from '../api/alerts.api';

export function useAlerts() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['alerts'],
    queryFn: alertsApi.getAll,
    select: (data) => data.data,
    refetchInterval: 30000, // Refresh every 30s
  });

  const markReadMutation = useMutation({
    mutationFn: alertsApi.markAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alerts'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: alertsApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alerts'] }),
  });

  const clearAllMutation = useMutation({
    mutationFn: alertsApi.clearAll,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['alerts'] }),
  });

  const unreadCount = query.data?.filter((a) => !a.isRead).length ?? 0;

  return { ...query, unreadCount, markReadMutation, deleteMutation, clearAllMutation };
}
