import Header, { Breadcrumb } from "@shared/components/BreadCrumbs";
import Table from "../../generator/table";
import useDummyHook from "./useDummyHook";
import { useState } from "react";

const EGM = () => {
  const [sorting, setSorting] = useState([]);
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });

  const { egmData, egmColumns } = useDummyHook();

  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "EGM",
      link: "",
    },
  ];
  return (
    <div>
      <Header pageName='EGM' label='EGM Data' />
      <Breadcrumb items={breadcrumbItems} />
      <Table
        columns={egmColumns}
        data={egmData}
              pagination={pagination}
              setPagination={setPagination}
        sortColumnArr={sorting}
        sortingHandler={setSorting}
        selectedRowsArr={rows}
        selectRowsHandler={setRows}
      />
    </div>
  );
};

export default EGM;
