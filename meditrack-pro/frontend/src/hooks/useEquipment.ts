import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { equipmentApi } from '../api/equipment.api';
import type { EquipmentFilters } from '../types';

export function useEquipment(initialFilters: EquipmentFilters = {}) {
  const [filters, setFilters] = useState<EquipmentFilters>({ page: 1, limit: 10, ...initialFilters });
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['equipment', filters],
    queryFn: () => equipmentApi.getAll(filters),
  });

  const createMutation = useMutation({
    mutationFn: equipmentApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['equipment'] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof equipmentApi.update>[1] }) =>
      equipmentApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['equipment'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: equipmentApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['equipment'] }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => equipmentApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['equipment'] }),
  });

  return {
    ...query,
    filters,
    setFilters,
    createMutation,
    updateMutation,
    deleteMutation,
    updateStatusMutation,
  };
}
