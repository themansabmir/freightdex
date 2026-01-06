// hooks/useQuotationApi.ts
import { QuotationHttpService } from '@api/endpoints/quotation.endpoints';
import { useMutation, useQuery, useQueryClient } from '@lib/react-query';
import { GetAllQuotationResponse, IQuotation, QuotationGetAllParams } from '../index.types';
import { toast } from 'react-toastify';

const QUOTATION_KEY = 'quotations';

export const useGetQuotations = (queryString: QuotationGetAllParams) =>
  useQuery<GetAllQuotationResponse>({
    queryKey: [QUOTATION_KEY, queryString],
    queryFn: () => QuotationHttpService.getAll(queryString),
  });

export const useGetQuotationById = (id: string | null) =>
  useQuery<IQuotation>({
    queryKey: [QUOTATION_KEY, id],
    queryFn: () => QuotationHttpService.getById(id!),
    enabled: !!id,
  });

export const useUpdateQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<IQuotation> }) => QuotationHttpService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUOTATION_KEY] });
      toast.success('Quotation updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update quotation');
    },
  });
};

export const useUpdateQuotationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => QuotationHttpService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUOTATION_KEY] });
      toast.success('Quotation status updated successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update status');
    },
  });
};

export const useDownloadQuotationPDF = () => {
  return useMutation({
    mutationFn: (id: string) => QuotationHttpService.downloadPDF(id),
    onSuccess: () => {
      toast.success('PDF downloaded successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to download PDF');
    },
  });
};

export const useSendQuotationToVendor = () => {
  return useMutation({
    mutationFn: ({ id }: { id: string }) => QuotationHttpService.sendToVendor(id),
    onSuccess: () => {
      toast.success('Quotation sent to vendor successfully');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to send quotation to vendor');
    },
  });
};
