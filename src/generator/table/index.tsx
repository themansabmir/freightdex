import { getCoreRowModel, useReactTable } from "@tanstack/react-table";
import TableHeader from "./components/TableHeader";
import TableBody from "./components/TableBody";
import TableFooter from "./components/TableFooter";
import { UseTableLogicProps } from "./table.types";

const Table = <TData extends object,>({
  data,
  columns,
  sortColumnArr,
  sortingHandler,
  selectedRowsArr,
  selectRowsHandler,
  getRowId,
  enableManualSorting,
  enableRowsSelection,
  pagination,
  setPagination,
  rowCount,
  isLoading
}: UseTableLogicProps<TData>) => {
  const table = useReactTable({
    data,
    columns,
    getRowId: getRowId,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: sortingHandler,
    onRowSelectionChange: selectRowsHandler,
    onPaginationChange: setPagination,
    manualSorting: enableManualSorting ?? true,
    enableRowSelection: enableRowsSelection ?? true,
    manualPagination: true,
    rowCount: rowCount,
    state: {
      sorting: sortColumnArr,
      rowSelection: selectedRowsArr,
      pagination,
    },
  });

  return (
    <div>
      <div className='table__container'>
        <table role='table' aria-label='Data Table'>
          <TableHeader table={table} />
          {/* TABLE HEAD */}

          {/* TABLE BODY */}
          <TableBody table={table} />

          {/* PAGINATION COMPONENT */}
          <TableFooter
            pagination={pagination}
            setPagination={setPagination}
            table={table}
          />
        </table>
      </div>
    </div>
  );
};

export default Table;
