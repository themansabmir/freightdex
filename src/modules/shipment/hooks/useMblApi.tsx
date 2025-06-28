import { MblHttpService } from '@api/endpoints/mbl.endpoint';
import { queryClient, useMutation, useQuery } from '@lib/react-query';
import { toast } from 'react-toastify';

export const useMblApi = () => {

    const MBL_KEY='mbl';

    const saveMblMutation = useMutation({
        mutationFn: (payload: unknown) => MblHttpService.saveMBL(payload),
        onError: ({ message }) => toast.error(message),
        onSettled: (data) => {
            if (data) {
                queryClient.invalidateQueries({ queryKey: [MBL_KEY] });
                toast.success(`MBL updated successfully`);
            }
        },
    })

    const  useGetMblByShipmentId = (id: string) =>
        useQuery({
            queryKey: [MBL_KEY, id],
            queryFn: () => MblHttpService.getMblByFolderId(id),
        });


    return {
        saveMbl: saveMblMutation.mutateAsync,
        useGetMblByShipmentId,
        isSaving: saveMblMutation.isPending
    }
}