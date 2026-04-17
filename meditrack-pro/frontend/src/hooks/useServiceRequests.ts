import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { serviceRequestApi } from '../api/serviceRequest.api';

export function useServiceRequests(filters: { priority?: string; status?: string } = {}) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['service-requests', filters],
    queryFn: () => serviceRequestApi.getAll(filters),
    select: (data) => data.data,
  });

  const createMutation = useMutation({
    mutationFn: serviceRequestApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['service-requests'] }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      serviceRequestApi.updateStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['service-requests'] }),
  });

  return { ...query, createMutation, updateStatusMutation };
}
