import { FinanceHttpService, IFinanceDocument } from '@api/endpoints/finance.endpoint';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { queryClient, useQuery } from '@lib/react-query';

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

export const useGetAllFinanceDocuments = () => {
  return useQuery({
    queryKey: [FINANCE_KEY],
    queryFn: (): Promise<{ response: IFinanceDocument[]; total: number }> =>
      FinanceHttpService.getAll({
        skip: '0',
        limit: '100',
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }).then((res) => ({ response: res.response, total: res.total })),
  });
};
