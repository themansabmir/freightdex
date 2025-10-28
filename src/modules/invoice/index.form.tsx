import { useCallback, useMemo, useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import Select from 'react-select';
import { useGetAllInvoiceItems } from '@modules/invoiceItem/hooks/useInvoiceItemApi';
import { updateRowAtIndex, blankRow } from './utils';
import { getColumns, InvoiceTable, selectedBillingPartyDetails } from './index.components';
import { fetchFinanceDocumentById, useGetDocumentsByShipmentId, useSaveFinanceDocument, useUpdateFinanceDocument } from './index.hook';
import { Button } from '@shared/components';
import './totals.scss';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { searchShipment } from './index.hook';
import { Stack } from '@shared/components/Stack';
import { toast } from 'react-toastify';

const FinanceDocumentList = () => {
  // CONSTANT LOCAL STATES
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const type = params.get('type');
  const id = params.get('id');
  const [docType, setDocType] = useState<string>('HBL');
  const { data: masterInvoiceItems } = useGetAllInvoiceItems();

  const [invoiceRows, setInvoiceRows] = useState<any[]>([]);

  // shipment
  // const [shipment, setShipment] = useState<string | null>(null);
  const [selectedShipment, setSelectedShipment] = useState<{ label: string; value: string } | null>(null);

  const { isSaving, saveFinanceDocument } = useSaveFinanceDocument();
  const { isUpdating, updateFinanceDocument } = useUpdateFinanceDocument();

  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [editingDoc, setEditingDoc] = useState<any | null>(null);

  const [billingPartySnapshot, setBillingPartySnapshot] = useState<any>(null);


  // HANDLER FUNCTIONS

  const removeRow = useCallback((idx: number) => {
    setInvoiceRows((rs) => rs.filter((_, i) => i !== idx));
  }, []);
  const updateRow = useCallback((idx: number, patch: Partial<any>) => {
    setInvoiceRows((rs) => updateRowAtIndex(rs, idx, patch));
  }, []);

  const columns = useMemo(() => getColumns(masterInvoiceItems ?? [], updateRow, removeRow), [masterInvoiceItems, updateRow, removeRow]);

  // API CALLS
  const loadShipmentOptions = useCallback(searchShipment, []);
  const { data } = useGetDocumentsByShipmentId(selectedShipment?.value ?? '');

  const loadFinanceDocumentById = useCallback(fetchFinanceDocumentById, [id]);

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
    // Shipment must be selected or prefilled
    if (!selectedShipment?.value) {
      toast.error('Please select a shipment');
      return;
    }

    const isValidItems = invoiceRows.filter((row) => row.rate > 0).length > 0;
    if (!isValidItems) {
      toast.error('Please add at least one item');
      return;
    }

    // Build billing party details
    const effectiveSelectedDocument = selectedDocument;
    const billingPartyDetails = effectiveSelectedDocument ? selectedBillingPartyDetails(effectiveSelectedDocument) : editingDoc?.billingPartySnapshot;

    const basePayload: any = {
      docType,
      document: selectedDocument?.value,
      shipmentId: selectedShipment?.value,
      lineItems: invoiceRows.filter((row) => row.rate > 0),
      net_discount: Number(totals.netDiscount),
      net_taxable: Number(totals.netTaxable),
      net_gst: Number(totals.netGst),
      grand_total: Number(totals.grandTotal),
    };

    if (id) {
      // Update existing
      const updatePayload = {
        ...basePayload,
        type: editingDoc?.type || type,
        status: editingDoc?.status || 'draft',
        documentNumber: editingDoc?.documentNumber,
        issueDate: editingDoc?.issueDate,
        dueDate: editingDoc?.dueDate,
        customerId: effectiveSelectedDocument?.billing_party?._id || editingDoc?.customerId?._id,
        locationId: effectiveSelectedDocument?.billing_party_address || editingDoc?.locationId,
        billingPartySnapshot: billingPartySnapshot,
      };
      await updateFinanceDocument({ id, payload: updatePayload }).then(() => {
        navigate(`/finance?type=${editingDoc?.type || type}`);
      });
    } else {
      // Create new
      if (!effectiveSelectedDocument) {
        toast.error('Please select a document');
        return;
      }
      const createPayload = {
        ...basePayload,
        customerId: effectiveSelectedDocument?.billing_party?._id,
        locationId: effectiveSelectedDocument?.billing_party_address,
        billingPartySnapshot: billingPartyDetails,
        type: type,
        status: 'draft',
        documentNumber: 'INV-' + new Date().toISOString(),
        issueDate: new Date(),
        dueDate: new Date(),
      };
      await saveFinanceDocument(createPayload).then(() => {
        navigate(`/finance?type=${type}`);
      });
    }
  };

  useEffect(() => {
    // Only add default blank rows in create mode
    if (invoiceRows.length < 2) {
      setInvoiceRows((prev) => [...prev, blankRow()]);
    }
  }, [invoiceRows]);

  useEffect(() => {
    if (selectedShipment) {
      if (data) {
        const arr = data.map((i: any) => { 
          return { value: i._id, label: i.hbl_number, ...i } 
        });
        setDocuments(arr);
      }
    }
  }, [data]);

  useEffect(() => {
    if (id) {
      loadFinanceDocumentById(id).then((res) => {
        if (!res) return;
      
        setEditingDoc(res);
        setDocType(res?.docType);
        setInvoiceRows([...res?.lineItems, blankRow()] );
        console.log(res)

        setSelectedDocument({label: res?.document?.hbl_number, value: res?.document?._id, ...res?.document})
        const billingPartySnapshot =res.status!=='draft' ? res?.billingPartySnapshot : selectedBillingPartyDetails(res?.document)
        setBillingPartySnapshot(billingPartySnapshot)
        setSelectedShipment({ label: res?.shipmentId?.shipment_name ?? '', value: res?.shipmentId?._id ?? '' });
      });
    }
  }, [id, loadFinanceDocumentById]);

  return (
    <div className="form-container">
      <Stack direction="horizontal" justify="start">
        <div>
          <label htmlFor="vendor" className="form-label">
            Select Shipment
          </label>
          <AsyncSelect
            loadOptions={loadShipmentOptions}
            value={selectedShipment}
            onChange={(selectedOption) => {
              setSelectedShipment(selectedOption);
              setBillingPartySnapshot(null)
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
                width: '380px',
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
              onChange={(option) => {
                setSelectedDocument(option)
                const billingPartyDetails =id? option.billingPartySnapshot : selectedBillingPartyDetails(option)
                setBillingPartySnapshot(billingPartyDetails)
              }}
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option._id}
              placeholder="Select a user..."
              isSearchable
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: '40px',
                  width: '380px',
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

      {billingPartySnapshot && (
        <>
          <div className="billing-info mt-6">
            <h3>Bill To:</h3>
            <div className="customer-details">
              <strong>{billingPartySnapshot?.vendor_name || 'Customer Name'}</strong>
              <p>Mobile: {billingPartySnapshot?.mobile_number}</p>
              <p>
                Address: {billingPartySnapshot?.address}, {billingPartySnapshot?.city},{' '}
                <br />
                {billingPartySnapshot?.state} - {billingPartySnapshot?.pin_code}
                <br />
                <strong>PAN: {billingPartySnapshot?.pan_number}</strong>
                <strong>GST: {billingPartySnapshot?.gst_number}</strong>
              </p>
            </div>
          </div>
        </>
      )}

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
        <Button onClick={() => handleSubmit()} disabled={isSaving || isUpdating}>
          {isSaving || isUpdating ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default FinanceDocumentList;
