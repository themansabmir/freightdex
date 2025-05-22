import { VendorHttpService } from '@api/endpoints/vendor.endpoint';
import { queryClient, useMutation, useQuery } from '@lib/react-query';
import { toast } from 'react-toastify';
import { CreateVendorRequest, GetAllVendorResponse, IVendor } from '../index.types';

export const useVendorApi = () => {
  // CREATE
  const createVendorMutation = useMutation({
    mutationFn: (payload: CreateVendorRequest) => VendorHttpService.create(payload),
    onError: ({ message }) => toast.error(message),
    onSettled: (data) => {
      if (data) {
        queryClient.setQueryData(['vendors'], (old: IVendor[]) => {
          const withoutTemp = old?.filter((p) => !p.temp) ?? [];
          return [...withoutTemp, data];
        });
        toast.success(`${data.vendor_name} created successfully`);
      }
    },
  });

  const useGetVendors = (queryString?: string) =>
    useQuery<GetAllVendorResponse>({
      queryKey: ['vendors', queryString],
      queryFn: () => VendorHttpService.getAll(queryString),
    });

  //   // READ ONE
  //   const useGetVendorById = (id: string) =>
  //     useQuery({
  //       queryKey: ["vendor", id],
  //       queryFn: () => getVendorById(id),
  //       enabled: !!id, // Only fetch if ID is provided
  //     });

  //   // UPDATE
  //   const updateVendorMutation = useMutation({
  //     mutationFn: ({ id, payload }: { id: string; payload: Partial<IVendor> }) =>
  //       updateVendor({ id, payload }),
  //     onSuccess: (_, { id }) => {
  //       queryClient.invalidateQueries({ queryKey: ["vendors"] });
  //       queryClient.invalidateQueries({ queryKey: ["vendor", id] });
  //     },
  //   });

  //   // DELETE
  //   const deleteVendorMutation = useMutation({
  //     mutationFn: (id: string) => deleteVendor(id),
  //     onSuccess: () => queryClient.invalidateQueries({ queryKey: ["vendors"] }),
  //   });

  return {
    // // Queries
    createVendor: createVendorMutation.mutate,
    isCreated: createVendorMutation.isSuccess,
    useGetVendors,
    // useGetVendors,
    // useGetVendorById,

    // Mutations

    // updateVendor: updateVendorMutation.mutate,
    // updateVendorAsync: updateVendorMutation.mutateAsync,
    // deleteVendor: deleteVendorMutation.mutate,
    // deleteVendorAsync: deleteVendorMutation.mutateAsync,

    // Statuses (optional)
    isCreating: createVendorMutation.isPending,
    // isUpdating: updateVendorMutation.isLoading,
    // isDeleting: deleteVendorMutation.isLoading,
  };
};
