import { PortHttpService } from '@api/endpoints/port.endpoints';
import { queryClient, useMutation, useQuery } from '@lib/react-query';
import { toast } from 'react-toastify';
import { CreatePortRequest, GetAllPortResponse, IPort, PortGetAllParams } from '../index.types';

export const usePortApi = () => {
  const PORT_KEY = 'ports';
  // CREATE
  const createPortMutation = useMutation({
    mutationFn: (payload: CreatePortRequest) => PortHttpService.create(payload),
    onError: ({ message }) => toast.error(message),
    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['ports'] });
        toast.success(`${data.port_name} created successfully`);
      }
    },
  });

  const useGetPort = (queryString: PortGetAllParams) =>
    useQuery<GetAllPortResponse>({
      queryKey: [PORT_KEY, queryString],
      queryFn: () => PortHttpService.getAll(queryString),
    });

  //   // READ ONE
  //   const useGetVendorById = (id: string) =>
  //     useQuery({
  //       queryKey: ["vendor", id],
  //       queryFn: () => getVendorById(id),
  //       enabled: !!id, // Only fetch if ID is provided
  //     });

  //   // UPDATE
  const updatePortMutation = useMutation({
    mutationFn: ({ id, payload }: { id?: string; payload: Partial<IPort> }) => PortHttpService.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [ProcessingInstruction] });
      queryClient.invalidateQueries({ queryKey: ['port', id] });
      toast.success('Port updated successfully');
    },
  });

  // DELETE
  const deletePortMutation = useMutation({
    mutationFn: (id: string) => PortHttpService.delete(id),
    onSuccess: () => {
      toast.success(`Port deleted successfully`);
      return queryClient.invalidateQueries({ queryKey: [PORT_KEY] });
    },
  });

  return {
    // // Queries
    createPort: createPortMutation.mutateAsync,
    deletePort: deletePortMutation.mutateAsync,
    updatePort: updatePortMutation.mutateAsync,
    useGetPort,
    // Statuses (optional)
    isCreating: createPortMutation.isPending,
    isDeleting: deletePortMutation.isPending,
    isUpdating: updatePortMutation.isPending,
  };
};
