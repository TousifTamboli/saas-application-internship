import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi } from '../api/staff.api';

export function useStaff() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['staff'],
    queryFn: staffApi.getAll,
    select: (data) => data.data,
  });

  const createMutation = useMutation({
    mutationFn: staffApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: staffApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff'] }),
  });

  return { ...query, createMutation, deleteMutation };
}
