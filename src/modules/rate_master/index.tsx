import PageHeader from '@blocks/page-header';
import FileUploadSection from '@shared/components/FileUpload';
import { useModal } from '@shared/hooks/useModal';
import { Stack } from '@shared/components/Stack';
import { Button } from '@shared/components/Button';
import { RateMasterHttpService } from '@api/endpoints/ratemaster.endpoint';
import { toast } from 'react-toastify';
import { useEffect, useMemo } from 'react';
import { useState } from 'react';
import { GetRateSheetsFilters, IDisplayRow } from './index.types';
import SpreadSheet from './component/SpreadSheet';
import Dropdown from '@shared/components/SingleDropdown';
import { containerSize, containerType, tradeType, columnsArr } from './contants';
import { filterRateSheetMaster, useGetDistinctShippingLines, useGetDistinctPorts, useBulkInsertRateSheet } from './hooks/useRateMasterApi';
import { UploadIcon } from 'lucide-react';
import { FieldLabel } from '@generator/form';
import dayjs from 'dayjs';

const RateSheetMaster = () => {
  const { isOpen, closeModal, openModal } = useModal();
  const [data, setData] = useState<IDisplayRow[]>([]);
  const [filters, setFilters] = useState<GetRateSheetsFilters>({
    shippingLineId: '',
    containerType: '',
    containerSize: '',
    startPortId: '',
    endPortId: '',
    effectiveFrom: undefined,
    effectiveTo: undefined,
    tradeType: '',
  });

  console.log('Filters', filters);
  const { data: shippingLines } = useGetDistinctShippingLines();
  const { data: ports } = useGetDistinctPorts(filters.shippingLineId);
  const { bulkInsert, isUploading } = useBulkInsertRateSheet();

  const shippingLineOptions = useMemo(() => {
    return (
      shippingLines?.map((line) => ({
        label: line.vendor_name,
        value: line._id,
      })) || []
    );
  }, [shippingLines]);

  const portOptions = useMemo(() => {
    return (
      ports?.map((port) => ({
        label: port.port_name,
        value: port._id,
      })) || []
    );
  }, [ports]);

  const columns = useMemo(() => columnsArr, []);

  const handleCancel = () => {
    closeModal();
  };

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    await bulkInsert(formData);
    console.log(file);
    closeModal();
  };

  const handleDownloadTemplate = async () => {
    try {
      await RateMasterHttpService.downloadTemplate('rate-master');
      toast.success('Template Downloaded');
    } catch (error) {
      console.log(error);
      toast.error('Failed to download template');
    }
  };

  useEffect(() => {
    // Fetch data when filters change - can work with or without shippingLineId
    filterRateSheetMaster(filters).then(setData);
  }, [filters]);

  // Clear port selections when shipping line changes
  useEffect(() => {
    if (filters.shippingLineId) {
      setFilters((prev) => ({
        ...prev,
        startPortId: '',
        endPortId: '',
      }));
    }
  }, [filters.shippingLineId]);
  const breadcrumbArray = [
    { label: 'Dashboard', href: '/' },
    { label: 'Rate Sheet Master', href: '' },
  ];
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

      <div className="flex mb-2 gap-2">
        <Dropdown
          value={filters.shippingLineId || null}
          options={shippingLineOptions}
          placeholder="Shipping Line"
          onChange={(value) => setFilters({ ...filters, shippingLineId: value || '' })}
        />
        <Dropdown
          value={filters.containerType || null}
          options={containerType}
          placeholder="Container Type"
          onChange={(value) => setFilters({ ...filters, containerType: value || '' })}
        />
        <Dropdown
          value={filters.containerSize || null}
          options={containerSize}
          placeholder="Container Size"
          onChange={(value) => setFilters({ ...filters, containerSize: value || '' })}
        />
      </div>
      <div className="flex gap-2">
        <Dropdown
          value={filters.startPortId || null}
          options={portOptions}
          placeholder="Start Port"
          onChange={(value) => setFilters({ ...filters, startPortId: value || '' })}
        />
        <Dropdown
          value={filters.endPortId || null}
          options={portOptions}
          placeholder="End Port"
          onChange={(value) => setFilters({ ...filters, endPortId: value || '' })}
        />
        <Dropdown
          value={filters.tradeType || null}
          options={tradeType}
          placeholder="Trade Type"
          onChange={(value) => setFilters({ ...filters, tradeType: value || '' })}
        />
      </div>
        <div>
          <br />
          <FieldLabel label={'Effective From '} />
          <br />
          <input
            className="custom-date-input"
            value={filters.effectiveFrom ? dayjs.utc(filters.effectiveFrom).tz('Asia/Kolkata').format('YYYY-MM-DD') : filters.effectiveFrom}
            style={{ backgroundColor: 'white' }}
            onChange={(e) => setFilters((prev) => ({ ...prev, effectiveFrom: e.target.value }))}
            type="date"
          />
        </div>
        <div>
          <br />
          <FieldLabel label={'Effective To '} />
          <br />
          <input
            className="custom-date-input"
            value={filters.effectiveTo ? dayjs.utc(filters.effectiveTo).tz('Asia/Kolkata').format('YYYY-MM-DD') : filters.effectiveTo}
            style={{ backgroundColor: 'white' }}
            onChange={(e) => setFilters((prev) => ({ ...prev, effectiveTo: e.target.value }))}
            type="date"
          />
        </div>
      <div></div>

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
