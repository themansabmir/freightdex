// src/modules/quotation/index.tsx
import QuotationTable from '@generator/table';
import { Button, TextField } from '@shared/components';
import PageLoader from '@shared/components/Loader/PageLoader';
import { Stack } from '@shared/components/Stack';
import { Download, Mail, SearchIcon, Filter, X } from 'lucide-react';
import { useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import MultiSelectInput from '@shared/components/Dropdown';
import { useQuotationFilters } from './hooks/useQuotationFilters';
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState<EQuotationStatus | ''>(selectedQuotation?.quotationMeta?.status || '');

  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [statusInputValue, setStatusInputValue] = useState('');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const [customerFilter, setCustomerFilter] = useState<string[]>([]);
  const [customerInputValue, setCustomerInputValue] = useState('');
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);

  const [shippingLineFilter, setShippingLineFilter] = useState<string[]>([]);
  const [shippingLineInputValue, setShippingLineInputValue] = useState('');
  const [isShippingLineDropdownOpen, setIsShippingLineDropdownOpen] = useState(false);

  const [startPortFilter, setStartPortFilter] = useState<string[]>([]);
  const [startPortInputValue, setStartPortInputValue] = useState('');
  const [isStartPortDropdownOpen, setIsStartPortDropdownOpen] = useState(false);

  const [endPortFilter, setEndPortFilter] = useState<string[]>([]);
  const [endPortInputValue, setEndPortInputValue] = useState('');
  const [isEndPortDropdownOpen, setIsEndPortDropdownOpen] = useState(false);

  useEffect(() => {
    const status = searchParams.get('status');
    const customer = searchParams.get('customer');
    const shippingLine = searchParams.get('shippingLine');
    const startPort = searchParams.get('startPort');
    const endPort = searchParams.get('endPort');

    if (status) setStatusFilter(status.split(','));
    if (customer) setCustomerFilter(customer.split(','));
    if (shippingLine) setShippingLineFilter(shippingLine.split(','));
    if (startPort) setStartPortFilter(startPort.split(','));
    if (endPort) setEndPortFilter(endPort.split(','));

    if (status || customer || shippingLine || startPort || endPort) {
      setShowFilters(true);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    if (statusFilter.length > 0) params.set('status', statusFilter.join(','));
    if (customerFilter.length > 0) params.set('customer', customerFilter.join(','));
    if (shippingLineFilter.length > 0) params.set('shippingLine', shippingLineFilter.join(','));
    if (startPortFilter.length > 0) params.set('startPort', startPortFilter.join(','));
    if (endPortFilter.length > 0) params.set('endPort', endPortFilter.join(','));
    setSearchParams(params, { replace: true });
  }, [statusFilter, customerFilter, shippingLineFilter, startPortFilter, endPortFilter]);

  const activeFilterCount = useMemo(() => {
    return statusFilter.length + customerFilter.length + shippingLineFilter.length + startPortFilter.length + endPortFilter.length;
  }, [statusFilter, customerFilter, shippingLineFilter, startPortFilter, endPortFilter]);

  const clearAllFilters = () => {
    setStatusFilter([]);
    setCustomerFilter([]);
    setShippingLineFilter([]);
    setStartPortFilter([]);
    setEndPortFilter([]);
  };

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
    if (selectedQuotation?._id) {
      sendToVendorMutation.mutate({ id: selectedQuotation._id });
    }
  };

  // HOOKS
  const updateStatusMutation = useUpdateQuotationStatus();
  const downloadPDFMutation = useDownloadQuotationPDF();
  const sendToVendorMutation = useSendQuotationToVendor();

  const { columns } = useQuotationPage({ onViewDetails: handleViewDetails });

  const { statusOptions, customerOptions, shippingLineOptions, startPortOptions, endPortOptions } = useQuotationFilters();

  const { rows, sorting, pagination, query, setQuery, setRows, setPagination, setSorting } = usePageState();

  const getRowId = (row: IQuotation) => row._id;

  const queryBuilder = useMemo((): QuotationGetAllParams => {
    return {
      skip: String(pagination.pageIndex),
      limit: String(pagination.pageSize),
      search: query.trim(),
      sortBy: sorting?.[0]?.id ?? '',
      sortOrder: sorting?.[0]?.desc ? 'desc' : 'asc',
      status: statusFilter.length > 0 ? statusFilter.join(',') : undefined,
      customerId: customerFilter.length > 0 ? customerFilter.join(',') : undefined,
      shippingLineId: shippingLineFilter.length > 0 ? shippingLineFilter.join(',') : undefined,
      startPortId: startPortFilter.length > 0 ? startPortFilter.join(',') : undefined,
      endPortId: endPortFilter.length > 0 ? endPortFilter.join(',') : undefined,
    };
  }, [pagination.pageIndex, pagination.pageSize, query, sorting, statusFilter, customerFilter, shippingLineFilter, startPortFilter, endPortFilter]);

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
        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-end' }}>
          <TextField
            prefixIcon={<SearchIcon />}
            label="Search Quotation"
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            name="search"
            placeholder="Search by quotation number or customer..."
          />
          <div style={{ position: 'relative' }}>
            <Button variant="neutral" onClick={() => setShowFilters(!showFilters)} addClass="!py-2 !px-3">
              <Filter size={18} />
              {activeFilterCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    width: '20px',
                    height: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    fontWeight: '600',
                  }}
                >
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        <Button variant="primary" onClick={() => navigate('/quotation/add')}>
          +Add Quotation
        </Button>
      </Stack>

      {showFilters && (
        <div
          style={{
            backgroundColor: '#f4ebff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px',
            marginTop: '16px',
            marginBottom: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px',
            }}
          >
            <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#475569' }}>
              Filters {activeFilterCount > 0 && `(${activeFilterCount} active)`}
            </h3>
            {activeFilterCount > 0 && (
              <Button variant="neutral" onClick={clearAllFilters} addClass="!py-1 !px-2 !text-xs">
                <X size={14} style={{ marginRight: '4px' }} />
                Clear All
              </Button>
            )}
          </div>
          <div className="flex flex-wrap" style={{ gap: '12px' }}>
            <MultiSelectInput
              label="Status"
              name="statusFilter"
              options={statusOptions}
              selectedValues={statusFilter}
              onSelect={(value) => {
                setStatusFilter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
              }}
              inputValue={statusInputValue}
              onInputChange={setStatusInputValue}
              placeholder="Select status..."
              isOpen={isStatusDropdownOpen}
              setIsOpen={setIsStatusDropdownOpen}
            />

            <MultiSelectInput
              label="Customer"
              name="customerFilter"
              options={customerOptions}
              selectedValues={customerFilter}
              onSelect={(value) => {
                setCustomerFilter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
              }}
              inputValue={customerInputValue}
              onInputChange={setCustomerInputValue}
              placeholder="Select customer..."
              isOpen={isCustomerDropdownOpen}
              setIsOpen={setIsCustomerDropdownOpen}
            />

            <MultiSelectInput
              label="Shipping Line"
              name="shippingLineFilter"
              options={shippingLineOptions}
              selectedValues={shippingLineFilter}
              onSelect={(value) => {
                setShippingLineFilter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
              }}
              inputValue={shippingLineInputValue}
              onInputChange={setShippingLineInputValue}
              placeholder="Select shipping line..."
              isOpen={isShippingLineDropdownOpen}
              setIsOpen={setIsShippingLineDropdownOpen}
            />

            <MultiSelectInput
              label="Start Port"
              name="startPortFilter"
              options={startPortOptions}
              selectedValues={startPortFilter}
              onSelect={(value) => {
                setStartPortFilter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
              }}
              inputValue={startPortInputValue}
              onInputChange={setStartPortInputValue}
              placeholder="Select start port..."
              isOpen={isStartPortDropdownOpen}
              setIsOpen={setIsStartPortDropdownOpen}
            />

            <MultiSelectInput
              label="End Port"
              name="endPortFilter"
              options={endPortOptions}
              selectedValues={endPortFilter}
              onSelect={(value) => {
                setEndPortFilter((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
              }}
              inputValue={endPortInputValue}
              onInputChange={setEndPortInputValue}
              placeholder="Select end port..."
              isOpen={isEndPortDropdownOpen}
              setIsOpen={setIsEndPortDropdownOpen}
            />
          </div>
        </div>
      )}

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
                <Button isLoading={sendToVendorMutation.isPending} onClick={handleSendToVendor} variant="primary" addClass="!py-2 !px-3">
                  <Mail size={16} style={{ marginRight: '6px' }} />
                  E-Mail to customer
                </Button>
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
