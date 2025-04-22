import Header, { Breadcrumb } from "@shared/components/BreadCrumbs";
import Table from "../../generator/table";
import useDummyHook from "./useDummyHook";
import { useState } from "react";

const IGM = () => {
  const [sorting, setSorting] = useState([]);
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 50,
  });

  const { igmData, igmColumns } = useDummyHook();

  const breadcrumbItems = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "IGM",
      link: "",
    },
  ];
  return (
    <div>
      <Header pageName='IGM' label='IGM Data' />
      <Breadcrumb items={breadcrumbItems} />
      <Table
        columns={igmColumns}
        data={igmData}
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

export default IGM;
