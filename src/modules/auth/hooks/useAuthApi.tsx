import { AuthHttpService } from '@api/endpoints/auth.endpoints';

import { useMutation } from '@tanstack/react-query';
import { LoginPayload } from '../index.types';
import { toast } from 'react-toastify';
import { useAuth } from './useAuth';

export function useAuthApi() {
  const { addUserToStorage } = useAuth();
  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) => AuthHttpService.login(payload),
    onSuccess(data) {
      console.log("Data API" , data)
      addUserToStorage(data.response);
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });

  return {
    login: loginMutation.mutate,

    loginAsync: loginMutation.mutateAsync,
    isLoading: loginMutation.isPending,
    isError: loginMutation.isError,
    isSuccess: loginMutation.isSuccess,
    error: loginMutation.error,
    data: loginMutation.data?.response,
  };
}
