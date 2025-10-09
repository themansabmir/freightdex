import { useCallback, useMemo, useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { useGetAllInvoiceItems } from '@modules/invoiceItem/hooks/useInvoiceItemApi';
import { updateRowAtIndex, blankRow } from './utils';
import { getColumns, InvoiceTable, renderSelectedDocument, selectedBillingPartyDetails } from './index.components';
import { useSaveFinanceDocument } from './index.hook';
import { Button } from '@shared/components';
import './totals.scss';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchShipment, fetchDocumentsByShipmentId } from './index.hook';
import { Stack } from '@shared/components/Stack';
import { toast } from 'react-toastify';

const FinanceDocumentList = () => {
  // LOCAL STATES
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const type = params.get('type');

  const [invoiceRows, setInvoiceRows] = useState<any[]>([]);

  // shipment
  const [shipment, setShipment] = useState<string | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<{ label: string; value: string } | null>(null);
  const { data: masterInvoiceItems } = useGetAllInvoiceItems();
  const { isSaving, saveFinanceDocument } = useSaveFinanceDocument();

  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  // API CALLS
  const loadShipmentOptions = useCallback(searchShipment, []);

  const loadDocumentsByShipmentId = useCallback(fetchDocumentsByShipmentId, []);


  // HANDLER FUNCTIONS

  const removeRow = useCallback((idx: number) => {
    setInvoiceRows((rs) => rs.filter((_, i) => i !== idx));
  }, []);
  const updateRow = useCallback((idx: number, patch: Partial<any>) => {
    setInvoiceRows((rs) => updateRowAtIndex(rs, idx, patch));
  }, []);

  const columns = useMemo(() => getColumns(masterInvoiceItems ?? [], updateRow, removeRow), [masterInvoiceItems, updateRow, removeRow]);

  // Calculate totals from invoice rows
  const totals = useMemo(() => {
    const validRows = invoiceRows.filter((row) => row.serviceItem && row.quantity > 0);

    const netDiscount = validRows.reduce((sum, row) => sum + (row.discount || 0), 0);
    const netTaxable = validRows.reduce((sum, row) => sum + (row.taxableAmount || 0), 0);
    const netGst = validRows.reduce((sum, row) => sum + (row.gstAmount || 0), 0);
    const grandTotal = validRows.reduce((sum, row) => sum + (row.totalWithGst || 0), 0);

    return {
      netDiscount: netDiscount.toFixed(2),
      netTaxable: netTaxable.toFixed(2),
      netGst: netGst.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
    };
  }, [invoiceRows]);

  const handleSubmit = async () => {
    if(selectedDocument === null){
      toast.error('Please select a document');
      return;
    }
    const billingPartyDetails = selectedBillingPartyDetails(selectedDocument);
    const isValidItems  = invoiceRows.filter((row) => row.rate > 0).length > 0;
    if (!isValidItems) {
      toast.error('Please add at least one item');
      return;
    }
    const payload = {
      customerId: selectedDocument?.billing_party?._id,
      shipmentId: shipment,
      locationId: selectedDocument?.billing_party_address,
      billingPartySnapshot: billingPartyDetails,
      type: type,
      status: 'draft',
      documentNumber: 'INV-' + new Date().toISOString(),
      issueDate: new Date(),
      dueDate: new Date(),
      lineItems: invoiceRows.filter((row) => row.rate > 0),
      net_discount: Number(totals.netDiscount),
      net_taxable: Number(totals.netTaxable),
      net_gst: Number(totals.netGst),
      grand_total: Number(totals.grandTotal),
    };
    await saveFinanceDocument(payload).then(() => {
      navigate(`/finance?type=${type}`);
    });
  };

  useEffect(() => {
    if (invoiceRows.length < 2) {
      setInvoiceRows((prev) => [...prev, blankRow()]);
    }
  }, [invoiceRows, blankRow]);

  useEffect(() => {
    if (selectedShipment) {
      loadDocumentsByShipmentId(selectedShipment.value).then((res) => {
        const { mblDocument, hblDocument } = res;
        if (hblDocument.length > 0) {
          const arr = hblDocument.map((i: any) => ({ value: i.hblId, label: i.hbl_number, ...i }));
          setDocuments(arr);
        }
      });
    }
  }, [selectedShipment]);



  return (
    <div className="form-container">
      <Stack direction='horizontal' justify='start'>
        <div>

      <label htmlFor="vendor" className="form-label">
        Select Shipment
      </label>
      <AsyncSelect
        loadOptions={loadShipmentOptions}
        value={selectedShipment}
        onChange={(selectedOption) => {
          setShipment(selectedOption?.value || null);
          setSelectedShipment(selectedOption);
          setSelectedDocument(null);
          setDocuments([]);
        }}
        placeholder="Search and select Shipment"
        isClearable
        defaultOptions
        cacheOptions
        styles={{
          control: (base) => ({
            ...base,
            minHeight: '40px',
            width:'380px', 
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            '&:hover': {
              borderColor: '#9ca3af',
            },
          }),
          placeholder: (base) => ({
            ...base,
            color: '#6b7280',
          }),
        }}
      />
        </div>


      {selectedShipment && (
        <div>
          <label htmlFor="vendor" className="form-label">
            Select MBL/HBL Document
          </label>
          <Select
            options={documents}
            value={selectedDocument}
            onChange={setSelectedDocument}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
            placeholder="Select a user..."
            isSearchable
            styles={{
              control: (base) => ({
                ...base,
                minHeight: '40px',
                width:'380px', 
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                '&:hover': {
                  borderColor: '#9ca3af',
                },
              }),
              placeholder: (base) => ({
                ...base,
                color: '#6b7280',
              }),
            }}
          />
        </div>
      )}
      </Stack>

      {selectedDocument && renderSelectedDocument(selectedDocument)}

      <div className="table-container">
        <InvoiceTable rows={invoiceRows} updateRow={updateRow} removeRow={removeRow} items={masterInvoiceItems ?? []} columns={columns} />
      </div>

      {/* Totals Grid */}
      <div className="totals-container">
        <div className="totals-wrapper">
          <div className="totals-grid">
            {/* Net Discount Column */}
            <div className="totals-column">
              <div className="totals-label">Net Discount</div>
              <div className="totals-value">₹{totals.netDiscount}</div>
            </div>

            {/* Net Taxable Column */}
            <div className="totals-column">
              <div className="totals-label">Net Taxable</div>
              <div className="totals-value">₹{totals.netTaxable}</div>
            </div>

            {/* Net GST Column */}
            <div className="totals-column">
              <div className="totals-label">Net GST</div>
              <div className="totals-value">₹{totals.netGst}</div>
            </div>

            {/* Grand Total Column */}
            <div className="totals-column totals-column--grand-total">
              <div className="totals-label totals-label--grand-total">Grand Total</div>
              <div className="totals-value totals-value--grand-total">₹{totals.grandTotal}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <Button onClick={() => handleSubmit()} disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default FinanceDocumentList;
