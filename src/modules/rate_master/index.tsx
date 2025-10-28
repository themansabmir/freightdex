import PageLoader from '@shared/components/Loader/PageLoader';
import PageHeader from '@blocks/page-header';
import FileUploadSection from '@shared/components/FileUpload';
import { useModal } from '@shared/hooks/useModal';
import { Stack } from '@shared/components/Stack';
import { Button } from '@shared/components/Button';
import { RateMasterHttpService } from '@api/endpoints/ratemaster.endpoint';
import { toast } from 'react-toastify';
import { useEffect, useMemo } from 'react';
import { useState } from 'react';
import { IExcelRow } from './index.types';
import SpreadSheet from './component/SpreadSheet';
import Dropdown from '@shared/components/SingleDropdown';
import { containerSize, containerType , tradeType} from './contants';

const RateSheetMaster = () => {
  const { isOpen, closeModal, openModal } = useModal();
  const [data, setData] = useState<IExcelRow[]>([]);

  const columns = useMemo(
    () => [
      { accessorKey: 'SHIPPING_LINE', header: 'Shipping Line', size: 150 },
      { accessorKey: 'CONTAINER_TYPE', header: 'Type', size: 100 },
      { accessorKey: 'CONTAINER_SIZE', header: 'Size', size: 100 },
      { accessorKey: 'START_PORT', header: 'Start Port', size: 120 },
      { accessorKey: 'END_PORT', header: 'End Port', size: 120 },
      { accessorKey: 'CHARGE_NAME', header: 'Charge Name', size: 180 },
      { accessorKey: 'HSN_CODE', header: 'HSN Code', size: 140 },
      { accessorKey: 'PRICE', header: 'Price', size: 100, isNumeric: true },
      { accessorKey: 'EFFECTIVE_FROM', header: 'Effective From', size: 150 },
      { accessorKey: 'EFFECTIVE_TO', header: 'Effective To', size: 150 },
      { accessorKey: 'TRADE_TYPE', header: 'Trade Type', size: 100 },
    ],
    []
  );

  const handleCancel = () => {
    closeModal();
  };

  const handleFileUpload = () => {
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
    RateMasterHttpService.getActiveRateSheets({ shippingLineId: '68fd3c0f3bf05f23ff152261' }).then((res) => {
      const rateSheets = res.map((rateSheet) => ({
        ...rateSheet,
        SHIPPING_LINE: rateSheet?.SHIPPING_LINE?.vendor_name,
        START_PORT: rateSheet?.START_PORT?.port_name,
        END_PORT: rateSheet?.END_PORT?.port_name,
        EFFECTIVE_FROM: new Date(rateSheet.EFFECTIVE_FROM).toLocaleDateString(),
        EFFECTIVE_TO: rateSheet?.EFFECTIVE_TO ? new Date(rateSheet?.EFFECTIVE_TO).toLocaleDateString() : null,
      }));
      setData(rateSheets);
    });
  }, []);
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

      <Stack direction="horizontal" justify="end">
        <Button onClick={openModal}>Upload Rate Sheet +</Button>
      </Stack>

      <div className="flex mb-2 gap-2">
        <Dropdown value={null} options={[{ label: 'ShippingLine', value: '1' }]} placeholder="Shipping Line" onChange={() => {}} />
        <Dropdown value={null} options={containerType} placeholder="Container Type" onChange={() => {}} />
        <Dropdown value={null} options={containerSize} placeholder="Container Size" onChange={() => {}} />
      </div>
      <div className="flex gap-2">
        <Dropdown value={null} options={[]} placeholder="Start Port" onChange={() => {}} />
        <Dropdown value={null} options={[]} placeholder="End Port" onChange={() => {}} />
        <Dropdown value={null} options={tradeType} placeholder="Trade Type" onChange={() => {}} />
      </div>

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
