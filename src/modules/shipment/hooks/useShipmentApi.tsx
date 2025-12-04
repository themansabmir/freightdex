import { ShipmentHttpService } from '@api/endpoints/shipment.endpoint';
import { queryClient, useMutation, useQuery } from '@lib/react-query';
import { GetAllShipmentResponse, ShipmentGetAllParams } from '../index.types';
import { toast } from 'react-toastify';

const SHIPMENT_KEY = 'shipment';
const SHIPMENT_DOCUMENTS_KEY = 'shipment-documents';

export const useShipmentApi = () => {
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

  const useGetShipments = (queryString: ShipmentGetAllParams) =>
    useQuery<GetAllShipmentResponse>({
      queryKey: [SHIPMENT_KEY, queryString],
      queryFn: () => ShipmentHttpService.getShipmentFolder(queryString),
    });

  const useGetShipmentById = (id: string) => useQuery({ queryKey: [SHIPMENT_KEY, id], queryFn: () => ShipmentHttpService.getFolderById(id) });

  // Document upload mutation
  const uploadDocumentsMutation = useMutation({
    mutationFn: ({ shipmentId, files }: { shipmentId: string; files: FormData }) => ShipmentHttpService.uploadDocuments(shipmentId, files),
    onError: ({ message }) => toast.error(message || 'Failed to upload documents'),
    onSuccess: () => {
      toast.success('Document uploaded successfully');
      queryClient.invalidateQueries({ queryKey: [SHIPMENT_DOCUMENTS_KEY] });
    },
  });

  // Document delete mutation
  const deleteDocumentMutation = useMutation({
    mutationFn: ({ documentId }: { documentId: string }) => ShipmentHttpService.deleteDocument(documentId),
    onError: ({ message }) => toast.error(message || 'Failed to delete document'),
    onSuccess: () => {
      toast.success('Document deleted successfully');
      queryClient.invalidateQueries({ queryKey: [SHIPMENT_DOCUMENTS_KEY] });
    },
  });

  return {
    useGetShipments,
    createShipmentFolder: createShipmentMutation.mutateAsync,
    isCreating: createShipmentMutation.isPending,
    useGetShipmentById,
    uploadDocuments: uploadDocumentsMutation.mutateAsync,
    isUploading: uploadDocumentsMutation.isPending,
    deleteDocument: deleteDocumentMutation.mutateAsync,
    isDeleting: deleteDocumentMutation.isPending,
  };
};

export const useGetShipments = (queryString: ShipmentGetAllParams) =>
  useQuery({
    queryKey: [SHIPMENT_KEY, queryString],
    queryFn: () => ShipmentHttpService.getShipmentFolder(queryString),
  });
