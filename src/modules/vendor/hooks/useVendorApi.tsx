import { VendorHttpService } from '@api/endpoints/vendor.endpoint';
import { queryClient, useMutation, useQuery } from '@lib/react-query';
import { toast } from 'react-toastify';
import { CreateVendorRequest, GetAllVendorResponse, IVendor } from '../index.types';

export const useVendorApi = () => {
  const VENDOR_KEY = 'vendors';
  // CREATE
  const createVendorMutation = useMutation({
    mutationFn: (payload: CreateVendorRequest) => VendorHttpService.create(payload),
    onError: ({ message }) => toast.error(message),
    onSettled: (data) => {
      if (data) {
        queryClient.setQueryData([VENDOR_KEY], (old: IVendor[]) => {
          const withoutTemp = old?.filter((p) => !p.temp) ?? [];
          return [...withoutTemp, data];
        });
        toast.success(`${data.vendor_name} created successfully`);
      }
    },
  });

  const useGetVendors = (queryString) =>
    useQuery<GetAllVendorResponse>({
      queryKey: [VENDOR_KEY, queryString],
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
  // const updateVendorMutation = useMutation({
  //   mutationFn: ({ id, payload }: { id: string; payload: Partial<IVendor> }) =>
  //     updateVendor({ id, payload }),
  //   onSuccess: (_, { id }) => {
  //     queryClient.invalidateQueries({ queryKey: [VENDOR_KEY] });
  //     queryClient.invalidateQueries({ queryKey: ["vendor", id] });
  //   },
  // });

  //   // DELETE
  const deleteVendorMutation = useMutation({
    mutationFn: (id: string) => Promise.resolve(id),
    onSuccess: () => {
      toast.success(`Vendor deleted successfully`);
      return queryClient.invalidateQueries({ queryKey: [VENDOR_KEY] });
    },
  });

  return {
    // // Queries
    createVendor: createVendorMutation.mutate,
    deleteVendor: deleteVendorMutation.mutate,

    useGetVendors,
    // useGetVendors,
    // useGetVendorById,

    // Mutations

    // updateVendor: updateVendorMutation.mutate,
    // updateVendorAsync: updateVendorMutation.mutateAsync,
    // deleteVendor: deleteVendorMutation.mutate,
    // deleteVendorAsync: deleteVendorMutation.mutateAsync,

    // Statuses (optional)
    isCreated: createVendorMutation.isSuccess,
    isCreating: createVendorMutation.isPending,
    isDeleting: deleteVendorMutation.isPending,
    isDeleted: deleteVendorMutation.isSuccess,
    queryKey: VENDOR_KEY
    // isUpdating: updateVendorMutation.isLoading,
    // isDeleting: deleteVendorMutation.isLoading,
  };
};
