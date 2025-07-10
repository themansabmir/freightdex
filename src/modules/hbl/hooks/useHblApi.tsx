import { HblHttpService } from '@api/endpoints/hbl.endpoint';
import { queryClient, useMutation, useQuery } from '@lib/react-query'; // Ensure correct path
import { toast } from 'react-toastify';
import { IHbl } from '../index.types'; // Ensure correct path

export const useHblApi = () => {
  const HBL_QUERY_KEY = 'hbl'; // Query key for HBL data

  // Mutation for saving (creating or updating) an HBL
  const saveHblMutation = useMutation({
    mutationFn: (payload: Partial<IHbl>) => HblHttpService.saveHBL(payload), // Adjust payload type as needed by HblHttpService
    onSuccess: (data) => {
      // Invalidate HBL list queries and specific HBL query to refetch
      queryClient.invalidateQueries({ queryKey: [HBL_QUERY_KEY] });
      if (data?._id) { // Assuming your HBL object has an _id
        queryClient.invalidateQueries({ queryKey: [HBL_QUERY_KEY, data._id] });
      }
      if (data?.mbl_id) {
        queryClient.invalidateQueries({ queryKey: [HBL_QUERY_KEY, 'by-mbl', data.mbl_id] });
      }
      if (data?.shipment_folder_id) {
        queryClient.invalidateQueries({ queryKey: [HBL_QUERY_KEY, 'by-shipment-folder', data.shipment_folder_id] });
      }
      toast.success(`HBL ${data?._id ? 'updated' : 'created'} successfully`);
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || 'Failed to save HBL');
    },
  });

  // Mutation for deleting an HBL
  const deleteHblMutation = useMutation({
    mutationFn: (hblId: string) => HblHttpService.deleteHBL(hblId),
    onSuccess: (_, hblId) => {
      // Invalidate HBL list queries
      queryClient.invalidateQueries({ queryKey: [HBL_QUERY_KEY] });
      // Potentially invalidate the specific MBL's HBL list if applicable
      // queryClient.invalidateQueries({ queryKey: [HBL_QUERY_KEY, 'by-mbl', mblId] });
      toast.success('HBL deleted successfully');
    },
    onError: (error: { message?: string }) => {
      toast.error(error.message || 'Failed to delete HBL');
    },
  });

  // Query to get a single HBL by its ID
  const useGetHblById = (hblId: string | undefined) =>
    useQuery({
      queryKey: [HBL_QUERY_KEY, hblId],
      queryFn: () => {
        if (!hblId) return Promise.resolve(null); // Or throw error if id is strictly required
        return HblHttpService.getHblById(hblId);
      },
      enabled: !!hblId, // Only run query if hblId is provided
    });

  // Query to get all HBLs for a specific MBL ID
  const useGetHblsByMblId = (mblId: string | undefined) =>
    useQuery({
      queryKey: [HBL_QUERY_KEY, 'by-mbl', mblId],
      queryFn: () => {
        if (!mblId) return Promise.resolve([]);
        return HblHttpService.getHblsByMblId(mblId);
      },
      enabled: !!mblId, // Only run query if mblId is provided
    });

  // Query to get all HBLs for a specific Shipment Folder ID
  const useGetHblsByShipmentFolderId = (shipmentFolderId: string | undefined) =>
    useQuery({
      queryKey: [HBL_QUERY_KEY, 'by-shipment-folder', shipmentFolderId],
      queryFn: () => {
        if (!shipmentFolderId) return Promise.resolve([]);
        return HblHttpService.getHblsByShipmentFolderId(shipmentFolderId);
      },
      enabled: !!shipmentFolderId,
    });


  return {
    saveHbl: saveHblMutation.mutateAsync,
    isSavingHbl: saveHblMutation.isPending,
    deleteHbl: deleteHblMutation.mutateAsync,
    isDeletingHbl: deleteHblMutation.isPending,
    useGetHblById,
    useGetHblsByMblId,
    useGetHblsByShipmentFolderId,
  };
};
