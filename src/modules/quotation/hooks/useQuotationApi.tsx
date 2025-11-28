// hooks/useQuotationApi.ts
import { QuotationHttpService } from '@api/endpoints/quotation.endpoints';
import { useQuery } from '@lib/react-query';
import { GetAllQuotationResponse, QuotationGetAllParams } from '../index.types';

const QUOTATION_KEY = 'quotations';

export const useGetQuotations = (queryString: QuotationGetAllParams) =>
  useQuery<GetAllQuotationResponse>({
    queryKey: [QUOTATION_KEY, queryString],
    queryFn: () => QuotationHttpService.getAll(queryString),
  });
