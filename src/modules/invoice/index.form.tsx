import { useVendorApi } from '@modules/vendor/hooks/useVendorApi';
import { useCallback, useMemo, useEffect, useState } from 'react';
import SingleDropdown from '@shared/components/SingleDropdown';
import { formatVendorLabel } from '@modules/vendor/helper';
import { useGetAllInvoiceItems } from '@modules/invoiceItem/hooks/useInvoiceItemApi';
import { updateRowAtIndex, blankRow } from './utils';
import { getColumns, InvoiceTable } from './index.components';
import { useSaveFinanceDocument } from './index.hook';
import { Button } from '@shared/components';
import './totals.scss';
import { useSearchParams } from 'react-router-dom';
const query = {
  skip: '0',
  limit: '10',
  search: '',
  sortBy: 'name',
  sortOrder: 'asc',
};
const FinanceDocumentList = () => {
  // LOCAL STATES
  const [invoiceRows, setInvoiceRows] = useState<any[]>([]);
  const [vendor, setVendor] = useState<string | null>(null);
  const [params, setParams] = useSearchParams();
  const type= params.get('type');

  const { data: masterInvoiceItems } = useGetAllInvoiceItems();
  const { data: vendors, isLoading: vendorsLoading } = useVendorApi().useGetVendors(query);
  const { isSaving, saveFinanceDocument } = useSaveFinanceDocument();
  const options = formatVendorLabel(vendors?.response ?? []);

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
    const validRows = invoiceRows.filter(row => row.serviceItem && row.quantity > 0);
    
    const netDiscount = validRows.reduce((sum, row) => sum + (row.discount || 0), 0);
    const netTaxable = validRows.reduce((sum, row) => sum + (row.taxableAmount || 0), 0);
    const netGst = validRows.reduce((sum, row) => sum + (row.gstAmount || 0), 0);
    const grandTotal = validRows.reduce((sum, row) => sum + (row.totalWithGst || 0), 0);

    return {
      netDiscount: netDiscount.toFixed(2),
      netTaxable: netTaxable.toFixed(2),
      netGst: netGst.toFixed(2),
      grandTotal: grandTotal.toFixed(2)
    };
  }, [invoiceRows]);

  const handleSubmit = async () => {
    
    console.log(vendor);
    console.log(invoiceRows);
    console.log('Totals:', totals);
    const payload = {
      type: type,
      status: 'draft',
      documentNumber: 'INV-'+new Date().toISOString(),
      issueDate: new Date(),
      dueDate: new Date(),
      customerId: vendor?.split('|')[0]??'',
      shipmentId: '68db905d648e4f734fdd208e',
      lineItems: invoiceRows.filter(row =>row.rate > 0),
      net_discount: Number(totals.netDiscount),
      net_taxable: Number(totals.netTaxable),
      net_gst: Number(totals.netGst),
      grand_total: Number(totals.grandTotal)
    };
    await saveFinanceDocument(payload)
  };
  useEffect(() => {
    if (invoiceRows.length < 2) {
      setInvoiceRows((prev) => [...prev, blankRow()]);
    }
  }, [invoiceRows, blankRow]);

  return (
    <div className="form-container">
      <label htmlFor="vendor" className="form-label">Select Billing Party</label>
      <SingleDropdown options={options} value={vendor} onChange={setVendor} placeholder="Select Vendor" />
      
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
