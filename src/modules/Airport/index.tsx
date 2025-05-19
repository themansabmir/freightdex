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
import useAirportPage, { Airport } from "./hooks/useAirport";

const AirportPage = () => {
  const {
    columns: airportColumns,
    data: airportData,
    formSchema: airportFormSchema,
  } = useAirportPage();

  const [isForm, setIsForm] = useState<boolean>(false);
  const [sorting, setSorting] = useState<ColumnSort[]>([]);
  const [rows, setRows] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });
  const [formData, setFormData] = useState<Data>({});

  const getRowId = (row: Airport) => row.airport_code;

  
  const handleCancel = () => {
    setIsForm(false);
    setFormData({}); 
  };

  const handleSubmit = () => {
    console.log("Submitted form data:", formData);
    setIsForm(false);
  };


  return (
    <>
      <Header
        pageName="Airports"
        label="Here you can manage your Airport database."
      />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Airport" }]} />

      {!isForm ? (
        <div style={{ marginRight: "10px" }}>
          <div style={{ display: "flex", justifyContent: "end" }}>
            <Button onClick={() => setIsForm(true)}>+ Add New</Button>
          </div>
          <Table
            columns={airportColumns}
            data={airportData}
            getRowId={getRowId}
            sortColumnArr={sorting}
            sortingHandler={setSorting}
            selectedRowsArr={rows}
            selectRowsHandler={setRows}
            pagination={pagination}
            setPagination={setPagination}
            rowCount={airportData.length}
          />
        </div>
      ) : (
        <DynamicForm
          schema={airportFormSchema}
          data={formData}
          setData={setFormData}
        />

      )}
        <div>
           <Button onClick={handleSubmit} >Submit</Button>
            <Button  type="ghost" variant="destructive" onClick={handleCancel}>
              Cancel
            </Button>
        </div>
    </>
  );
};

export default AirportPage;



