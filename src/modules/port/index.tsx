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
import usePortPage, { IPort, Port } from "./hooks/usePort";

const PortForm = () => {
  const {
    columns: portColumns,
    data: portData,
    formSchema: portFormSchema,
  } = usePortPage();

  const [isForm, setIsForm] = useState<boolean>(false);
  const [sorting, setSorting] = useState<ColumnSort[]>([]);
  const [rows, setRows] = useState<RowSelectionState>({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });
  const [formData, setFormData] = useState<IPort>({
    port_code: '',
    port_name: '',
    id:''
  });

  const getRowId = (row: Port) => row.id;

  const handleCancel = () => {
    setIsForm(false);
    setFormData({port_code:'', port_name:'', id:''});
  };

  const handleSubmit = () => {
    console.log("Submitted form data:", formData);
    setIsForm(false);
  };

  return (
    <>
      <Header pageName="Ports" label="Here you can manage your Ports." />
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Port" }]} />

      {!isForm ? (
        <>
          <div style={{ marginRight: "10px" }}>
            <div style={{ display: "flex", justifyContent: "end" }}>
              <Button onClick={() => setIsForm(true)}>+ Add New</Button>
            </div>
            <Table
              columns={portColumns}
              data={portData}
              getRowId={getRowId}
              sortColumnArr={sorting}
              sortingHandler={setSorting}
              selectedRowsArr={rows}
              selectRowsHandler={setRows}
              pagination={pagination}
              setPagination={setPagination}
              rowCount={portData.length}
            />
          </div>
        </>
      ) : (
        <>
          <DynamicForm
            schema={portFormSchema}
            data={formData}
            setData={setFormData}
          />
          <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
            <Button type="ghost" variant="destructive" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Submit</Button>
          </div>
        </>
      )}
    </>
  );
};

export default PortForm;
