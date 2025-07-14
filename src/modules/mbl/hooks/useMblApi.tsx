import { MblHttpService } from '@api/endpoints/mbl.endpoint';
import { queryClient, useMutation, useQuery } from '@lib/react-query';
import { toast } from 'react-toastify';
import { IMbl } from '../index.types';

const MBL_KEY = 'mbl';

export const useSaveMbl = () => {
  const saveMblMutation = useMutation({
    mutationFn: (payload: unknown) => MblHttpService.saveMBL(payload),
    onError: ({ message }) => toast.error(message),
    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: [MBL_KEY] });
        toast.success(`MBL updated successfully`);
      }
    },
  });

  return {
    saveMbl: saveMblMutation.mutateAsync,
    isSaving: saveMblMutation.isPending,
  };
};

export const useGetMblByShipmentId = (id: string) =>
  useQuery({
    queryKey: [MBL_KEY, id],
    queryFn: ():Promise<IMbl> => MblHttpService.getMblByFolderId(id),
  });
