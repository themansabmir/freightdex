import PageHeader from '@blocks/page-header';
import { useEffect, useState, useMemo } from 'react';
import { containerSize, containerType, tradeType } from '../rate_master/contants';
import { useRateMasterOptions } from '../rate_master/hooks/useRateMasterOptions';
import { useRateFiltersUrl } from '../rate_master/hooks/useRateFiltersUrl';
import RateFilters from '../rate_master/component/RateFilters';
import { filterRateSheetMaster } from '@modules/rate_master/hooks/useRateMasterApi';
import EditableQuotationGrid, { EditableLineItem } from './components/EditableQuotationGrid';
import { IDisplayRow } from '../rate_master/index.types';
import { QuotationHttpService } from '@api/endpoints/quotation.endpoints';
import { Button } from '@shared/components/Button';
import { Stack } from '@shared/components/Stack';
import { SaveIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import Dropdown from '@shared/components/SingleDropdown';
import { useDropDownData } from '@modules/mbl/hooks/useDropdownData';
import { splitCompositeFields } from '@shared/utils';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useGetQuotationById, useUpdateQuotation } from './hooks/useQuotationApi';
import PageLoader from '@shared/components/Loader/PageLoader';

const generateUniqueOptions = (combinedOptions: { label: string; value: string }[]) => {
  return Array.from(new Map(combinedOptions.map((obj) => [obj.value, obj])).values());
};

const QuotationForm = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editId = searchParams.get('edit');
  const isEditMode = !!editId;

  const [rateData, setRateData] = useState<IDisplayRow[]>([]);
  const [lineItems, setLineItems] = useState<EditableLineItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [exchangeRate, setExchangeRate] = useState<number>(1);

  // Fetch quotation data if in edit mode
  const { data: quotationData, isLoading: isLoadingQuotation } = useGetQuotationById(editId);
  const updateQuotationMutation = useUpdateQuotation();

  // Billing party state
  const [billingPartyId, setBillingPartyId] = useState<string | null>(null);
  const [billingPartyOptions, setBillingPartyOptions] = useState<{ label: string; value: string }[]>([]);

  // Validity dates state
  const [validityDates, setValidityDates] = useState({
    validFrom: new Date().toISOString().split('T')[0],
    validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days from now
  });

  // Use URL-based filters for persistence across page refreshes
  const { filters, setFilters, clearFilters: clearUrlFilters } = useRateFiltersUrl();

  const { shippingLineOptions, portOptions } = useRateMasterOptions({
    shippingLineId: filters.shippingLineId,
  });

  // Fetch dropdown data using the hook
  const { shipper, consignee, notify, agent } = useDropDownData();

  // Populate billing party options from combined unique list

  useEffect(() => {
    const combinedOptions = [...(shipper ?? []), ...(consignee ?? []), ...(notify ?? []), ...(agent ?? [])];

    // Create unique list based on value (id)
    const uniqueOptions = generateUniqueOptions(combinedOptions);

    console.log('UNIQUE', uniqueOptions);

    setBillingPartyOptions(uniqueOptions);
  }, [shipper, consignee, notify, agent, generateUniqueOptions]);

  // Populate form fields when quotation data is loaded in edit mode
  useEffect(() => {
    if (quotationData && isEditMode) {
      // Set filters
      setFilters({
        shippingLineId: quotationData.shippingLineId?.toString() || '',
        startPortId: quotationData.startPortId?.toString() || '',
        endPortId: quotationData.endPortId?.toString() || '',
        containerType: quotationData.containerType || '',
        containerSize: quotationData.containerSize || '',
        tradeType: quotationData.tradeType || '',
      });

      // Set billing party

      setBillingPartyId(`${quotationData.customerId?.toString()}|${quotationData.customerAddressId}`);

      // Set validity dates
      setValidityDates({
        validFrom: quotationData.validFrom ? new Date(quotationData.validFrom).toISOString().split('T')[0] : '',
        validTo: quotationData.validTo ? new Date(quotationData.validTo).toISOString().split('T')[0] : '',
      });

      // Set line items
      if (quotationData.lineItems && quotationData.lineItems.length > 0) {
        const mappedLineItems: EditableLineItem[] = quotationData.lineItems.map((item: any) => ({
          id: item._id || `item-${Date.now()}-${Math.random()}`,
          chargeName: item.chargeName || '',
          hsnCode: item.hsnCode || '',
          price: item.price || 0,
          currency: item.currency || 'USD',
          quantity: item.quantity || 1,
          totalAmount: item.totalAmount || 0,
        }));
        setLineItems(mappedLineItems);
      }
    }
  }, [quotationData, isEditMode, shipper, consignee, notify, agent, generateUniqueOptions]);

  const handleClearFilters = () => {
    clearUrlFilters();
  };

  // Transform rate data to editable line items
  const transformedLineItems = useMemo<EditableLineItem[]>(() => {
    return rateData.map((rate, index) => ({
      id: `${rate.SHIPPING_LINE}-${rate.CHARGE_NAME}-${index}`,
      chargeName: rate.CHARGE_NAME || '',
      hsnCode: rate.HSN_CODE || '',
      price: rate.PRICE || 0,
      currency: 'USD', // Default currency, can be made dynamic
      quantity: 1, // Default quantity
      totalAmount: rate.PRICE || 0,
    }));
  }, [rateData]);

  // Update line items when transformed data changes (only in create mode, not edit mode)
  useEffect(() => {
    if (!isEditMode) {
      setLineItems(transformedLineItems);
    }
  }, [transformedLineItems, isEditMode]);

  const handleDataChange = (updatedData: EditableLineItem[]) => setLineItems(updatedData);

  const handleSaveQuotation = async () => {
    // Validation
    if (!billingPartyId) {
      toast.error('Please select a billing party');
      return;
    }
    if (!filters.shippingLineId) {
      toast.error('Please select a shipping line');
      return;
    }
    if (!filters.startPortId) {
      toast.error('Please select start port');
      return;
    }
    if (!filters.endPortId) {
      toast.error('Please select end port');
      return;
    }
    if (!filters.containerType) {
      toast.error('Please select container type');
      return;
    }
    if (!filters.containerSize) {
      toast.error('Please select container size');
      return;
    }
    if (!filters.tradeType) {
      toast.error('Please select trade type');
      return;
    }
    if (lineItems.length === 0) {
      toast.error('Please add at least one line item');
      return;
    }

    setIsSaving(true);

    try {
      // Get selected billing party details

      // Transform line items to DTO format
      const billingParty = splitCompositeFields({ billingPartyId }, ['billingPartyId']);
      const quotationPayload = {
        customerId: billingParty.billingPartyId,
        customerAddressId: billingParty.billingPartyId_address,
        shippingLineId: filters.shippingLineId,
        startPortId: filters.startPortId,
        endPortId: filters.endPortId,
        containerType: filters.containerType,
        containerSize: filters.containerSize,
        tradeType: filters.tradeType,
        validFrom: new Date(validityDates.validFrom).toISOString(),
        validTo: new Date(validityDates.validTo).toISOString(),
        lineItems: lineItems.map((item) => ({
          chargeName: item.chargeName,
          hsnCode: item.hsnCode,
          price: item.price,
          currency: item.currency,
          quantity: item.quantity,
        })),
      };

      if (isEditMode && editId) {
        // Update existing quotation
        await updateQuotationMutation.mutateAsync({ id: editId, payload: quotationPayload as any });
        toast.success('Quotation updated successfully!');
        navigate('/quotation');
      } else {
        // Create new quotation
        const savedQuotation = await QuotationHttpService.create(quotationPayload as any);
        toast.success(`Quotation ${savedQuotation.quotationNumber} created successfully!`);

        // Reset form
        setLineItems([]);
        setBillingPartyId(null);
        setValidityDates({
          validFrom: new Date().toISOString().split('T')[0],
          validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        });
        clearUrlFilters();
      }
    } catch (error: any) {
      console.error('Error saving quotation:', error);
      toast.error(error?.response?.data?.message || 'Failed to save quotation');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    // Fetch data when filters change - API already returns transformed data
    // Skip fetching rate data in edit mode since we use quotation line items
    if (!isEditMode) {
      filterRateSheetMaster(filters).then((response) => {
        setRateData(response || []);
      });
    }
  }, [
    filters.containerSize,
    filters.containerType,
    filters.tradeType,
    filters.shippingLineId,
    filters.startPortId,
    filters.endPortId,
    filters.effectiveFrom,
    filters.effectiveTo,
    filters,
    isEditMode,
  ]);

  const breadcrumbArray = [
    { label: 'Dashboard', href: '/' },
    { label: 'Quotation ', href: '/quotation' },
    { label: isEditMode ? 'Edit Quotation' : 'Quotation Form', href: '' },
  ];

  if (isLoadingQuotation) {
    return <PageLoader isLoading={isLoadingQuotation} />;
  }

  return (
    <div>
      <PageHeader
        pageName={isEditMode ? 'Edit Quotation' : 'Quotation'}
        pageDescription={isEditMode ? 'Update quotation details and line items' : 'Create a new quotation by selecting rates and editing line items'}
        isEdit={isEditMode}
        isViewMode={false}
        isForm={false}
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

      {/* Quotation Details Form */}
      <div
        style={{
          background: '#fff',
          maxWidth: '1150px',
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>Quotation Details</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div>
            <Dropdown
              label="Billing Party"
              options={billingPartyOptions}
              value={billingPartyId}
              onChange={(value) => setBillingPartyId(value)}
              placeholder="Select billing party"
              searchable
              required
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500 }}>
              Valid From <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="date"
              value={validityDates.validFrom}
              onChange={(e) => setValidityDates({ ...validityDates, validFrom: e.target.value })}
              style={{
                width: '320px',
                padding: '8px 12px',
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 500 }}>
              Valid To <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="date"
              value={validityDates.validTo}
              onChange={(e) => setValidityDates({ ...validityDates, validTo: e.target.value })}
              style={{
                width: '320px',
                padding: '8px 12px',
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1200px',
        }}
      >
        <EditableQuotationGrid
          data={lineItems}
          onDataChange={handleDataChange}
          readOnly={false}
          exchangeRate={exchangeRate}
          onExchangeRateChange={setExchangeRate}
        />
      </div>

      {/* Save Button */}
      <Stack direction="horizontal" justify="end" className="mt-3">
        <Button onClick={handleSaveQuotation} disabled={isSaving || lineItems.length === 0}>
          <SaveIcon size={16} className="mr-1" />
          {isSaving ? 'Saving...' : 'Save Quotation'}
        </Button>
      </Stack>
    </div>
  );
};

export default QuotationForm;
