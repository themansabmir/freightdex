import DynamicForm from "@generator/form";
import Table from "@generator/table";
import { Button, TextField } from "@shared/components";
import Header, { Breadcrumb } from "@shared/components/BreadCrumbs";
import { Stack } from "@shared/components/Stack";
import {
  ColumnSort,
  PaginationState,
  RowSelectionState,
} from "@tanstack/react-table";
import { useState } from "react";
import useVendorPage, { IVendor } from "./hooks/useVendor";
const Vendor = () => {
  /*
  ###################
        STATES
  ###################
  */
  const {
    columns: vendorColumns,
    data: vendorData,
    formSchema: vendorFormSchema,
  } = useVendorPage();
  const [isForm, setIsForm] = useState<boolean>(false);
  const [sorting, setSorting] = useState<ColumnSort[]>([]);
  const [rows, setRows] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });


  const  [query, setQuery] = useState<string>("")
  const [formData, setFormData] = useState<Partial<IVendor>>({
    vendor_name: "",
    vendor_type: [],
    id: "",
    locations: [
      {
        city: "",
        country: "",
        state: "",
        pan_number: "",
        address: "",
        gst_number: "",
        fax: 0,
        mobile_number: "",
        pin_code: "",
        telephone: "",
      },
    ],
  });
  const handleClick = () => {
    setIsForm(true);
  };
  const handleCancel = () => {
    setIsForm(false)
    setFormData({})
  }

  const getRowId = (row: IVendor) => row.id;
  return (
    <>
      <Header
        pageName='Vendors'
        label='Here you can manage your Shipper, Consignee, Shipping Line, Agent, CHA etc database.'
      />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Vendor" }]} />
      {!isForm ? (
        <>
          <div className='flex justify-between'>
            <TextField
              label="Search Vendor"
              onChange={(e) => setQuery(e.target.value)}
              value={query}
              placeholder='Search Vendor'
            />
            <Button onClick={() => handleClick()}>+Add New</Button>
          </div>
          <Table
            columns={vendorColumns}
            data={vendorData}
            getRowId={getRowId}
            sortColumnArr={sorting}
            sortingHandler={setSorting}
            selectedRowsArr={rows}
            selectRowsHandler={setRows}
            pagination={pagination}
            setPagination={setPagination}
            rowCount={vendorData.length}
            isLoading={true}
          />
        </>
      ) : (
        <>
          <DynamicForm
            schema={vendorFormSchema}
            data={formData}
            setData={setFormData}
          />
          <Stack gap='1em' direction='horizontal' justify='end' align='center'>
            <Button type='outline' variant='destructive' onClick={handleCancel}>
              Cancel
            </Button>
            <Button>Submit</Button>
          </Stack>
        </>
      )}
    </>
  );
};

export default Vendor;
