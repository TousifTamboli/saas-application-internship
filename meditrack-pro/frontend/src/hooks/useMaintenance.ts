import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { maintenanceApi } from '../api/maintenance.api';

export function useMaintenance(filters: { status?: string; equipment?: string } = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['maintenance', filters],
    queryFn: () => maintenanceApi.getAll(filters),
    select: (data) => data.data,
  });

  const createMutation = useMutation({
    mutationFn: maintenanceApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['maintenance'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof maintenanceApi.update>[1] }) =>
      maintenanceApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['maintenance'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: maintenanceApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['maintenance'] }),
  });

  return { ...query, createMutation, updateMutation, deleteMutation };
}
