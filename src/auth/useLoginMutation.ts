import { useMutation } from '@tanstack/react-query';

import { loginRequest, type LoginBody } from '@/api';

import { useAuth } from './AuthProvider';

export function useLoginMutation() {
  const { setSession } = useAuth();

  return useMutation({
    mutationFn: (body: LoginBody) => loginRequest(body),
    onSuccess: async (result) => {
      await setSession({
        user: result.data.user,
        accessToken: result.data.accessToken,
        refreshToken: result.data.refreshToken,
      });
    },
  });
}
