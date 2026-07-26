import { useQuery } from '@tanstack/react-query';
import { apiServices } from '@/src/apis'; // adjust the import path to your structure

export const useUserProfile = (id: number | null) => {
  return useQuery({
    queryKey: ['userProfile', id],
    queryFn: () => apiServices.user.get(id!),
    enabled: !!id,
  });
};