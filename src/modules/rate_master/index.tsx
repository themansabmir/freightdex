import PageHeader from '@blocks/page-header';
import FileUploadSection from '@shared/components/FileUpload';
import { useModal } from '@shared/hooks/useModal';
import { Stack } from '@shared/components/Stack';
import { Button } from '@shared/components/Button';
import { useEffect, useState } from 'react';
import { IDisplayRow } from './index.types';
import SpreadSheet from './component/SpreadSheet';
import { containerSize, containerType, tradeType, breadcrumbArray } from './contants';
import { filterRateSheetMaster, useBulkInsertRateSheet } from './hooks/useRateMasterApi';
import { useRateMasterOptions, handleDownloadTemplate } from './hooks/useRateMasterOptions';
import { useRateFiltersUrl } from './hooks/useRateFiltersUrl';
import { UploadIcon } from 'lucide-react';
import RateFilters from './component/RateFilters';

const RateSheetMaster = () => {
  const { isOpen, closeModal, openModal } = useModal();
  const [data, setData] = useState<IDisplayRow[]>([]);
  
  // Use URL-based filters for persistence across page refreshes
  const { filters, setFilters, clearFilters: clearUrlFilters } = useRateFiltersUrl();

  const { bulkInsert } = useBulkInsertRateSheet();
  const { shippingLineOptions, portOptions, columns } = useRateMasterOptions({
    shippingLineId: filters.shippingLineId
  });

  const handleCancel = () => {
    closeModal();
  };  
  const handleClearFilters = () => {
    clearUrlFilters();
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    await bulkInsert(formData);
    console.log(file);
    closeModal();
  };




  useEffect(() => {
    // Fetch data when filters change - can work with or without shippingLineId
    console.log("Filters", filters)
    filterRateSheetMaster(filters).then(setData);

  }, [filters.containerSize, filters.containerType, filters.tradeType, filters.shippingLineId, filters.startPortId, filters.endPortId, filters.effectiveFrom, filters.effectiveTo]);

  // Clear port selections when shipping line changes
  // useEffect(() => {
  //   if (filters.shippingLineId) {
  //     setFilters((prev) => ({
  //       ...prev,
  //       startPortId: '',
  //       endPortId: '',
  //     }));
  //   }
  // }, [filters.shippingLineId]);

  return (
    <div>
      {/* <PageLoader isLoading={isLoading} /> */}
      <PageHeader
        pageName="Rate Sheet Master"
        pageDescription="Here you can manage your rate sheet for all your shipping lines"
        isEdit={false}
        isViewMode={false}
        isForm={false}
        breadcrumnArray={breadcrumbArray}
      />

      <Stack direction="horizontal" justify="end" className="mb-3">
        <Button onClick={openModal}>
          {' '}
          Upload Rate Sheet <UploadIcon size={16} className="ml-1" />{' '}
        </Button>
      </Stack>

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

      <SpreadSheet data={data} columns={columns} />

      <FileUploadSection
        title="Upload Rate Sheet"
        onDownloadTemplate={handleDownloadTemplate}
        onCancel={handleCancel}
        onSubmit={handleFileUpload}
        isOpen={isOpen}
        closeModal={closeModal}
      />
    </div>
  );
};

export default RateSheetMaster;
