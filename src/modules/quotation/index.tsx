// src/modules/quotation/index.tsx
import QuotationTable from '@generator/table';
import { Button, TextField } from '@shared/components';
import PageLoader from '@shared/components/Loader/PageLoader';
import { Stack } from '@shared/components/Stack';
import { Download, Mail, SearchIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
import PageHeader from '../../blocks/page-header';

import usePageState from '@shared/hooks/usePageState';
import useQuotationPage from './hooks/useQuotation';
import { useGetQuotations } from './hooks/useQuotationApi';
import { EQuotationStatus, IQuotation, QuotationGetAllParams } from './index.types';
import { useNavigate } from 'react-router-dom';
import QuotationDocument from './components/QuotationDoc';
import { mapQuotationApiResponse } from '@shared/utils/documentMappers';
import Drawer from '@shared/components/Drawer';
import { useUpdateQuotationStatus, useDownloadQuotationPDF, useSendQuotationToVendor } from './hooks/useQuotationApi';

const Quotation = () => {
  const [selectedQuotation, setSelectedQuotation] = useState<IQuotation | null | any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const navigate = useNavigate();

  const [selectedStatus, setSelectedStatus] = useState<EQuotationStatus | ''>(selectedQuotation?.quotationMeta?.status || '');
  const [vendorEmail, setVendorEmail] = useState('');
  const [showVendorInput, setShowVendorInput] = useState(false);

  const handleViewDetails = (quotation: IQuotation) => {
    const formattedQuotation = mapQuotationApiResponse(quotation);
    setSelectedQuotation(formattedQuotation as unknown as IQuotation);
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    // Delay clearing the selected quotation to allow drawer close animation
    setTimeout(() => setSelectedQuotation(null), 300);
  };

  const handleStatusChange = (newStatus: EQuotationStatus) => {
    if (newStatus && selectedQuotation?._id) {
      updateStatusMutation.mutate({ id: selectedQuotation._id, status: newStatus });
      setSelectedQuotation({ ...selectedQuotation, quotationMeta: { ...selectedQuotation.quotationMeta, status: newStatus } });
      setSelectedStatus('');
    }
  };

  const handleDownloadPDF = () => {
    console.log('selectedQuotation', selectedQuotation);
    if (selectedQuotation?._id) {
      downloadPDFMutation.mutate(selectedQuotation._id);
    }
  };

  const handleSendToVendor = () => {
    if (selectedQuotation?._id && vendorEmail) {
      sendToVendorMutation.mutate({ id: selectedQuotation._id, vendorId: vendorEmail });
      setVendorEmail('');
      setShowVendorInput(false);
    }
  };

  // HOOKS
  const updateStatusMutation = useUpdateQuotationStatus();
  const downloadPDFMutation = useDownloadQuotationPDF();
  const sendToVendorMutation = useSendQuotationToVendor();

  const { columns } = useQuotationPage({ onViewDetails: handleViewDetails });

  const { rows, sorting, pagination, query, setQuery, setRows, setPagination, setSorting } = usePageState();

  const getRowId = (row: IQuotation) => row._id;

  const queryBuilder = useMemo((): QuotationGetAllParams => {
    return {
      skip: String(pagination.pageIndex),
      limit: String(pagination.pageSize),
      search: query.trim(),
      sortBy: sorting?.[0]?.id ?? '',
      sortOrder: sorting?.[0]?.desc ? 'desc' : 'asc',
    };
  }, [pagination.pageIndex, pagination.pageSize, query, sorting]);

  const { isLoading, data } = useGetQuotations(queryBuilder);

  const breadcrumbArray = [{ label: 'Home', href: '/' }, { label: 'Quotation' }];

  return (
    <>
      <PageLoader isLoading={isLoading} />

      <PageHeader
        pageName="Quotation"
        pageDescription="Here you can manage your freight quotations."
        isEdit={false}
        isViewMode={false}
        isForm={false}
        breadcrumnArray={breadcrumbArray}
      />

      <Stack direction="horizontal" align="end" justify="between">
        <TextField
          prefixIcon={<SearchIcon />}
          label="Search Quotation"
          onChange={(e) => setQuery(e.target.value)}
          value={query}
          name="search"
          placeholder="Search by quotation number or customer..."
        />

        <Button variant="primary" onClick={() => navigate('/quotation/add')}>
          +Add Quotation
        </Button>
      </Stack>

      <QuotationTable
        columns={columns}
        data={data?.response ?? []}
        getRowId={getRowId}
        sortColumnArr={sorting}
        sortingHandler={setSorting}
        selectedRowsArr={rows}
        selectRowsHandler={setRows}
        pagination={pagination}
        setPagination={setPagination}
        rowCount={data?.total ?? 0}
        isLoading={isLoading}
      />

      <Drawer open={isDrawerOpen} onClose={handleCloseDrawer} side="right">
        {selectedQuotation ? (
          <>
            <div
              style={{
                backgroundColor: '#fff',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                // gap: '16px',
                flexWrap: 'wrap',
              }}
            >
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1f2937' }}>Quotation Details</h2>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                {/* Status Selector */}
                <select
                  value={selectedQuotation?.quotationMeta?.status || selectedStatus}
                  onChange={(e) => handleStatusChange(e.target.value as EQuotationStatus)}
                  disabled={updateStatusMutation.isPending}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    fontSize: '13px',
                    backgroundColor: '#fff',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                >
                  <option value="">Update Status</option>
                  {Object.values(EQuotationStatus).map((status) => {
                    return (
                      <option key={status} value={status} disabled={status === selectedQuotation?.status}>
                        {status}
                      </option>
                    );
                  })}
                </select>

                {/* Send Button */}
                {!showVendorInput ? (
                  <Button onClick={() => setShowVendorInput(true)} variant="primary" addClass="!py-2 !px-3">
                    <Mail size={16} style={{ marginRight: '6px' }} />
                    E-Mail to customer
                  </Button>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', padding: '4px', borderRadius: '6px' }}>
                    <input
                      type="text"
                      placeholder="Vendor Email"
                      value={vendorEmail}
                      onChange={(e) => setVendorEmail(e.target.value)}
                      style={{
                        padding: '6px 10px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '4px',
                        fontSize: '13px',
                        width: '180px',
                      }}
                    />
                    <Button
                      onClick={handleSendToVendor}
                      disabled={!vendorEmail || sendToVendorMutation.isPending}
                      variant="primary"
                      addClass="!py-1 !px-2 !text-xs"
                    >
                      Send
                    </Button>
                    <button
                      onClick={() => setShowVendorInput(false)}
                      style={{ padding: '4px', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      ✕
                    </button>
                  </div>
                )}
                {/* Download Button */}
                <Button onClick={handleDownloadPDF} disabled={downloadPDFMutation.isPending} variant="neutral" addClass="!py-2 !px-3">
                  <Download size={16} /> PDF
                </Button>
              </div>
            </div>
            <QuotationDocument data={selectedQuotation} />
          </>
        ) : (
          <p>No quotation selected</p>
        )}
      </Drawer>
    </>
  );
};

export default Quotation;
