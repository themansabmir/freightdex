import Select from 'react-select'
import { useState } from 'react'
import { useGetAllInvoiceItems } from '@modules/invoiceItem/hooks/useInvoiceItemApi';
const DashboardPage = () => {

  const [selected, setSelected]= useState({
    "_id": "68de159227931c3ad544af30",
    "hsn_code": "002",
    "fieldName": "service 002",
    "gst": "28",
    "unit": "wm",
    "createdAt": "2025-10-02T06:02:58.299Z",
    "updatedAt": "2025-10-03T05:27:33.681Z"
  }
  )
    const { data: masterInvoiceItems } = useGetAllInvoiceItems();
  

  return (
    <div>
      DashboardPage
      <label htmlFor="">Dropdown</label>
      <Select
        value={selected}
        getOptionLabel={(option: any) => option.fieldName}
        getOptionValue={(option: any) => option._id}
        options={masterInvoiceItems}
        onChange={(opt: any) => {
          if (!opt) return;
          setSelected(opt);
        }}
        placeholder=""
        classNamePrefix="react-select"
      />
    </div>
  );
};

export default DashboardPage;
