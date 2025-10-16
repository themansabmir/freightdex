import { FinanceHttpService, IFinanceDocument } from '@api/endpoints/finance.endpoint';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { queryClient, useQuery } from '@lib/react-query';
import { ShipmentHttpService } from '@api/endpoints/shipment.endpoint';

const FINANCE_KEY = 'finance';


export const financeMap =(doc: IFinanceDocument[]) =>{
  return doc.map((doc) => {
    return {
      ...doc,
      shipment_name: doc.shipmentId?.shipment_name,
      vendor_name: doc.customerId?.vendor_name,
    }
  })  
}

export const useSaveFinanceDocument = () => {
  const saveFinanceMutation = useMutation({
    mutationFn: (payload: Partial<any>) => FinanceHttpService.create(payload),
    onError: ({ message }) => toast.error(message),
    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: [FINANCE_KEY] });
        toast.success(`Finance document saved successfully`);
      }
    },
  });

  return {
    saveFinanceDocument: saveFinanceMutation.mutateAsync,
    isSaving: saveFinanceMutation.isPending,
  };
};

export const useUpdateFinanceDocument = () => {
  const updateFinanceMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<any> }) => FinanceHttpService.update(id, payload),
    onError: ({ message }) => toast.error(message),
    onSettled: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: [FINANCE_KEY] });
        toast.success(`Finance document updated successfully`);
      }
    },
  });

  return {
    updateFinanceDocument: updateFinanceMutation.mutateAsync,
    isUpdating: updateFinanceMutation.isPending,
  };
};

export const useGetAllFinanceDocuments = (type?: string) => {
  return useQuery({
    queryKey: [FINANCE_KEY, type],
    queryFn: (): Promise<{ response: IFinanceDocument[]; total: number }> =>
      FinanceHttpService.getAll({
        skip: '0',
        limit: '100',
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
        type,
      }).then((res) => ({ response: res.response, total: res.total })),
  });
};

export const searchShipment = async (inputValue: string): Promise<{ label: string; value: string }[]> => {
  try {
    const searchQuery = {
      skip: '0',
      limit: '30',
      search: inputValue,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
    const response = await ShipmentHttpService.getShipmentFolder(searchQuery);
    const formatResponse = response?.map((i: any) => ({ label: i.shipment_name, value: i?._id }));
    return formatResponse ?? [];
  } catch (error) {
    console.error('Error loading vendors:', error);
    return [];
  }
}


export const useGetDocumentsByShipmentId = (shipmentId: string) => {
    return useQuery({
        queryKey: ["documents", "shipment", shipmentId],
        queryFn: (): Promise<IFinanceDocument[]> =>
          fetchDocumentsByShipmentId(shipmentId)
        .then((res) => res),
      });
}
export const fetchDocumentsByShipmentId = async (shipmentId: string) => {
    try {
      if(!shipmentId) return [];
      const response = await ShipmentHttpService.getAllDocumentsByShipmentId(shipmentId);
      return response;
    } catch (error) {
      console.error('Error loading vendors:', error);
      return [];
    }
  }


  export const fetchFinanceDocumentById = async  (id : string) =>{
    try {
     return await FinanceHttpService.getById(id)
    } catch (error) {
      toast.error("Document doesnt exist with this id")
    }
  }