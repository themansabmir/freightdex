import { useVendorApi } from '@modules/vendor/hooks/useVendorApi';
import { useCallback, useMemo, useEffect, useState } from 'react';
import SingleDropdown from '@shared/components/SingleDropdown';
import { formatVendorLabel } from '@modules/vendor/helper';
import { useGetAllInvoiceItems } from '@modules/invoiceItem/hooks/useInvoiceItemApi';
import { updateRowAtIndex , blankRow} from './utils';
import {getColumns, InvoiceTable} from './index.components';
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

  const { data: masterInvoiceItems } = useGetAllInvoiceItems();
  const { data: vendors, isLoading: vendorsLoading } = useVendorApi().useGetVendors(query);
  const options = formatVendorLabel(vendors?.response ?? []);

  // HANDLER FUNCTIONS

  const removeRow = useCallback((idx: number) => {
    setInvoiceRows((rs) => rs.filter((_, i) => i !== idx));
  }, []);

  const updateRow = useCallback((idx: number, patch: Partial<any>) => {
    setInvoiceRows((rs) => updateRowAtIndex(rs, idx, patch));
  }, []);

  const columns = useMemo(() => getColumns(masterInvoiceItems ?? [], updateRow, removeRow), [masterInvoiceItems, updateRow, removeRow]);

    useEffect(() => {
      if (invoiceRows.length < 2) {
        setInvoiceRows((prev) => [...prev, blankRow()]);
      }
    }, [invoiceRows, blankRow]);
  
  return (
    <div>
      <label htmlFor="vendor">Select Billing Party</label>
      <SingleDropdown options={options} value={vendor} onChange={setVendor} placeholder="Select Vendor" />
      <InvoiceTable rows={invoiceRows} updateRow={updateRow} removeRow={removeRow} items={masterInvoiceItems ?? []} columns={columns} />
    </div>
  );
};

export default FinanceDocumentList;
