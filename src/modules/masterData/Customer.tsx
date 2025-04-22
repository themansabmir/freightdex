import { Button } from "@shared/components";
import { Breadcrumb, Header } from "@shared/components/BreadCrumbs";
import { useEffect, useMemo, useState } from "react";
import CustomerForm from "./CustomerForm";
import { useCustomerDataLayer } from "./hooks/usePageConfig";
import Table from "../../generator/table";
import useCustomerTable, { User } from "./hooks/useCustomerTable";
// import TableComponent from "../../generator/table/TestTable";

export const Customer = () => {
  const [isForm, setIsForm] = useState(false);
  const {
    payload,
    customerForm,
    charges: chargesForm,
  } = useCustomerDataLayer();

  const { data, columns} =useCustomerTable()
  const [payloadData, setPayloadData] = useState({ ...payload });

  const [selectedOptions, setSelectedOptions] = useState<string[]>([]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    const data = { ...payloadData };
    data[name] = value;
    setPayloadData(data);
  };
  const handleCheckboxChange = (option: string) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Master Data", href: "/master-data/form-builder" },
    { label: "Customer", href: "" },
  ];

  const [sorting, setSorting] = useState([])
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState(
    {
      pageIndex: 0,
      pageSize: 50,
    },
  );

  const getRowId =(row:User) => row.id;
  useEffect(() => {

    console.log("Render", pagination)
}, [ pagination])
  return (
    <div >
      <Header
        pageName={isForm ? "Add New Customer" : "Customers"}
        label='Insert Shipping line charges information'
      />
      <Breadcrumb items={breadcrumbItems} />
      {!isForm && <Button onClick={() => setIsForm(true)}>+ Add New</Button>}

      {!isForm && (
        <Table
          columns={columns}
          getRowId={getRowId}
          data={data}
          sortColumnArr={sorting}
          sortingHandler={setSorting}
          selectedRowsArr={rows}
          selectRowsHandler={setRows}
          pagination={pagination}
          setPagination={setPagination}
          rowCount={data.length}
        />
      )}

      {/* <TableComponent /> */}

      {isForm && (
        <div>
          {" "}
          <CustomerForm
            handleChange={handleChange}
            handleCheckboxChange={handleCheckboxChange}
            payload={payload}
            chargesForm={chargesForm}
            customerForm={customerForm}
            selectedOptions={selectedOptions}
            payloadData={payloadData}
          />
          <div>
            {isForm && (
              <div
                style={{
                  display: "flex",
                  gap: "1em",
                  justifyContent: "flex-end",
                  width: "80%",
                }}
              >
                <Button onClick={() => setIsForm(false)}>Save</Button>
                <Button
                  onClick={() => setIsForm(false)}
                  variant='neutral'
                  type='outline'
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
