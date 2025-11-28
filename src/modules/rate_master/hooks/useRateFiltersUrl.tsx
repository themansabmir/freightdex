import { useQueryStates, parseAsString, parseAsIsoDateTime } from 'nuqs';
import { useMemo } from 'react';
import { GetRateSheetsFilters } from '../index.types';

/**
 * Custom hook for managing rate sheet filters in URL query parameters
 * Provides persistent filter state that survives page refreshes
 * 
 * @returns Object containing filters and setFilters function
 */
export const useRateFiltersUrl = () => {
  const [urlFilters, setUrlFilters] = useQueryStates(
    {
      shippingLineId: parseAsString.withDefault(''),
      containerType: parseAsString.withDefault(''),
      containerSize: parseAsString.withDefault(''),
      startPortId: parseAsString.withDefault(''),
      endPortId: parseAsString.withDefault(''),
      effectiveFrom: parseAsIsoDateTime,
      effectiveTo: parseAsIsoDateTime,
      tradeType: parseAsString.withDefault(''),
    },
    {
      // History mode: push new entries to browser history
      history: 'push',
      // Shallow routing: don't trigger full page reload
      shallow: true,
      // Clear empty values from URL
      clearOnDefault: true,
    }
  );

  /**
   * Memoized filters object that combines URL state with defaults
   */
  const filters: GetRateSheetsFilters = useMemo(() => ({
    shippingLineId: urlFilters.shippingLineId || undefined,
    containerType: urlFilters.containerType || undefined,
    containerSize: urlFilters.containerSize || undefined,
    startPortId: urlFilters.startPortId || undefined,
    endPortId: urlFilters.endPortId || undefined,
    effectiveFrom: urlFilters.effectiveFrom || undefined,
    effectiveTo: urlFilters.effectiveTo || undefined,
    tradeType: urlFilters.tradeType || undefined,
  }), [urlFilters]);

  /**
   * Update filters in URL
   * Supports both direct values and updater functions (like React.useState)
   */
  const updateFilters = (
    value: GetRateSheetsFilters | ((prev: GetRateSheetsFilters) => GetRateSheetsFilters)
  ) => {
    const newFilters = typeof value === 'function' ? value(filters) : value;
    
    setUrlFilters({
      shippingLineId: newFilters.shippingLineId || '',
      containerType: newFilters.containerType || '',
      containerSize: newFilters.containerSize || '',
      startPortId: newFilters.startPortId || '',
      endPortId: newFilters.endPortId || '',
      effectiveFrom: newFilters.effectiveFrom || null,
      effectiveTo: newFilters.effectiveTo || null,
      tradeType: newFilters.tradeType || '',
    });
  };

  /**
   * Clear all filters and reset to defaults
   */
  const clearFilters = () => {
    setUrlFilters({
      shippingLineId: '',
      containerType: '',
      containerSize: '',
      startPortId: '',
      endPortId: '',
      effectiveFrom: null,
      effectiveTo: null,
      tradeType: '',
    });
  };

  return {
    filters,
    setFilters: updateFilters,
    clearFilters,
  };
};
