import PageHeader from '@blocks/page-header';
import { useEffect, useState, useMemo } from 'react';
import { containerSize, containerType, tradeType, breadcrumbArray } from '../rate_master/contants';
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
import { useDropDownData } from '@modules/mbl/hooks/useDropdownData'; // Import useDropDownData
import { splitCompositeFields } from '@shared/utils';

const QuotationForm = () => {
  const [rateData, setRateData] = useState<IDisplayRow[]>([]);
  const [lineItems, setLineItems] = useState<EditableLineItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);

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
    const uniqueOptions = Array.from(new Map(combinedOptions.map((obj) => [obj.value, obj])).values());

    setBillingPartyOptions(uniqueOptions);
  }, [shipper, consignee, notify, agent]);

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

  // Update line items when transformed data changes
  useEffect(() => {
    setLineItems(transformedLineItems);
  }, [transformedLineItems]);

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
    } catch (error: any) {
      console.error('Error saving quotation:', error);
      toast.error(error?.response?.data?.message || 'Failed to save quotation');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    // Fetch data when filters change - API already returns transformed data
    filterRateSheetMaster(filters).then((response) => {
      setRateData(response || []);
    });
  }, [
    filters.containerSize,
    filters.containerType,
    filters.tradeType,
    filters.shippingLineId,
    filters.startPortId,
    filters.endPortId,
    filters.effectiveFrom,
    filters.effectiveTo,
  ]);

  return (
    <div>
      <PageHeader
        pageName="Quotation"
        pageDescription="Create a new quotation by selecting rates and editing line items"
        isEdit={false}
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
          padding: '20px',
          borderRadius: '8px',
          marginTop: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <h3 style={{ marginTop: 0, marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>Quotation Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
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
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
              Valid From <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="date"
              value={validityDates.validFrom}
              onChange={(e) => setValidityDates({ ...validityDates, validFrom: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500 }}>
              Valid To <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="date"
              value={validityDates.validTo}
              onChange={(e) => setValidityDates({ ...validityDates, validTo: e.target.value })}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                fontSize: '14px',
              }}
            />
          </div>
        </div>
      </div>

      <EditableQuotationGrid data={lineItems} onDataChange={handleDataChange} readOnly={false} />

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
