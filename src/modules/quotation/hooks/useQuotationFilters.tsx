import { useQuery } from '@tanstack/react-query';
import { QuotationHttpService } from '@api/endpoints/quotation.endpoints';

interface FilterOption {
  label: string;
  value: string;
}

interface UseQuotationFiltersReturn {
  statusOptions: FilterOption[];
  customerOptions: FilterOption[];
  shippingLineOptions: FilterOption[];
  startPortOptions: FilterOption[];
  endPortOptions: FilterOption[];
  isLoading: boolean;
}

export const useQuotationFilters = (): UseQuotationFiltersReturn => {
  const { data: filterOptions, isLoading } = useQuery({
    queryKey: ['quotation-filter-options'],
    queryFn: () => QuotationHttpService.getFilterOptions(),
    staleTime: 5 * 60 * 1000,
  });

  return {
    statusOptions: filterOptions?.statuses || [],
    customerOptions: filterOptions?.customers || [],
    shippingLineOptions: filterOptions?.shippingLines || [],
    startPortOptions: filterOptions?.startPorts || [],
    endPortOptions: filterOptions?.endPorts || [],
    isLoading,
  };
};
