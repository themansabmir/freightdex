import { ShipmentHttpService } from '@api/endpoints/shipment.endpoint';
import { queryClient, useMutation, useQuery } from '@lib/react-query';
import { VendorGetAllParams } from '@modules/vendor/index.types';
import { toast } from 'react-toastify';

export const useShipmentApi = () => {
  const SHIPMENT_KEY = 'shipment';

  const createShipmentMutation = useMutation({
    mutationFn: (payload: { shipment_type: string }) => ShipmentHttpService.createShipmentFolder(payload),
    onError: ({ message }) => toast.error(message),
    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: [SHIPMENT_KEY] });
        const shipmentFolder = data.shipment_type === 'IMP' ? 'Import' : 'Export';
        toast.success(`${shipmentFolder} folder created successfully`);
      }
    },
  });

  const useGetShipments = (queryString: VendorGetAllParams) =>
    useQuery({
      queryKey: [SHIPMENT_KEY, queryString],
      queryFn: () => ShipmentHttpService.getShipmentFolder(queryString),
    });

  const useGetShipmentById = (id: string) => useQuery({ queryKey: [SHIPMENT_KEY, id], queryFn: () => ShipmentHttpService.getFolderById(id) });

  return {
    useGetShipments,
    createShipmentFolder: createShipmentMutation.mutateAsync,
    isCreating: createShipmentMutation.isPending,
    useGetShipmentById,
  };
};
