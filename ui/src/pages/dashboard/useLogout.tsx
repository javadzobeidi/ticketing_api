import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { apiServices } from '../../apis';

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {

      await apiServices.user.logout(); // send cookie
    },
    onSuccess: () => {
      // ✅ Clear React Query cache
      queryClient.clear();

      // ✅ Optionally redirect user to login page
      window.location.href = '/login';
    },
    onError: (error) => {
      console.error('Logout failed:', error);
    },
  });
}