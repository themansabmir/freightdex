import { HBLHttpService } from '@api/endpoints/hbl.endpoint';
import { queryClient } from '@lib/react-query';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { IHbl } from '../index.types';

const HBL_KEY = 'hbl';
export const useSaveHbl = () => {
  const saveHblMutation = useMutation({
    mutationFn: (payload: unknown) => HBLHttpService.saveHbl(payload),
    onError: ({ message }) => toast.error(message),
    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: [HBL_KEY] });
        toast.success(`HBL updated successfully`);
      }
    },
  });

  return {
    saveHbl: saveHblMutation.mutateAsync,
    isSaving: saveHblMutation.isPending,
  };
};

export const useGetHblById = (id: string) =>
  useQuery({
    queryKey: [HBL_KEY, id],
    queryFn: ():Promise<IHbl> => HBLHttpService.getHblById(id),
  });

export const useGetHblsByShipmentId = (id: string) => {
  return useQuery({
    queryKey: [HBL_KEY, id],
    queryFn: (): Promise<IHbl[]> => HBLHttpService.getHblsByShipmentId(id),
  });
};
