// hooks/useQuotationApi.ts
import { QuotationHttpService } from '@api/endpoints/quotation.endpoints';
import { useQuery } from '@lib/react-query';
import { GetAllQuotationResponse, QuotationGetAllParams } from '../index.types';

export const useQuotationApi = () => {
  const QUOTATION_KEY = 'quotations';

  const useGetQuotations = (queryString: QuotationGetAllParams) =>
    useQuery<GetAllQuotationResponse>({
      queryKey: [QUOTATION_KEY, queryString],
      queryFn: () => QuotationHttpService.getAll(queryString),
    });

  return {
    useGetQuotations,
  };
};
