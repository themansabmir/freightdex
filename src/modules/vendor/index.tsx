import DynamicForm from "@generator/form";
import { Data } from "@generator/form/index.types";
import Table from "@generator/table";
import { Button } from "@shared/components";
import Header, { Breadcrumb } from "@shared/components/BreadCrumbs";
import {
  ColumnSort,
  PaginationState,
  RowSelectionState,
} from "@tanstack/react-table";
import { useState } from "react";
import useVendorPage, { User } from "./hooks/useVendor";
import { Stack } from "@shared/components/Stack";
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
  const [formData, setFormData] = useState<Data>({});

  const getRowId = (row: User) => row.id;
  return (
    <>
      <Header
        pageName='Vendors'
        label='Here you can manage your Shipper, Consignee, Shipping Line, Agent, CHA etc database.'
      />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Vendor" }]} />
      {!isForm ? (
        <>
          <div>
            <div style={{ display: "flex", justifyContent: "end" }}>
              <Button onClick={() => setIsForm(true)}>+Add New</Button>
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
            />
          </div>
        </>
      ) : (
        <>
          <DynamicForm
            schema={vendorFormSchema}
            data={formData}
            setData={setFormData}
          />
          <Stack gap='1em' direction='horizontal' justify='end' align='center'>
            <Button type='outline' variant='destructive'>
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
