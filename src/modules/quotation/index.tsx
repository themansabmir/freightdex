import PageHeader from '@blocks/page-header';
import { useEffect, useState } from 'react';
import { IDisplayRow } from '@modules/rate_master/index.types';
import { useRateMasterOptions } from '@modules/rate_master/hooks/useRateMasterOptions';
import { useRateFiltersUrl } from '@modules/rate_master/hooks/useRateFiltersUrl';
import { breadcrumbArray } from './contants';
import RateFilters from '@modules/rate_master/component/RateFilters';
import { containerSize, containerType, tradeType } from '@modules/rate_master/contants';
import { filterRateSheetMaster } from '@modules/rate_master/hooks/useRateMasterApi';

const Quotation = () => {
      const [data, setData] = useState<IDisplayRow[]>([]);
      
      // Use URL-based filters for persistence across page refreshes
      const { filters, setFilters, clearFilters: clearUrlFilters } = useRateFiltersUrl();
    
      const { shippingLineOptions, portOptions, columns } = useRateMasterOptions({
        shippingLineId: filters.shippingLineId
      });

      const handleClearFilters = () => {
        clearUrlFilters();
      };

      useEffect(() =>{
        filterRateSheetMaster(filters).then(setData);
      }, [filters])

  return (
    <div>
      <PageHeader
        pageName="Quotation"
        pageDescription="Here you can manage your Quotations of all your clients"
        isForm={false}
        isEdit={false}
        isViewMode={false}
        breadcrumnArray={breadcrumbArray}
      />
      <RateFilters 
        filters={filters}
        setFilters={setFilters}
        shippingLineOptions={shippingLineOptions}
        containerType={containerType}
        containerSize={containerSize}
        portOptions={portOptions}
        tradeType={tradeType}
        clearFilters={handleClearFilters}
      />
    </div>
  );
};

export default Quotation;
